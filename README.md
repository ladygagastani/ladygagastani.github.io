# Mathesis Stoicheion · Μάθησις Στοιχείων

A free website for learning to read Ancient Greek and exploring the Greek world. It has no adverts and no trackers.

- **Brief:** `greek-reader-website-prompt.md` describes what the site should be.
- **Plan:** `PLAN.md` describes how it is built.
- **State:** `PROGRESS.md` records what is done, the decisions log, known problems and next steps. Read it first.
- **Instructions for AI sessions:** `CLAUDE.md`.

## Folders

| Folder | What it is |
|---|---|
| `web/` | The website (Next.js 16, React 19, TypeScript). |
| `design-study/` | The Phase 0 prototype of three visual directions. Kept for reference; not used by the site. |
| `pipeline/` | Python scripts that download the original collections and build the catalogue, word analyses, core vocabulary and LSJ dictionary from them. Downloads are cached in `pipeline/.cache/` (not committed). |

## Running the site

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000.

| Command (in `web/`) | What it does |
|---|---|
| `npm run build` | Production build, which also type-checks. |
| `npm test` | Unit tests (Vitest). |
| `NETWORK=1 npx vitest run src/data/lessons.test.ts` | Also checks the lessons' real sentences against the source files online. |
| `CORPUS=1 npx vitest run src/lib/tei/corpus.test.ts` | Corpus health check of every text (needs `pipeline/fetch_corpus.py` first). |
| `npm run e2e` | Click-through tests in Microsoft Edge (Playwright). The command builds and starts the site itself, and needs internet for GitHub. |
| `npm run lint` | Lint (ESLint). |
| `node scripts/screenshot.mjs …` | Screenshot a page of the built site in Edge (see the file for options). |

## The large data files

The catalogue, core vocabulary, work abbreviations and metre data are committed. Three large generated
sets are **not** committed (they are too big for git, about 740 MB together), so a fresh copy of the site
has no word analyses, no LSJ dictionary and no search until they are rebuilt. Where to host them for
the public site is still undecided (see "Known problems" in `PROGRESS.md`).

To rebuild everything, in this order (Python commands from the top folder, `npx` commands in `web/`):

| Step | Command | Makes |
|---|---|---|
| 1 | `python pipeline/fetch_corpus.py` | Every text file, checked, in `pipeline/.cache/corpus/`. |
| 2 | `python pipeline/build_words.py` | Word analyses from GLAUx, `web/public/data/words/` (about 345 MB; downloads about 3.3 GB). |
| 3 | `python pipeline/build_lsj.py` | The LSJ dictionary, `web/public/data/lsj/` (about 75 MB). |
| 4 | `python pipeline/build_pack_index.py` | Sizes and checksums of steps 2 and 3, for offline downloads. |
| 5 | `npx tsx scripts/build-search.ts grc`, then `eng`, then `lem` | The search index, `web/public/data/search/` (about 320 MB). |

Rebuilding the committed data, only when its sources change:

| Command | Makes |
|---|---|
| `python pipeline/build_catalog.py` | `catalog.json`: authors, works and texts, pinned to exact versions. |
| `python pipeline/build_core.py` | `core.json`: the DCC core vocabulary. |
| `npx tsx scripts/build-abbrev.ts` | `abbrev.json`: abbreviations such as "Il." (needs the LSJ files). |
| `python pipeline/fetch_hypotactic.py`, then `npx tsx scripts/build-metre.ts` | The metre data in `public/data/metre/` (also needs step 1). |
| `npx tsx scripts/check-metre.ts` | Checks the site's scansion against the published scansions. |

## Where things live in `web/src`

- `config/areas.ts` holds **every area's Greek name**, English subtitle and explanation. Change names only here.
- `config/sources.ts` holds the original text collections (Perseus, First1KGreek).
- `app/globals.css` is the design system: tokens for both themes, ornament bands and the page-turn transition.
- `components/Page.tsx` wraps every page so the page-turn transition plays.
- `lib/settings.ts` stores the reader's settings, together with the boot script that applies them before first paint.
- `lib/ui.ts` holds site-wide UI state that survives page changes.
- `lib/tei/` reads the original text files and splits them into pages and aligned passages.
- `lib/search/`, `lib/echoes/` and `lib/metre/` hold the Oracle search, Echoes and scansion.
- `data/` holds hand-checked content: the alphabet, stroke order, lessons, tables of forms and passages of the day.

## Content rules

Texts and translations are shown exactly as the source files give them, and are never edited. Every fact needs a
source. Every image, font and data set is listed with its licence on the Credits page (`app/credits/page.tsx`).
