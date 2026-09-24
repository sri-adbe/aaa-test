/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AAA Northeast (northeast.aaa.com) section breaks and section metadata.
 * Template "discounts" has 7 sections; selectors come from page-templates.json
 * (DOM-verified during page analysis): .offer-decisioning, .html-source:has(.widget-header),
 * .html-source:has(.sub-navigationdsktp), .offer-row-square.parbase,
 * .html-source:has(.masonry-container), .tabbed-section.parbase, .faq.
 * Styles: section-1 blue, section-3 dark, section-7 grey.
 *
 * Inserts <hr> before every non-first section in beforeTransform (while section
 * elements still exist, before parsers replace them), and Section Metadata blocks
 * in afterTransform for styled sections, anchored to a marker <hr>.
 *
 * The source page nests .html-source wrappers inside each other, so a
 * `.html-source:has(...)` selector can also match an outer ancestor. We resolve
 * each selector to its innermost match (a match with no descendant match).
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

function innermost(root, sel) {
  let matches;
  try {
    matches = [...root.querySelectorAll(sel)];
  } catch (e) {
    return null; // invalid selector in this environment — skip
  }
  if (!matches.length) return null;
  const leaf = matches.find((el) => !matches.some((other) => other !== el && el.contains(other)));
  return leaf || matches[0];
}

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    const el = innermost(root, sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = (payload && payload.template) || {};
  const sections = template.sections || [];
  if (sections.length < 2) return;

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata needed
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess a replacement

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to the marker <hr> placed above,
    // or the original element if it survived.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
