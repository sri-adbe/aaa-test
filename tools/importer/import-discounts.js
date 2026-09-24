/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroDiscountParser from './parsers/hero-discount.js';
import cardsOfferParser from './parsers/cards-offer.js';
import cardsCategoryParser from './parsers/cards-category.js';
import tabsSavingsParser from './parsers/tabs-savings.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS (northeast.aaa.com-specific; aaa-*/wknd-* transformers target other source sites)
import cleanupTransformer from './transformers/northeast-cleanup.js';
import sectionsTransformer from './transformers/northeast-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
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
        ".sub-navigationdsktp .nav-item a:not([id^=\"b-test\"])"
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

// TARGET PATHS - source pathname → document path in this site
const PATH_MAP = {
  '/discounts': '/discounts',
};

// PARSER REGISTRY
const parsers = {
  'hero-discount': heroDiscountParser,
  'cards-offer': cardsOfferParser,
  'cards-category': cardsCategoryParser,
  'tabs-savings': tabsSavingsParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup (adds section breaks); only when 2+ sections.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (mapped to this site's page; root → /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const mappedPath = PATH_MAP[rawPath] || rawPath;
    const path = WebImporter.FileUtils.sanitizePath(mappedPath === '' ? '/index' : mappedPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
