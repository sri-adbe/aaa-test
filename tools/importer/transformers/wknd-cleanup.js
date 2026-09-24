/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND (wknd.site, AEM Core Components) site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html
 * (source: https://wknd.site/us/en/adventures.html).
 *
 * Kept (authorable): h1.cmp-title__text "Adventures", .teaser.cmp-teaser--hero,
 * .title.cmp-title--underline h2 "Current Adventures", and .tabs.panelcontainer
 * with its .cmp-tabs__tablist and ALL .cmp-tabs__tabpanel elements (active or not).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

const DEFAULT_ORIGIN = 'https://wknd.site';

function getOrigin(payload) {
  try {
    const original = payload && payload.params && payload.params.originalURL;
    if (original) return new URL(original).origin;
  } catch (e) {
    // fall through to default
  }
  return DEFAULT_ORIGIN;
}

// Resolve root-relative / relative URLs to absolute wknd.site URLs.
// Leaves absolute, protocol-relative-resolved, anchor, mailto/tel and data URIs alone.
function toAbsolute(value, origin) {
  if (!value) return value;
  const v = value.trim();
  if (/^(https?:|data:|mailto:|tel:|javascript:|#)/i.test(v)) return value;
  try {
    return new URL(v, `${origin}/`).href;
  } catch (e) {
    return value;
  }
}

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    const origin = getOrigin(payload);

    // Adobe Audience Manager ID-sync iframe (cleaned.html:
    // <iframe id="destination_publishing_iframe_wkndsite_0" class="aamIframeLoaded"
    //  src="https://wkndsite.demdex.net/dest5.html...">) and analytics beacons
    // (metadata.json images.mapping: https://dpm.demdex.net/ibs:...,
    //  https://wkndsitewknd887971p.112.2o7.net/b/ss/...). Removed before parsing
    // so tracking pixels never end up inside block cells.
    WebImporter.DOMUtils.remove(element, [
      'iframe.aamIframeLoaded',
      'img[src*="demdex.net"]',
      'img[src*="2o7.net"]',
      'img[src*="omtrdc.net"]',
    ]);

    // Tabs: every .cmp-tabs__tabpanel becomes its own cards-adventure block, so
    // inactive panels must not be treated as hidden content. Strip any
    // hidden / aria-hidden / display:none state from the panels (cleaned.html:
    // <div id="tabs-b4210c6ff3-item-...-tabpanel" class="cmp-tabs__tabpanel">).
    element.querySelectorAll('.tabs.panelcontainer .cmp-tabs__tabpanel').forEach((panel) => {
      panel.removeAttribute('hidden');
      panel.removeAttribute('aria-hidden');
      if (panel.style && panel.style.display === 'none') panel.style.removeProperty('display');
    });

    // Make image and link URLs absolute (wknd.site) so parsers copy usable URLs.
    element.querySelectorAll('img[src]').forEach((img) => {
      img.setAttribute('src', toAbsolute(img.getAttribute('src'), origin));
    });
    element.querySelectorAll('img[srcset]').forEach((img) => {
      const srcset = img.getAttribute('srcset')
        .split(',')
        .map((part) => {
          const [u, ...rest] = part.trim().split(/\s+/);
          return [toAbsolute(u, origin), ...rest].join(' ');
        })
        .join(', ');
      img.setAttribute('srcset', srcset);
    });
    element.querySelectorAll('a[href]').forEach((a) => {
      a.setAttribute('href', toAbsolute(a.getAttribute('href'), origin));
    });
  }

  if (hookName === H.after) {
    // Non-authorable site chrome (verified in cleaned.html):
    // <header class="experiencefragment cmp-experiencefragment--header ...">  (global nav, lang nav, sign-in)
    // <footer class="experiencefragment cmp-experiencefragment--footer ..."> (footer nav, social, copyright)
    // <div id="toggleNav"> / <div id="mobileNav" class="cmp-navigation--mobile"> (mobile nav clone at end of body)
    // <div class="separator ..."><div class="cmp-separator"><hr class="cmp-separator__horizontal-rule">
    //   decorative separator (targeted by wrapper class so bare <hr> section breaks survive).
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      'footer.experiencefragment',
      '#toggleNav',
      '#mobileNav',
      '.separator',
      'iframe',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // Strip Core Components data-layer / link-accessibility attributes (on <body> in cleaned.html).
    [element, ...element.querySelectorAll('[data-cmp-data-layer-enabled], [data-cmp-data-layer-name], [data-cmp-link-accessibility-enabled], [data-cmp-link-accessibility-text]')]
      .forEach((el) => {
        el.removeAttribute('data-cmp-data-layer-enabled');
        el.removeAttribute('data-cmp-data-layer-name');
        el.removeAttribute('data-cmp-link-accessibility-enabled');
        el.removeAttribute('data-cmp-link-accessibility-text');
      });

    // Remove empty layout wrappers (AEM grid / container divs left empty after
    // chrome removal). Keep anything with text, media, links, tables (blocks) or <hr> (section breaks).
    let removed = true;
    while (removed) {
      removed = false;
      element.querySelectorAll('div').forEach((div) => {
        if (div.closest('table')) return;
        if (div.textContent.trim() !== '') return;
        if (div.querySelector('img, picture, video, a, table, hr, iframe')) return;
        div.remove();
        removed = true;
      });
    }
  }
}
