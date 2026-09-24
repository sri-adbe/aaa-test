/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-adventure. Base: cards.
 * Source: https://wknd.site/us/en/adventures.html
 * Instance selector: .tabs.panelcontainer .cmp-tabs__tabpanel .cmp-image-list
 * (6 instances, one per tab panel; item counts 16/2/3/3/2/6)
 * Output: one row per li.cmp-image-list__item —
 *   cell 1 = image (wrapped in link to the adventure page when available)
 *   cell 2 = title as a link to the adventure page + description paragraph
 *
 * Iteration is keyed on the block-level li (digest: iterationSafe, no invalid
 * nesting). The image link and title link are adjacent sibling <a>s with the
 * same href, which html2md's inline-merge preprocessing can fold together, so
 * content is read by inner class (img / title span / description span) and the
 * links are rebuilt instead of reusing the source anchors.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll(':scope > li.cmp-image-list__item')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-image-list__item, :scope > li')];

  const makeLink = (href, content) => {
    const a = document.createElement('a');
    a.href = href;
    if (typeof content === 'string') a.textContent = content;
    else a.append(content);
    return a;
  };

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, img');
    const titleEl = item.querySelector('.cmp-image-list__item-title');
    const descEl = item.querySelector('.cmp-image-list__item-description');

    // href: title link, else image link, else any link in the item
    const linkEl = item.querySelector('a.cmp-image-list__item-title-link[href]')
      || item.querySelector('a.cmp-image-list__item-image-link[href]')
      || item.querySelector('a[href]');
    const href = linkEl ? linkEl.getAttribute('href') : '';

    let titleText = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!titleText && img) titleText = (img.getAttribute('alt') || '').trim();
    const descText = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';

    if (!img && !titleText && !descText) return;

    // Cell 1: image, linked to the adventure page when a link exists
    let imageCell = '';
    if (img) imageCell = href ? makeLink(href, img) : img;

    // Cell 2: title link + description
    const bodyCell = [];
    if (titleText) {
      const p = document.createElement('p');
      p.append(href ? makeLink(href, titleText) : document.createTextNode(titleText));
      bodyCell.push(p);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      bodyCell.push(p);
    }

    cells.push([imageCell, bodyCell.length ? bodyCell : '']);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-adventure', cells });
  element.replaceWith(block);
}
