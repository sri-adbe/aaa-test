/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-teaser. Base: hero.
 * Source: https://wknd.site/us/en/adventures.html
 * Instance selector: .teaser.cmp-teaser--hero
 * Output: row 1 = image, row 2 = H2 heading + description paragraph(s). No CTA.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  // Image: AEM core teaser image (validated: .cmp-teaser__image img.cmp-image__image)
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  // Heading: validated h2.cmp-teaser__title; fallbacks for other heading levels
  const titleEl = element.querySelector('.cmp-teaser__title, h1, h2, h3');

  // Description: validated .cmp-teaser__description > p; fall back to its text
  const descWrap = element.querySelector('.cmp-teaser__description');
  let descriptions = descWrap ? [...descWrap.querySelectorAll('p')] : [];
  if (!descriptions.length && descWrap && descWrap.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = descWrap.textContent.trim();
    descriptions = [p];
  }

  // Normalise heading to H2 (block README: row 2 = H2 heading + paragraph)
  let heading = null;
  if (titleEl && titleEl.textContent.trim()) {
    heading = document.createElement('h2');
    heading.textContent = titleEl.textContent.trim();
  }

  // Empty-block guard
  if (!image && !heading && !descriptions.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (image) cells.push([image]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...descriptions);
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-teaser', cells });
  element.replaceWith(block);
}
