# PLAN.md — How the site will be built

Status: **agreed**; Phases 0–7 are built and Phase 8 (accounts, the Town Hall, the Pnyx, on Supabase) is built and tested but not yet published, by the owner's choice (see `PROGRESS.md`). The owner's decisions since this was written are in
`PROGRESS.md`'s decisions log, and win where they differ from this file. The main ones: hosting is **GitHub Pages**
(static export), not Vercel; the map is **drawn by the site from its own files**, not MapLibre with tiles; texts are read
from the original GitHub files, unchanged (§3a); the large data packs are a second GitHub Pages site at `/packs/`
(DEPLOYMENT.md); Phase 8 uses email sign-up, and the owner moderates. Still open: a domain.
Written 2026-09-26. The brief (`greek-reader-website-prompt.md`) is the source of truth; this file
explains *how* we'll deliver it. Anything marked **(verify)** must be checked before we rely on it.

---

## 1. The big picture, in plain English

The site has three layers:

1. **The website itself.** It's what you see and click. It's built so that moving between pages
   never reloads the whole page. That lets the floating reader and the animations carry on
   smoothly as you move around.
2. **The prepared library.** Before the site goes live, a set of scripts downloads the Greek
   texts, cleans them up and splits them into citable passages. The same scripts attach
   dictionary and grammar information to every word and build the search indexes. The results
   are stored as small, fast files that the website fetches on demand. The brief asks us not to
   parse huge XML files in the browser, and this layer is how we avoid it.
3. **The accounts service.** A hosted database holds sign-ins, the forum and debates, and a
   synced copy of each reader's personal library.

Reading, studying and the wiki all work **without an account**. Only the forum and
syncing across devices need one.

---

## 2. Technology choices (recommended)

