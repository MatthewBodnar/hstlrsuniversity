# Delivery verification

- Both source transcripts were read sequentially; overlapping passages and irregular numbering were reconciled into the coverage map.
- Eighteen pre-rendered chapters, 8,176 words including figure labels and takeaways, and eighteen responsive figures.
- Checked chapter anchors, local asset references, generated/source consistency and an encoded exclusion list for identities and source brands.
- Browser-inspected the desktop cover and reading layout and responsive layouts with actual content viewports of 320, 390 and 768 pixels. No horizontal page or figure overflow at the two phone widths.
- Exercised search for cash and pricing, no-result behavior, Escape dismissal, copied chapter links, chapter selection, mobile contents opening/closing, text-size controls, focus mode and the saved-position prompt.
- Corrected search snippets to preserve spaces between block elements and included the chapter topic in search.
- Verified pricing at $600 gives $500 gross contribution and 83% rounded contribution margin with the illustrated $100 delivery cost.
- Verified £10,000 reserve with £10,000 monthly outflow gives 1.0 month in the added runway illustration.
- Checked the page’s console output separately from browser-extension messages; no application errors were observed.
- All chapters remain in the HTML without scripting. Print and reduced-motion rules are provided. Physical devices and a full screen-reader session were not available for testing.

The site needs static hosting to be publicly readable as a website. The repository root is ready for branch-based Pages hosting; a separate static-host build is available in `dist/` after running the build command.
