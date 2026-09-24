/**
 * hero-login — login banner over a full-bleed background image.
 * The image-only cell becomes an absolute background; the copy cell becomes an
 * overlaid content card (heading, subtext, CTA buttons, secondary link).
 * Mirrors the base hero: with no image, add no-image so text uses default color.
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Tag the image-only cell (background) and the copy cell (overlaid card).
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

  // Within the content card: promote lone CTA links to buttons, group the
  // consecutive CTA buttons into one row, and flag the trailing "join" note.
  const content = block.querySelector('.hero-login-content');
  if (content) {
    const ctaItems = [];
    [...content.querySelectorAll(':scope > p')].forEach((p) => {
      const a = p.querySelector(':scope > a');
      const isButton = a && p.textContent.trim() === a.textContent.trim();
      if (isButton) {
        a.classList.add('button', 'primary');
        p.classList.add('button-container');
        ctaItems.push(p);
      } else if (p.querySelector('a')) {
        p.classList.add('hero-login-join');
      }
    });

    if (ctaItems.length) {
      const row = document.createElement('div');
      row.className = 'hero-login-cta';
      ctaItems[0].before(row);
      ctaItems.forEach((p) => row.append(p));
    }
  }
}
