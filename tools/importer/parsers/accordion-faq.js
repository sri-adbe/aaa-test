/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://northeast.aaa.com/discounts.html
 * Instance selector: .faqs-component-container .row
 * Output (matches blocks/accordion-faq): one row per item — cell 1 = question text,
 * cell 2 = answer paragraph(s). The "+" toggle icon is dropped. The section heading
 * ("Frequently Asked Questions") sits outside .row and stays default content.
 * Generated: 2026-09-24
 */
const BLOCK_TAGS = /^(P|UL|OL|DIV|TABLE|H[1-6]|BLOCKQUOTE)$/;

export default function parse(element, { document }) {
  // Validated: .faq-item (3 items), question in .faq-list h2, answer in .faq-content .top-space
  let items = [...element.querySelectorAll('.faq-item')];
  if (!items.length) items = [...element.querySelectorAll('.item, [class*="faq"][class*="item"]')];

  const cells = [];
  items.forEach((item) => {
    const qEl = item.querySelector('.faq-list h2, .faq-list, h2, h3, h4');
    let question = '';
    if (qEl) {
      const clone = qEl.cloneNode(true);
      clone.querySelectorAll('.icon-adjust, [class*="icon"]').forEach((s) => s.remove());
      question = clone.textContent.replace(/\s+/g, ' ').trim();
    }
    if (!question && qEl) question = (qEl.getAttribute('title') || '').trim();

    const aEl = item.querySelector('.faq-content .top-space, .faq-content');
    const answer = [];
    if (aEl) {
      // <sup>TM</sup> renders as raw HTML in markdown and splits the paragraph;
      // use the trademark character instead
      aEl.querySelectorAll('sup').forEach((sup) => {
        const t = sup.textContent.trim().toUpperCase();
        if (t === 'TM') sup.replaceWith('™');
        else if (t === 'R') sup.replaceWith('®');
      });
      aEl.normalize();
      // Group loose text/inline nodes into paragraphs; keep block children as-is
      let p = null;
      [...aEl.childNodes].forEach((node) => {
        if (node.nodeType === 1 && BLOCK_TAGS.test(node.tagName)) {
          p = null;
          if (node.textContent.trim() || node.querySelector('img')) answer.push(node);
          return;
        }
        if (node.nodeType === 3 && !node.textContent.trim()) {
          if (p) p.append(' ');
          return;
        }
        if (!p) {
          p = document.createElement('p');
          answer.push(p);
        }
        if (node.nodeType === 3) p.append(node.textContent.replace(/\s+/g, ' ').replace(/^ /, p.childNodes.length ? ' ' : ''));
        else p.append(node);
      });
    }

    if (!question && !answer.length) return;
    cells.push([question, answer.length ? answer : '']);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
