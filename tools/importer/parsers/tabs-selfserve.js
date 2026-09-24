/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-selfserve. Base block: tabs.
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `#tabSectionOne` — a 4-tab switcher
 * (Insurance, Membership, Travel, Financial). The tab labels are <button> elements
 * inside `.inner-tab`; the tab panels are the sibling `.css-mphph9` stacks that follow
 * the tab strip. structure.json reports the tab labels (buttons) and the panels
 * (`.css-mphph9`) each repeat ×4, all iterationSafe:true, no invalid nesting.
 *
 * Library structure (Tabs): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one tab: [tab label cell, tab panel content cell].
 *
 * Iteration: keyed on the 4 tab-label buttons (stable, one per tab) and paired
 * positionally with the 4 panel stacks. Buttons carry a leading icon <span>; only the
 * label text is emitted (icons are base64 SVGs and are dropped). Panels are captured
 * as-is (client-rendered, deeply nested) so all present content is preserved.
 */
export default function parse(element, { document }) {
  // --- Tab labels: the buttons inside the tab strip (.inner-tab). ---
  let tabButtons = [...element.querySelectorAll('.inner-tab button')];
  if (!tabButtons.length) {
    // Fallback: MuiButton buttons that are direct labels (exclude in-panel buttons).
    tabButtons = [...element.querySelectorAll('button[class*="MuiButton-root"]')]
      .filter((b) => !b.closest('.card-row, .MuiCardActions-root'));
  }

  // --- Tab panels: the .css-mphph9 stacks that hold each tab's content. ---
  const panels = [...element.querySelectorAll('.css-mphph9')];

  const cells = [];
  const pairCount = Math.min(tabButtons.length, panels.length);

  for (let i = 0; i < pairCount; i += 1) {
    const btn = tabButtons[i];
    const panel = panels[i];

    // Label cell: plain text of the button (icon span stripped).
    const labelText = btn.textContent.replace(/\s+/g, ' ').trim();
    const labelP = document.createElement('p');
    labelP.textContent = labelText;

    // Panel cell: keep the whole panel content. Strip base64 icon <img> so SVG noise
    // is not carried into the import; keep real content images (MuiCardMedia).
    const panelClone = panel.cloneNode(true);
    panelClone.querySelectorAll('img[src^="data:"]').forEach((n) => n.remove());

    cells.push([labelP, panelClone]);
  }

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-selfserve', cells });
  element.replaceWith(block);
}
