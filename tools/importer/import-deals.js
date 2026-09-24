/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import widgetParser from './parsers/widget.js';
import cardsDealParser from './parsers/cards-deal.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/aaa-cleanup.js';
import dmImagesTransformer from './transformers/aaa-dm-images.js';
import sectionsTransformer from './transformers/aaa-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'deals',
  description: 'AAA travel deals catalog page: booking widget, promotional deal-card rows grouped by theme, blue promo banners, image-backed cruise feature cards, and a travel assistant widget.',
  urls: [
    'https://www.ace.aaa.com/travel/deals/travel-deals.html?intcmp=nav:gotravel:bookatrip:traveldeals',
  ],
  blocks: [
    {
      name: 'widget',
      instances: ['#aceTravelWidget-rb', '#aceTravelAssistant'],
    },
    {
      name: 'cards-deal',
      instances: [
        '.css-l4xn9z:nth-of-type(3) .card-row',
        '.css-sp6gi5 .card-row',
        '#north-america .card-row',
        '.css-l4xn9z:nth-of-type(8) .card-row',
        '.css-z5kqeg:nth-of-type(9) .card-row',
        '.css-1v158k1 .card-row',
      ],
    },
    {
      name: 'cards-feature',
      instances: ['#cruiseDeals .card-row'],
    },
    {
      name: 'columns-promo',
      instances: ['.css-1w1lp5c .MuiCard-root', '.experience-fragment .MuiCard-root'],
    },
  ],
  sections: [
    { id: 'rc1', name: 'booking-intro', selector: ['.MuiStack-root.SclStack.css-6yluhb'], style: null, blocks: ['widget'], defaultContent: ['.css-6yluhb .MuiTypography-b2Regular'] },
    { id: 'rc2', name: 'featured-deals', selector: ['.MuiStack-root.SclStack.css-l4xn9z:nth-of-type(3)'], style: null, blocks: ['cards-deal'], defaultContent: ['.css-l4xn9z:nth-of-type(3) .MuiTypography-b2Regular'] },
    { id: 'rc3', name: 'promo-dream-vacation', selector: ['.MuiStack-root.SclStack.css-1w1lp5c'], style: null, blocks: ['columns-promo'], defaultContent: [] },
    { id: 'rc4', name: 'partner-hotels-cars', selector: ['.MuiStack-root.SclStack.css-sp6gi5'], style: null, blocks: ['cards-deal'], defaultContent: ['.css-sp6gi5 .MuiTypography-b2Regular'] },
    { id: 'rc5', name: 'promo-experience-fragment', selector: ['.MuiStack-root.SclStack.css-l4xn9z:nth-of-type(6)'], style: null, blocks: ['columns-promo'], defaultContent: [] },
    { id: 'rc6', name: 'north-america-deals', selector: ['#north-america'], style: null, blocks: ['cards-deal'], defaultContent: ['#north-america .MuiTypography-b2Regular'] },
    { id: 'rc7', name: 'international-deals', selector: ['.MuiStack-root.SclStack.css-l4xn9z:nth-of-type(8)'], style: null, blocks: ['cards-deal'], defaultContent: ['.css-l4xn9z:nth-of-type(8) .MuiTypography-b2Regular'] },
    { id: 'rc8', name: 'cruise-deals', selector: ['.MuiStack-root.SclStack.css-z5kqeg:nth-of-type(9)'], style: null, blocks: ['cards-deal'], defaultContent: ['.css-z5kqeg:nth-of-type(9) .MuiTypography-b2Regular'] },
    { id: 'rc9', name: 'last-minute-cruise-deals', selector: ['#cruiseDeals'], style: null, blocks: ['cards-feature'], defaultContent: ['#lastminutedeals'] },
    { id: 'rc10', name: 'luxury-travel-deals', selector: ['.MuiStack-root.SclStack.css-1v158k1'], style: null, blocks: ['cards-deal'], defaultContent: ['.css-1v158k1 .MuiTypography-b2Regular'] },
    { id: 'rc11', name: 'spacer', selector: ['.MuiStack-root.SclStack.css-z5kqeg:nth-of-type(12)'], style: null, blocks: [], defaultContent: [] },
    { id: 'rc12', name: 'about-and-assistant', selector: ['.MuiStack-root.SclStack.css-l4xn9z:nth-of-type(13)'], style: null, blocks: ['widget'], defaultContent: ['.css-l4xn9z:nth-of-type(13) .MuiCardContent-root'] },
    { id: 'rc13', name: 'root-portal', selector: ['#root'], style: null, blocks: [], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  widget: widgetParser,
  'cards-deal': cardsDealParser,
  'cards-feature': cardsFeatureParser,
  'columns-promo': columnsPromoParser,
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup (adds section breaks); only when 2+ sections.
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
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

    // 6. Sanitized path (root → /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

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
