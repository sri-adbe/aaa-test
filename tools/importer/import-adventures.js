/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTeaserParser from './parsers/hero-teaser.js';
import tabsCategoryParser from './parsers/tabs-category.js';
import cardsAdventureParser from './parsers/cards-adventure.js';

// TRANSFORMER IMPORTS (WKND-specific; aaa-* transformers target a different source site)
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventures',
  description: 'WKND adventures listing: page title, hero teaser, category tabs with adventure card grids',
  urls: [
    'https://wknd.site/us/en/adventures.html',
  ],
  blocks: [
    {
      name: 'hero-teaser',
      instances: ['.teaser.cmp-teaser--hero'],
    },
    {
      name: 'tabs-category',
      instances: ['.tabs.panelcontainer .cmp-tabs__tablist'],
    },
    {
      name: 'cards-adventure',
      instances: ['.tabs.panelcontainer .cmp-tabs__tabpanel .cmp-image-list'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'page-title', selector: ['main.cmp-layout-container--fixed:has(h1)'], style: null, blocks: [], defaultContent: ['h1.cmp-title__text'] },
    { id: 'section-2', name: 'hero-teaser', selector: ['.teaser.cmp-teaser--hero'], style: null, blocks: ['hero-teaser'], defaultContent: [] },
    { id: 'section-3', name: 'current-adventures', selector: ['main.cmp-layout-container--fixed:has(.tabs.panelcontainer)'], style: null, blocks: ['tabs-category', 'cards-adventure'], defaultContent: ['.title.cmp-title--underline h2'] },
  ],
};

// TARGET PATHS - source pathname → document path in this site
const PATH_MAP = {
  '/us/en/adventures': '/adventures',
};

// PARSER REGISTRY
const parsers = {
  'hero-teaser': heroTeaserParser,
  'tabs-category': tabsCategoryParser,
  'cards-adventure': cardsAdventureParser,
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
