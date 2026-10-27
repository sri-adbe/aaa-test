import { splitImageAndCopy } from '../../scripts/lux.js';

/**
 * hero-cta — closing call-to-action band: a softly washed-out background
 * photo behind a centered eyebrow, heading, button and small print.
 *
 * Authored rows: row 1 = background image, row 2 = eyebrow paragraph,
 * heading, CTA link and a short note paragraph.
 */
export default function decorate(block) {
  const { content } = splitImageAndCopy(block, 'hero-cta');
  // the paragraph after the button is the small print
  const button = content.querySelector('p.button-wrapper, p:has(> a:only-child)');
  const note = button?.nextElementSibling;
  if (note?.tagName === 'P') note.classList.add('hero-cta-note');
}
