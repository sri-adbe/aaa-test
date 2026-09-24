/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-savings. Base: tabs.
 * Source: https://northeast.aaa.com/discounts.html
 * Instance selector: .tabbed-section-wrapper .tab-content
 * Output (matches blocks/tabs-savings): one row per tab —
 * cell 1 = tab label, cell 2 = H2 + rich text (bold lead, lists) + <p><strong><a>CTA</a></strong></p> + <p><img></p>.
 * Tab labels live in the sibling ul.nav-tabs (matched to panes by href="#paneId",
 * falling back to index order). The nav-tabs list is removed after reading so it
 * does not leak into the page as default content. The section heading
 * h2.comp-header ("Ways to Save") is default content and is left untouched.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  // Tab labels: validated ul.nav-tabs > li > a[role=tab][href="#content-par-tabbed_section-NN"]
  const wrapper = element.closest('.tabbed-section-wrapper') || element.parentElement;
  let nav = element.previousElementSibling;
  if (!nav || !nav.matches('ul.nav-tabs, .nav-tabs, [role="tablist"]')) {
    nav = wrapper ? wrapper.querySelector('ul.nav-tabs, [role="tablist"]') : null;
  }
  const tabLinks = nav ? [...nav.querySelectorAll('a[role="tab"], li > a')] : [];
  const labelById = {};
  tabLinks.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) labelById[href.slice(1)] = a.textContent.replace(/\s+/g, ' ').trim();
  });

  // Panes: validated .tab-content > .tab-pane
  let panes = [...element.querySelectorAll(':scope > .tab-pane')];
  if (!panes.length) panes = [...element.querySelectorAll('.tab-pane, [role="tabpanel"]')];

  const cells = [];
  panes.forEach((pane, i) => {
    const label = labelById[pane.id]
      || (tabLinks[i] && tabLinks[i].textContent.replace(/\s+/g, ' ').trim())
      || `Tab ${i + 1}`;

    const content = [];

    // Heading: h2 > span.title — emit a clean H2
    const headingEl = pane.querySelector('.text-block h2, h2, h3');
    if (headingEl && headingEl.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = headingEl.textContent.replace(/\s+/g, ' ').trim();
      content.push(h2);
    }

    // Rich text: .theTextEditor children (p/ul/ol), kept as-is
    const rte = pane.querySelector('.theTextEditor, .article-text, .rte-default');
    if (rte) {
      [...rte.children].forEach((el) => {
        if (el.textContent.trim() || el.querySelector('img')) content.push(el);
      });
    }

    // CTAs: validated .img-50-50-bottom-cta a.btn-style
    const ctas = [...pane.querySelectorAll('.img-50-50-bottom-cta a[href], a.btn-style')]
      .filter((a, idx, arr) => arr.indexOf(a) === idx && a.textContent.trim());
    ctas.forEach((cta) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = cta.textContent.replace(/\s+/g, ' ').trim();
      strong.append(a);
      p.append(strong);
      content.push(p);
    });

    // Image: validated .image-block img.fiftyfiftyimage — goes last in its own paragraph
    const img = pane.querySelector('.image-block img, img.fiftyfiftyimage')
      || [...pane.querySelectorAll('img')].find((im) => !(rte && rte.contains(im)));
    if (img) {
      const p = document.createElement('p');
      p.append(img);
      content.push(p);
    }

    if (!content.length) return;
    cells.push([label, content]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Tab labels are now carried by the block; drop the original tab list
  if (nav) nav.remove();

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-savings', cells });
  element.replaceWith(block);
}
