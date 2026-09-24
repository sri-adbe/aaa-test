import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature — full-bleed image-background feature cards.
 * Each card is a background image with a title, supporting text, and an
 * optional CTA overlaid on top. Used for cruise-line brand feature rows.
 *
 * Authored as rows; the picture cell becomes the card background, the
 * remaining cell(s) form the overlaid content. Decorate defensively.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-card-image';
      } else {
        div.className = 'cards-feature-card-body';
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
