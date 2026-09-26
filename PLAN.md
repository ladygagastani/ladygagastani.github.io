# PLAN.md — How the site will be built

Status: **draft, waiting for the owner's decisions** (see "Decisions needed" at the end).
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
