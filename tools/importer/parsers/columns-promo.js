/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base block: columns.
 * Source: https://www.ace.aaa.com/travel/deals/travel-deals.html
 * Generated: 2026-09-24
 *
 * Instances (from page-templates.json): `.css-1w1lp5c .MuiCard-root` and
 * `.experience-fragment .MuiCard-root` — a single promotional card with an image
 * on one side and heading/description/CTAs on the other.
 *
 * Library structure (Columns): first row = block name; subsequent rows hold the
 * columns for that layout. This promo is one row of two columns: [image, content].
 * structure.json flagged the two instances disagree on child count (one has a
 * "Limited-time offer" chip, one does not) — the chip is treated as optional and
 * prepended into the content column when present.
 */
export default function parse(element, { document }) {
  // The matched element is the card itself (.MuiCard-root).
  const card = element.matches('.MuiCard-root') ? element : element.querySelector('.MuiCard-root') || element;

  // --- Column 1: image ---
  const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

  // --- Column 2: content ---
  const contentCol = [];

  // Optional promo chip (e.g. "Limited-time offer").
  const chip = card.querySelector('.MuiChip-label, [class*="MuiChip-label"]');
  if (chip) {
    const chipText = chip.textContent.replace(/\s+/g, ' ').trim();
    if (chipText) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = chipText;
      p.appendChild(em);
      contentCol.push(p);
    }
  }

  const content = card.querySelector('.MuiCardContent-root');
  const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
  const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');
  if (title) contentCol.push(title);
  if (description) contentCol.push(description);

  // CTA buttons (Explore vacations / Protect my trip / Learn more).
  const ctas = [...card.querySelectorAll('a.SclButton, a[class*="MuiButton-root"]')];
  ctas.forEach((a) => contentCol.push(a));

  // Empty-block guard
  if (!img && !contentCol.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns: [image cell, content cell].
  const cells = [[img || '', contentCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
