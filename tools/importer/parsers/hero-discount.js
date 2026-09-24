/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-discount. Base: hero.
 * Source: https://northeast.aaa.com/discounts.html
 * Instance selector: .widget-header.widget-header-container-no-widget
 * Output (matches blocks/hero-discount): row 1 = background image,
 * row 2 = H1 + <ul> (each <li>: icon image + text link) + <p> with CTA link.
 * Source H1 wraps a <p>; a clean H1 with plain text is emitted instead.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  // Background image: validated as a direct child <img> of the widget header
  const bgImage = element.querySelector(':scope > img')
    || element.querySelector(':scope > picture img, img:not(.dxxImage)');

  // Heading: validated .widget-header-title > h1 > p
  const titleEl = element.querySelector('.widget-header-title h1, h1, .widget-header-title, h2');
  let heading = null;
  if (titleEl && titleEl.textContent.trim()) {
    heading = document.createElement('h1');
    heading.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
  }

  // Shortcut tiles: iterate the stable block wrappers (.row1/.row2 divs inside
  // #btn-dxx-*) rather than the anchors themselves; fall back to anchors with an icon.
  let tiles = [...element.querySelectorAll('.btn-dxx-container [id^="btn-dxx"] > div')];
  if (!tiles.length) {
    tiles = [...element.querySelectorAll('a')]
      .filter((a) => a.querySelector('img.dxxImage, img'))
      .map((a) => a.parentElement);
  }

  const list = document.createElement('ul');
  tiles.forEach((tile) => {
    const link = tile.querySelector('a[href]');
    const icon = tile.querySelector('img.dxxImage, img');
    const labelEl = tile.querySelector('.dxxTitle:not(a), p');
    const label = ((labelEl && labelEl.textContent) || (icon && (icon.title || icon.alt)) || '')
      .replace(/\s+/g, ' ').trim();
    if (!link && !label) return;
    const li = document.createElement('li');
    if (icon) {
      const img = document.createElement('img');
      img.src = icon.getAttribute('src');
      img.alt = icon.getAttribute('alt') || label;
      li.append(img, ' ');
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = label || link.textContent.trim();
      li.append(a);
    } else {
      li.append(label);
    }
    list.append(li);
  });

  // CTA: validated a.hero-btn (#mbl-btn-only); fallback to a btn-style link
  const ctaSrc = element.querySelector('a.hero-btn, #mbl-btn-only, a.btn-style');
  let ctaP = null;
  if (ctaSrc && ctaSrc.textContent.trim()) {
    const a = document.createElement('a');
    a.href = ctaSrc.getAttribute('href');
    a.textContent = ctaSrc.textContent.replace(/\s+/g, ' ').trim();
    ctaP = document.createElement('p');
    ctaP.append(a);
  }

  // Empty-block guard
  if (!bgImage && !heading && !list.children.length && !ctaP) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (list.children.length) contentCell.push(list);
  if (ctaP) contentCell.push(ctaP);
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-discount', cells });
  element.replaceWith(block);
}
