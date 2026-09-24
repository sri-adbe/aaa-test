/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-login. Base block: hero.
 * Source: https://www.ace.aaa.com/self-serve.html
 * Generated: 2026-09-24
 *
 * Instance (page-templates.json): `.MuiCard-root.css-6cayp` — a login banner card:
 * background/lifestyle image + h1 heading + subheading paragraph + "Create an account" /
 * "Log in" buttons + a "Not a member? Join AAA today" link.
 *
 * Library structure (Hero): 1 column, 3 rows. Row 1 = block name. Row 2 = background
 * image (single cell). Row 3 = single cell holding title, subheading, CTAs, and the
 * join link. structure.json: repeating units all iterationSafe:true, no invalid nesting;
 * this is a single hero instance (not a repeating list), so no iteration is required.
 */
export default function parse(element, { document }) {
  // The matched element is the card itself.
  const card = element.matches('.MuiCard-root') ? element : element.querySelector('.MuiCard-root') || element;

  // --- Background image (row 2, optional) ---
  const bgImage = card.querySelector('img[class*="MuiCardMedia"], img[class*="CardMedia"]');

  // --- Content (row 3) ---
  const content = card.querySelector('.MuiCardContent-root') || card;

  // Title: h1 heading (wrapped in a MuiTypography span/h1).
  const heading = content.querySelector('h1, h2, [class*="MuiTypography-h1"] p, [class*="MuiTypography-h1"]');
  // Subheading: first b2Regular paragraph that is NOT the "Join" note (the join note
  // lives in css-13inzlw and contains a link; the subheading is css-1mhq8hc).
  const subheading = content.querySelector('[class*="css-1mhq8hc"] p, [class*="css-1mhq8hc"]');

  // CTA buttons (Create an account / Log in).
  const ctas = [...content.querySelectorAll('.MuiCardActions-root a.SclButton, .MuiCardActions-root a[class*="MuiButton-root"]')];

  // "Not a member? Join AAA today" note — a b2Regular span with an inline link.
  const joinNote = content.querySelector('[class*="css-13inzlw"] p, [class*="css-13inzlw"]');

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctas.forEach((a) => contentCell.push(a));
  if (joinNote) contentCell.push(joinNote);

  // Empty-block guard
  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);   // row 2: background image (1 cell)
  cells.push([contentCell]);            // row 3: one cell holding all content elements

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-login', cells });
  element.replaceWith(block);
}
