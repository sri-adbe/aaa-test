/**
 * accordion-faq — stack of expandable question/answer items separated by
 * rules, with a +/- toggle marker on the right of each question.
 *
 * Authored rows: one row per item; cell 1 = question, cell 2 = answer.
 * Built on native <details>/<summary> so it is keyboard- and screen-reader
 * accessible without extra script. Decorate defensively: a row with only one
 * cell becomes a question with an empty answer; extra cells are appended to
 * the answer; empty rows are dropped.
 */

const OPTION_CLASSES = [];

export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const items = [];
  [...block.children].forEach((row) => {
    const [label, ...bodyCells] = [...row.children];
    if (!label || (!row.textContent.trim() && !row.querySelector('picture'))) return;

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    // summary takes phrasing/heading content: unwrap a lone <p> question
    const only = label.children.length === 1 ? label.firstElementChild : null;
    const source = only && only.tagName === 'P' ? only : label;
    const question = document.createElement('span');
    question.className = 'accordion-faq-item-question';
    question.append(...source.childNodes);
    summary.append(question);

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    bodyCells.forEach((cell) => body.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    items.push(details);
  });

  block.replaceChildren(...items);
}
