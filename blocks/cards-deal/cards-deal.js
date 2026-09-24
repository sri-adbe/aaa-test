import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-deal — promotional travel-deal cards.
 * Each card: image (with optional eyebrow badge overlay), title, description,
 * a "Save up to" savings block, and CTAs (Book now / Learn more).
 *
 * Authored as rows; the first cell holding a picture becomes the image,
 * the remaining cells form the card body. Decorate defensively — authors
 * may omit the badge, savings, or a CTA.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-deal-card-image';
      } else {
        div.className = 'cards-deal-card-body';
      }
    });

    ul.append(li);
  });

  // Mark the savings block: a paragraph whose text starts with "Save".
  ul.querySelectorAll('.cards-deal-card-body p').forEach((p) => {
    if (/^save\b/i.test(p.textContent.trim())) {
      p.classList.add('cards-deal-savings');
    }
  });

  // Group trailing CTA links into an actions row.
  ul.querySelectorAll('.cards-deal-card-body').forEach((bodyEl) => {
    const ctas = [...bodyEl.querySelectorAll(':scope > p')]
      .filter((p) => p.querySelector('a') && p.children.length === 1
        && p.firstElementChild.tagName === 'A');
    if (ctas.length) {
      const actions = document.createElement('div');
      actions.className = 'cards-deal-actions';
      ctas.forEach((p) => {
        const a = p.firstElementChild;
        // "Learn more" reads as a secondary (outlined) CTA on the source;
        // everything else ("Book now", "Contact an advisor") is the primary (filled) CTA.
        a.classList.add(/learn more/i.test(a.textContent.trim())
          ? 'cards-deal-cta-secondary'
          : 'cards-deal-cta-primary');
        actions.append(a);
      });
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
