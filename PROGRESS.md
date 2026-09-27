# PROGRESS.md — project memory

## Current status
- **Phase 0 (look & feel): done.** The owner chose direction A, with B's layout for the reader. The prototype stays in `design-study/` for reference only.
- **Phase 1 (design system, site shell, home page): done.** The code is in `web/` (see `README.md`). Built so far:
  - **Design system** (`web/src/app/globals.css`): Black-Figure tokens for the light "Papyrus" and dark "Black-figure" themes, meander, tongue and ray bands, buttons, chips and certainty tags.
  - **Page-turn transition** between areas, using React `<ViewTransition>` inside `components/Page.tsx`. The header stays still, and reduced motion is respected.
  - **Site shell**: the header (area names from `src/config/areas.ts`), the Settings panel, a toast, the footer and a skip link. The settings panel has theme, Greek text size, line spacing, animation (auto, reduced or full) and offline reading. Settings are saved in localStorage, and a small boot script applies them before the first paint so nothing flashes.
  - **Home page** (`src/app/page.tsx`):
    - hero with the three.js amphora (`components/Amphora.tsx`, loaded only on this page);
    - "Start with the letters", with flip tiles;
    - passage of the day, Iliad 1.1–7, in the reader style: margin notes, rubric initial, word look-up with links to Logeion, Perseus and Wiktionary;
    - three wiki cards: a dark-side topic, an archaeology topic and democracy;
    - the offline block, where Download links to the GitHub ZIPs work and Load / Reconnect show "arrives in Phase 2".
  - **Every other area** has a page whose header explains its name, plus an honest "being built in Phase N" list. There are also About (the names) and Credits, licences & privacy pages.
  - **Tests** (all passing on 2026-09-26): `npm test` runs 8 Vitest checks; `npm run e2e` runs 5 Playwright tests in the installed Microsoft Edge.
- **Phase 2 (Library and reader): done** (2026-09-27). Tests: 47 unit (`npm test`) and 12 browser (`npm run e2e`, which needs internet for GitHub).
  - **Catalogue** (`pipeline/build_catalog.py` → `web/public/data/catalog.json`, committed): 373 authors, 1,837 works, 2,816 texts, pinned to exact commits.
  - **TEI reader** (`web/src/lib/tei/`): cRefPattern citation schemes; pages by book, scene or size (very long divisions are split); alignment of translations (line markers, and finer or coarser schemes). The corpus health check covers all 2,774 Greek and English texts.
  - **Text sources**: browser storage (OPFS), then connected folders, then GitHub pinned to a SHA. The downloader checks git blob SHA-1s and can resume. ZIP import and reconnect folders work.
  - **Pages**:
    - Reader `/read?w=&ed=&tr=&at=` (plus `w2=…` for a second pane).
    - Mouseion library: where to begin, search, and filters by genre, period and dialect from GLAUx metadata.
    - Scroll Case: download texts plus word look-ups.
    - Live passage of the day: 10 verified passages in `src/data/passages.ts`.
  - **Word look-up**:
    - GLAUx analysis in context, from `pipeline/build_words.py`, **345 MB, not committed**;
    - DCC core-vocabulary definitions for the ~500 commonest words (`pipeline/build_core.py` → `core.json`, committed);
    - LSJ (`pipeline/build_lsj.py`, **75 MB, not committed**), with citations linked into the reader; Shift-click opens a citation beside;
    - live Wiktionary.
  - **Passage tools**: bookmark, favourite, notes (inline, editable, deletable), highlights in 4 colours, Share (link, text, image with a highlight-or-skip step), a "Your marks" list, and cross-references between panes.
  - **Side-by-side**: two panes, each with its own navigation; synced scrolling for the same work; Shift-click on a citation opens it beside.
  - **Reading aids** (learning first): transliteration in the site's documented simple scheme; colour by case from GLAUx; a vocabulary list for the page.