| Job | Choice | Why, in one line |
|---|---|---|
| Website framework | **Next.js** (React) with TypeScript, hosted on **Vercel** | Pages change without reloading, and wiki pages still show up in Google; this is the brief's suggested default. |
| Styling | Our **own design system**: colour, type, spacing and ornament "tokens" in one place, with no off-the-shelf template | That's how the site gets a distinctive look instead of a generic one. |
| Animation | **Motion** for page and panel transitions, **GSAP** for choreographed scenes (for example, figures moving along a vase band), and **Three.js** for the rotating 3D vase | Each is the best tool for its kind of animation. All animation respects the "reduce motion" setting. |
| Map | **MapLibre** with **Ancient World Mapping Center** tiles and **Pleiades** place data | Open-source and fast; these are the data sources the brief names. |
| Accounts, forum, synced data | **Supabase** (a hosted database that includes sign-in and security rules) | You get one dashboard to manage, plus strong per-user privacy rules. |
| Prepared library files | Stored on a file host with low bandwidth costs, such as **Cloudflare R2** or Vercel Blob **(verify pricing)** | The corpus is large, so keeping it off the website server keeps costs down. |
| Offline | A **service worker** (a small background helper that stores pages) plus **IndexedDB** (the browser's built-in database) | This is the standard way for websites to work offline. |
| Data scripts | **Python** | It has the best tools for TEI XML and Greek linguistic data. It's already installed (3.14). |
| Tests | **Vitest** for the logic and **Playwright** for automated click-through tests in a real browser | Covers the brief's list: search, word parsing, offline and sync, and notes. |
| Version history | **git** | Every change can be undone, and future sessions can see what changed. |

---

## 3a. Owner decisions that override parts of this plan (2026-09-26)

- **Texts come from the original GitHub collections, unchanged.** Perseus `canonical-greekLit` and
  `First1KGreek` TEI files are read exactly as published. We never edit, modernise or replace any
  text or translation. Errors we find are reported to Perseus / OGL, not patched locally.
  - Online, the reader fetches the original TEI files from GitHub.
  - Offline, the reader loads the same files from a downloaded copy of the repositories (ZIP or
    unpacked folder). The front page and Settings have Download / Load from a folder /
    Reconnect folders.
  - The files are read in the browser, in a background worker so the page stays smooth.
    Pre-built files are limited to *additions* that never alter the texts: the catalogue, the
    word-analysis and dictionary pack, and search indexes. Each is tied to the exact repository
    version it was built from.
- **Word look-up, offline:** a downloadable pack built only from scholarly sources: LSJ, the
  Middle Liddell and Autenrieth (from `PerseusDL/lexica`), plus Morpheus and the treebanks for
  grammar.
- **Word look-up, online:** additionally shows live entries from the most respected references.
  Wiktionary is fetched live and attributed (CC BY-SA). Deep links go to Logeion (LSJ and other
  lexica), the Perseus Word Study Tool, and the Diccionario Griego-Español where it covers the
  word. Every piece of information says where it came from. This live look-up sends only the
  looked-up word to those sites; this is stated on the Privacy page.
- **Accuracy and scholarly standards come first.** Uncertain parsings are marked, never guessed.

## 3. The data pipeline (how the texts get prepared)

1. **Download** Perseus `canonical-greekLit` and `First1KGreek`, fixed at specific versions, so
   every build produces the same result.
2. **Split** each TEI file into passages using its standard citation scheme (book, line, section,
   Stephanus page and so on). Pair each Greek passage with its translation where one exists.
3. **Parse every word**, giving its dictionary form and full grammar. These sources get compared
   on accuracy, and the best mix wins:
   - existing hand-checked treebanks (Perseus AGDT, PROIEL);
   - large automatically parsed corpora (GLAUx and Diorisis are candidates) **(verify licences)**;
   - the Morpheus analyser.

   Accuracy is measured against hand-checked data. The reader shows a confidence mark wherever the
   parsing is uncertain. The owner gets a report on what was chosen and why.
4. **Dictionary.** LSJ, the Middle Liddell and Autenrieth's Homeric dictionary from
   `PerseusDL/lexica` **(verify licence)**. A short definition is extracted from each entry for
   the word pop-up. The full entry opens on demand.
5. **Indexes** for:
   - searching by form, by dictionary word, by grammar and in English;
   - accent-free matching (typing λογος finds λόγος);
   - the Census counts;
   - Echoes (repeated words and phrases within a book).
6. **Names** (people, gods, places, peoples) are identified from TEI tags where present, by
   matching against Pleiades, and from curated lists. The Census page states how complete this is.
7. **Metre.** Rule-based scansion, checked against published scansions:
   1. dactylic hexameter and elegiacs first, since these are well understood and can be scanned
      very reliably;
   2. then iambic trimeter;
   3. lyric metres only where reliable published scansions exist.

   Lines the scanner is unsure of are marked, never guessed.
8. **Output** compact per-work files and split-up search indexes. Downloading a book for offline
   reading means downloading just those files.

---

## 4. Build order

The brief's nine phases are kept. Two changes are **proposed** because beauty and learning are
now top priorities; the owner decides:

| # | Phase | What you'll be able to click through |
|---|---|---|
| **0** | **Look & feel study** *(proposed new)* | 2–3 visual directions as live sample pages: palette, Greek and English fonts shown side by side, ornament, a sample animation, light "papyrus" and dark "black-figure" modes. You pick one, and it becomes the design system. |
| 1 | Design system and site shell | Themed site with all the Greek area names, navigation, page transitions and the home page. |
| 2 | Library and reader | Real texts, word look-up, translation beside the Greek, bookmarks, favourites, notes, highlights, side-by-side reading, and Share (including the image). |
| **3** | **Study, the Academy** *(proposed: moved up from 6)* | The alphabet, pronunciation, the first lessons, flashcards, and words saved in the reader flowing into review. |
| 4 | Search, Echoes, Metre | |
| 5 | My Library | Notes, saved words, Word Study pages, favourites, places, author notes, export. |
| 6 | Offline mode and Reconnect, floating reader, "continue where you left off", scrollbar markers | |
| 7 | Wiki, maps and archaeology | 25+ fully sourced flagship entries across all categories. |
| 8 | Town Hall, the Pnyx, accounts | |
| 9 | Polish, performance, accessibility, full review | |
| **10** | **The phone edition** *(added 2026-09-29, owner's request)* | The whole site redesigned for phones: navigation in thumb reach, gestures, bigger buttons, a reader made for one hand. See section 7. |

Every phase ends with a plain-English report and a review by a separate, fresh session before it
counts as done. Groundwork the floating reader depends on (no page reloads, a shared "what's open"
state) is built into Phase 1, even though the floating window itself comes in Phase 6.

---

## 5. Ideas to make learning better (proposed, beyond the brief)

- **"Words you know" shading.** As you learn words in Study, the reader marks unfamiliar words
  subtly, and a counter shows what share of the page you can already read.
- **Preview before reading.** Before a passage, a short card lists its 5–10 new high-frequency
  words, which you can add to your deck in one click.
- **Animated grammar.** Endings visibly slide into place in paradigm tables, and case roles
  (subject, object and so on) are colour-linked to their English translation.
- **Your first real sentence in lesson one.** Every early lesson ends with a genuine line from the
  corpus, linked to the reader.
- **A short daily session.** Flashcard review, one grammar drill and one real sentence, with a
  gentle streak.

---

## 6. Decisions needed from the owner

**Needed now:**
1. **The site's overall name.** The folder is called "Mathesis Stoicheion". Written
   **Μάθησις Στοιχείων**, it means "learning the letters / the elements"; στοιχεῖα is the word for
   letters of the alphabet and for basic elements, as in the title of Euclid's *Elements*. Is that
   the name?
2. **Budget.** Start on free tiers (only a domain, about $15/year) and upgrade later, or start on
   paid plans (roughly $45/month for Vercel Pro and Supabase Pro)? **(verify current prices)**
   Vercel's free plan is for non-commercial sites only.
3. **Commercial or not?** Will the site ever make money (ads, donations with perks,
   subscriptions)? This affects which images, fonts and 3D scans we may use, because many are
   licensed for non-commercial use only. Perseus texts are licensed CC BY-SA, which means our
   processed versions must be shared under the same licence **(verify)**.
4. **Add Phase 0 (look & feel study)?** Recommended: yes.
5. **Move Study up to Phase 3?** Recommended: yes.

**Needed later:**
- default pronunciation (before Phase 3);
- audio: whether to find licensed recordings or leave audio out until we have them (Phase 3);
- which sign-in methods to offer, and who moderates the forum (Phase 8);
- a domain name (before launch).

---

## 7. Phase 10: the phone edition (proposed 2026-09-29)

**Goal.** Today the site *works* on a phone; it was designed for a big screen and then made to fit.
Phase 10 designs it for the phone first: beautiful at 375 px wide, everything reachable with one thumb,
and gestures that feel natural, without losing anything the big-screen site does. These are proposals:
the owner picks what to keep.

**Ground rules**
- Every button and link at least **44 × 44 px** to touch (today many are 32–38 px), with at least 8 px
  between neighbours. One set of button sizes for the whole site: 48 px main buttons, 44 px ordinary
  buttons, 36 px chips inside a 44 px touch area.
- Controls you use often sit in the **bottom third** of the screen, where the thumb rests.
- Spacing on an **8-point grid**, and a separate, smaller heading scale for phones (area titles take
  almost half the first screen now).
- Room for the notch and the home bar (safe areas), and the browser's top bar coloured like the theme
  (clay by day, black gloss by night).
- Every gesture also has a visible button, so nobody has to know the gesture; motion respects
  "reduced motion"; gestures are tested on a real iPhone and a real Android phone.

**1. Navigation**
- A **bottom bar** on phones with five places, left to right: **Library** (the Mouseion), **Learn Greek**
  (the Academy), **Wiki** (the Painted Stoa), **Forum** (the Town Hall) and **My Library** (the Treasury)
  (owner's choice, 2026-09-29). It replaces the sideways-scrolling menu at the top, which shrinks to the
  site's name (the way home), search, account and Settings.
- **Search as a full-screen sheet** from the search button (today the quick search opens only with the
  keyboard's "/" key), with the Greek keyboard docked above the phone's own keyboard.
- The bar and header **tuck away while reading** and come back with a small scroll up or a tap.

**2. The reader, made for one hand**
- ~~Swipe sideways to turn to the next or previous book or chapter.~~ **Not wanted** (owner, 2026-09-29):
  the reader stays scrolling; books and chapters change with the buttons in the reading bar.
- A **reading bar at the bottom**: previous / next, contents, reading aids and "Aa" (text size and
  spacing). The top bar disappears.
- **Tap the empty margin for a clean page**: all controls fade out; a thin line at the top shows how far
  through the book you are.
- **Pinch the text to change its size**, remembered in Settings.
- **The look-up sheet** gets a handle and three heights (peek, half, full): drag it up for LSJ, swipe it
  down to close, swipe it sideways for the next or previous word of the passage.
- **Press and hold** a word for a quick one-line meaning without opening the sheet; press and hold a
  passage number for its actions (bookmark, note, share).
- **"Try it first" mode** (a learning aid): the translation stays hidden under each verse or passage
  until you tap it, so you read the Greek before the English.
- A **contents drawer** that slides in from the left edge: books, chapters, your bookmarks.
- Poetry that fits: an option to fit a whole hexameter line to the width instead of wrapping it.

**3. The Academy on a phone**
- **Flashcards you swipe**: right for "knew it", left for "again", up for "easy", with the buttons kept.
- **Trace the letter**: on the alphabet page, draw each letter with a finger over its stroke-order guide.
- Practice answers as **large buttons in the lower half** of the screen, never needing the keyboard.
- The daily session as a **full-screen sequence** (review, one drill, one real sentence), like pages of
  a small book, swiped forward.

**4. Pages and cards**
- Long pages shortened with **swipeable card rows** (the Painted Stoa cards, reading levels, the
  Academy's tools) that snap into place, instead of one long column.
- **Collapsible sections** on the home page, remembered, so a returning reader sees "Continue reading"
  first.
- The home **amphora smaller on phones**, turned by tilting the phone (where the phone allows it)
  as well as by dragging.
- Full-width rows for every list, the whole row tappable (no tiny links inside dense lists).
- Inputs at 16 px or larger (iPhones zoom into smaller ones), with the right phone keyboard
  (search key, no autocorrect for Greek or Beta Code).

**5. Gestures elsewhere**
- **Pull down to refresh** the Town Hall and a thread.
- ~~The map: two fingers to move it, one finger scrolls the page.~~ **Changed by the owner (2026-10-01): one finger
  moves the map, two fingers zoom it**; the map leaves part of the page in view on phones, to scroll by.
- Swipe between tabs where a page has tabs (the Oracle's search kinds, the Census's lists).
- A short **vibration** on save, bookmark and correct answer, on Android phones that allow it (iPhones
  do not let websites vibrate), off by a Settings switch.

**6. Installing the site like an app**
- Polished "Add to home screen": icon, splash screen in the theme colours, opening straight into
  the bottom bar, and a clear sign when the phone is offline.

**Order of work**
1. Foundations: button sizes, spacing, heading scale for phones, safe areas, theme colour, bottom bar.
2. The reader (the biggest part).
3. The Academy.
4. Every other page, one area at a time, light and dark.
5. Testing on real phones, browser tests for the gestures, the phone checker raised to 44 px targets,
   and a review by a fresh session.

**The owner's decisions (2026-09-29): Phase 10 is ready to start**
- **Bottom bar: yes**, showing Library, Learn Greek, Wiki, Forum and My Library, in that order from left
  to right.
- **Swipe to turn pages in the reader: no.** The reader stays scrolling.
- **Short vibrations: yes** (Android phones that allow them; a Settings switch turns them off).
- **Every other idea in this section is approved**, as written above.
