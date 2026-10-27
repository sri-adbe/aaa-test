import { splitImageAndCopy } from '../../scripts/lux.js';

/**
 * hero-lux — full-bleed photo with a large centered serif headline, a short
 * subline and a call-to-action.
 *
 * Authored rows: row 1 = image, row 2 = heading + subline + CTA link.
 */
export default function decorate(block) {
  const { image } = splitImageAndCopy(block, 'hero-lux');
  const img = image.querySelector('img');
  if (img) {
    // the hero is the page's LCP element
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }
}
