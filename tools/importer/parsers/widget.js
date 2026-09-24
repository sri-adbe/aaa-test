/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget. Base block: widget (custom — no library convention).
 * Source: https://www.ace.aaa.com/travel/deals/travel-deals.html
 * Generated: 2026-09-24
 *
 * Instances (from page-templates.json): `#aceTravelWidget-rb` (booking widget) and
 * `#aceTravelAssistant` (travel assistant). Both are client-side, JS-injected
 * mount points — the scraped/cleaned DOM contains only an empty placeholder div
 * with no static content. There is nothing to extract, so the parser emits a
 * single-column block whose one cell records which widget mounts here (by the
 * element id) so the block resolves and the mount point is preserved on import.
 */
export default function parse(element, { document }) {
  // Identify which widget this is from the element id (fallbacks for class/root).
  const id = element.id
    || (element.querySelector('[id]') && element.querySelector('[id]').id)
    || (element.className && String(element.className).trim())
    || 'widget';

  const cell = document.createElement('p');
  cell.textContent = id;

  // Single-column block: one row, one cell holding the widget identifier.
  const cells = [[cell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'widget', cells });
  element.replaceWith(block);
}
