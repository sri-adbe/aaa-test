import { buildCardList } from '../../scripts/lux.js';

/**
 * cards-testimonial — bordered quote cards: a serif client quote followed by
 * a small uppercase attribution ("— M. Laurent, Paris").
 *
 * Authored rows: one per testimonial = a single cell with the quote paragraph
 * and an attribution paragraph. The last paragraph is the attribution when
 * there is more than one.
 */
export default function decorate(block) {
  buildCardList(block, 'cards-testimonial').forEach((card) => {
    const body = card.querySelector('.cards-testimonial-card-body');
    if (!body) return;
    const paragraphs = [...body.querySelectorAll(':scope > p')];
    if (paragraphs.length < 2) {
      if (paragraphs[0]) paragraphs[0].classList.add('cards-testimonial-quote');
      return;
    }
    const attribution = paragraphs.pop();
    attribution.classList.add('cards-testimonial-attribution');
    paragraphs.forEach((p) => p.classList.add('cards-testimonial-quote'));

    // wrap the copy in blockquote/figcaption semantics
    const figure = document.createElement('figure');
    const quote = document.createElement('blockquote');
    quote.append(...paragraphs);
    const caption = document.createElement('figcaption');
    caption.append(attribution);
    figure.append(quote, caption);
    body.append(figure);
  });
}
