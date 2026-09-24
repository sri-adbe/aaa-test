/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-deal. Base block: cards.
 * Source: https://www.ace.aaa.com/travel/deals/travel-deals.html
 * Generated: 2026-09-24
 *
 * Library structure (Cards): 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one card: [image cell, text cell].
 * Text cell holds: title (heading), description, optional price/savings text, CTA links.
 *
 * Iteration: repeating unit is `div.MuiCard-root` (sibling divs, iterationSafe:true per
 * structure.json — not nested inside another interactive element). The icon-only
 * <button> elements inside the savings stack hold base64 SVGs and are dropped.
 */
export default function parse(element, { document }) {
  // Direct card children of the card-row; fall back to any descendant card.
  let cards = [...element.querySelectorAll(':scope > .MuiCard-root')];
  if (!cards.length) cards = [...element.querySelectorAll('.MuiCard-root')];

  const cells = [];

  cards.forEach((card) => {
    // --- Image cell ---
    const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

    // --- Text cell ---
    const content = card.querySelector('.MuiCardContent-root');
    const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
    const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');

    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);

    // Savings / price stack (e.g. "Get up to 40% off fares") — strip icon buttons/images
    // so base64 SVG noise is not carried into the import.
    const priceStack = card.querySelector('.MuiStack-root.css-1cnr8ro, [class*="css-1cnr8ro"]');
    if (priceStack) {
      const priceClone = priceStack.cloneNode(true);
      priceClone.querySelectorAll('button, img, .MuiCardActions-root').forEach((n) => n.remove());
      // Text lives in separate sibling spans with no whitespace between them;
      // join each span's trimmed text with a single space to avoid "up to40%off".
      const parts = [...priceClone.querySelectorAll('span')]
        .map((s) => s.textContent.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      const priceText = (parts.length
        ? parts.join(' ')
        : priceClone.textContent.replace(/\s+/g, ' ').trim()).trim();
      if (priceText) {
        const p = document.createElement('p');
        p.textContent = priceText;
        textCell.push(p);
      }
    }

    // CTA links (Book now / Learn more). MuiButton anchors carry the SclButton class.
    const ctas = [...card.querySelectorAll('a.SclButton, a[class*="MuiButton-root"]')];
    ctas.forEach((a) => textCell.push(a));

    // Skip empty cards; keep the two-column shape otherwise.
    if (!img && !textCell.length) return;
    cells.push([img || '', textCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-deal', cells });
  element.replaceWith(block);
}