- **Phase 3 (the Academy): first version done** (2026-09-27). Tests: 52 unit (plus 3 that need the network or the corpus cache) and 17 browser.
  - **Alphabet** `/academy/alphabet`: 24 letters plus final sigma, with animated stroke order (`data/strokes.ts`, 49 paths inspected visually), names (including the Classical names εἶ, οὖ, ὖ, ὦ, λάβδα), and sounds in three systems (`data/alphabet.ts`, after Allen's *Vox Graeca*); diphthongs; example words from the DCC core list.
  - **8 lessons** (`data/lessons.ts`): letters, marks, case, article, 2nd and 1st declension, εἰμί, present tense. Real sentences are shown live from the source files and verified by `NETWORK=1 npx vitest run src/data/lessons.test.ts`. Made-up practice sentences are labelled as such. Each lesson has word lists that go into the review deck.
  - **Daily review** `/academy/review`: FSRS via ts-fsrs. Lesson words, "Learn" in the vocabulary list and the reader's "Save word" all feed it.
  - **Tables of forms** `/academy/tables`: `data/paradigms.ts`, 225 forms, checked by `pipeline/check_paradigms.py` against GLAUx (216 attested; the rest reviewed in `pipeline/PARADIGM-REVIEW.md`). Endings are highlighted and attestation counts shown.
  - **Vocabulary** `/academy/vocabulary`: the DCC core list, and "how much can you read" per text from GLAUx lemma counts.
  - **Practice** `/academy/practice`: an endings drill from the checked tables, and parsing of real words in John using hand-checked PROIEL analyses.
  - **Progress**: lessons done, words learned, cards due, streak, next step.
  - **Audio**: `public/audio/index.json` manifest; play buttons appear only where a recording exists. **Recording studio** `/academy/studio` (development only) records in the browser and saves `<key>.webm` plus the index into `web/public/audio/`.
  - **Tools**: `pipeline/find_sentences.py` finds short hand-annotated sentences with a given feature and common vocabulary, for new lessons.
- **Not started:** Phases 4–9.

## Decisions log
| Date | Decision | Reason |
|---|---|---|
| 2026-09-26 | Brand-new site. Ignore the old Μάθησις app and the parent-folder `CLAUDE.md` (F#/Fable port). | Owner's instruction: this is a better, improved app. |
| 2026-09-26 | Top priorities: visual and graphic beauty, great animation, a better learning experience. | Owner's instruction. |
| 2026-09-26 | Site name: **Μάθησις Στοιχείων / Mathesis Stoicheion**. | Owner confirmed. |
| 2026-09-26 | **Never commercial.** Free for everybody. Non-commercial licences (images, fonts, 3D scans) are acceptable, but must still be recorded and attributed. | Owner's instruction. |
| 2026-09-26 | **No trackers**: no analytics, no ad or social scripts. Fonts and libraries are self-hosted in the final site, so visitors' browsers don't contact third parties just to show a page. Any third-party request (such as map tiles) is listed on the Credits & Privacy page. | Owner's instruction. |
| 2026-09-26 | Focus order: **1. learning, 2. reading.** | Owner's instruction. |
| 2026-09-26 | Offline reading: an option in **Settings**, and also on the **front page**. The front page has buttons to download the library, load it offline, and **reconnect folders**. Browsers forget folder permission after a restart, so one click restores it. | Owner's instruction. |
| 2026-09-26 | Hosting: free tiers (Vercel Hobby is allowed because the site is non-commercial). No domain for now. | Owner's instruction. |
| 2026-09-26 | Phase 0 (look & feel study) added. Study moved up to Phase 3. See `PLAN.md` §4. | Owner approved both proposals. |
| 2026-09-26 | Polytonic-capable Google Fonts, checked by their greek-ext subset: GFS Didot, GFS Neohellenic, Gentium Plus / Book Plus, Noto Serif (+Display), EB Garamond, Literata, Alegreya (+Sans), Piazzolla, Ysabeau, Libertinus, Tinos, Inter, Noto Sans. Not polytonic: Cormorant, Source Serif 4, Commissioner, Manrope, Newsreader, Cinzel, Marcellus, Playfair (use these for English only). | Checked against the Google Fonts CSS API. |
| 2026-09-26 | **Visual direction: A · Black-Figure** (clay orange, black gloss, added red; GFS Didot for Greek and display, Alegreya for English, Alegreya Sans SC for labels; meander and tongue bands; 3D amphora on the home page). | Owner's choice from the design study. |
| 2026-09-26 | **The reader uses B's scholarly layout** (margin notes like scholia, rubric-style initials, manuscript ruling) **in A's colour scheme**. No separate papyrus palette. | Owner's choice. |
| 2026-09-26 | **Texts come from the original GitHub collections, unchanged**: online from GitHub, offline from a downloaded copy of the repos (ZIP or folder). Translations are never altered. Only additions (catalogue, word pack, search indexes) are pre-built. See `PLAN.md` §3a. | Owner's instruction: accuracy and scholarly standards. |
| 2026-09-26 | **Word look-up**: offline pack from LSJ, Middle Liddell, Autenrieth (PerseusDL/lexica, CC BY-SA 4.0) plus Morpheus and treebanks. Online it adds live Wiktionary and links to Logeion, Perseus Word Study and DGE. | Owner's instruction. |
| 2026-09-26 | Licences confirmed by the GitHub API: canonical-greekLit, First1KGreek and lexica are all CC BY-SA 4.0. Repo sizes including history: about 850 MB, 930 MB and 140 MB. | Checked. |
| 2026-09-26 | Perseus canonical-greekLit licence confirmed: CC BY-SA 4.0. The README also asks that modifications be offered back to Perseus. | Read from the repository README. |
| 2026-09-26 | Stack: **Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript**. `web/` holds the site; the Python data scripts will go in `pipeline/`. | The PLAN.md recommendation, confirmed. |
| 2026-09-26 | Fonts via `next/font/google`, which self-hosts them at build time (no requests to Google): GFS Didot, Alegreya, Alegreya Sans SC with greek and greek-ext subsets. | No-trackers decision. |
| 2026-09-26 | Page transitions use React `<ViewTransition>` with `transitionTypes={["page-turn"]}` on internal links. It must wrap each page (the `Page` component), not the layout. | Next.js 16 guide (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`). |
| 2026-09-26 | State: **Zustand**. `lib/settings.ts` is persisted with `skipHydration` (rehydrated in `SettingsApplier`); `lib/ui.ts` holds site-wide UI state in the root layout. The floating reader's state goes in `lib/ui.ts` too. | Survives page changes; avoids hydration mismatches. |
| 2026-09-26 | three.js is imported dynamically inside `Amphora`, so only the home page downloads it. The "motion" library was removed as unused; CSS and the View Transitions API cover the animation so far. | Performance. |
| 2026-09-26 | Browser tests use the installed Microsoft Edge (`channel: "msedge"`), so no Playwright browser download is needed. Next.js telemetry was switched off (`next telemetry disable`). | Simplicity; no-trackers spirit. |
| 2026-09-27 | **Offline downloads fetch only the original text XML files, one by one** from GitHub raw (pinned SHA), each verified by git blob SHA-1, into browser storage (OPFS) or a chosen folder. Full-repository ZIPs remain as an option. | Owner's choice; much smaller than the ZIPs. |
| 2026-09-27 | **Word analyses come from GLAUx** (in context; hand-checked treebank sentences flagged; stated accuracy: lemma 98.8%, morphology 97.2%). **Dictionary: LSJ** from PerseusDL/lexica. Wiktionary is live when online. Logeion and Perseus are links. | The most scholarly open sources; context beats out-of-context analysis. |
| 2026-09-27 | The reader is one static page, `/read?w=<work>&ed=<version>&tr=<version or none>&at=<ref>`, so a cached shell works offline. | Offline-friendly. |
| 2026-09-27 | **Display rules for TEI** (the text is never changed, but not every element is printed text): `<reg>` is not shown, because Perseus uses it for gazetteer data such as "Bodrum [27.466,37.5]…" beside "Halicarnassus". Where two text pieces meet at a markup boundary, a doubled space is collapsed and a space before punctuation is removed. Backslashes in cRefPattern are ignored (the Theogony header escapes its quotes). | Found while testing; covered by tests. |
| 2026-09-27 | **Library filters** use GLAUx metadata (genre grouped into 12 families, period by century, dialect) for 1,186 works. **Passage of the day** is live from the files, from a curated list of 10 verified references (`src/data/passages.ts`; `NETWORK=1 npx vitest run src/data/passages.test.ts` re-checks them). | Brief. |
| 2026-09-27 | **Default pronunciation: reconstructed Classical Attic** (after W. S. Allen, *Vox Graeca*, 3rd ed. 1987). Erasmian and Modern Greek are selectable. | Owner's choice. |
| 2026-09-27 | **Audio: the owner records it.** The site gets a built-in recording studio (script, pronunciation guide, record, listen, save correctly named files into `web/public/audio/`). Play buttons appear only where a recording exists. | Owner's choice; the brief forbids faked audio. |
| 2026-09-27 | **Git**: the owner allows local commits (version snapshots). Commit at the end of each piece of work; don't push (there is no remote). | Owner's instruction. |
| 2026-09-27 | **Phase reviews by a fresh session are optional**, the owner's own workflow. Don't wait for them. | Owner's instruction. |
| 2026-09-26 | npm 11 blocks install scripts by default. `unrs-resolver` (an ESLint dependency) is not approved and linting still works. Don't pass `--allow-scripts` on the command line; approve in package.json if ever needed. | Seen during setup. |

## Known problems
- **Phase 3 follow-ups**:
  - More lessons are needed beyond lesson 8. Planned: genitive and dative with prepositions, adjectives, third declension, imperfect, aorist, middle and passive, participles, infinitives, contract verbs, -μι verbs, metre (for Phase 4).
  - More tables: contract verbs, the middle and passive, participles, more of the third declension.
  - The owner is recording the audio (letters, diphthongs, top 100 words) in `/academy/studio`.
  - Studio recordings are WebM/Opus. Older Safari may not play WebM, so convert them to AAC/M4A in the pipeline before launch (for example with ffmpeg).
- **Corpus health check** (`python pipeline/fetch_corpus.py`, then `CORPUS=1 npx vitest run src/lib/tei/corpus.test.ts` in `web/`; report in `pipeline/.cache/corpus-report.json`). On 2026-09-27, 2,774 Greek and English texts were checked and 4 remain flagged, all because of the source files:
  - Andocides' English translations (tlg0027.tlg001, tlg002, tlg004 perseus-eng2) are divided into "Intro / Narrative / Proof / Conclusion" with no section numbers, so they can only sit at the start of the text.
  - tlg0541.tlg042.1st1K-grc2 has 28 numbered "sentence" divisions with no text.
- **Hosting the generated data packs** (word analyses 345 MB and LSJ 75 MB, uncompressed; roughly 100 MB gzipped) is not decided. They are gitignored and must be rebuilt with the pipeline scripts. Options: Vercel static files (check the limits), GitHub Releases or jsDelivr, or Cloudflare R2. This needs the owner's input before launch.
- GLAUx covers 1,186 of our 1,837 works; the rest show "no analysis yet" plus LSJ and Wiktionary.
- The GLAUx tag "b" is read as "coordinating conjunction", confirmed in glaux-nlp `treebanks/Tagsets.py` ("coordinator").
- The Bash tool turns a backslash followed by the digit 1, written inside a heredoc, into a control character. Never write regex back-references through a Bash heredoc; use the Edit tool or `chr(92)`. This bit `build_lsj.py` once; it was fixed and the output was verified clean.
- Home page items the brief asks for that depend on later phases: "recent forum activity" (Phase 8), and daily rotation of the wiki cards (Phase 7, once real entries exist). The three current cards are fixed.
- "Save word", "Load from a folder" and "Reconnect folders" show a toast saying which phase delivers them.
- The passage of the day is hard-coded from the Perseus files (`src/data/iliad-sample.ts`). Phase 2 should load it live from the TEI file and choose a different passage each day.
- The word entries in `iliad-sample.ts` were checked by hand; Phase 2 replaces them with the word pack plus live look-ups.

## Next steps
1. *(Optional; the owner's own workflow, not a blocker.)* A fresh session could review Phase 1: run the tests, click through at every width in both themes, and check the facts in `src/config/areas.ts`, the wiki cards and `iliad-sample.ts`.
2. **Phase 2 (Library and reader):**
   - the catalogue from both repos' `__cts__.xml` files;
   - reading TEI from GitHub raw online, and from a folder or ZIP offline (File System Access API, with handles remembered in IndexedDB, which is what the Reconnect button restores);
   - parsing in a Web Worker;
   - the reader in B's layout with A's colours;
   - word look-up: a word-pack pipeline in `pipeline/`, plus live Wiktionary;
   - bookmarks, favourites, notes and highlights, side-by-side reading, and Share.

## Review history
- None yet.
