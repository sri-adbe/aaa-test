/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base block: cards.
 * Source: https://www.ace.aaa.com/travel/deals/travel-deals.html
 * Generated: 2026-09-24
 *
 * Library structure (Cards): 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one card: [image cell, text cell].
 *
 * Iteration trap: the repeating unit here is `a.MuiCard-root` — an <a> wrapping
 * block content, repeated as siblings. structure.json reports iterationSafe:true
 * (valid HTML5), but the importer's html2md preProcess can merge adjacent sibling
 * anchors. Per generate-import-parser.md we key iteration on the stable inner
 * block wrapper (.MuiCardContent-root) instead, and read the href off the closest
 * <a>. The anchor query remains only as a fallback.
 */
export default function parse(element, { document }) {
  // Primary: iterate the inner content wrappers (immune to anchor-merge trap).
  let items = [...element.querySelectorAll('.MuiCardContent-root')].map((content) => ({
    content,
    card: content.closest('.MuiCard-root') || content.closest('a'),
  }));

  // Fallback: the card anchors are intact in this DOM.
  if (!items.length) {
    items = [...element.querySelectorAll('.card-row > a.MuiCard-root, a.MuiCard-root')].map((card) => ({
      content: card.querySelector('.MuiCardContent-root'),
      card,
    }));
  }

  const cells = [];

  items.forEach(({ content, card }) => {
    const scope = card || content;

    // --- Image cell ---
    const img = scope && scope.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

    // --- Text cell ---
    const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
    const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');

    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);

    // The whole card is a link — preserve it as a CTA so the href is not lost.
    const href = card && card.tagName === 'A' ? card.getAttribute('href') : (card && card.closest('a') ? card.closest('a').getAttribute('href') : null);
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      // Generic CTA label — the source card has no explicit link text, and reusing
      // the title would duplicate it in the output.
      link.textContent = 'Learn more';
      textCell.push(link);
    }

    if (!img && !textCell.length) return;
    cells.push([img || '', textCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
