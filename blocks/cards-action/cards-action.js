import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-action — grid of quick-action tiles.
 * Each tile: a small icon/image, a title (often a link like "Manage my
 * policy >") and a short supporting description. Decorate defensively —
 * some tiles may omit the icon.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-action-card-image';
      } else {
        div.className = 'cards-action-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
