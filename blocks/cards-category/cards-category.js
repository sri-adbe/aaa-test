import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-category — masonry grid of linked category photo tiles. The photo
 * fills the tile; the title is overlaid on it and the description is
 * revealed on hover / keyboard focus.
 *
 * Authored rows: one row per tile; cell 1 = photo, cell 2 = heading link +
 * description paragraph. Decorate defensively: the photo or body may be
 * missing, cells may be swapped, and rows may carry extra cells. The first
 * link in the tile is stretched over the whole tile.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    const li = document.createElement('li');
    li.className = 'cards-category-card';

    [...row.children].forEach((cell) => {
      const imageOnly = cell.querySelector('picture') && !cell.textContent.trim();
      if (imageOnly && !li.querySelector('.cards-category-card-image')) {
        cell.className = 'cards-category-card-image';
        li.prepend(cell);
      } else if (cell.textContent.trim()) {
        cell.className = 'cards-category-card-body';
        li.append(cell);
      }
    });

    const body = li.querySelector('.cards-category-card-body');
    if (body) {
      // undo decorateButtons on lone bold/italic links (it wraps them in
      // p.button-wrapper > a.button); the title is a plain link
      body.querySelectorAll('a.button').forEach((a) => {
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        if (!a.className) a.removeAttribute('class');
      });
      body.querySelectorAll('.button-wrapper, .button-container').forEach((p) => {
        p.classList.remove('button-wrapper', 'button-container');
        if (!p.className) p.removeAttribute('class');
      });

      // first heading (or first element) is the overlaid title; the rest is
      // the hover description
      const title = body.querySelector('h1, h2, h3, h4, h5, h6') || body.firstElementChild;
      if (title) title.classList.add('cards-category-card-title');
      const rest = [...body.children].filter((el) => el !== title);
      if (rest.length) {
        const desc = document.createElement('div');
        desc.className = 'cards-category-card-description';
        desc.append(...rest);
        body.append(desc);
      }
    }

    if (!li.querySelector('.cards-category-card-image')) li.classList.add('no-image');
    const link = li.querySelector('a');
    if (link) {
      link.classList.add('cards-category-card-link');
      li.classList.add('is-linked');
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
  block.replaceChildren(ul);
}
