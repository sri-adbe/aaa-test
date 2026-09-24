// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * tabs-category — category switcher (All, Climbing, Cycling, ...). Each source
 * row = tab label cell + optional panel content cell. Builds an accessible
 * tablist (roving tabindex, arrow/Home/End keys) and toggles panel visibility.
 *
 * EDS does not nest blocks, so each tab's card grid is authored as its own
 * cards-adventure block placed directly after this block, in tab order. The
 * Nth following cards-adventure wrapper is adopted into panel N. The wrapper
 * element is moved as-is (never re-decorated); the section loader still holds
 * a reference to the cards block and loads/decorates it in place.
 */

const ADOPTED_BLOCK = 'cards-adventure';

let instanceCount = 0;

/**
 * Collects the consecutive cards-adventure wrappers that follow this block in
 * its section, up to `max`. Stops at the first unrelated element so content
 * further down the section is never swallowed.
 */
function findAdoptableWrappers(block, max) {
  const wrapper = block.parentElement;
  const found = [];
  if (!wrapper || !wrapper.parentElement) return found;
  let next = wrapper.nextElementSibling;
  while (next && found.length < max) {
    const isAdoptable = next.classList.contains(`${ADOPTED_BLOCK}-wrapper`)
      || !!next.querySelector(`:scope > .${ADOPTED_BLOCK}`);
    if (!isAdoptable) break;
    found.push(next);
    next = next.nextElementSibling;
  }
  return found;
}

export default async function decorate(block) {
  instanceCount += 1;
  const prefix = `tabs-category-${instanceCount}`;

  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-category-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.textContent.trim()
    || row.querySelector('picture, img, a'));
  const adoptable = findAdoptableWrappers(block, rows.length);
  const usedIds = new Set();
  const buttons = [];
  const panels = [];

  const select = (index, focus) => {
    buttons.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', selected);
      btn.tabIndex = selected ? 0 : -1;
      panels[i].setAttribute('aria-hidden', !selected);
    });
    if (focus) buttons[index].focus();
  };

  rows.forEach((row, i) => {
    const [labelCell, ...contentCells] = [...row.children];
    const label = labelCell ? labelCell.textContent.trim() : '';
    let id = toClassName(label) || `${i + 1}`;
    if (usedIds.has(id)) id = `${id}-${i + 1}`;
    usedIds.add(id);

    // decorate tabpanel: keep any authored panel content, drop empty cells
    const tabpanel = row;
    tabpanel.className = 'tabs-category-panel';
    tabpanel.id = `${prefix}-panel-${id}`;
    tabpanel.setAttribute('aria-labelledby', `${prefix}-tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    contentCells.forEach((cell) => {
      if (cell.textContent.trim() || cell.querySelector('picture, img')) {
        cell.className = 'tabs-category-panel-content';
      } else {
        cell.remove();
      }
    });
    if (adoptable[i]) tabpanel.append(adoptable[i]);

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-category-tab';
    button.id = `${prefix}-tab-${id}`;
    if (labelCell && labelCell.innerHTML.trim()) {
      // buttons take phrasing content only: unwrap a lone <p> label
      const only = labelCell.children.length === 1 ? labelCell.firstElementChild : null;
      const source = only && only.tagName === 'P' && labelCell.textContent.trim() === only.textContent.trim()
        ? only : labelCell;
      button.innerHTML = source.innerHTML;
    } else {
      button.textContent = `Tab ${i + 1}`;
    }
    button.setAttribute('aria-controls', tabpanel.id);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => select(i, false));
    if (labelCell) labelCell.remove();

    buttons.push(button);
    panels.push(tabpanel);
    tablist.append(button);
  });

  tablist.addEventListener('keydown', (e) => {
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    let target;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = (current + 1) % buttons.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = (current - 1 + buttons.length) % buttons.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = buttons.length - 1;
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  });

  block.replaceChildren(tablist, ...panels);
  if (buttons.length) select(0, false);
}
