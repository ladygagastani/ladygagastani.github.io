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
- **Phase 4 (search, Echoes, metre): done** (2026-09-27). Tests: 86 unit (plus 3 that need the network or the corpus cache) and 27 browser.
  - **Search index** (`web/scripts/build-search.ts`, run `npx tsx scripts/build-search.ts grc`, then `eng`, then `lem`, in `web/`; needs `pipeline/.cache/corpus` from `fetch_corpus.py` and the GLAUx word packs). Output goes to `web/public/data/search/`, **about 320 MB, not committed**:
    - Greek words of every edition: 33.7M words, 788k accent-free keys, 149 MB;
    - English words of every translation: 13.0M words, 46 MB;
    - dictionary words (lem, 75 MB) and grammar (tag, 52 MB) from GLAUx.
    - The format is small binary "shards" (`src/lib/search/codec.ts`). A search downloads only the shards it needs.
  - **GLAUx words placed on the reader's words**: 95.3% (15.6M). The rest are mostly passages that the reader's edition does not contain: Diodorus books 1–10 and 18–20, most of Pollux, parts of Hippocrates and Origen.
  - **The Oracle** `/search`:
    - Greek words, with accents ignored, as a phrase or with the `*` and `?` wildcards;
    - dictionary word, with grammar, or grammar alone;
    - translations;
    - My library (notes, marks, saved words).
    - You can type Greek, Latin letters (the site's transliteration; a plain e or o also finds η or ω) or Beta Code, and the page shows back what it will search for. There is an on-screen Greek keyboard.
    - Filters: author, work, kind of writing, period, dialect, and all editions.
    - Results come grouped by work (sorted by most results or by date), each shown in context with the word marked. Every result links into the reader, where the word is highlighted with the CSS Custom Highlight API. Translation results find the right row even when the translation is cited by "card".
  - **Typed references** such as "Il. 1.1", "S. Ant. 332" or "Pl. R. 327a" go straight to the passage. The 4,320 abbreviations were learnt from LSJ's own citations (`web/scripts/build-abbrev.ts` → `public/data/abbrev.json`, committed); English titles work too.
  - **Quick search** from any page (press `/` or Ctrl+K): passages, works, authors, and the Oracle's searches.
  - **Echoes** in the reader (`src/lib/echoes/`, `components/reader/EchoesPanel.tsx`). Open it from the passage toolbar (select words, or click a passage number) or from a word's look-up ("Echoes · where else it occurs"):
    - a word: **this form**, or **every form of its dictionary word** (GLAUx);
    - a phrase or sentence: **exact wording**, **Close** (likeness 75%+) or **Loose** (50%+), each match labelled exact / other forms / near with its likeness;
    - the total, a **strip for the whole book** with a mark at every match (height = likeness; the book's pages as notches; hover names the place, click goes there), and a **list with context** where matching words are marked and differing ones pale;
    - clicking goes there (a browser history step), and **"← Back to …"** returns; every match on the page is marked in the text;
    - **widen**: this book → all the author's works (compared word by word in the browser when the author has at most 40 works and 14 MB of Greek; Homer, Plato, the tragedians…) → all Greek texts (from the search index: counts by work, linked to the Oracle);
    - "What counts as a match" explains the rules on screen.
    - Checked on real texts: the dawn line (Il. 1.477) is found at Il. 24.788 and 20 times in the Odyssey; Achilles' reply formula (Il. 1.84) finds 9 exact repeats, 3 in other forms (τὴν δʼ…) and its variants (τὴν δὲ βαρὺ στενάχων…); Republic 327a κατέβην … εἰς Πειραιᾶ finds 328c καταβαίνων εἰς τὸν Πειραιᾶ.
  - **Metre** in the reader (`src/lib/metre/`, `components/reader/MetreBar.tsx`). A **Metre** button appears on verse texts (131 editions):
    - marks over every syllable: – long, ˘ short, × a free place whose vowel length the spelling doesn't show; | between feet (metra in trimeter); ‖ at the caesura; ochre marks where a licence is used (hover names it: correption, synizesis, stop + liquid, lengthening); **?** where the scanner is unsure (never guessed);
    - a legend naming the metre and the source of the scansion, **How this metre works** (hexameter, elegiacs, iambic trimeter, comedy, lyric; long and short; licences; how the scanner works and how accurate it is), and a link to the new lesson;
    - **▸ plays a line's rhythm** (long = two beats, short = one, a stronger tone at each foot), lighting each syllable as it sounds. It plays the rhythm only, not the words;
    - the marks sweep in from left to right when Metre is switched on (one animation per line; none with reduced motion).
    - **Where the scansion comes from.** The published scansion by David Chamberlain (hypotactic.com, CC BY 4.0) is used wherever its line has the same words as the edition shown: 110,000 lines of Homer, Hesiod, the Homeric Hymns, Apollonius, Quintus, Nonnus, Aratus, Callimachus, Theocritus, Oppian, Theognis, the Greek Anthology, three plays of Aeschylus, Lycophron and Pindar (lyric metres, named as Hypotactic names them; no feet marked). Everywhere else the site's own scanner is used: other hexameter and elegiac texts; iambic trimeter in the spoken parts of Aeschylus, Sophocles, Euripides and the other tragedies; the freer comic trimeter in Aristophanes (all 11 plays). Sung or chanted passages of plays (Perseus marks them: strophe, antistrophe, choral, lyric, anapaests, trochees…) are labelled, not scanned.
    - **Accuracy**, checked on the site's own text against the published scansion (106,813 lines the scanner was sure of): hexameter 99.6%, elegiac pentameter 99.7%, iambic trimeter 96.9% (Aeschylus and Lycophron). The scanner is sure of 99.5% of hexameter lines and 98.9% of trimeter lines.
    - **The scanner**: syllables and their possible lengths (nature, position, the accent where it proves a length, vowel lengths learned from the published scansions for 12,000 word forms), licences with costs by kind of verse (Homer vs. Attic drama), then a fit to every pattern the metre allows; lines split between two speakers (35 + 35b) are joined before scanning.
    - **Lesson 9, "Hearing Homer's rhythm: the hexameter"** (`/academy/lesson/metre`): long and short, the six feet, caesura, correption and synizesis, with Iliad 1.1, Odyssey 1.1 and the Delphic oracle in Herodotus 1.47.3 shown scanned, and ▸ to hear them.
    - Data: `python pipeline/fetch_hypotactic.py` (downloads the published scansions, 102 MB, into `pipeline/.cache/hypotactic`), then `npx tsx scripts/build-metre.ts` in `web/` → `public/data/metre/` (4 MB, committed): `_index.json` (which texts are verse, in which metre, with the accuracy figures), one file of published scansions per edition, `_lengths.json`. `npx tsx scripts/check-metre.ts errors 30` lists disagreements.
- **Phase 5 (the Treasury, My Library): done** (2026-09-27). Tests: 100 unit (plus 3 that need the network or the corpus cache) and 32 browser.
  - **The Treasury** `/treasury` (`components/treasury/`). The overview is a Doric frieze, as on the treasuries at Delphi: eight metopes (Notes, Anthology, Bookmarks, Highlights, Cross-references, Words, Authors, Places), each with its count, between triglyphs, under a pediment that draws itself. Below it: **Continue reading** (book spines, from the reader's remembered positions) and **Latest** (the newest things saved, of every kind). Sections are chosen by `?s=`.
    - **Notes on passages**: grouped by work or newest first, searchable (Greek or English, accents ignored), filtered by tag (`?tag=`); each note is edited in place and opens its passage.
    - **Anthology** (favourite passages): shown as manuscript leaves; **collections** the reader names, creates, renames and removes (a collection is a name on each favourite; empty ones are remembered in localStorage `mathesis:collections`).
    - **Bookmarks** with Continue reading; **Highlights** by colour; **Cross-references** shown as pairs (each is stored on both passages; removing removes both).
    - **Words**: saved words (optionally lesson and core words too), with review status, each opening Word Study; a box to study any word (Greek or Beta Code).
    - **Authors**: the reader's own notes on authors, with an author finder.
    - **Places** (since Phase 7): the places saved on the Periplus, on a small map of your own, with a list (`PlacesSection.tsx`). Saved places are in the Download / Restore file.
    - **Keep your Treasury safe**: **Download my Treasury** saves one HTML file that reads as a tidy document in any browser and carries the same data as JSON inside it; **Restore from a file** merges it back (adds what is missing, replaces only with newer copies, never deletes) and reports what changed. `lib/treasury-io.ts`.
  - **Notes** now have light formatting (**bold**, *italic*, "- " lists; toolbar and Ctrl+B / Ctrl+I), a **Greek typing box** (Beta Code, e.g. `mh=nin` → μῆνιν, with a live preview) and **tags**, in the reader and the Treasury alike (`components/notes/`).
  - **Notes on authors and on words** are stored in a second IndexedDB store (`mathesis-user` version 2, store `notes`, ids `author:tlg0012` / `word:λόγος`).
  - **Word Study** `/treasury/word?l=λόγος`, also reached from the reader's look-up ("Word Study · λόγος") and from saved words:
    - meaning: the DCC core definition and LSJ (short, or the full entry);
    - **every form** laid out as a grammar would print it: case by number (per gender) for nouns, adjectives, pronouns and articles; person by mood per tense and voice for verbs, with infinitive and participles; or as a list with plain-English parsing. Forms under 3% of uses are folded into "Rarer forms and analyses";
    - **where it is used**: bar charts of uses per 10,000 words by period, and the ten authors who use it most (hover or focus for details; "Show as a table");
    - **in real texts**: one passage from each period, opened from the original files, with the word marked, its grammar there, and a link into the reader; plus "Every occurrence in the Oracle";
    - **family** (live from Wiktionary): where the word comes from, English words descended from it, and the Greek words built on it, each opening its own Word Study;
    - **yours**: review status (or "Save word to my review") and your note on the word.
    - Data: `web/scripts/build-lexicon.ts` → `web/public/data/lexicon/` (**about 40 MB, not committed**): 119,708 dictionary words, 687,857 forms, 1,186 works, from the GLAUx word packs.
  - Numbers are now written the English way everywhere (43,789, not 43.789, whatever the computer's language).
- **Phase 6 (offline, floating reader, where you left off, scrollbar markers): done** (2026-09-27). Tests: 108 unit (plus 3 that need the network or the corpus cache) and 37 browser.
  - **The site works offline once visited.** An offline helper (service worker, `public/sw.js`) keeps every page (the list is `config/pages.ts`, served at `/offline.json`; a test checks it against `src/app`), the code and fonts they use, and the small data files. Pages come from the network when it answers within 4 s, else from the kept copy; code files are kept once built; `/data` is network-first with the kept copy as fallback; the search index is never kept by it. Each build registers `/sw.js?build=<id>` (the id comes from `next.config.ts`), so a new build replaces the old copy. In-app navigation data (RSC) is never kept: offline, the app falls back to loading the page itself, which the kept copy answers.
  - **Installable**: `app/manifest.ts` and icons drawn in code (`app/icons/[size]/route.tsx`: a black-figure amphora with a band of rays).
  - **Connection light** in the header (`components/ConnectionLight.tsx`, `lib/connection.ts`): Online (green), Offline (red, one ripple), Syncing (ochre, rippling). Clicking it shows what works offline (the site copy, texts downloaded, folders, look-ups) and has **Reconnect**: it reconnects folders first (the browser only allows that straight after a click), checks the connection with a real request (5 s limit), updates the offline copy of the site, and reports each step. Notes, marks and saved words live in this browser, so nothing made offline can be lost; syncing between devices waits for accounts (Phase 8), and the report says so.
  - **Word Study offline**: its index is now part of the Scroll Case's look-up downloads (`build_pack_index.py` indexes `lexicon/`; `lib/lexicon.ts` reads browser storage first).
  - **Scrollbar markers** (`components/reader/ScrollMarkers.tsx`): beside the scroll bar (of the page, or of a pane or the floating window), a mark for each note, bookmark, highlight (in its colour), favourite and cross-reference on the page, where you left off last time, and the current Echoes. Hover or focus shows a preview (a note's text); a click goes there. A **Markers** legend in the reader's bar explains them and switches each kind on or off (remembered in Settings as `markers`).
  - **The floating reader** (`components/reader/FloatingReader.tsx`, `lib/float.ts`): **Float the reader** in the reader's bar (or **Float this book** on one pane of two) shrinks it into a window that stays open across the whole site (it lives in the root layout) and returns you to the page you came from. The window:
    - is dragged by its title bar and resized from any edge or corner; dropped near a screen edge it docks there full height, near a corner it tucks into it, with a dashed preview of where it will land; the keyboard moves it (arrows) and resizes it (Shift+arrows);
    - minimises to a tab showing the book and passage, and expands back into the full reader at the passage in view (the expand button, or a double-click on the title bar);
    - keeps working: scrolling, pages, word look-up, notes, bookmarks, highlights, Echoes (with a Back button), metre, side-by-side;
    - unrolls when it opens and rolls up when it closes (no animation with reduced motion); on a phone it is a sheet across the bottom of the screen;
    - folds the book's settings (edition, translation, reading aids) away so the Greek shows first;
    - is remembered, with its book, passage, position and size, after a reload (localStorage `mathesis:float`).
  - The reader's navigation now goes through a small context (`ReaderNav` in `Reader.tsx`): the address bar on the reader's page, the window's own state when floating. Two readers can be open at once; keys go to the one in use.
  - **Drag a passage into a note**: a grip beside each passage number (on hover), or selected Greek, drags as the Greek in quotation marks followed by (Author, Work ref), which any note (or other text box) takes as a quotation. The forum and debates will take it too (Phase 8).
  - **Continue where you left off** (`lib/resume.ts`, `components/Resume.tsx`): the site remembers the pages visited (newest first; the reader once per set of books open) and how far down each was scrolled. The home page shows the last place (the reader resumes at its own remembered passage), the books in progress and the other recent pages (a lesson, a search with its filters, a Word Study...); following a link there restores the page's scroll. "Forget these pages" clears the list. Unsent drafts: notes already save as they are typed.
  - **Reading position is now measured from what is on screen** (the first passage showing below the sticky bar, on scroll), instead of an IntersectionObserver that only reported rows whose visibility changed; a passage brought into view is no longer hidden under the bar (its offset follows the bar's real height, `--bar-h`).
- **Phase 7 (the Painted Stoa wiki, maps, archaeology, Census): in progress** (2026-09-27). Tests: 212 unit (plus 53 that need the network or the corpus cache; with `CORPUS=1` the wiki check runs 154) and 47 browser (6 for the wiki, `e2e/stoa.spec.ts`; 4 for the map, `e2e/map.spec.ts`). Commits "Phase 7 (1)" onwards.
  - **Done: the wiki engine** (`web/src/wiki/`, `components/stoa/`):
    - `types.ts`: an `Entry` has slug, title, optional Greek, category, kicker, hook, body, quotes, timeline, "Read it yourself" passages, related entries, primary sources, secondary works (by bibliography id, with a note), optional image and places, and the date written. Certainty labels: `well` (well attested), `debated`, `legend`. The 11 categories are in `CATEGORIES`.
    - `markup.ts`: a small text format for entry bodies. Blocks: `##`/`###` headings, `- ` lists, `!!` "Did you know", `{{quote:id}}`, `{{figure:id}}`, `{{timeline}}`, and `{well}`/`{debated}`/`{legend}` at the start of a paragraph to tag it. Inline: `*italic*`, `**bold**`, a certainty tag, and links `[text](cts:work:ref[-to])` into the reader, `[text](wiki:slug)` to another entry, `[text](https://…)`. Anything unknown makes the build fail, so a typo cannot slip through.
    - `bibliography.ts` (`BIB`): every modern book or article cited, **each checked on a publisher's page, library catalogue, JSTOR or a scholarly review before use; the link is kept in `checked`**. Nothing is added from memory.
    - `index.ts`: the list of entries (`ENTRIES`), `entryBySlug`, `entriesIn`, `categoryOf`. `useTitles.ts` names wiki notes outside the wiki, loading the wiki only when needed.
    - Pages: `/stoa` (`StoaIndex.tsx`: a colonnade of painted panels, one per category, with search and a featured entry) and `/stoa/<slug>` (`EntryView.tsx`: lead picture, hook, "on this page" contents that follow your scroll, the body with Greek quotations beside their translations, timeline, Read it yourself, sources, related entries). Every entry page is pre-built and kept for offline use (`config/pages.ts`).
  - **Done: the checks that keep entries honest.**
    - `npm test` (`entries.test.ts`): every body parses; every quote is defined and used; every wiki, related, image and bibliography id exists; every cited work is in the catalogue; every bibliography item has a `checked` link and is used.
    - `CORPUS=1 npx vitest run src/wiki` (`entries.corpus.test.ts`, needs `pipeline/.cache/corpus`): every citation exists in the text; **every Greek quotation is found word for word** near the passage cited (the cited unit, the one before and up to six after, so verse quotations may run over several lines; accents and punctuation normalised); every translation marked as from the corpus is found word for word in the translation file.
    - `npx tsx scripts/passage.ts <work> <ref> [to]` (in `web/`) prints a passage's Greek and its translation with the translator's name; `find <words>` finds a work id; `refs <work> [prefix]` lists valid references. **Quotations are copied from this output, never typed.**
  - **Done: 25 entries** (in `src/wiki/entries/`), all passing both checks:
    - people: pericles, hipparchia · democracy: ostracism, mytilene-debate, kleroterion (the allotment machine), trial-of-socrates · education: school (going to school in Athens), spartan-upbringing · daily life: symposium, olympic-games, asclepius (the healing sleep) · religion: delphi, eleusinian-mysteries · beautiful: painted-statues, homeric-similes · weird: diogenes, pythagoras · strange: antikythera-mechanism · dark side: melos, helots, laurion, plague-of-athens · archaeology: kerameikos, black-and-red-figure · language: linear-b.
    - Facts corrected while checking (the drafts were wrong, the sources right): Beazley's first painter study was the Kleophrades Painter (1910), not the Berlin Painter (1911).
  - **Done: lead pictures for 21 entries** (`web/scripts/fetch-images.ts`, list in `web/scripts/images.list.json`; files in `web/public/images/`, 5 MB, committed; credits in `src/data/images.json`). From The Metropolitan Museum of Art's Open Access (CC0, checked by the API's `isPublicDomain`) and Wikimedia Commons (licence read from each file's own record; only public domain, CC0, CC BY and CC BY-SA accepted). Each has a written description for screen readers. Tall objects are shown whole, not cropped. The Credits page lists every picture with its source and licence. The offline helper keeps pictures once seen. Still without a picture: melos, plague-of-athens, mytilene-debate, helots.
  - **Done: around the wiki.**
    - Wiki entries in Quick search (`/` or Ctrl+K); the wiki's data loads only when the box opens.
    - The home page's three wiki cards change each day (the same for everyone), always one from the dark side and one from archaeology (`components/StoaCards.tsx`).
    - **Notes on wiki entries**: a "✎ Note" button under each section heading (and after the opening) writes a note, saved with the reader's other notes (`PageNote` kind `stoa`, id `stoa:<slug>#<section>`). The notes show beside the scroll bar with "where you left off" (`components/stoa/EntryNotes.tsx`, reusing the reader's markers), and appear in the Treasury's Latest list, the Oracle's "My library" search and the Treasury export.
  - **Done: the Periplus map** `/stoa/periplus` (`components/map/Periplus.tsx`, `lib/map.ts`):
    - Drawn by the site itself as SVG in the black-figure look (black-gloss sea with a wave pattern, clay land, red dots), from files served by this site: no map tiles from other servers. Wheel, drag, pinch, double-click, the + / − / ⌂ buttons, or the keyboard (arrows, + and −) to move; places fly into view. Filters by kind (cities, islands, regions, rivers and seas, mountains…) and names in Greek or English. `?p=<Pleiades id>` opens a place.
    - A place's panel: its Greek and English name, kind, how often the library names it and in how many works, its Painted Stoa entries, the twelve works that name it most (each opening the Oracle's search for it in that work), **Save this place**, "Every mention", and a link to Pleiades.
    - Data: `python pipeline/build_map.py` → `web/public/data/map/` (committed, 0.8 MB): `base.json` (sea and lakes from AWMC geodata's open-water polygons, ODbL, simplified to about 1 km) and `places.json`. Places are GLAUx dictionary words written with a capital, matched to Pleiades Greek names (accents ignored): 1,315 places from 35,073 names. The 249 places named at least 52 times (and the great regions and rivers, `OVERRIDES`) were checked by hand; 73 names used mostly for people, gods, peoples or constellations are left out (`NOT_PLACES`). Automatically matched places show as hollow dots, their river and region names paler, and their panel says so. The builder warns if a place over the cut-off is not checked. `pipeline/.cache/map/names.json` keeps every capitalised name with its count per work, for the Census.
    - Links: an entry's `places` shows "On the map" in its side column, and the place's panel lists the entry; the reader's word look-up shows "On the map · <name>" when the dictionary word is a place (`placeNamed` in `lib/map.ts`). Saved places live in localStorage `mathesis:places`.
  - **Not started in Phase 7:**
    - **The Kerameikos section** (`/stoa/kerameikos`, still a "coming" page; the archaeology category links there): an archaeology front page for the archaeology entries.
    - **The Census** (`/stoa/census`, still a "coming" page): most mentioned words from the Word Study index counts, and names (people, gods, places) as PLAN.md §3 item 6 describes, with a plain statement of how the counting was done and how complete it is.
    - Updating README when done.
- **Not started:** Phases 8–9.

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
| 2026-09-27 | **Search runs in the browser from a pre-built index** of static shard files (by the first two letters of the key), so it needs no server and can work offline later. Keys are accent-free (`greekKey`: fold, σ for ς and ϲ, letters only). Dictionary words are stored with their accents (εἰμί "be" and εἶμι "go" stay apart) and found by their accent-free key. | No server, no trackers; accuracy. |
| 2026-09-27 | **GLAUx analyses are placed on the reader's words by walking both texts in reading order**, re-finding the place with a five-word run when they drift apart. GLAUx's own references are not used for this: they often follow another citation scheme. | Raised the placement rate from 88% to 95%. |
| 2026-09-27 | By default, search covers the edition and translation the reader opens first (Perseus first), so parallel editions don't count twice. "Every edition" is a checkbox. | Honest counts. |
| 2026-09-27 | GLAUx dates a work by its author's lifetime, by century. The site shows the whole span ("5th–4th c. BC" for Plato), never just the first century, with a note on hover. | Accuracy: a single century claimed too much. |
| 2026-09-27 | GLAUx files the forms of εἶμι "go" under ἔρχομαι. The search page says so whenever εἰμί, εἶμι or ἔρχομαι is searched. | Found while testing; readers would otherwise miss them. |
| 2026-09-27 | **Echoes matching rules.** Exact form: letters, breathings and accents count; capitals, grave-for-acute, a second (enclitic) accent, final sigma and the elision mark don't. Words are "the same" when GLAUx gives them the same dictionary word (else the same form). Near: an in-order match within a stretch at most a quarter longer than the phrase, rare words weighted more (log of words ÷ occurrences); likeness = weighted share found. Phrases may cross line and section breaks. | Brief (Homeric formulas); stated on screen. |
| 2026-09-27 | **Echoes computes in the browser** for the book and for small authors, from the texts and the GLAUx word packs. GLAUx's words are placed on the text with the same stream alignment as the search index (`src/lib/search/place.ts`, shared by both), so any edition works. Wider searches use the search index. | No server; works for every edition; matches cross passages. |
| 2026-09-27 | **Metre: the published scansion first, the site's scanner elsewhere.** David Chamberlain's scansions (hypotactic.com) are CC BY 4.0 ("All the data on this site is/are licensed as CC-BY 4.0", hypotactic.com/latin/about.html) and are credited on the Credits page and in the reader. They are matched to our editions line by line by their words (accents ignored), never by line number. | Plan: "checked against published scansions"; accuracy. |
| 2026-09-27 | **Unsure lines are never guessed.** A line is scanned only when every best reading gives each syllable the same length; a free place (anceps) holding α, ι or υ of unknown length is shown as ×, not as long or short. | Plan §7. |
| 2026-09-27 | **Which metre a text is in** is decided by the build: the published scansion's own tags where it covers the text, otherwise the share of lines the scanner can fit to each metre; Aristophanes and Menander are comedy. In plays, Perseus's division subtypes (strophe, choral, anapests…) mark the sung parts, which the parser now records on each verse line (`Block.part`). | Honest labels; the brief asks for the correct metre per text. |
| 2026-09-27 | **Rhythm playback** sounds beats (long two, short one), not words: there is no recording of the lines, and the brief forbids faked audio. | Brief. |
| 2026-09-27 | **Word Study counts come from GLAUx's own texts** (the word packs), not from the reader's editions: forms with their grammar and uses per work, pre-built into a small index. Rates are per 10,000 analysed words of each period or author, so larger bodies of text do not win by size. | Honest, comparable counts; one source for forms and counts. |
| 2026-09-27 | **In paradigm tables a grave accent is written as an acute** and a sentence-initial capital is lowered (not for names), as dictionaries and grammars print forms. Unaccented stray lemmas in GLAUx are not offered as "spelled alike". | Readable tables; accuracy. |
| 2026-09-27 | **A word's family comes live from English Wiktionary** (rendered page, sections Etymology, Derived/Related terms, Descendants → English), credited, and only when online. Nothing about etymology or derivatives is written by the site itself. | Real facts only; Wiktionary is the open, cited source. |
| 2026-09-27 | **The Treasury export is one HTML file with the data inside it.** Restoring merges by id and date and never deletes. | "Export everything to a readable file so the user owns their data" (brief), and a way back in. |
| 2026-09-27 | **Places in the Treasury wait for the map** (Phase 7): saving a place needs Pleiades places and the map, which that phase builds. | Avoid a half-feature now. |
| 2026-09-27 | **Offline: a hand-written service worker** (no plug-in): pages network-first with a 4 s limit, built code cached once, data network-first. The page list is explicit (`config/pages.ts`) and tested against the app's pages. | Small, readable, and exact about what is kept. |
| 2026-09-27 | **The connection light checks with a real request**, not only the browser's online flag, which can say "online" on a network that reaches nothing. | Honest status. |
| 2026-09-27 | **The floating reader is the same reader**, given a different place to keep what it shows (`ReaderNav`), not a second copy. It lives in the root layout, so page changes never reset it. After floating, the site returns to the last page that was not the reader (never off the site). | Everything the reader does keeps working while floating. |
| 2026-09-27 | **Passages are dragged by a grip**, not by their number: browsers do not start a drag from a button. The Float button sits in the sticky bar, so floating keeps the passage being read. | Found while testing. |
| 2026-09-27 | **How a wiki entry is written.** (1) Find the passages with `scripts/passage.ts` and copy the Greek and translation from its output. (2) Check every modern book or article by web search and record the page used as `checked`. (3) Write the entry; anything that cannot be traced to a source is left out or softened (e.g. "and others" for co-authors not verified). (4) Run `npm test` and `CORPUS=1 npx vitest run src/wiki`. (5) Commit. | Real facts only; the checks make a wrong quotation fail the build. |
| 2026-09-27 | **Translations in quotations**: the corpus translation when it exists (credited with translator and year, checked word for word); otherwise the site's own plain translation, labelled "this site". | Brief: translations are never altered; honest labels. |
| 2026-09-27 | **Certainty is shown, not hidden**: paragraphs and timeline items are tagged well attested / debated / legend, and debates give both sides. | Brief. |
| 2026-09-27 | Entries live in TypeScript files in the code (`src/wiki/entries/`), not a database, so the build can check every link and quotation. | Accuracy; no server. |
| 2026-09-27 | **The map is drawn by the site from its own files** (AWMC open-water polygons, simplified, as SVG), not from map tiles or MapLibre. | No-trackers rule (no third-party tile servers); the black-figure look; works offline. Replaces PLAN.md's MapLibre + AWMC tiles. |
| 2026-09-27 | **Places come from the texts' own names**: GLAUx capitalised dictionary words matched to Pleiades Greek names. The most-named places are checked by hand; the rest are shown as matched automatically. Peoples go to the Census, not the map. | Real counts from the corpus; honest about what is unchecked. |
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
- **Search follow-ups**:
  - The search index (about 320 MB) can't be downloaded for offline use yet. It should join the Scroll Case downloads, like the word packs. Its `_index.json` holds [bytes, keys], whereas the packs' index holds [bytes, sha1], so a checksum is needed first.
  - Phrases are found only within one passage (one verse line, one prose section).
  - The reader's word look-up still matches GLAUx by reference, so it finds less than the search index does. It could use the index's placement instead (stream alignment) for the 11% of works whose citation schemes differ.
  - Results show passages from the text file itself. If your downloaded copy of a text differs from the pinned commit the index was built from, the marked word can be off.
- **Hosting**: the search index adds about 320 MB to the generated data (see above).
- **Metre follow-ups**:
  - The scanner's trimeter has been checked only on Aeschylus (3 plays) and Lycophron, where a published scansion exists (96.9% agree). Sophocles, Euripides and Aristophanes are unchecked: no published scansion covers them. A spot-check by a reader who knows metre would be valuable.
  - Lyric metres are shown only where the published scansion covers the text (Pindar, parts of Aeschylus). Other choral odes are labelled "sung; not scanned".
  - Hexameter or elegiac lines quoted inside prose (oracles in Herodotus, epigrams in Athenaeus) are scanned only in lessons, not in the reader.
  - The rhythm player could later speak the line with the owner's recordings (in the chosen pronunciation) once they exist.
  - The brief's "beat playback using the pronunciation system the user chose" is therefore only partly met: the rhythm is the same in every pronunciation, the sound of the words is not played.
- **Echoes follow-ups**:
  - Across all Greek texts, and for very large authors (over 40 works or 14 MB, e.g. Galen, Plutarch, Aristotle), Echoes uses the search index, so it finds no near repetitions there, finds phrases only within one passage, and ignores accents. The panel says so.
  - Echoes results should appear as scrollbar markers (Phase 6, with the other markers).
  - The first Echoes in a long book prepares it on the main thread (about half a second for the Iliad). If this feels slow on phones, move it into the parsing worker.
  - Near repetitions are looked for in selections of up to 40 words; Echoes takes at most 200 words.
  - A browser development server from another session may hold port 3000; `.claude/launch.json` has `web-prod` (built site on port 3100) for checking in the built-in browser.

- **Treasury follow-ups**:
  - Word Study's examples need the search index, and its family needs Wiktionary, so those two parts need a connection. (Its index downloads with the look-ups since Phase 6.)
  - Word Study needs the dictionary form (λόγος, not λόγου). A typed inflected form could be resolved to its dictionary word via GLAUx later.
  - Empty anthology collections live in localStorage, not in the export (collections that hold passages are exported with them).
  - Syncing the Treasury across devices comes with accounts (Phase 8); until then, Download / Restore moves it between browsers.
- **Hosting**: the Word Study index adds about 40 MB to the generated data.

- **Phase 6 follow-ups**:
  - The search index (about 320 MB) is still not downloadable for offline use (see Search follow-ups).
  - Scrollbar markers exist in the reader; long wiki entries get them when the wiki arrives (Phase 7).
  - A Study lesson is remembered by its scroll position; the practice drills do not yet save a half-finished round.
  - With the floating reader open, the page-turning keys go to whichever reader has the focus.
  - Python edits run through a Bash heredoc can break in two ways: a backslash before b or 1 becomes a control character, and some long heredocs fail to parse. Write such edit scripts to a file first.

- **Phase 7 follow-ups**:
  - After rebuilding the site (`npm run build`), restart the preview server, or it serves a stale mix of old and new files (blank pages).
  - `npm run e2e` needs port 3100 free.
  - On Windows, Git Bash's `/tmp` is not visible to Windows Python; put temporary scripts in the session's scratchpad folder. Commands that take a path such as `/stoa` need `MSYS_NO_PATHCONV=1` in Git Bash.
  - The existing "Parsing CSS" warnings in the build come from the older `::highlight` rules and are harmless.
  - `e2e/echoes.spec.ts` "Echoes of a line" once failed when the whole suite ran together (timing under load) and passed when run again alone. Watch it; if it recurs, give its first check a longer wait.
  - **Map follow-ups**: the 1,066 automatically matched places below the cut-off are unchecked (the map marks them); a later pass could check more by hand. Roads are not drawn yet (AWMC has them). A place's panel does not yet say "what happened there" (the brief): that needs written, sourced text per place, best done as Painted Stoa entries for the major places.

## Next steps
1. The Kerameikos section, then the Census.
2. Update README and this file; report to the owner in plain English.
3. Phase 8 (Town Hall, the Pnyx, accounts) needs the owner's decisions first: which sign-in methods, and who moderates.

## Review history
- None yet.
