import { buildCardList } from '../../scripts/lux.js';

/**
 * cards-service — numbered service tiles: a small serif index (01, 02 …), a
 * corner arrow, the service name and a short description.
 *
 * Authored rows: one per service = a single cell with heading + description.
 * An authored number paragraph ("01") is used as-is; otherwise the index is
 * generated from the card's position.
 */
export default function decorate(block) {
  buildCardList(block, 'cards-service').forEach((card, i) => {
    const body = card.querySelector('.cards-service-card-body');
    if (!body) return;

    const first = body.firstElementChild;
    let index = first?.tagName === 'P' && /^\d{1,3}\.?$/.test(first.textContent.trim()) ? first : null;
    if (!index) {
      index = document.createElement('p');
      index.textContent = String(i + 1).padStart(2, '0');
      body.prepend(index);
    }
    index.classList.add('cards-service-index');

    const arrow = document.createElement('span');
    arrow.className = 'cards-service-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    body.prepend(arrow);
  });
}
