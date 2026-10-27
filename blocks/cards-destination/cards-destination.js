import { buildCardList, markEyebrow } from '../../scripts/lux.js';

/**
 * cards-destination — large rounded destination photos in a two-up grid, each
 * captioned with a country eyebrow, the destination name and a short line.
 *
 * Authored rows: one per destination = image cell + body cell
 * (eyebrow paragraph, heading, description paragraph).
 */
export default function decorate(block) {
  buildCardList(block, 'cards-destination', '1200').forEach((card) => {
    const body = card.querySelector('.cards-destination-card-body');
    if (body) markEyebrow(body, 'cards-destination-eyebrow');
  });
}
