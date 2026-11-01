# Fieldnotes

A blunt, conversational business reading page. The first reading page is available at `business-fieldguide/`; the root opens that page. The structure is ready for additional guides without inventing unfinished navigation.

![Desktop cover preview](docs/preview.jpg)

[See the direct-address reading layout](docs/reading-preview.jpg)

## Run

Use Node 20.11 or later. There are no application dependencies, accounts, API keys or external font/image services.

```sh
npm run dev
```

Open the local address on port 3000. Set `PORT` to choose another port.

## Edit and build

- `src/chapters.mjs`: eighteen chapters, source ranges, part groupings and takeaways.
- `src/visuals.mjs`: responsive HTML/SVG figures and illustrative arithmetic.
- `src/template.mjs`: semantic page template and navigation.
- `assets/style.css`: responsive layouts, typography, reduced-motion and print styles.
- `assets/reader.js`: search, chapter tracking, local reading preferences, copy links and optional demonstrations.

```sh
npm run build
npm run check
```

The build refreshes the committed root entry and reading page, and creates a standalone `dist/` directory for static hosting. Keep the generated HTML in sync with the source modules before committing. All reading content is pre-rendered; scripting adds optional reading tools. Search, progress and preferences stay in the reader’s browser. No analytics or third-party requests are included.

## Static hosting

The repository root can be served directly. For Pages hosting, choose the `main` branch and the root directory in the repository’s Pages settings. The entry page forwards to `business-fieldguide/`. All URLs are relative, including the redirect, so project subdirectory hosting works. A build pipeline can publish `dist/` instead.

## Content and artwork

This is a condensed direct-address adaptation of two supplied transcripts, retaining literal phrasing, emotional emphasis and the spoken rhythm. Repeated passages and irregular source numbering have been consolidated, and personal and organizational identities have been removed. Original transcripts and private research notes are not included. Chapter numbers represent the editorial reading order, not a claim to recover a missing source catalogue.

See [the coverage map](docs/COVERAGE.md) for thematic traceability and [artwork notes](docs/ARTWORK.md) for the original visual brief. Numerical anecdotes, hypotheses and added illustrations are distinguished in the page. No quiz or assessment section is included.

Local font licensing is preserved in `assets/fonts/LICENSE.txt`.
