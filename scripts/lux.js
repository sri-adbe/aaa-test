import { createOptimizedPicture } from './aem.js';

/**
 * Shared helpers for the lux template's blocks.
 */

/**
 * Moves the block's first picture into an image layer and all copy into a
 * content layer. Cells may arrive in any order, in one row or several, and
 * the image or the copy may be missing entirely.
 * @param {Element} block The block element
 * @param {string} name The block name, used for class names
 * @returns {{ image: Element, content: Element }} The two layers
 */
export function splitImageAndCopy(block, name) {
  const cells = [...block.children].flatMap((row) => [...row.children]);

  const image = document.createElement('div');
  image.className = `${name}-image`;
  const content = document.createElement('div');
  content.className = `${name}-content`;

  cells.forEach((cell) => {
    const picture = cell.querySelector('picture');
    if (picture && !image.querySelector('picture')) image.append(picture);
    // drop stray extra images and the now-empty paragraphs that held them
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
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 600px)', width: '2000' },
      { width: '750' },
    ]));
  }

  block.replaceChildren();
  if (image.querySelector('picture')) block.append(image);
  else block.classList.add('no-image');
  if (content.childNodes.length) block.append(content);
  return { image, content };
}

/**
 * Turns a block's rows into a list of cards. Each row becomes an `li`; a cell
 * holding only a picture becomes the card image, every other cell is merged
 * into a single card body. Empty rows are skipped.
 * @param {Element} block The block element
 * @param {string} name The block name, used for class names
 * @param {string} [imageWidth] Width of the optimized card images
 * @returns {Element[]} The card `li` elements
 */
export function buildCardList(block, name, imageWidth = '750') {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const body = document.createElement('div');
    body.className = `${name}-card-body`;
    [...row.children].forEach((cell) => {
      const pictures = cell.querySelectorAll('picture');
      const onlyPicture = pictures.length === 1 && !cell.textContent.trim();
      if (onlyPicture && !li.querySelector(`.${name}-card-image`)) {
        const image = document.createElement('div');
        image.className = `${name}-card-image`;
        image.append(pictures[0]);
        li.prepend(image);
        return;
      }
      cell.querySelectorAll('p').forEach((p) => {
        if (!p.textContent.trim() && !p.children.length) p.remove();
      });
      while (cell.firstChild) body.append(cell.firstChild);
    });
    if (body.textContent.trim() || body.querySelector('picture')) li.append(body);
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: imageWidth }]),
    );
  });
  block.replaceChildren(ul);
  return [...ul.children];
}

/**
 * Marks the paragraph authored directly above a card's heading as its eyebrow.
 * @param {Element} body The card body
 * @param {string} className Class to add to the eyebrow
 */
export function markEyebrow(body, className) {
  const heading = body.querySelector('h2, h3, h4, h5, h6');
  const prev = heading?.previousElementSibling;
  if (prev?.tagName === 'P') prev.classList.add(className);
}
