import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

/**
 * tabs-savings — centred tab list switching between savings spotlight
 * panels. Each panel is a two-column layout: copy (heading, lead, bullet
 * lists, CTA) on the left and an image on the right.
 *
 * Authored rows: one row per tab; cell 1 = tab label, cell 2 = panel content
 * (text, then an image paragraph). Any further cells are treated as more
 * panel content. Decorate defensively: labels, content or image may be
 * missing. Builds an accessible tablist (roving tabindex, arrow/Home/End).
 */

const OPTION_CLASSES = [];

let instanceCount = 0;

/** Split a panel's content into a copy column and a media column. */
function buildPanelLayout(cells) {
  const text = document.createElement('div');
  text.className = 'tabs-savings-panel-text';
  const media = document.createElement('div');
  media.className = 'tabs-savings-panel-media';

  cells.forEach((cell) => {
    [...cell.children].forEach((el) => {
      const imageOnly = el.querySelector('picture') && !el.textContent.trim();
      if (imageOnly || el.tagName === 'PICTURE') media.append(el);
      else text.append(el);
    });
    // loose text nodes directly in the cell
    if (cell.textContent.trim()) text.append(...cell.childNodes);
  });

  media.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 900px)', width: '900' },
      { width: '750' },
    ]));
  });

  const content = document.createElement('div');
  content.className = 'tabs-savings-panel-content';
  if (text.childNodes.length) content.append(text);
  if (media.childNodes.length) content.append(media);
  else content.classList.add('no-image');
  return content;
}

export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  instanceCount += 1;
  const prefix = `tabs-savings-${instanceCount}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-savings-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.textContent.trim()
    || row.querySelector('picture, img, a'));
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

    const tabpanel = document.createElement('div');
    tabpanel.className = 'tabs-savings-panel';
    tabpanel.id = `${prefix}-panel-${id}`;
    tabpanel.setAttribute('aria-labelledby', `${prefix}-tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    tabpanel.append(buildPanelLayout(contentCells));

    const button = document.createElement('button');
    button.className = 'tabs-savings-tab';
    button.id = `${prefix}-tab-${id}`;
    if (labelCell && labelCell.innerHTML.trim()) {
      // buttons take phrasing content only: unwrap a lone <p> label
      const only = labelCell.children.length === 1 ? labelCell.firstElementChild : null;
      const source = only && only.tagName === 'P' && label === only.textContent.trim()
        ? only : labelCell;
      button.innerHTML = source.innerHTML;
    } else {
      button.textContent = `Tab ${i + 1}`;
    }
    button.setAttribute('aria-controls', tabpanel.id);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => select(i, false));

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
