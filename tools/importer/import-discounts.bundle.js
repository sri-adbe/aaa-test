/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-discounts.js
  var import_discounts_exports = {};
  __export(import_discounts_exports, {
    default: () => import_discounts_default
  });

  // tools/importer/parsers/hero-discount.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(":scope > img") || element.querySelector(":scope > picture img, img:not(.dxxImage)");
    const titleEl = element.querySelector(".widget-header-title h1, h1, .widget-header-title, h2");
    let heading = null;
    if (titleEl && titleEl.textContent.trim()) {
      heading = document2.createElement("h1");
      heading.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
    }
    let tiles = [...element.querySelectorAll('.btn-dxx-container [id^="btn-dxx"] > div')];
    if (!tiles.length) {
      tiles = [...element.querySelectorAll("a")].filter((a) => a.querySelector("img.dxxImage, img")).map((a) => a.parentElement);
    }
    const list = document2.createElement("ul");
    tiles.forEach((tile) => {
      const link = tile.querySelector("a[href]");
      const icon = tile.querySelector("img.dxxImage, img");
      const labelEl = tile.querySelector(".dxxTitle:not(a), p");
      const label = (labelEl && labelEl.textContent || icon && (icon.title || icon.alt) || "").replace(/\s+/g, " ").trim();
      if (!link && !label) return;
      const li = document2.createElement("li");
      if (icon) {
        const img = document2.createElement("img");
        img.src = icon.getAttribute("src");
        img.alt = icon.getAttribute("alt") || label;
        li.append(img, " ");
      }
      if (link) {
        const a = document2.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = label || link.textContent.trim();
        li.append(a);
      } else {
        li.append(label);
      }
      list.append(li);
    });
    const ctaSrc = element.querySelector("a.hero-btn, #mbl-btn-only, a.btn-style");
    let ctaP = null;
    if (ctaSrc && ctaSrc.textContent.trim()) {
      const a = document2.createElement("a");
      a.href = ctaSrc.getAttribute("href");
      a.textContent = ctaSrc.textContent.replace(/\s+/g, " ").trim();
      ctaP = document2.createElement("p");
      ctaP.append(a);
    }
    if (!bgImage && !heading && !list.children.length && !ctaP) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (list.children.length) contentCell.push(list);
    if (ctaP) contentCell.push(ctaP);
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-discount", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-offer.js
  function parse2(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(".offer-row-square-offer")];
    if (!tiles.length) tiles = [...element.querySelectorAll(":scope > div")];
    const cells = [];
    tiles.forEach((tile) => {
      const link = tile.querySelector("a[href]");
      const img = tile.querySelector("img");
      const textWrap = tile.querySelector(".offer-text-square") || link || tile;
      const titleText = [...textWrap.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
      const descEl = textWrap.querySelector(":scope > span, span");
      const descText = descEl ? descEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!titleText && !descText && !img) return;
      const body = [];
      if (titleText) {
        const p = document2.createElement("p");
        const strong = document2.createElement("strong");
        if (link) {
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          a.textContent = titleText;
          strong.append(a);
        } else {
          strong.textContent = titleText;
        }
        p.append(strong);
        body.push(p);
      }
      if (descText) {
        const p = document2.createElement("p");
        p.textContent = descText;
        body.push(p);
      }
      cells.push([img || "", body.length ? body : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-offer", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function tileImage(tile, document2) {
    const img = tile.querySelector("img");
    if (img && img.getAttribute("src")) return img;
    const styled = [tile, ...tile.querySelectorAll('[style*="background"]')].find((el) => /url\(/.test(el.getAttribute("style") || ""));
    if (styled) {
      const m = (styled.getAttribute("style") || "").match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
      if (m) {
        const bg = document2.createElement("img");
        bg.src = m[1];
        return bg;
      }
    }
    return null;
  }
  function parse3(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(".masonry-item")];
    if (!tiles.length) {
      tiles = [...element.querySelectorAll(".masonry-header-text, h2, h3, h4")].map((h) => h.closest('[class*="masonry-item"], [class*="item"], li') || h.parentElement).filter((el, i, arr) => el && arr.indexOf(el) === i);
    }
    const cells = [];
    tiles.forEach((tile) => {
      const titleEl = tile.querySelector(".masonry-header-text, h1, h2, h3, h4, h5, h6");
      const descEl = tile.querySelector(".masonry-subtitle-text, p");
      const link = tile.querySelector("a[href]") || tile.closest("a[href]");
      const img = tileImage(tile, document2);
      const titleText = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      const descText = descEl && descEl !== titleEl ? descEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!titleText && !descText && !img) return;
      const body = [];
      if (titleText) {
        const h = document2.createElement("h4");
        if (link) {
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          a.textContent = titleText;
          h.append(a);
        } else {
          h.textContent = titleText;
        }
        body.push(h);
      }
      if (descText) {
        const p = document2.createElement("p");
        p.textContent = descText;
        body.push(p);
      }
      cells.push([img || "", body.length ? body : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-savings.js
  function parse4(element, { document: document2 }) {
    const wrapper = element.closest(".tabbed-section-wrapper") || element.parentElement;
    let nav = element.previousElementSibling;
    if (!nav || !nav.matches('ul.nav-tabs, .nav-tabs, [role="tablist"]')) {
      nav = wrapper ? wrapper.querySelector('ul.nav-tabs, [role="tablist"]') : null;
    }
    const tabLinks = nav ? [...nav.querySelectorAll('a[role="tab"], li > a')] : [];
    const labelById = {};
    tabLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) labelById[href.slice(1)] = a.textContent.replace(/\s+/g, " ").trim();
    });
    let panes = [...element.querySelectorAll(":scope > .tab-pane")];
    if (!panes.length) panes = [...element.querySelectorAll('.tab-pane, [role="tabpanel"]')];
    const cells = [];
    panes.forEach((pane, i) => {
      const label = labelById[pane.id] || tabLinks[i] && tabLinks[i].textContent.replace(/\s+/g, " ").trim() || `Tab ${i + 1}`;
      const content = [];
      const headingEl = pane.querySelector(".text-block h2, h2, h3");
      if (headingEl && headingEl.textContent.trim()) {
        const h2 = document2.createElement("h2");
        h2.textContent = headingEl.textContent.replace(/\s+/g, " ").trim();
        content.push(h2);
      }
      const rte = pane.querySelector(".theTextEditor, .article-text, .rte-default");
      if (rte) {
        [...rte.children].forEach((el) => {
          if (el.textContent.trim() || el.querySelector("img")) content.push(el);
        });
      }
      const ctas = [...pane.querySelectorAll(".img-50-50-bottom-cta a[href], a.btn-style")].filter((a, idx, arr) => arr.indexOf(a) === idx && a.textContent.trim());
      ctas.forEach((cta) => {
        const p = document2.createElement("p");
        const strong = document2.createElement("strong");
        const a = document2.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = cta.textContent.replace(/\s+/g, " ").trim();
        strong.append(a);
        p.append(strong);
        content.push(p);
      });
      const img = pane.querySelector(".image-block img, img.fiftyfiftyimage") || [...pane.querySelectorAll("img")].find((im) => !(rte && rte.contains(im)));
      if (img) {
        const p = document2.createElement("p");
        p.append(img);
        content.push(p);
      }
      if (!content.length) return;
      cells.push([label, content]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (nav) nav.remove();
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-savings", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  var BLOCK_TAGS = /^(P|UL|OL|DIV|TABLE|H[1-6]|BLOCKQUOTE)$/;
  function parse5(element, { document: document2 }) {
    let items = [...element.querySelectorAll(".faq-item")];
    if (!items.length) items = [...element.querySelectorAll('.item, [class*="faq"][class*="item"]')];
    const cells = [];
    items.forEach((item) => {
      const qEl = item.querySelector(".faq-list h2, .faq-list, h2, h3, h4");
      let question = "";
      if (qEl) {
        const clone = qEl.cloneNode(true);
        clone.querySelectorAll('.icon-adjust, [class*="icon"]').forEach((s) => s.remove());
        question = clone.textContent.replace(/\s+/g, " ").trim();
      }
      if (!question && qEl) question = (qEl.getAttribute("title") || "").trim();
      const aEl = item.querySelector(".faq-content .top-space, .faq-content");
      const answer = [];
      if (aEl) {
        aEl.querySelectorAll("sup").forEach((sup) => {
          const t = sup.textContent.trim().toUpperCase();
          if (t === "TM") sup.replaceWith("\u2122");
          else if (t === "R") sup.replaceWith("\xAE");
        });
        aEl.normalize();
        let p = null;
        [...aEl.childNodes].forEach((node) => {
          if (node.nodeType === 1 && BLOCK_TAGS.test(node.tagName)) {
            p = null;
            if (node.textContent.trim() || node.querySelector("img")) answer.push(node);
            return;
          }
          if (node.nodeType === 3 && !node.textContent.trim()) {
            if (p) p.append(" ");
            return;
          }
          if (!p) {
            p = document2.createElement("p");
            answer.push(p);
          }
          if (node.nodeType === 3) p.append(node.textContent.replace(/\s+/g, " ").replace(/^ /, p.childNodes.length ? " " : ""));
          else p.append(node);
        });
      }
      if (!question && !answer.length) return;
      cells.push([question, answer.length ? answer : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/northeast-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".bootbox.modal",
        ".modal-backdrop"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".sub-navigationmbl",
        "#b-test-link-desktop",
        "#b-test-link-mobile",
        // The A/B-test script can strip the ids at render time; the variant link is
        // always the second orange CTA inside the same <li class="nav-item">.
        ".sub-navigationdsktp .nav-item a.link-navigation + a.link-navigation"
      ]);
      element.querySelectorAll(".sub-navigationdsktp a").forEach((a) => {
        const text = a.textContent.replace(/\s+/g, " ").trim();
        if (/^view your discounts$/i.test(text)) a.remove();
        else if (/view your discounts$/i.test(text)) a.textContent = text.replace(/\s*view your discounts$/i, "");
      });
      const srcHtml = payload && payload.html;
      const tileTexts = element.querySelectorAll(".offer-row-square-offer .offer-text-square");
      if (srcHtml && tileTexts.length) {
        const srcDoc = new DOMParser().parseFromString(srcHtml, "text/html");
        const srcTexts = srcDoc.querySelectorAll(".offer-row-square-offer .offer-text-square");
        if (srcTexts.length === tileTexts.length) {
          tileTexts.forEach((textEl, i) => {
            const desc = srcTexts[i].querySelector(":scope > span");
            if (!desc) return;
            const title = [...srcTexts[i].childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
            const descEl = document.createElement("span");
            descEl.textContent = desc.textContent.replace(/\s+/g, " ").trim();
            textEl.textContent = `${title} `;
            textEl.append(descEl);
          });
        }
      }
      WebImporter.DOMUtils.remove(element, ["span.anchr"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#page-header",
        "#page-footer",
        ".wgt-scrollup",
        "#mobile-roadside"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "#pagetags",
        "#aep-renew_global_bnnr",
        "#st-injected-content",
        ".__st-search-container",
        "#ZN_9AC3K4TKUMkFCIe",
        "noscript",
        "link"
      ]);
      element.querySelectorAll(".html-source").forEach((el) => {
        const hasMedia = el.querySelector("img, picture, video, table, hr, a, iframe");
        if (!hasMedia && el.textContent.trim() === "") el.remove();
      });
    }
  }

  // tools/importer/transformers/northeast-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function innermost(root, sel) {
    let matches;
    try {
      matches = [...root.querySelectorAll(sel)];
    } catch (e) {
      return null;
    }
    if (!matches.length) return null;
    const leaf = matches.find((el) => !matches.some((other) => other !== el && el.contains(other)));
    return leaf || matches[0];
  }
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      const el = innermost(root, sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template || {};
    const sections = template.sections || [];
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-discounts.js
  var PAGE_TEMPLATE = {
    "name": "discounts",
    "description": "AAA Northeast discounts landing page: hero with icon shortcuts, partner offer tiles, category masonry, savings tabs, FAQ accordion",
    "urls": [
      "https://northeast.aaa.com/discounts.html"
    ],
    "blocks": [
      {
        "name": "hero-discount",
        "instances": [
          ".widget-header.widget-header-container-no-widget"
        ]
      },
      {
        "name": "cards-offer",
        "instances": [
          ".offer-row-square .offer-row-square-offers"
        ]
      },
      {
        "name": "cards-category",
        "instances": [
          ".masonry-container"
        ]
      },
      {
        "name": "tabs-savings",
        "instances": [
          ".tabbed-section-wrapper .tab-content"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".faqs-component-container .row"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Membership promo bar",
        "selector": [
          ".offer-decisioning"
        ],
        "style": "blue",
        "blocks": [],
        "defaultContent": [
          ".notifications-bar"
        ]
      },
      {
        "id": "section-2",
        "name": "Discounts hero",
        "selector": [
          ".html-source:has(.widget-header)"
        ],
        "style": null,
        "blocks": [
          "hero-discount"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "Quick CTA bar",
        "selector": [
          ".html-source:has(.sub-navigationdsktp)"
        ],
        "style": "dark",
        "blocks": [],
        "defaultContent": [
          '.sub-navigationdsktp .nav-item a:not([id^="b-test"])'
        ]
      },
      {
        "id": "section-4",
        "name": "Partner offer row",
        "selector": [
          ".offer-row-square.parbase"
        ],
        "style": null,
        "blocks": [
          "cards-offer"
        ],
        "defaultContent": []
      },
      {
        "id": "section-5",
        "name": "Popular Categories",
        "selector": [
          ".html-source:has(.masonry-container)"
        ],
        "style": null,
        "blocks": [
          "cards-category"
        ],
        "defaultContent": [
          "h2.masonry-container-header",
          ".new-cc-cta a"
        ]
      },
      {
        "id": "section-6",
        "name": "Ways to Save",
        "selector": [
          ".tabbed-section.parbase"
        ],
        "style": null,
        "blocks": [
          "tabs-savings"
        ],
        "defaultContent": [
          ".tabbed-section-wrapper h2.comp-header"
        ]
      },
      {
        "id": "section-7",
        "name": "Frequently Asked Questions",
        "selector": [
          ".faq"
        ],
        "style": "grey",
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          ".faqs-component-container .horizontal-space2 h2"
        ]
      }
    ]
  };
  var PATH_MAP = {
    "/discounts": "/discounts"
  };
  var parsers = {
    "hero-discount": parse,
    "cards-offer": parse2,
    "cards-category": parse3,
    "tabs-savings": parse4,
    "accordion-faq": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_discounts_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const mappedPath = PATH_MAP[rawPath] || rawPath;
      const path = WebImporter.FileUtils.sanitizePath(mappedPath === "" ? "/index" : mappedPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_discounts_exports);
})();
