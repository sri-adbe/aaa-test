import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-offer — a row of linked partner-offer tiles: partner logo on top,
 * bold offer title (the link) and a one-line description underneath.
 *
 * Authored rows: one row per tile; cell 1 = logo image, cell 2 = bold title
 * link + description paragraph. Decorate defensively: the logo or the body
 * may be missing, cells may be swapped, and a row may carry extra cells.
 * The first link in the tile is stretched over the whole tile.
 */

const OPTION_CLASSES = [];

/**
 * decorateButtons (scripts.js) runs before this block and turns the offer's
 * lone `<p><strong><a>` title into `p.button-wrapper > a.button.primary`,
 * dropping the authored <strong>. The title is a plain link, so undo that
 * and restore the emphasis wrapper inside the link.
 */
function unbuttonize(root) {
  root.querySelectorAll('a.button').forEach((a) => {
    const accent = a.classList.contains('accent');
    const strong = accent || a.classList.contains('primary');
    const em = accent || a.classList.contains('secondary');
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.className) a.removeAttribute('class');
    if (a.title === a.textContent) a.removeAttribute('title');
    let wrapper = null;
    if (strong) wrapper = document.createElement('strong');
    if (em) {
      const emEl = document.createElement('em');
      if (wrapper) wrapper.append(emEl);
      else wrapper = emEl;
    }
    if (wrapper) {
      const inner = wrapper.querySelector('em') || wrapper;
      inner.append(...a.childNodes);
      a.append(wrapper);
    }
  });
  root.querySelectorAll('.button-wrapper, .button-container').forEach((p) => {
    p.classList.remove('button-wrapper', 'button-container');
    if (!p.className) p.removeAttribute('class');
  });
}

export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    const li = document.createElement('li');
    li.className = 'cards-offer-card';

    [...row.children].forEach((cell) => {
      const imageOnly = cell.querySelector('picture') && !cell.textContent.trim();
      if (imageOnly && !li.querySelector('.cards-offer-card-image')) {
        cell.className = 'cards-offer-card-image';
        li.prepend(cell);
      } else if (cell.textContent.trim() || cell.querySelector('picture')) {
        cell.className = 'cards-offer-card-body';
        li.append(cell);
      }
    });

    unbuttonize(li);

    // stretch the primary link over the tile (logo links are folded into it)
    const link = li.querySelector('.cards-offer-card-body a') || li.querySelector('a');
    if (link) {
      link.classList.add('cards-offer-card-link');
      li.classList.add('is-linked');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });
  block.replaceChildren(ul);
}
