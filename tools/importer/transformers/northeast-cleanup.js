/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AAA Northeast (northeast.aaa.com) site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html (discounts page).
 * Note: no cookie-consent markup (OneTrust/Cookiebot) exists in the captured DOM,
 * so none is targeted here.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Zip-code welcome popup (bootbox modal) + its backdrop, found at end of body:
    // <div class="bootbox modal fade in"> ... <div class="zipcodeContainer">
    // <div class="modal-backdrop fade in">
    WebImporter.DOMUtils.remove(element, [
      '.bootbox.modal',
      '.modal-backdrop',
    ]);

    // Mobile duplicate of the sticky sub-navigation (<div class="sub-navigationmbl">)
    // and the A/B-test duplicate CTA links (<a id="b-test-link-desktop">,
    // <a id="b-test-link-mobile">). Removed before parsing so the Quick CTA bar
    // section only carries the desktop links once.
    WebImporter.DOMUtils.remove(element, [
      '.sub-navigationmbl',
      '#b-test-link-desktop',
      '#b-test-link-mobile',
      // The A/B-test script can strip the ids at render time; the variant link is
      // always the second orange CTA inside the same <li class="nav-item">.
      '.sub-navigationdsktp .nav-item a.link-navigation + a.link-navigation',
    ]);
    // At render time the A/B-test script folds the variant label into the control
    // link itself ("View All Discounts View Your Discounts"); keep only the control label.
    element.querySelectorAll('.sub-navigationdsktp a').forEach((a) => {
      const text = a.textContent.replace(/\s+/g, ' ').trim();
      if (/^view your discounts$/i.test(text)) a.remove();
      else if (/view your discounts$/i.test(text)) a.textContent = text.replace(/\s*view your discounts$/i, '');
    });

    // Offer-row tiles: <span class="offer-text-square">Title <span>Description</span></span>.
    // The importer flattens the nested <span> before transform runs, merging title and
    // description; restore the split from the raw page HTML so cards-offer can separate them.
    const srcHtml = payload && payload.html;
    const tileTexts = element.querySelectorAll('.offer-row-square-offer .offer-text-square');
    if (srcHtml && tileTexts.length) {
      const srcDoc = new DOMParser().parseFromString(srcHtml, 'text/html');
      const srcTexts = srcDoc.querySelectorAll('.offer-row-square-offer .offer-text-square');
      if (srcTexts.length === tileTexts.length) {
        tileTexts.forEach((textEl, i) => {
          const desc = srcTexts[i].querySelector(':scope > span');
          if (!desc) return;
          const title = [...srcTexts[i].childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          const descEl = document.createElement('span');
          descEl.textContent = desc.textContent.replace(/\s+/g, ' ').trim();
          textEl.textContent = `${title} `;
          textEl.append(descEl);
        });
      }
    }

    // In-page anchor spans: <span class="anchr"><a class="anchr-lnks" id="offers" href="#"></a></span>
    WebImporter.DOMUtils.remove(element, ['span.anchr']);
  }

  if (hookName === H.after) {
    // Non-authorable site chrome (verified in cleaned.html):
    // <header id="page-header" class="navbar-fixed-top"> (includes #breadcrumbwrapper-0, nav, search)
    // <footer id="page-footer">
    // <span class="wgt-scrollup"> (Return to Top)
    // <div id="mobile-roadside" class="container"> (sticky roadside CTA)
    WebImporter.DOMUtils.remove(element, [
      '#page-header',
      '#page-footer',
      '.wgt-scrollup',
      '#mobile-roadside',
    ]);

    // Tracking / third-party injected widgets (verified in cleaned.html):
    // iframes: demdex id-sync, pbbl.co, bounceexchange (#bcx_local_storage_frame), empty <iframe>
    // <input id="pagetags">, <div id="aep-renew_global_bnnr">, Swiftype (#st-injected-content,
    // .__st-search-container), Qualtrics feedback (#ZN_9AC3K4TKUMkFCIe)
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      '#pagetags',
      '#aep-renew_global_bnnr',
      '#st-injected-content',
      '.__st-search-container',
      '#ZN_9AC3K4TKUMkFCIe',
      'noscript',
      'link',
    ]);

    // Empty html-source containers (e.g. <div class="html-source parbase"><div class="html-source-content"></div></div>,
    // including the ones left empty after span.anchr removal).
    element.querySelectorAll('.html-source').forEach((el) => {
      const hasMedia = el.querySelector('img, picture, video, table, hr, a, iframe');
      if (!hasMedia && el.textContent.trim() === '') el.remove();
    });
  }
}
