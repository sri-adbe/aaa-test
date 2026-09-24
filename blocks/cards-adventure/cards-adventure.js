import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-adventure — grid of adventure tiles linking to detail pages.
 * One row per card: cell 1 = (linked) image, cell 2 = title link + description.
 *
 * Decorate defensively: the image link may be authored as <a><picture></a>,
 * as a picture followed by a URL-only link, or omitted (then the title link is
 * reused). Cells may be missing, merged into one, or extra.
 * May be adopted into a tabs-category panel; that only moves the wrapper, so
 * this block never assumes where it sits in the page.
 */

const isUrlLink = (a) => {
  const text = a.textContent.trim();
  return !text || text === a.getAttribute('href') || text === a.href || /^(https?:\/\/|\/)\S*$/.test(text);
};

const isLinkOnly = (el) => {
  const a = el.querySelector(':scope > a');
  return a && el.children.length === 1 && el.textContent.trim() === a.textContent.trim();
};

function buildCard(row) {
  const image = document.createElement('div');
  image.className = 'cards-adventure-card-image';
  const body = document.createElement('div');
  body.className = 'cards-adventure-card-body';

  let imageLink = null;
  [...row.children].forEach((cell) => {
    const picture = cell.querySelector('picture');
    if (picture && !image.firstChild) {
      imageLink = picture.closest('a');
      image.append(imageLink || picture);
      // a URL-only link in the image cell is the image's link target
      [...cell.querySelectorAll(':scope > p')].forEach((p) => {
        const a = p.querySelector('a');
        if (a && isLinkOnly(p) && isUrlLink(a)) {
          if (!imageLink) imageLink = a;
          p.remove();
        }
      });
    }
    cell.querySelectorAll('picture').forEach((pic) => pic.remove());
    cell.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.children.length) p.remove();
    });
    if (cell.textContent.trim()) {
      while (cell.firstChild) body.append(cell.firstChild);
    }
  });

  // title = first heading, else first link-only paragraph, else first element
  const children = [...body.children];
  const title = children.find((el) => /^H[1-6]$/.test(el.tagName))
    || children.find((el) => isLinkOnly(el))
    || children[0];
  if (title) {
    title.classList.add('cards-adventure-card-title');
    children.filter((el) => el !== title).forEach((el) => el.classList.add('cards-adventure-card-description'));
  } else if (body.textContent.trim()) {
    // bare text node(s) only
    const p = document.createElement('p');
    p.className = 'cards-adventure-card-description';
    while (body.firstChild) p.append(body.firstChild);
    body.append(p);
  }

  // ensure the image is linked: authored image link, else the title link
  const picture = image.querySelector('picture');
  if (picture && !picture.closest('a')) {
    const titleLink = title && title.querySelector('a');
    const target = imageLink || titleLink;
    if (target) {
      const a = document.createElement('a');
      a.href = target.getAttribute('href');
      if (target === titleLink) {
        // duplicate destination: keep one tab stop / announcement per card
        a.tabIndex = -1;
        a.setAttribute('aria-hidden', 'true');
      } else if (target.title) {
        a.title = target.title;
      }
      picture.replaceWith(a);
      a.append(picture);
    }
  }

  // an authored image link that duplicates a link in the body (normally the
  // title) is redundant: take it out of tab order / the a11y tree so each
  // card is one stop. The image stays clickable for pointer users.
  const imgAnchor = image.querySelector('a');
  if (imgAnchor && !imgAnchor.hasAttribute('aria-hidden')) {
    const { href } = imgAnchor;
    const duplicated = [...body.querySelectorAll('a[href]')].some((a) => a.href === href);
    if (duplicated) {
      imgAnchor.tabIndex = -1;
      imgAnchor.setAttribute('aria-hidden', 'true');
    }
  }

  if (!image.firstChild && !body.firstChild) return null;
  const li = document.createElement('li');
  if (image.firstChild) li.append(image);
  if (body.firstChild) li.append(body);
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = buildCard(row);
    if (li) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
