/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-selfserve. Base block: columns.
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `#claims` — a side-by-side promo card. Left: an image
 * (MuiCardMedia "Woman using laptop"). Right: a heading (b1Bold → h3), a description
 * (b2Regular), and a CTA ("View or file a claim").
 *
 * Library structure (Columns): first row = block name; subsequent rows hold the columns.
 * This promo is one row of two columns: [image, content]. structure.json reports a single
 * instance (repeating units iterationSafe:true, no invalid nesting) — no iteration needed.
 */
export default function parse(element, { document }) {
  const card = element.matches('.MuiCard-root') ? element : element.querySelector('.MuiCard-root') || element;

  // --- Column 1: image ---
  const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

  // --- Column 2: content ---
  const contentCol = [];

  const content = card.querySelector('.MuiCardContent-root');
  // Heading is a b1Bold span wrapping an <h3>; description is a b2Regular paragraph.
  const heading = content && content.querySelector('[class*="b1Bold"] h1, [class*="b1Bold"] h2, [class*="b1Bold"] h3, [class*="b1Bold"]');
  const description = content && content.querySelector('[class*="b2Regular"] p, [class*="b2Regular"]');
  if (heading) contentCol.push(heading);
  if (description) contentCol.push(description);

  // CTA buttons (View or file a claim).
  const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
  ctas.forEach((a) => contentCol.push(a));

  // Empty-block guard
  if (!img && !contentCol.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns: [image cell, content cell].
  const cells = [[img || '', contentCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-selfserve', cells });
  element.replaceWith(block);
}
