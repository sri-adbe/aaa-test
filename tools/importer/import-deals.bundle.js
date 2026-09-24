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

  // tools/importer/import-deals.js
  var import_deals_exports = {};
  __export(import_deals_exports, {
    default: () => import_deals_default
  });

  // tools/importer/parsers/widget.js
  function parse(element, { document: document2 }) {
    const id = element.id || element.querySelector("[id]") && element.querySelector("[id]").id || element.className && String(element.className).trim() || "widget";
    const cell = document2.createElement("p");
    cell.textContent = id;
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "widget", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-deal.js
  function parse2(element, { document: document2 }) {
    let cards = [...element.querySelectorAll(":scope > .MuiCard-root")];
    if (!cards.length) cards = [...element.querySelectorAll(".MuiCard-root")];
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
      const content = card.querySelector(".MuiCardContent-root");
      const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
      const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');
      const textCell = [];
      if (title) textCell.push(title);
      if (description) textCell.push(description);
      const priceStack = card.querySelector('.MuiStack-root.css-1cnr8ro, [class*="css-1cnr8ro"]');
      if (priceStack) {
        const priceClone = priceStack.cloneNode(true);
        priceClone.querySelectorAll("button, img, .MuiCardActions-root").forEach((n) => n.remove());
        const parts = [...priceClone.querySelectorAll("span")].map((s) => s.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
        const priceText = (parts.length ? parts.join(" ") : priceClone.textContent.replace(/\s+/g, " ").trim()).trim();
        if (priceText) {
          const p = document2.createElement("p");
          p.textContent = priceText;
          textCell.push(p);
        }
      }
      const ctas = [...card.querySelectorAll('a.SclButton, a[class*="MuiButton-root"]')];
      ctas.forEach((a) => textCell.push(a));
      if (!img && !textCell.length) return;
      cells.push([img || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-deal", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    let items = [...element.querySelectorAll(".MuiCardContent-root")].map((content) => ({
      content,
      card: content.closest(".MuiCard-root") || content.closest("a")
    }));
    if (!items.length) {
      items = [...element.querySelectorAll(".card-row > a.MuiCard-root, a.MuiCard-root")].map((card) => ({
        content: card.querySelector(".MuiCardContent-root"),
        card
      }));
    }
    const cells = [];
    items.forEach(({ content, card }) => {
      const scope = card || content;
      const img = scope && scope.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
      const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
      const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');
      const textCell = [];
      if (title) textCell.push(title);
      if (description) textCell.push(description);
      const href = card && card.tagName === "A" ? card.getAttribute("href") : card && card.closest("a") ? card.closest("a").getAttribute("href") : null;
      if (href) {
        const link = document2.createElement("a");
        link.setAttribute("href", href);
        link.textContent = "Learn more";
        textCell.push(link);
      }
      if (!img && !textCell.length) return;
      cells.push([img || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document: document2 }) {
    const card = element.matches(".MuiCard-root") ? element : element.querySelector(".MuiCard-root") || element;
    const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
    const contentCol = [];
    const chip = card.querySelector('.MuiChip-label, [class*="MuiChip-label"]');
    if (chip) {
      const chipText = chip.textContent.replace(/\s+/g, " ").trim();
      if (chipText) {
        const p = document2.createElement("p");
        const em = document2.createElement("em");
        em.textContent = chipText;
        p.appendChild(em);
        contentCol.push(p);
      }
    }
    const content = card.querySelector(".MuiCardContent-root");
    const title = content && content.querySelector('.MuiTypography-b1Bold, [class*="b1Bold"]');
    const description = content && content.querySelector('.MuiTypography-b2Regular, [class*="b2Regular"]');
    if (title) contentCol.push(title);
    if (description) contentCol.push(description);
    const ctas = [...card.querySelectorAll('a.SclButton, a[class*="MuiButton-root"]')];
    ctas.forEach((a) => contentCol.push(a));
    if (!img && !contentCol.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[img || "", contentCol]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aaa-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk",
        "#ot-fltr-modal",
        ".onetrust-pc-dark-filter"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/aaa-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/aaa-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform3(hookName, element, payload) {
    const sections = payload.template.sections || [];
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

  // tools/importer/import-deals.js
  var PAGE_TEMPLATE = {
    name: "deals",
    description: "AAA travel deals catalog page: booking widget, promotional deal-card rows grouped by theme, blue promo banners, image-backed cruise feature cards, and a travel assistant widget.",
    urls: [
      "https://www.ace.aaa.com/travel/deals/travel-deals.html?intcmp=nav:gotravel:bookatrip:traveldeals"
    ],
    blocks: [
      {
        name: "widget",
        instances: ["#aceTravelWidget-rb", "#aceTravelAssistant"]
      },
      {
        name: "cards-deal",
        instances: [
          ".css-l4xn9z:nth-of-type(3) .card-row",
          ".css-sp6gi5 .card-row",
          "#north-america .card-row",
          ".css-l4xn9z:nth-of-type(8) .card-row",
          ".css-z5kqeg:nth-of-type(9) .card-row",
          ".css-1v158k1 .card-row"
        ]
      },
      {
        name: "cards-feature",
        instances: ["#cruiseDeals .card-row"]
      },
      {
        name: "columns-promo",
        instances: [".css-1w1lp5c .MuiCard-root", ".experience-fragment .MuiCard-root"]
      }
    ],
    sections: [
      { id: "rc1", name: "booking-intro", selector: [".MuiStack-root.SclStack.css-6yluhb"], style: null, blocks: ["widget"], defaultContent: [".css-6yluhb .MuiTypography-b2Regular"] },
      { id: "rc2", name: "featured-deals", selector: [".MuiStack-root.SclStack.css-l4xn9z:nth-of-type(3)"], style: null, blocks: ["cards-deal"], defaultContent: [".css-l4xn9z:nth-of-type(3) .MuiTypography-b2Regular"] },
      { id: "rc3", name: "promo-dream-vacation", selector: [".MuiStack-root.SclStack.css-1w1lp5c"], style: null, blocks: ["columns-promo"], defaultContent: [] },
      { id: "rc4", name: "partner-hotels-cars", selector: [".MuiStack-root.SclStack.css-sp6gi5"], style: null, blocks: ["cards-deal"], defaultContent: [".css-sp6gi5 .MuiTypography-b2Regular"] },
      { id: "rc5", name: "promo-experience-fragment", selector: [".MuiStack-root.SclStack.css-l4xn9z:nth-of-type(6)"], style: null, blocks: ["columns-promo"], defaultContent: [] },
      { id: "rc6", name: "north-america-deals", selector: ["#north-america"], style: null, blocks: ["cards-deal"], defaultContent: ["#north-america .MuiTypography-b2Regular"] },
      { id: "rc7", name: "international-deals", selector: [".MuiStack-root.SclStack.css-l4xn9z:nth-of-type(8)"], style: null, blocks: ["cards-deal"], defaultContent: [".css-l4xn9z:nth-of-type(8) .MuiTypography-b2Regular"] },
      { id: "rc8", name: "cruise-deals", selector: [".MuiStack-root.SclStack.css-z5kqeg:nth-of-type(9)"], style: null, blocks: ["cards-deal"], defaultContent: [".css-z5kqeg:nth-of-type(9) .MuiTypography-b2Regular"] },
      { id: "rc9", name: "last-minute-cruise-deals", selector: ["#cruiseDeals"], style: null, blocks: ["cards-feature"], defaultContent: ["#lastminutedeals"] },
      { id: "rc10", name: "luxury-travel-deals", selector: [".MuiStack-root.SclStack.css-1v158k1"], style: null, blocks: ["cards-deal"], defaultContent: [".css-1v158k1 .MuiTypography-b2Regular"] },
      { id: "rc11", name: "spacer", selector: [".MuiStack-root.SclStack.css-z5kqeg:nth-of-type(12)"], style: null, blocks: [], defaultContent: [] },
      { id: "rc12", name: "about-and-assistant", selector: [".MuiStack-root.SclStack.css-l4xn9z:nth-of-type(13)"], style: null, blocks: ["widget"], defaultContent: [".css-l4xn9z:nth-of-type(13) .MuiCardContent-root"] },
      { id: "rc13", name: "root-portal", selector: ["#root"], style: null, blocks: [], defaultContent: [] }
    ]
  };
  var parsers = {
    widget: parse,
    "cards-deal": parse2,
    "cards-feature": parse3,
    "columns-promo": parse4
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
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
  var import_deals_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
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
  return __toCommonJS(import_deals_exports);
})();
