# How to Hustle - Business 101

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

- `src/chapters.mjs`: chapter assembly, source ranges, part groupings, legacy links and takeaways.
- `src/content/*.json`: 64 chapters in HU1 → HU2 order, including detailed first-person stories and examples.
- `src/diagrams.mjs`: 128 responsive diagrams, ledgers, comparison cards and tables, plus two interactive calculations.
- `src/editorial.mjs`: shared language masking, HTML escaping and word counts.
- `src/template.mjs`: semantic page template and navigation.
- `assets/style.css` and `assets/infographics.css`: responsive layouts, typography, infographic variants, reduced-motion and print styles.
- `assets/reader.js`: search, chapter tracking, local reading preferences, copy links and optional demonstrations.

```sh
npm run build
npm run check
```

The build refreshes the committed root entry and reading page, and creates a standalone `dist/` directory for static hosting. Keep the generated HTML in sync with the source modules before committing. All reading content is pre-rendered; scripting adds optional reading tools. Search, progress and preferences stay in the reader’s browser. No analytics or third-party requests are included.

## Static hosting

The repository root can be served directly. For Pages hosting, choose the `main` branch and the root directory in the repository’s Pages settings. The entry page forwards to `business-fieldguide/`. All URLs are relative, including the redirect, so project subdirectory hosting works. A build pipeline can publish `dist/` instead.

## Content and artwork

An expanded first-person adaptation of both supplied transcripts: **64 chapters, 130 infographics and 44,230 words** (36,956 words of prose excluding diagram copy). This is about **7.8×** the previous 5,704-word revision. HU1 comes first; HU2 follows, with repeated topics retained at their later source positions. Literal phrasing, emotional emphasis and the spoken rhythm are preserved, while company and creator identities are removed. Swearwords have a vowel replaced with a star. Original transcripts and private research notes are not included. Chapter numbers represent the editorial reading order, not a claim to recover a missing source catalogue.

See [the coverage map](docs/COVERAGE.md) for thematic traceability and [artwork notes](docs/ARTWORK.md) for the original visual brief. Examples use concrete figures; conditional scenarios and added interactive calculations remain clearly worded as examples. No quiz or assessment section is included.

Local font licensing is preserved in `assets/fonts/LICENSE.txt`.
