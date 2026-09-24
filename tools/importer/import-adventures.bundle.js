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

  // tools/importer/import-adventures.js
  var import_adventures_exports = {};
  __export(import_adventures_exports, {
    default: () => import_adventures_default
  });

  // tools/importer/parsers/hero-teaser.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const titleEl = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const descWrap = element.querySelector(".cmp-teaser__description");
    let descriptions = descWrap ? [...descWrap.querySelectorAll("p")] : [];
    if (!descriptions.length && descWrap && descWrap.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = descWrap.textContent.trim();
      descriptions = [p];
    }
    let heading = null;
    if (titleEl && titleEl.textContent.trim()) {
      heading = document2.createElement("h2");
      heading.textContent = titleEl.textContent.trim();
    }
    if (!image && !heading && !descriptions.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...descriptions);
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-category.js
  function parse2(element, { document: document2 }) {
    let tabs = [...element.querySelectorAll(":scope > .cmp-tabs__tab")];
    if (!tabs.length) tabs = [...element.querySelectorAll('[role="tab"], :scope > li')];
    const cells = [];
    tabs.forEach((tab) => {
      const label = tab.textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      cells.push([label, ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-adventure.js
  function parse3(element, { document: document2 }) {
    let items = [...element.querySelectorAll(":scope > li.cmp-image-list__item")];
    if (!items.length) items = [...element.querySelectorAll(".cmp-image-list__item, :scope > li")];
    const makeLink = (href, content) => {
      const a = document2.createElement("a");
      a.href = href;
      if (typeof content === "string") a.textContent = content;
      else a.append(content);
      return a;
    };
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const titleEl = item.querySelector(".cmp-image-list__item-title");
      const descEl = item.querySelector(".cmp-image-list__item-description");
      const linkEl = item.querySelector("a.cmp-image-list__item-title-link[href]") || item.querySelector("a.cmp-image-list__item-image-link[href]") || item.querySelector("a[href]");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      let titleText = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!titleText && img) titleText = (img.getAttribute("alt") || "").trim();
      const descText = descEl ? descEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!img && !titleText && !descText) return;
      let imageCell = "";
      if (img) imageCell = href ? makeLink(href, img) : img;
      const bodyCell = [];
      if (titleText) {
        const p = document2.createElement("p");
        p.append(href ? makeLink(href, titleText) : document2.createTextNode(titleText));
        bodyCell.push(p);
      }
      if (descText) {
        const p = document2.createElement("p");
        p.textContent = descText;
        bodyCell.push(p);
      }
      cells.push([imageCell, bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  var DEFAULT_ORIGIN = "https://wknd.site";
  function getOrigin(payload) {
    try {
      const original = payload && payload.params && payload.params.originalURL;
      if (original) return new URL(original).origin;
    } catch (e) {
    }
    return DEFAULT_ORIGIN;
  }
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
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      const origin = getOrigin(payload);
      WebImporter.DOMUtils.remove(element, [
        "iframe.aamIframeLoaded",
        'img[src*="demdex.net"]',
        'img[src*="2o7.net"]',
        'img[src*="omtrdc.net"]'
      ]);
      element.querySelectorAll(".tabs.panelcontainer .cmp-tabs__tabpanel").forEach((panel) => {
        panel.removeAttribute("hidden");
        panel.removeAttribute("aria-hidden");
        if (panel.style && panel.style.display === "none") panel.style.removeProperty("display");
      });
      element.querySelectorAll("img[src]").forEach((img) => {
        img.setAttribute("src", toAbsolute(img.getAttribute("src"), origin));
      });
      element.querySelectorAll("img[srcset]").forEach((img) => {
        const srcset = img.getAttribute("srcset").split(",").map((part) => {
          const [u, ...rest] = part.trim().split(/\s+/);
          return [toAbsolute(u, origin), ...rest].join(" ");
        }).join(", ");
        img.setAttribute("srcset", srcset);
      });
      element.querySelectorAll("a[href]").forEach((a) => {
        a.setAttribute("href", toAbsolute(a.getAttribute("href"), origin));
      });
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        "footer.experiencefragment",
        "#toggleNav",
        "#mobileNav",
        ".separator",
        "iframe",
        "script",
        "style",
        "noscript",
        "link"
      ]);
      [element, ...element.querySelectorAll("[data-cmp-data-layer-enabled], [data-cmp-data-layer-name], [data-cmp-link-accessibility-enabled], [data-cmp-link-accessibility-text]")].forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-data-layer-name");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
      });
      let removed = true;
      while (removed) {
        removed = false;
        element.querySelectorAll("div").forEach((div) => {
          if (div.closest("table")) return;
          if (div.textContent.trim() !== "") return;
          if (div.querySelector("img, picture, video, a, table, hr, iframe")) return;
          div.remove();
          removed = true;
        });
      }
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
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

  // tools/importer/import-adventures.js
  var PAGE_TEMPLATE = {
    name: "adventures",
    description: "WKND adventures listing: page title, hero teaser, category tabs with adventure card grids",
    urls: [
      "https://wknd.site/us/en/adventures.html"
    ],
    blocks: [
      {
        name: "hero-teaser",
        instances: [".teaser.cmp-teaser--hero"]
      },
      {
        name: "tabs-category",
        instances: [".tabs.panelcontainer .cmp-tabs__tablist"]
      },
      {
        name: "cards-adventure",
        instances: [".tabs.panelcontainer .cmp-tabs__tabpanel .cmp-image-list"]
      }
    ],
    sections: [
      { id: "section-1", name: "page-title", selector: ["main.cmp-layout-container--fixed:has(h1)"], style: null, blocks: [], defaultContent: ["h1.cmp-title__text"] },
      { id: "section-2", name: "hero-teaser", selector: [".teaser.cmp-teaser--hero"], style: null, blocks: ["hero-teaser"], defaultContent: [] },
      { id: "section-3", name: "current-adventures", selector: ["main.cmp-layout-container--fixed:has(.tabs.panelcontainer)"], style: null, blocks: ["tabs-category", "cards-adventure"], defaultContent: [".title.cmp-title--underline h2"] }
    ]
  };
  var PATH_MAP = {
    "/us/en/adventures": "/adventures"
  };
  var parsers = {
    "hero-teaser": parse,
    "tabs-category": parse2,
    "cards-adventure": parse3
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
  var import_adventures_default = {
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
  return __toCommonJS(import_adventures_exports);
})();
