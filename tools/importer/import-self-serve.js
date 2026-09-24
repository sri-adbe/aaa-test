/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLoginParser from './parsers/hero-login.js';
import tabsSelfserveParser from './parsers/tabs-selfserve.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsSelfserveParser from './parsers/columns-selfserve.js';
import cardsFaqParser from './parsers/cards-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/aaa-cleanup.js';
import dmImagesTransformer from './transformers/aaa-dm-images.js';
import sectionsTransformer from './transformers/aaa-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'self-serve',
  description: 'AAA account self-serve hub: login hero banner over a lifestyle photo, and a 4-tab switcher (Insurance, Membership, Travel, Financial) whose panels hold quick-action tiles, product cards, image+text promos, and FAQ cards.',
  urls: [
    'https://www.ace.aaa.com/self-serve.html?intcmp=nav:findmore:aaabranches:selfservice',
  ],
  blocks: [
    { name: 'hero-login', instances: ['.MuiCard-root.css-6cayp'] },
    { name: 'tabs-selfserve', instances: ['#tabSectionOne'] },
    { name: 'cards-action', instances: ['.css-mphph9 > .card-row:nth-of-type(1)'] },
    { name: 'cards-product', instances: ['.css-mphph9 > .card-row:nth-of-type(2)'] },
    { name: 'columns-selfserve', instances: ['#claims'] },
    { name: 'cards-faq', instances: ['.css-mphph9 > .card-row:nth-of-type(4)'] },
  ],
  sections: [
    { id: 'rc1', name: 'hero-login', selector: ['.MuiCard-root.css-6cayp'], style: null, blocks: ['hero-login'], defaultContent: [] },
    { id: 'rc2', name: 'self-serve-tabs', selector: ['#tabSectionOne'], style: null, blocks: ['tabs-selfserve', 'cards-action', 'cards-product', 'columns-selfserve', 'cards-faq'], defaultContent: [] },
    { id: 'rc3', name: 'root-portal', selector: ['#root'], style: null, blocks: [], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-login': heroLoginParser,
  'tabs-selfserve': tabsSelfserveParser,
  'cards-action': cardsActionParser,
  'cards-product': cardsProductParser,
  'columns-selfserve': columnsSelfserveParser,
  'cards-faq': cardsFaqParser,
};

// TRANSFORMER REGISTRY (section transformer runs after cleanup; only when 2+ sections)
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
