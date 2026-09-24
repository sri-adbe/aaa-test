import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-teaser — editorial page-intro teaser: a full-bleed photo band with a
 * wide content panel (heading + short paragraph) overlapping its lower edge.
 *
 * Authored rows: row 1 = image, row 2 = heading + paragraph. Decorate
 * defensively: cells may arrive in any order, in one row or several, and the
 * image or the copy may be missing entirely.
 */
export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);

  const image = document.createElement('div');
  image.className = 'hero-teaser-image';
  const content = document.createElement('div');
  content.className = 'hero-teaser-content';

  cells.forEach((cell) => {
    const picture = cell.querySelector('picture');
    if (picture && !image.querySelector('picture')) {
      // keep a wrapping link if the author linked the image
      image.append(picture.closest('a') || picture);
    }
    // everything else in the cell is copy; drop stray extra images and the
    // now-empty paragraphs that held them
    cell.querySelectorAll('picture').forEach((pic) => pic.remove());
    cell.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.children.length) p.remove();
    });
    if (cell.textContent.trim()) {
      while (cell.firstChild) content.append(cell.firstChild);
    }
  });

  const img = image.querySelector('img');
  if (img) {
    const optimized = createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 600px)', width: '2000' },
      { width: '750' },
    ]);
    const optimizedImg = optimized.querySelector('img');
    // hero is the likely LCP element even when it is not in the first section
    optimizedImg.setAttribute('fetchpriority', 'high');
    if (img.title) optimizedImg.title = img.title;
    img.closest('picture').replaceWith(optimized);
  }

  block.replaceChildren();
  if (image.querySelector('picture')) block.append(image);
  else block.classList.add('no-image');
  if (content.childNodes.length) block.append(content);
}
