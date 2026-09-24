/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-action. Base block: cards.
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `.css-mphph9 > .card-row:nth-of-type(1)` — quick-action
 * icon tiles. Each tile is an <a class="MuiCard-root"> holding: a base64 SVG icon <img>,
 * a title (b1Bold, "Manage my policy >") and a short description (b2Regular).
 *
 * Library structure (Cards): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one card: [image/icon cell, text cell]. Text cell holds
 * title (heading), description, and the card link as a CTA.
 *
 * 🚨 Iteration key: the repeating unit is an <a> wrapping block content (structure.json
 * reports it iterationSafe:true, ×4, no invalid nesting). Even so, the importer's html2md
 * preProcess can merge adjacent same-tag anchors — so per the parser reference we iterate
 * the stable inner block wrapper `.MuiCardContent-root` and read the href/icon off its
 * closest ancestor <a>, which is immune to that merge. The direct-anchor query is kept
 * only as a fallback.
 */
export default function parse(element, { document }) {
  const row = element.matches('.card-row') ? element : element.querySelector('.card-row') || element;

  // Preferred: iterate the inner content wrappers (one per card, merge-proof).
  let items = [...row.querySelectorAll(':scope > a .MuiCardContent-root, :scope a .MuiCardContent-root')]
    .map((content) => ({ content, anchor: content.closest('a') }));

  // Fallback: anchors are intact in this DOM.
  if (!items.length) {
    items = [...row.querySelectorAll(':scope > a')].map((anchor) => ({
      content: anchor.querySelector('.MuiCardContent-root'),
      anchor,
    }));
  }

  const cells = [];

  items.forEach(({ content, anchor }) => {
    // --- Image/icon cell ---
    // Icon lives as an <img> sibling of the content, inside the anchor.
    const icon = anchor && anchor.querySelector('img');

    // --- Text cell ---
    const title = content && content.querySelector('[class*="b1Bold"]');
    const description = content && content.querySelector('[class*="b2Regular"]');

    const textCell = [];

    // Title as a link (the whole card is a link). Preserve the href on the title text.
    const href = anchor && anchor.getAttribute('href');
    if (title) {
      const titleText = title.textContent.replace(/\s+/g, ' ').trim();
      if (href) {
        const h = document.createElement('h3');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleText;
        h.appendChild(a);
        textCell.push(h);
      } else {
        const h = document.createElement('h3');
        h.textContent = titleText;
        textCell.push(h);
      }
    }
    if (description) textCell.push(description);

    if (!icon && !textCell.length) return;
    cells.push([icon || '', textCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
