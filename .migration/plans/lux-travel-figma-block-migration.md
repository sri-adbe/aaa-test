# Figma Design to Block Migration Plan

## Status: Ready to run. Click **Execute Plan** to start
Typing "go ahead" in the chat keeps this conversation in planning mode, where I can only read files and can't make changes. To start the work, do one of these:

- **Click the "Execute Plan" button** at the bottom of the chat panel, next to Send. It appears now because this plan is ready. **(Recommended)**
- Or switch the **Quick / Plan** toggle at the bottom of the chat panel to **Quick**, then send "go ahead" again.

As soon as one of those happens, I'll begin with step 1.

## Overview
Build an Edge Delivery Services block from the Figma Make design **"lux-travel-2.5.1"** (https://www.figma.com/make/jMDlvKyPEcgXDLdxeKXpEy/lux-travel-2.5.1). The block will match the design's structure, content and styling, and I'll check it in the local preview.

## Current State
- The project already has several custom blocks (cards, heroes, tabs, columns and others) from earlier migrations.
- The working tree has uncommitted changes to `.eslintrc.js`, `cards-category`, `hero-discount`, `tabs-savings` and `styles/styles.css`. The new block won't touch these files.
- The Figma migration add-on is **not on yet**. `.agents/settings.json` doesn't exist, so step 1 will create it.

## Approach
1. **Turn on the Figma add-on** (you've approved this). Create `.agents/settings.json` containing:
   ```json
   {"enabledPlugins": {"excat-figma@excat-extended": true}}
   ```
   I'll stop after this step. The add-on's tools load when your next message arrives, so send one more short message (for example "continue") to start the design work.
2. **Extract the design.** Use the add-on to read the Figma Make file: the frame or component, its layout, typography, colors, spacing, images and text.
3. **Pick the block.** Compare the design with the existing blocks and the block library:
   - If an existing block is at least 80% similar, reuse it and add a variant (for example `cards-*` or `hero-*`).
   - Otherwise, create a new custom block with a name that describes it.
4. **Build the block** in `blocks/<block-name>/`:
   - `<block-name>.js`: handles the page markup defensively, so it still works when authors leave out or add cells. It imports only from `/scripts/`, and `scripts/aem.js` stays unchanged.
   - `<block-name>.css`: every rule scoped to `.<block-name>`, reusing the site's existing design tokens from `styles/styles.css` where they fit.
5. **Add sample content.** Create a sample page that shows how authors would build the block, using the design's real copy and images.
6. **Check the preview.** Inspect the block's structure and computed styles, compare it with the Figma design at desktop and mobile sizes, and fix any differences.
7. **Lint.** Run ESLint and Stylelint on the new block files.

## Open Questions (to settle after the design is extracted)
- If the Figma file has several frames or sections, which one should become the block? I'll ask once I can see them.
- Should a matching existing block get a variant, or should this be a standalone block? I'll recommend one based on how similar they are.

## Checklist
- [ ] **You:** click **Execute Plan**, or switch the Quick / Plan toggle to Quick and send your message again
- [ ] Create `.agents/settings.json` to turn on the Figma add-on (already approved by you)
- [ ] **You:** send one more message (for example "continue") so the add-on's tools load
- [ ] Read the lux-travel-2.5.1 design with the Figma tools
- [ ] Pick which frame or component to migrate (ask you if there are several)
- [ ] Compare it with the existing blocks and the block library, then choose to reuse with a variant or build a new block
- [ ] Write the block JavaScript with defensive handling of the markup
- [ ] Write the block CSS scoped to the block, matching Figma typography, colors and spacing
- [ ] Add a sample content page for the block
- [ ] Check the preview at desktop and mobile sizes and fix differences
- [ ] Run lint on the new files
- [ ] Summarize what changed (local only, nothing sent to Document Authoring or published)

## Notes
- All changes stay in the local workspace. Nothing goes to Document Authoring, preview or publish unless you ask.
- Your other uncommitted changes won't be touched.
