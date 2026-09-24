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

  // tools/importer/import-self-serve.js
  var import_self_serve_exports = {};
  __export(import_self_serve_exports, {
    default: () => import_self_serve_default
  });

  // tools/importer/parsers/hero-login.js
  function parse(element, { document: document2 }) {
    const card = element.matches(".MuiCard-root") ? element : element.querySelector(".MuiCard-root") || element;
    const bgImage = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
    const content = card.querySelector(".MuiCardContent-root") || card;
    const heading = content.querySelector('h1, h2, [class*="MuiTypography-h1"] p, [class*="MuiTypography-h1"]');
    const subheading = content.querySelector('[class*="css-1mhq8hc"] p, [class*="css-1mhq8hc"]');
    const ctas = [...content.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
    const joinNote = content.querySelector('[class*="css-13inzlw"] p, [class*="css-13inzlw"]');
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctas.forEach((a) => contentCell.push(a));
    if (joinNote) contentCell.push(joinNote);
    if (!bgImage && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-login", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-selfserve.js
  function parse2(element, { document: document2 }) {
    let tabButtons = [...element.querySelectorAll(".inner-tab button")];
    if (!tabButtons.length) {
      tabButtons = [...element.querySelectorAll('button[class*="MuiButton-root"]')].filter((b) => !b.closest(".card-row, .MuiCardActions-root"));
    }
    const panels = [...element.querySelectorAll(".css-mphph9")];
    const cells = [];
    const pairCount = Math.min(tabButtons.length, panels.length);
    for (let i = 0; i < pairCount; i += 1) {
      const btn = tabButtons[i];
      const panel = panels[i];
      const labelText = btn.textContent.replace(/\s+/g, " ").trim();
      const labelP = document2.createElement("p");
      labelP.textContent = labelText;
      const panelClone = panel.cloneNode(true);
      panelClone.querySelectorAll('img[src^="data:"]').forEach((n) => n.remove());
      cells.push([labelP, panelClone]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-selfserve", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-action.js
  function parse3(element, { document: document2 }) {
    const row = element.matches(".card-row") ? element : element.querySelector(".card-row") || element;
    let items = [...row.querySelectorAll(":scope > a .MuiCardContent-root, :scope a .MuiCardContent-root")].map((content) => ({ content, anchor: content.closest("a") }));
    if (!items.length) {
      items = [...row.querySelectorAll(":scope > a")].map((anchor) => ({
        content: anchor.querySelector(".MuiCardContent-root"),
        anchor
      }));
    }
    const cells = [];
    items.forEach(({ content, anchor }) => {
      const icon = anchor && anchor.querySelector("img");
      const title = content && content.querySelector('[class*="b1Bold"]');
      const description = content && content.querySelector('[class*="b2Regular"]');
      const textCell = [];
      const href = anchor && anchor.getAttribute("href");
      if (title) {
        const titleText = title.textContent.replace(/\s+/g, " ").trim();
        if (href) {
          const h = document2.createElement("h3");
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = titleText;
          h.appendChild(a);
          textCell.push(h);
        } else {
          const h = document2.createElement("h3");
          h.textContent = titleText;
          textCell.push(h);
        }
      }
      if (description) textCell.push(description);
      if (!icon && !textCell.length) return;
      cells.push([icon || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-action", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse4(element, { document: document2 }) {
    const row = element.matches(".card-row") ? element : element.querySelector(".card-row") || element;
    let cards = [...row.querySelectorAll(":scope > .MuiCard-root")];
    if (!cards.length) cards = [...row.querySelectorAll(".MuiCard-root")];
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
      const content = card.querySelector(".MuiCardContent-root");
      const title = content && content.querySelector('[class*="b1Bold"]');
      const description = content && content.querySelector('[class*="b2Regular"]');
      const textCell = [];
      if (title) {
        const h = document2.createElement("h3");
        h.textContent = title.textContent.replace(/\s+/g, " ").trim();
        textCell.push(h);
      }
      if (description) textCell.push(description);
      const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
      ctas.forEach((a) => textCell.push(a));
      if (!img && !textCell.length) return;
      cells.push([img || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-selfserve.js
  function parse5(element, { document: document2 }) {
    const card = element.matches(".MuiCard-root") ? element : element.querySelector(".MuiCard-root") || element;
    const img = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');
    const contentCol = [];
    const content = card.querySelector(".MuiCardContent-root");
    const heading = content && content.querySelector('[class*="b1Bold"] h1, [class*="b1Bold"] h2, [class*="b1Bold"] h3, [class*="b1Bold"]');
    const description = content && content.querySelector('[class*="b2Regular"] p, [class*="b2Regular"]');
    if (heading) contentCol.push(heading);
    if (description) contentCol.push(description);
    const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
    ctas.forEach((a) => contentCol.push(a));
    if (!img && !contentCol.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[img || "", contentCol]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-selfserve", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-faq.js
  function parse6(element, { document: document2 }) {
    const row = element.matches(".card-row") ? element : element.querySelector(".card-row") || element;
    let cards = [...row.querySelectorAll(":scope > .MuiCard-root")];
    if (!cards.length) cards = [...row.querySelectorAll(".MuiCard-root")];
    const cells = [];
    cards.forEach((card) => {
      const content = card.querySelector(".MuiCardContent-root");
      const title = content && content.querySelector('[class*="b1Bold"]');
      const description = content && content.querySelector('[class*="b2Regular"]');
      const cardCell = [];
      if (title) {
        const h = document2.createElement("h3");
        h.textContent = title.textContent.replace(/\s+/g, " ").trim();
        cardCell.push(h);
      }
      if (description) cardCell.push(description);
      const ctas = [...card.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];
      ctas.forEach((a) => cardCell.push(a));
      if (!cardCell.length) return;
      cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-faq", cells });
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

  // tools/importer/import-self-serve.js
  var PAGE_TEMPLATE = {
    name: "self-serve",
    description: "AAA account self-serve hub: login hero banner over a lifestyle photo, and a 4-tab switcher (Insurance, Membership, Travel, Financial) whose panels hold quick-action tiles, product cards, image+text promos, and FAQ cards.",
    urls: [
      "https://www.ace.aaa.com/self-serve.html?intcmp=nav:findmore:aaabranches:selfservice"
    ],
    blocks: [
      { name: "hero-login", instances: [".MuiCard-root.css-6cayp"] },
      { name: "tabs-selfserve", instances: ["#tabSectionOne"] },
      { name: "cards-action", instances: [".css-mphph9 > .card-row:nth-of-type(1)"] },
      { name: "cards-product", instances: [".css-mphph9 > .card-row:nth-of-type(2)"] },
      { name: "columns-selfserve", instances: ["#claims"] },
      { name: "cards-faq", instances: [".css-mphph9 > .card-row:nth-of-type(4)"] }
    ],
    sections: [
      { id: "rc1", name: "hero-login", selector: [".MuiCard-root.css-6cayp"], style: null, blocks: ["hero-login"], defaultContent: [] },
      { id: "rc2", name: "self-serve-tabs", selector: ["#tabSectionOne"], style: null, blocks: ["tabs-selfserve", "cards-action", "cards-product", "columns-selfserve", "cards-faq"], defaultContent: [] },
      { id: "rc3", name: "root-portal", selector: ["#root"], style: null, blocks: [], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-login": parse,
    "tabs-selfserve": parse2,
    "cards-action": parse3,
    "cards-product": parse4,
    "columns-selfserve": parse5,
    "cards-faq": parse6
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_self_serve_default = {
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
  return __toCommonJS(import_self_serve_exports);
})();
