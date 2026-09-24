/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-offer. Base: cards.
 * Source: https://northeast.aaa.com/discounts.html
 * Instance selector: .offer-row-square .offer-row-square-offers
 * Output (matches blocks/cards-offer): one row per tile —
 * cell 1 = logo image, cell 2 = <p><strong><a>title</a></strong></p> + <p>description</p>.
 * Iterates the stable wrapper div.offer-row-square-offer (not the anchors) so the
 * importer's inline-element merge cannot collapse tiles.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  let tiles = [...element.querySelectorAll('.offer-row-square-offer')];
  if (!tiles.length) tiles = [...element.querySelectorAll(':scope > div')];

  const cells = [];
  tiles.forEach((tile) => {
    const link = tile.querySelector('a[href]');
    const img = tile.querySelector('img');
    const textWrap = tile.querySelector('.offer-text-square') || link || tile;

    // Title = the text directly inside .offer-text-square (excluding the nested span)
    const titleText = [...textWrap.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const descEl = textWrap.querySelector(':scope > span, span');
    const descText = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';

    if (!titleText && !descText && !img) return;

    const body = [];
    if (titleText) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      if (link) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = titleText;
        strong.append(a);
      } else {
        strong.textContent = titleText;
      }
      p.append(strong);
      body.push(p);
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-offer', cells });
  element.replaceWith(block);
}
