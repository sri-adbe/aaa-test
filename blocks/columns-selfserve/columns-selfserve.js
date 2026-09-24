/**
 * columns-selfserve — side-by-side image + text-with-CTA promo.
 * One row, two cells (image | text). Tags the image-only column so CSS can
 * order it, and records the column count.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-selfserve-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-selfserve-img-col');
        }
      }
    });
  });
}
