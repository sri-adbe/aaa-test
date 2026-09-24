import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-discount — page-intro banner: a full-bleed background photo with a
 * translucent content panel holding the H1, a row of circular icon shortcut
 * links (image + label) and a closing CTA link.
 *
 * Authored rows: row 1 = background image, row 2 = heading, a bulleted list
 * whose items are "icon image + link", and a paragraph with the CTA link.
 * Decorate defensively: cells may arrive in one row or several, and the
 * background image, the icon list or the CTA may be missing.
 */

const OPTION_CLASSES = [];

// the source hero heading uses Roboto Slab; the site itself only loads Roboto
const HEADING_FONT_URL = 'https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap';

function loadHeadingFont() {
  if (document.querySelector(`link[href="${HEADING_FONT_URL}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = HEADING_FONT_URL;
  document.head.append(link);
}

function isImageOnly(cell) {
  return !!cell.querySelector('picture') && !cell.textContent.trim();
}

/** Turn each "icon + link" list item into one linked tile: a > (icon, label). */
function decorateShortcuts(list) {
  list.classList.add('hero-discount-shortcuts');
  [...list.children].forEach((li) => {
    li.className = 'hero-discount-shortcut';
    const picture = li.querySelector('picture');
    const link = li.querySelector('a');
    const label = document.createElement('span');
    label.className = 'hero-discount-shortcut-label';

    if (link) {
      // the link's own text is the label; an image-wrapped link keeps its picture
      [...link.childNodes].forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('picture')) return;
        if (node.nodeName === 'PICTURE') return;
        label.append(node);
      });
      if (!label.textContent.trim()) label.textContent = link.title || '';
    } else {
      label.textContent = li.textContent.trim();
    }

    const target = link || document.createElement('span');
    target.className = 'hero-discount-shortcut-link';
    target.replaceChildren();
    if (picture) {
      const icon = document.createElement('span');
      icon.className = 'hero-discount-shortcut-icon';
      icon.append(picture);
      target.append(icon);
    }
    if (label.textContent.trim()) target.append(label);
    li.replaceChildren(target);
  });
}

export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  if (block.querySelector('h1, h2')) loadHeadingFont();
  const cells = [...block.children].flatMap((row) => [...row.children]);

  const background = document.createElement('div');
  background.className = 'hero-discount-background';
  const panel = document.createElement('div');
  panel.className = 'hero-discount-panel';

  cells.forEach((cell) => {
    if (isImageOnly(cell) && !background.querySelector('picture')) {
      background.append(cell.querySelector('picture'));
      return;
    }
    cell.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('picture')) p.remove();
    });
    while (cell.firstChild) panel.append(cell.firstChild);
  });

  // shortcut rows: any list whose items carry an icon image
  panel.querySelectorAll(':scope > ul, :scope > ol').forEach((list) => {
    if (list.querySelector('picture')) decorateShortcuts(list);
  });

  // a trailing paragraph that holds only a link is the CTA
  [...panel.querySelectorAll(':scope > p')].forEach((p) => {
    const links = p.querySelectorAll('a');
    if (links.length && p.textContent.trim() === [...links].map((a) => a.textContent).join('').trim()) {
      p.classList.add('hero-discount-cta');
    }
  });

  const bgImg = background.querySelector('img');
  if (bgImg) {
    const optimized = createOptimizedPicture(bgImg.src, bgImg.alt, true, [
      { media: '(min-width: 900px)', width: '2000' },
      { width: '900' },
    ]);
    optimized.querySelector('img').setAttribute('fetchpriority', 'high');
    bgImg.closest('picture').replaceWith(optimized);
  }

  panel.querySelectorAll('.hero-discount-shortcut-icon picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '240' }]));
  });

  block.replaceChildren();
  if (background.querySelector('picture')) block.append(background);
  else block.classList.add('no-image');
  if (panel.childNodes.length) block.append(panel);
}
