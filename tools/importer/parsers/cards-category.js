/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-category. Base: cards.
 * Source: https://northeast.aaa.com/discounts.html
 * Instance selector: .masonry-container
 * Output (matches blocks/cards-category): one row per tile —
 * cell 1 = photo, cell 2 = <h4><a>title</a></h4> + <p>description</p>.
 * Iterates the stable block wrapper div.masonry-item (not the <a> that wraps the
 * text) so the importer's inline-element merge cannot collapse tiles.
 * Defensive for JS-rendered masonry markup: falls back to any tile-like element
 * holding a heading, and to a CSS background-image when there is no <img>.
 * Generated: 2026-09-24
 */
function tileImage(tile, document) {
  const img = tile.querySelector('img');
  if (img && img.getAttribute('src')) return img;
  // JS-rendered masonry variants sometimes paint the photo as a background image
  const styled = [tile, ...tile.querySelectorAll('[style*="background"]')]
    .find((el) => /url\(/.test(el.getAttribute('style') || ''));
  if (styled) {
    const m = (styled.getAttribute('style') || '').match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (m) {
      const bg = document.createElement('img');
      bg.src = m[1];
      return bg;
    }
  }
  return null;
}

export default function parse(element, { document }) {
  // Validated: .masonry-widget-wrapper > .masonry-item (8 tiles in 4 wrappers)
  let tiles = [...element.querySelectorAll('.masonry-item')];
  if (!tiles.length) {
    // Fallback: closest block-level container of each tile heading
    tiles = [...element.querySelectorAll('.masonry-header-text, h2, h3, h4')]
      .map((h) => h.closest('[class*="masonry-item"], [class*="item"], li') || h.parentElement)
      .filter((el, i, arr) => el && arr.indexOf(el) === i);
  }

  const cells = [];
  tiles.forEach((tile) => {
    const titleEl = tile.querySelector('.masonry-header-text, h1, h2, h3, h4, h5, h6');
    const descEl = tile.querySelector('.masonry-subtitle-text, p');
    const link = tile.querySelector('a[href]') || tile.closest('a[href]');
    const img = tileImage(tile, document);

    const titleText = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const descText = descEl && descEl !== titleEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!titleText && !descText && !img) return;

    const body = [];
    if (titleText) {
      const h = document.createElement('h4');
      if (link) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = titleText;
        h.append(a);
      } else {
        h.textContent = titleText;
      }
      body.push(h);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      body.push(p);
    }

    cells.push([img || '', body.length ? body : '']);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
