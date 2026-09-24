/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-category. Base: tabs.
 * Source: https://wknd.site/us/en/adventures.html
 * Instance selector: .tabs.panelcontainer .cmp-tabs__tablist (the <ol> tab list only)
 * Output: one row per tab — cell 1 = tab label, cell 2 = empty.
 * Panels are NOT part of this block: each panel's .cmp-image-list is parsed into
 * its own cards-adventure block that follows this block in document order, and
 * the tabs-category block JS adopts the Nth following cards-adventure into panel N.
 * Only the tablist element is replaced.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  // Validated: li.cmp-tabs__tab (6 tabs, first carries --active modifier)
  let tabs = [...element.querySelectorAll(':scope > .cmp-tabs__tab')];
  if (!tabs.length) tabs = [...element.querySelectorAll('[role="tab"], :scope > li')];

  const cells = [];
  tabs.forEach((tab) => {
    const label = tab.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;
    cells.push([label, '']);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-category', cells });
  element.replaceWith(block);
}
