/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-faq. Base block: cards (no images).
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `.css-mphph9 > .card-row:nth-of-type(4)` — FAQ cards
 * (Auto insurance FAQ, Home insurance FAQ, Auto claims FAQ, Home claims FAQ). Each card is
 * a <div class="MuiCard-root"> with NO image: a title (b1Bold), a description (b2Regular),
 * and a "Learn more" CTA.
 *
 * Library structure (Cards, no-images variant): 1 column, multiple rows. Row 1 = block
 * name. Each subsequent row = one card in a single cell holding heading, description, CTA.
 * The no-images variant is used because structure.json reports content.images: 0 for this
 * card-row (library-description: "If no images are present, use the 'no images' variant").
 *
 * Iteration: repeating unit is `div.MuiCard-root` (sibling divs, structure.json ×4,
 * iterationSafe:true, no invalid nesting) — safe to iterate directly.
 */
export default function parse(element, { document }) {
  const row = element.matches('.card-row') ? element : element.querySelector('.card-row') || element;

  let cards = [...row.querySelectorAll(':scope > .MuiCard-root')];
  if (!cards.length) cards = [...row.querySelectorAll('.MuiCard-root')];

  const cells = [];

  cards.forEach((card) => {
    const content = card.querySelector('.MuiCardContent-root');
    const title = content && content.querySelector('[class*="b1Bold"]');
    const description = content && content.querySelector('[class*="b2Regular"]');

    const cardCell = [];
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      cardCell.push(h);
    }
    if (description) cardCell.push(description);

    // CTA (Learn more).
    const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
    ctas.forEach((a) => cardCell.push(a));

    if (!cardCell.length) return;
    // 1-column (no-images) variant: one cell per row holding all card content.
    cells.push([cardCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-faq', cells });
  element.replaceWith(block);
}
