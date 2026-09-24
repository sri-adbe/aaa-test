/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base block: cards.
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `.css-mphph9 > .card-row:nth-of-type(2)` — product
 * cards (Auto / Home / Life insurance). Each card is a <div class="MuiCard-root"> holding:
 * a content image (MuiCardMedia), a title (b1Bold), a description (b2Regular), and two
 * CTAs ("Get a quote" / "Learn more").
 *
 * Library structure (Cards): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one card: [image cell, text cell]. Text cell holds title
 * (heading), description, and the CTA links.
 *
 * Iteration: repeating unit is `div.MuiCard-root` (sibling divs, structure.json ×3,
 * iterationSafe:true, no invalid nesting) — safe to iterate directly.
 */
export default function parse(element, { document }) {
  const row = element.matches('.card-row') ? element : element.querySelector('.card-row') || element;

  let cards = [...row.querySelectorAll(':scope > .MuiCard-root')];
  if (!cards.length) cards = [...row.querySelectorAll('.MuiCard-root')];

  const cells = [];

  cards.forEach((card) => {
    // --- Image cell ---
    const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

    // --- Text cell ---
    const content = card.querySelector('.MuiCardContent-root');
    const title = content && content.querySelector('[class*="b1Bold"]');
    const description = content && content.querySelector('[class*="b2Regular"]');

    const textCell = [];
    if (title) {
      // Title is a plain b1Bold span; promote to a heading for card semantics.
      const h = document.createElement('h3');
      h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(h);
    }
    if (description) textCell.push(description);

    // CTA buttons (Get a quote / Learn more).
    const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
    ctas.forEach((a) => textCell.push(a));

    if (!img && !textCell.length) return;
    cells.push([img || '', textCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
