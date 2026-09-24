/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AAA (ace.aaa.com) site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // OneTrust cookie consent shell + preference-center modals (found in cleaned.html:
    // id="onetrust-consent-sdk", id="onetrust-pc-sdk", id="ot-fltr-modal",
    // class="onetrust-pc-dark-filter"). Removed before parsing so overlays don't
    // interfere with block matching.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
      '#ot-fltr-modal',
      '.onetrust-pc-dark-filter',
    ]);
  }

  if (hookName === H.after) {
    // Non-authorable site chrome (verified in cleaned.html):
    // <header class="MuiStack-root SclStack css-qod8yg">
    // <footer class="MuiGrid2-root ... SclGrid css-jlkb88">
    // <nav class="MuiGrid2-root ... SclGrid css-11miji8">
    // Plus tracking/identity iframes (demdex, doubleclick, identity, onetrust text-resize).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'iframe',
    ]);
  }
}
