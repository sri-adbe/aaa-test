/**
 * columns-promo — side-by-side promotional banner.
 * Text (heading, subtext, benefit list, CTA) beside an image, on a colored
 * banner background. Mirrors the base columns decorate: it tags image-only
 * columns so CSS can order them, and records the column count.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-promo-img-col');
        }
      }
    });
  });
}
