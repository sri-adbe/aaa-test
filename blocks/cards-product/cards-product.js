import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-product — product cards with a top image, title, description and
 * up to two CTAs (e.g. "Get a quote" + "Learn more"). Trailing CTA links
 * are grouped into an actions row. Decorate defensively.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-product-card-image';
      } else {
        div.className = 'cards-product-card-body';
      }
    });
    ul.append(li);
  });

  // Group trailing single-link paragraphs into an actions row.
  ul.querySelectorAll('.cards-product-card-body').forEach((bodyEl) => {
    const ctas = [...bodyEl.querySelectorAll(':scope > p')]
      .filter((p) => p.children.length === 1 && p.firstElementChild
        && p.firstElementChild.tagName === 'A');
    if (ctas.length) {
      const actions = document.createElement('div');
      actions.className = 'cards-product-actions';
      ctas.forEach((p) => actions.append(p.firstElementChild));
      bodyEl.append(actions);
      ctas.forEach((p) => p.remove());
    }
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
