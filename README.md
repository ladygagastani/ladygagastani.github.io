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
| `supabase/migrations/` | The database behind accounts, the Town Hall and the Pnyx (Supabase), as SQL files run once each, in order, in the Supabase SQL editor. See PROGRESS.md, Phase 8. |

## The live site

https://mathesisstoicheion.com/ is published by GitHub Pages from this repository: every push to `main` builds a
static copy (`output: "export"`) and publishes it (`.github/workflows/deploy.yml`). The large generated data
(below) is not in this repository: it is published separately to https://mathesisstoicheion.com/packs/ by
`python pipeline/publish_packs.py --push`, and the live site reads it from there. See `DEPLOYMENT.md`.

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
| `CORPUS=1 npx vitest run src/wiki` | Checks every wiki quotation word for word against the texts (needs `pipeline/fetch_corpus.py` first). |
| `npx tsx scripts/passage.ts <work> <ref> [to]` | Prints a passage's Greek and translation from the local corpus, for copying into wiki entries (also `find <words>` and `refs <work> [prefix]`). |
| `npm run e2e` | Click-through tests in Microsoft Edge (Playwright). The command builds and starts the site itself, and needs internet for GitHub. |
| `npm run lint` | Lint (ESLint). |
| `node scripts/screenshot.mjs …` | Screenshot a page of the built site in Edge (see the file for options). |

## The large data files

The catalogue, core vocabulary, work abbreviations and metre data are committed. Four large generated
sets are **not** committed (they are too big for git, about 780 MB together), so a fresh copy of the site
has no word analyses, no LSJ dictionary, no Word Study forms and counts, and no search until they are rebuilt. Where to host them for
the public site is still undecided (see "Known problems" in `PROGRESS.md`).

To rebuild everything, in this order (Python commands from the top folder, `npx` commands in `web/`):

| Step | Command | Makes |
|---|---|---|
| 1 | `python pipeline/fetch_corpus.py` | Every text file, checked, in `pipeline/.cache/corpus/`. |
| 2 | `python pipeline/build_words.py` | Word analyses from GLAUx, `web/public/data/words/` (about 345 MB; downloads about 3.3 GB). |
| 3 | `python pipeline/build_lsj.py` | The LSJ dictionary, `web/public/data/lsj/` (about 75 MB). |
| 4 | `python pipeline/build_pack_index.py` | Sizes and checksums of steps 2, 3 and 6, for offline downloads (run it again after step 6). |
| 5 | `npx tsx scripts/build-search.ts grc`, then `eng`, then `lem` | The search index, `web/public/data/search/` (about 320 MB). |
| 6 | `npx tsx scripts/build-lexicon.ts` | The Word Study index, `web/public/data/lexicon/` (about 40 MB): every form of every dictionary word, and its count in each work (needs step 2). |
| 7 | `python pipeline/publish_packs.py --push` | Publishes steps 2, 3, 5 and 6 to https://mathesisstoicheion.com/packs/ for the live site (see `DEPLOYMENT.md`). Without `--push` it only checks and prepares. |

Rebuilding the committed data, only when its sources change:

| Command | Makes |
|---|---|
| `python pipeline/build_catalog.py` | `catalog.json`: authors, works and texts, pinned to exact versions. |
| `python pipeline/build_core.py` | `core.json`: the DCC core vocabulary. |
| `npx tsx scripts/build-difficulty.ts` | `difficulty.json`: each text's share of common words, for the library's vocabulary badge and filter (needs the word packs, step 2). |
| `node scripts/shots.mjs <folder> <site> <paths…>` and `node scripts/phone-audit.mjs <site> <paths…>` | Polish checks: screenshots wide and on a phone, light and dark; and a phone-width audit (sideways overflow, tiny tap targets and text). Need the built site served with `node scripts/serve-out.mjs 3100`. |
| `npx tsx scripts/build-abbrev.ts` | `abbrev.json`: abbreviations such as "Il." (needs the LSJ files). |
| `python pipeline/fetch_hypotactic.py`, then `npx tsx scripts/build-metre.ts` | The metre data in `public/data/metre/` (also needs step 1). |
| `python pipeline/build_census.py` | The Census (Most Mentioned) data in `public/data/census/` (committed, about 10 MB): ranked names, things, words and phrases for the whole library, each kind of writing and period, each author and each work. Needs steps 1–3 and 6 of the table above (GLAUx files, word packs, LSJ, Word Study index) and `pip install nltk` (WordNet). Hand-checked lists are in `pipeline/census_lists.py`. The first run scans GLAUx into `pipeline/.cache/census/` (2 minutes); `--rescan` repeats it. |
| `python pipeline/build_map.py` | The Periplus map data in `public/data/map/`: the sea and lakes (AWMC geodata) and the places the texts name (Pleiades), plus every capitalised name with its count per work in `pipeline/.cache/map/names.json` for the Census (needs step 2). Hand-checked matches are in its `OVERRIDES` and `NOT_PLACES` tables. |
| `npx tsx scripts/fetch-images.ts` | The wiki's pictures and their credits (`public/images/`, `src/data/images.json`) from the list in `scripts/images.list.json`. |
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
- `lib/annotations.ts` stores the reader's marks and notes (IndexedDB); `lib/treasury-io.ts` exports and restores them.
- `lib/lexicon.ts` reads the Word Study index and lays out forms as tables; `components/treasury/` is the Treasury and Word Study.
- `public/sw.js` is the offline helper (service worker); `config/pages.ts` lists the pages it keeps; `lib/connection.ts` and `components/ConnectionLight.tsx` are the connection light and Reconnect.
- `lib/float.ts` and `components/reader/FloatingReader.tsx` are the floating reader; `lib/resume.ts` and `components/Resume.tsx` remember where you left off.
- `wiki/` is the Painted Stoa: `entries/` (one file per entry; list new ones in `index.ts`), `bibliography.ts` (every modern work cited, each with the link it was checked against), `markup.ts` (the entry text format) and the tests that check entries against the texts; `components/stoa/` draws them.
- `wiki/kerameikos.ts` lists the archaeology section's layers and dig sites; `components/stoa/Kerameikos.tsx` draws it.
- `lib/map.ts` and `components/map/Periplus.tsx` are the Periplus map; saved places show in the Treasury (`components/treasury/PlacesSection.tsx`).
- `lib/census.ts` and `components/census/` are the Census (Most Mentioned); how it counts is written on the page itself (`Method.tsx`).
- `lib/community/` (connection, data, Treasury sync) and `components/community/` are accounts, the Town Hall and the Pnyx; `config/supabase.ts` holds the public Supabase address and publishable key. Supabase is contacted only on those pages or when someone is signed in.
- `data/` holds hand-checked content: the alphabet, stroke order, lessons, tables of forms and passages of the day.

## Content rules

Texts and translations are shown exactly as the source files give them, and are never edited. Every fact needs a
source. Every image, font and data set is listed with its licence on the Credits page (`app/credits/page.tsx`).
