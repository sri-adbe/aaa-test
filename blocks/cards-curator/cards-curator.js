import { buildCardList, markEyebrow } from '../../scripts/lux.js';

/**
 * cards-curator — profile cards for travel curators: framed portrait, a
 * location eyebrow, name, one-line bio and a "Meet …" link.
 *
 * Authored rows: one per curator = image cell + body cell
 * (eyebrow paragraph, heading, bio paragraph, link paragraph).
 */
export default function decorate(block) {
  buildCardList(block, 'cards-curator').forEach((card) => {
    const body = card.querySelector('.cards-curator-card-body');
    if (!body) return;
    markEyebrow(body, 'cards-curator-eyebrow');
    // the last link on its own line is the card's "Meet …" link
    const links = [...body.querySelectorAll('p > a:only-child')]
      .filter((a) => a.parentElement.textContent.trim() === a.textContent.trim());
    const link = links.pop();
    if (link) link.parentElement.classList.add('cards-curator-link');
  });
}
