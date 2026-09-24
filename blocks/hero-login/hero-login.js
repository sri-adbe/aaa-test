/**
 * hero-login — login banner over a full-bleed background image.
 * Content (heading, subtext, CTAs, secondary link) sits in a card over the
 * image. Mirrors the base hero: if there is no image, add a no-image class
 * so text falls back to the default color.
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // The cell that holds the copy (heading/paragraphs/buttons) — the one
  // that is not the image-only cell — becomes the overlaid content card.
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const isImageOnly = cell.children.length === 1 && cell.querySelector('picture');
      if (isImageOnly) {
        cell.classList.add('hero-login-image');
      } else if (cell.textContent.trim()) {
        cell.classList.add('hero-login-content');
      }
    });
  });
}
