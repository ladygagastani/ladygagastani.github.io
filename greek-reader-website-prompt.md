# Build Prompt: An Ancient Greek Reader Website for Beginners

## Who you are

You are three experts working as one:

1. **An Ancient Greek scholar** — a classicist fluent in Attic, Ionic, Homeric and Koine Greek, at home in history, archaeology, religion, material culture and the scholarship of the field. You care about getting facts right and you are honest about what is known, what is debated, and what is legend.
2. **An expert graphic and interaction designer** — you create beautiful, distinctive interfaces with a strong visual identity, refined typography and tasteful animation. You never ship something that looks like a generic template.
3. **An expert full-stack engineer** — you write clean, well-structured, tested, performant code, and you build things that work offline and survive bad network conditions.

## Who you're building for, and who you're working with

- **The site's audience:** complete or near-complete beginners who are curious about Ancient Greek — the language *and* the civilisation. They want to be drawn in, not overwhelmed. They are adults who want the full picture of ancient Greece, including its brutal, ugly and uncomfortable sides, not a sanitised marble-statue version.
- **The project owner (me):** I am not a coder. I read your progress messages. Write them in plain English: what you just finished, what it does for the user, what's next, and anything you need me to decide. Avoid jargon; when you must use a technical term, explain it in one short phrase.

## The one rule above all: real facts and real data

- Every factual claim in the wiki, study material or captions must be accurate and traceable. **Never invent** a quotation, date, statistic, citation, find, or source.
- Greek quotations must come from the actual texts in the corpus (see Data Sources), linked to their exact location so the reader can click through and read them in context.
- Every wiki entry ends with a **Sources** section: primary sources (with clickable citations into the site's own library) and reputable secondary scholarship (author, title, year).
- Label the certainty of claims where it matters: **Well established**, **Debated among scholars**, or **Ancient tradition / legend**. Show where the ancient sources disagree with each other or with archaeology.
- If you are not sure of something, don't guess — leave it out or mark it clearly as a TODO for review and tell me.

---

## The site at a glance

A PC-first website (desktop is the priority; it should still be usable on tablets and phones) with these main areas:

1. **Library** — the texts, with a powerful reader and a feature-packed search
2. **Study** — learning the language from zero
3. **Wiki** — engaging, well-sourced articles on Greek history, culture, daily life, the dark side, the weird and the beautiful, and archaeology
4. **The Town Hall** — the forum, including a debate section
5. **My Library** — the reader's personal space: notes, saved words, places, favourite passages, author notes
6. **Offline reading** — download texts and keep reading without a connection, with a Reconnect button
7. **Multitasking** — a floating reader that follows you around the site, and a site that remembers where you left off

### Every area has a name from Greek culture
Each part of the site has its own name drawn from ancient Greece, always shown with a plain English subtitle so beginners are never lost. The names become part of the site's personality (the "About" page and each area's header explain in one or two sentences what the original place was and why the name fits). Starting set — propose improvements if you have better, historically accurate ideas:

| Area | Name | Why it fits |
|---|---|---|
| Home page | **The Propylaea** — *Home* | The monumental gateway to the Athenian Acropolis |
| Library | **The Mouseion** — *Library* | The "Museum" of Alexandria, the research institution that housed the great Library |
| Reader | **The Scroll** — *Reader* | Greek books were papyrus rolls |
| Global search | **The Oracle** — *Search* | Ask a question, get an answer (less cryptic than Delphi's) |
| Study | **The Academy** — *Learn Greek* | Plato's school, in the grove of the hero Akademos |
| Wiki | **The Painted Stoa** — *Wiki* | The Stoa Poikile in Athens, decorated with great paintings of battles and myths, where philosophers taught |
| Archaeology section | **The Kerameikos** — *Archaeology* | Athens' potters' quarter and ancient cemetery, one of its most important excavations — and a nod to the terracotta theme |
| Most Mentioned | **The Census** — *Most Mentioned* | A counting of the corpus |
| Map | **The Periplus** — *Map* | An ancient sailing guide describing coasts, harbours and places |
| Forum | **The Town Hall** — *Forum* | The community's meeting place |
| Debate section | **The Pnyx** — *Debates* | The hill where the Athenian Assembly met to argue and vote |
| My Library | **The Treasury** — *My Library* | Like the treasuries at Delphi where cities stored their precious offerings — and *thesauros*, a store of words |
| Offline downloads | **The Scroll Case** — *Downloads* | Where you pack books to take with you |

Keep all names in one configuration file so they can be changed easily later.

---

## 1. Library

### The collection
- Built on the **Perseus Digital Library** and **First1KGreek** corpora (details below). Browse by author, work, genre (epic, tragedy, comedy, history, philosophy, oratory, lyric, medicine, science, novel…), period (Archaic, Classical, Hellenistic, Roman, Late Antique), and dialect.
- Every author has a profile page: dates, place, what they wrote, why they matter, a short "Start here" recommendation for beginners, and links to related wiki entries.
- Mark texts by difficulty so beginners know where to start (for example: New Testament Gospel of John and Aesop as easier entry points; Xenophon and Lysias as next steps; Thucydides and Pindar as hard). Explain the difficulty rating.

### The reader
- Clean, beautiful Greek typography with adjustable font size, line spacing and theme (light "papyrus", dark "black-figure").
- **Click or hover any word** to see: dictionary form (lemma), full grammatical parsing (e.g. "aorist active indicative, 3rd person singular"), a short definition, the full dictionary entry on demand, how common the word is, and a **Save word** button.
- Toggle a **parallel English translation** side by side where one is available.
- Optional beginner aids that can be switched on and off: transliteration, colour-coding by part of speech or case, and a running vocabulary list for the passage.
- Citation display using standard references (e.g. *Iliad* 1.1, Plato *Apology* 17a) with a "copy citation" button.
- Place names in the text link to the map and to their wiki entry.
- Keyboard navigation (next/previous section, open word panel, search) with a visible shortcut guide.

### Passage actions
Select any passage (a word, line, sentence or section) to get a toolbar with:
- **Bookmark** — mark a place to return to. Bookmarks appear in the margin, in a bookmarks list for that book, and in My Library. The reader also remembers where you stopped in every book.
- **Favourite** — add the passage to your personal anthology of favourite passages.
- **Note** — add a note attached to that exact passage. Notes are fully editable and deletable at any time, show as a small marker in the margin, open inline beside the text, and support formatting and Greek input.
- **Highlight** — in a choice of colours.
- **Echoes** — see below.
- **Share** — see below.
- **Ask in the forum** — see below.

### Echoes
An **Echoes** button that shows how often a word, phrase or sentence recurs **in the same book**:
- Works on a single word or on a selected phrase/sentence.
- For words, a toggle between **exact form** and **all forms of the same dictionary word** (e.g. every form of λύω).
- Shows the total count, and a thin strip representing the whole book with a mark at every occurrence, so the reader can see where it clusters.
- Lists every occurrence with its citation and a few words of context; clicking one jumps there (and back again).
- For phrases and sentences, also find near-repetitions — this matters for Homer's formulaic language (repeated epithets like "rosy-fingered Dawn", repeated lines and type-scenes). Explain on screen what counts as a match.
- An option to widen the search to the same author, then to the whole corpus.

### Metre
For verse texts, a **Metre** toggle that shows the scansion of each line — long and short syllables marked above the text, foot divisions, and the caesura:
- Use the **correct metre for each text and period**, not hexameter for everything: dactylic hexameter for Homer, Hesiod and other epic; elegiac couplets for elegy and many epigrams; iambic trimeter for the spoken parts of tragedy and comedy; the appropriate lyric metres for choral odes and lyric poets where reliable scansions exist.
- Label the metre and give a one-click explanation of how it works, with a link to a Study lesson on metre.
- Optional audio or visual "beat" playback of a line using the pronunciation system the user chose.
- Scansion must be accurate. Use a well-tested scansion method or a reputable openly licensed scanned dataset; check the results against published scansions, and mark lines the system is unsure of rather than guessing. Tell me which method you chose and how accurate it is.

### Side-by-side reading
- Open **another book next to the one you're reading** in a split view, to compare and cross-reference. Each pane has its own navigation, word look-up and tools.
- Where two texts are parallel (e.g. the Greek and a second translation, or two editions), offer synced scrolling.
- Click any citation (in a note, the wiki, a forum post or an Echoes result) with a modifier key to open it in the second pane instead of replacing the current text.
- Create a **cross-reference** linking a passage in one pane to a passage in the other; cross-references are saved to My Library and shown as margin markers in both texts.

### Share
The **Share** button offers:
- **Copy link** to the exact passage.
- **Copy as image** — creates a beautiful image of the passage and copies it straight to the clipboard:
  1. First, a **Highlight words** step: the user can click words in the passage to highlight them in the image. A clearly visible **Skip** button goes straight to the image without highlighting.
  2. The image shows the Greek, the English translation beneath it (when one is available), the citation (author, work, reference), and a small site credit, styled in the site's pottery theme (light or dark to choose).
  3. A preview before copying, and a confirmation once it's on the clipboard. If the browser won't allow copying images, fall back to downloading the image.
- **Copy text** — Greek, translation and citation as plain text.

### Ask in the forum
- An **Ask in the forum** button that opens a new forum post pre-filled with the quoted passage, its translation, and a live link back to that spot in the reader. The user just adds their question and picks a category.

### Search — make this genuinely powerful
- **Search Greek** with or without accents and breathings (typing λογος must find λόγος).
- **Type Greek without a Greek keyboard**: accept Latin transliteration and Beta Code, and provide an on-screen Greek keyboard.
- **Lemma search**: search one dictionary word and find *every* form of it (search λύω, find ἔλυσε, λυθείς, etc.).
- **Grammar search**: filter by part of speech, tense, mood, case, number and so on (e.g. "all optatives in Xenophon").
- **English search** across translations and the wiki.
- **Filters**: author, work, genre, period, dialect, difficulty.
- **Jump by reference**: typing "Il. 1.1" or "Hdt. 1.1" goes straight there.
- Results show the match highlighted in context (a few words either side), grouped and sortable, with counts per author and work.
- Search across your own notes and saved words too.
- A single global search box (shortcut: `/` or `Ctrl+K`) that searches everything — texts, dictionary, wiki, forum, My Library — with tabs for each.

---

## 2. Study

A structured path from knowing nothing to reading real texts.

- **The alphabet**: every letter with its shape, name, sound, and animated stroke order. Explain the different pronunciation systems honestly (reconstructed Attic, Erasmian, Modern Greek) and let the user choose one. Include audio if a properly licensed source is available — never fake it.
- **Accents and breathings**: what they are, why they exist, and how much a beginner really needs to worry about them.
- **Graded lessons**: short, clear, one concept at a time — nouns and cases, the article, verbs, tenses, participles, and so on — each lesson ending with a few sentences from *real* ancient texts that use what was just learned, linked to the library.
- **Practice**: flashcards with spaced repetition (a modern algorithm such as FSRS), parsing drills, fill-in-the-ending exercises, and "read this real sentence" challenges.
- **Paradigm tables**: all the standard declension and conjugation tables, interactive and searchable.
- **Vocabulary by frequency**: learn the most common words first, with a counter showing what percentage of a chosen text you can now read.
- **Progress tracking**: a clear, encouraging view of what's been learned, streaks, and suggested next steps.
- The words a user saves in the reader flow automatically into their review deck.

---

## 3. Wiki

The heart of the site's personality. Entries must be **engaging** — written like the best popular history, opening with a hook, full of vivid detail and real voices from the sources — while staying scrupulously accurate.

### Entry format
- A striking lead image with full credit
- A one-paragraph hook
- The body, with subheadings, pull-quotes from the Greek (with translation and link to the passage), maps and timelines where useful
- "Did you know?" boxes
- Certainty labels where needed
- **Read it yourself**: the key ancient passages on this topic, linked into the library
- Related entries
- Sources

### Categories and starter topics (don't hold back — expand these)

**People & power**: Sparta and its kings; tyrants; Pericles; Alexander and his successors; Macedon; Greek colonies from Spain to the Black Sea; famous women (Sappho, Aspasia, Hipparchia, Olympias).

**Democracy**: its own full category — how Athenian democracy was born (Solon, Cleisthenes, Ephialtes), how it actually worked day to day (the Assembly on the Pnyx, the Council of 500, selection by lot and the allotment machine, the kleroterion, mass juries, pay for public service, audits of officials), ostracism and the surviving ostraka, who was excluded (women, slaves, foreigners), its failures and crimes (the execution of the generals after Arginusae, the trial of Socrates, the Sicilian Expedition), the oligarchic coups of 411 and 404, its ancient critics (Plato, the "Old Oligarch", Thucydides), democracy beyond Athens, and how it differs from modern democracy.

**Education**: *paideia* and what the Greeks thought education was for; learning to read and write (and the surviving school exercises on papyri and wax tablets); the gymnasium and the palaestra; music and poetry memorised from Homer; Spartan training and its brutality; the Sophists and paid teaching; Isocrates' school of rhetoric; Plato's Academy and Aristotle's Lyceum; education of girls and the evidence for literate women; slaves as teachers (the *paidagogos*); Hellenistic education across the Greek-speaking world.

**The weird**: paradoxography, the ancient Greek genre of marvel-collecting (Phlegon of Tralles' *Book of Marvels* with its ghosts and monstrous births); Pythagoras and the bean taboo; Diogenes the Cynic living in a storage jar; the legends of Empedocles leaping into Etna; dream-healing in the sanctuaries of Asclepius and the inscribed "miracle cure" records at Epidaurus; strange Hippocratic remedies; Milo of Croton and the calf; bizarre laws and customs; odd deaths of philosophers as the ancient biographers told them. Always separate what the sources claim from what is likely true.

**The strange**: the Antikythera mechanism; oracles of the dead (the Nekromanteion debate); the Delphic oracle and the science of the vapours theory; the Eleusinian Mysteries and the secret nobody revealed; lost wonders and lost books; the Bronze Age collapse; Linear A, still undeciphered; the Phaistos Disc; mysteries archaeology hasn't solved.

**The beautiful**: Sappho's poetry; Homer's similes; the Parthenon and the optical refinements in its "straight" lines; kouroi and korai; the fact that Greek statues were brightly painted (polychromy) and how we know; vase painting at its finest (the Berlin Painter, Exekias); *kalos* inscriptions praising beauty on vases; the Greek idea of *kalokagathia*; music and the instruments we can reconstruct; theatre and its masks; mosaics; jewellery and goldwork (e.g. from Vergina); the most beautiful passages in Greek literature, linked into the library.

**Daily life**: food and wine, the symposium, clothing, houses, children and schooling, marriage, funerals, money and coinage, medicine and the Hippocratic writers, sport and the Olympic Games, theatre, music.

**Religion & belief**: the gods as the Greeks actually worshipped them (not just myths), sacrifice, oracles and Delphi, mystery cults (Eleusis), magic, curse tablets, ghosts and the dead.

**The dark side of ancient Greece** — treat these seriously, factually and without either sensationalism or apology:
- Slavery: its scale, the silver mines at Laurion, the legal status of slaves, torture of slaves as courtroom evidence
- Sparta's helots and the krypteia
- The status of women and the legal control of men over them
- Exposure of infants
- Pederasty as a social institution, discussed historically and in scholarly terms
- War atrocities: Melos, the Mytilene debate, the destruction of Plataea, the massacre at Mycalessus
- The plague of Athens
- Athenian imperialism and the tribute of the Delian League
- Execution and punishment
- Debates about human sacrifice in myth and history
- How later ages have romanticised or misused ancient Greece

**Archaeology** — its own section:
- How archaeology works: excavation, stratigraphy, dating methods, pottery sequences
- Great sites: Knossos, Mycenae, Troy/Hisarlik, Pylos, Akrotiri on Thera, the Athenian Agora and Acropolis, Delphi, Olympia, Vergina
- Great finds: the Antikythera mechanism and shipwreck, the Riace bronzes, the Griffin Warrior tomb, Linear B tablets
- The problems too: Schliemann's destructive digging and questionable claims, Evans's concrete "reconstructions" at Knossos, looting and the antiquities trade, the Parthenon Marbles debate and repatriation (presented even-handedly)
- Pottery as evidence: black-figure and red-figure techniques explained visually

**Language**: where Greek came from, Linear B, the dialects, how the alphabet was borrowed from the Phoenicians, Greek words in English, how Greek became Modern Greek.

**Places**: every significant city, sanctuary and battlefield, with a map.

### Most Mentioned
A dedicated **Most Mentioned** section of the wiki, built from real counts across the corpus:
- Rankings for **words**, **people**, **gods and heroes**, **places**, **peoples and tribes**, **objects** (ships, weapons, animals, foods, etc.), and **phrases and formulas**.
- Filter by author, work, genre and period (e.g. "most mentioned gods in tragedy", "most mentioned places in Herodotus"), and compare two authors side by side.
- Charts: top-ten bars, how mentions change over time periods, and where in a work they cluster.
- Each item links to its Word Study page, wiki entry, map location, or an Echoes view of every mention.
- Explain the counting method on the page (e.g. counting by dictionary word rather than exact form, how names were identified), and state how complete the data is. Only publish counts you can back up from the processed corpus.
- Surprising findings deserve short write-ups ("Did you know? The most mentioned place in…") — but only if the numbers support them.

### Places and maps
- An interactive map of the ancient Greek world built on the **Pleiades** gazetteer of ancient places, with the ancient map tiles from the **Ancient World Mapping Center**.
- Each place shows what happened there, which texts mention it (linked), and related wiki entries.

---

## 4. The Town Hall (forum)

### The Pnyx — debates
A dedicated debate section, modelled on the Athenian Assembly:
- Each debate has a clear motion (e.g. "Was Athens more oppressive than Sparta?", "Should the Parthenon Marbles return to Athens?", "Is Homer one poet or many?", "Should beginners learn reconstructed or Erasmian pronunciation?").
- Two sides, **For** and **Against**, shown in two columns, with replies threaded under each argument.
- Arguments can quote passages straight from the reader and link wiki entries as evidence. Encourage citing sources; show a small "cites a source" mark on arguments that do.
- Voting on the motion (with a nod to the Greek way — voting with pebbles, or a show of hands), with results shown when the debate closes, plus a "changed my mind" option.
- Featured weekly debate on the home page. Debates can also be proposed from wiki entries ("Debate this in the Pnyx").
- Firm civility rules and moderation — argue the idea, not the person.

### General forum
- Categories such as: Beginners' questions, Grammar help, Translation help, Texts and authors, History and culture, Archaeology news, Show your progress, Off-topic.
- Posts support Greek text properly (the same on-screen keyboard and transliteration input as search).
- **Quote a passage** directly from the library into a post, with a live link back to it.
- Threads, replies, upvotes, "marked as answered", tags, search, user profiles.
- Moderation tools: report, hide, ban, and a moderator role. Rate limiting and spam protection from day one.
- Forum requires an account; reading the library, study and wiki does not.

---

## 5. My Library (personal space)

Everything a reader saves, in one beautiful, well-organised place:

- **Notes on passages** — every note is attached to its exact passage, can be opened in context, edited, tagged, and searched.
- **Saved words** — each saved word opens a **Word Study** page showing:
  - the full dictionary entry
  - every form of the word with parsing
  - its frequency across the corpus, shown as a chart by author and period
  - example sentences from real texts (linked)
  - related words and English derivatives
  - the reader's own notes on the word and its review status in the flashcard deck
- **Places** — saved places on a personal map.
- **Favourite passages** — a personal anthology, which can be organised into collections.
- **Bookmarks** — every bookmark across all books, plus "continue reading" for each book in progress.
- **Cross-references** — every link the reader has made between passages in the side-by-side view.
- **Author notes** — the reader's own notes on each author.
- Export everything (to a readable file) so the user owns their data.
- Works offline; changes made offline sync when the connection returns.

---

## 6. Offline reading, with a Reconnect button

- The site should be installable and work offline for any texts the user has downloaded.
- A **Downloads** page lets the user pick authors or works to save for offline use (with the size shown), and remove them later.
- The reader, dictionary look-ups, study and My Library must all work offline for downloaded content.
- A clear, always-visible **connection status indicator** (online / offline / syncing).
- A **Reconnect** button that retries the connection on demand, syncs any notes, saved words and favourites made offline, and reports clearly what synced and whether anything failed.
- Handle conflicts sensibly (e.g. a note edited on two devices) and never silently lose the user's work.

---

## 7. Multitasking and remembering where you left off

### The floating reader
- A **collapse** button in the reader shrinks it into a small floating window that **follows you across the whole site** — keep reading Homer while browsing the wiki, studying a lesson or writing in the Town Hall.
- The floating window can be dragged anywhere, resized, snapped to a screen edge or corner, minimised to a small tab showing the book and reference, and expanded back to the full reader with one click (keeping the exact position).
- It keeps working while floating: scrolling, word look-up, notes, bookmarks, Echoes.
- Drag a passage from the floating reader into a forum post, a debate argument or a note to quote it with its citation.
- If side-by-side reading is open, both books collapse together, or the user can float just one.
- The site must be built so that moving between pages never reloads or resets the floating reader.

### Remembering where you left off
- The site remembers **everything about where you were**: the last page visited, the scroll position in every book and wiki entry, which books were open and how panes were arranged, the floating reader's position and size, the current Study lesson and exercise, search filters, and unsent drafts (notes, forum posts, debate arguments).
- On return, the home page offers **"Continue where you left off"**, and every book resumes at the right line.
- Works offline, and syncs across devices for signed-in users.

### Scrollbar markers
- The scrollbar in the reader (and in long wiki entries) shows **markers for where your notes are**, so you can see at a glance where you've written notes and click a marker to jump there. Hovering a marker shows a preview of the note.
- Different marker styles for notes, bookmarks, highlights and the "you left off here" point, and the current Echoes results when Echoes is on. A small legend explains them, and each type can be toggled on and off.

---

## Data sources (verify each one and its licence before using it)

| What | Source | Notes |
|---|---|---|
| Greek texts & translations | Perseus Digital Library — `github.com/PerseusDL/canonical-greekLit` | TEI XML with CTS identifiers; check licence (CC BY-SA) and attribute properly |
| More Greek texts | First1KGreek — `github.com/OpenGreekAndLatin/First1KGreek` | Same structure; check licence and attribute |
| Dictionary | Liddell–Scott–Jones and shorter lexica from `github.com/PerseusDL/lexica` | Check licence |
| Word parsing & lemmas | Morpheus morphological analyser, Perseus/AGDT treebank data, and existing lemmatised versions of these corpora | Research and choose the most accurate open option; tell me what you chose and why |
| Ancient places | Pleiades — `pleiades.stoa.org` | Coordinates and place data; attribute |
| Ancient map tiles | Ancient World Mapping Center | Attribute |
| Images | Wikimedia Commons, The Met Open Access, Cleveland Museum of Art Open Access, Art Institute of Chicago, Getty Open Content, Walters Art Museum, Smithsonian Open Access | **Only** images that are public domain or openly licensed for this use. Record every image's source, creator and licence |

- Keep a **Credits & Licences** page listing every data source and every image with its licence and link. Follow each licence's attribution and share-alike terms exactly.
- Keep a machine-readable image credits file so nothing is ever used without a recorded licence.
- Use high-resolution photographs of real objects and places: vases, sculpture, coins, inscriptions, papyri, sites. Every image caption says what the object is, its date, where it is now, and the credit.

---

## Look and feel

**Theme**: the world of Greek pottery, stone and fresco — refined and scholarly, never kitsch or theme-park.

- **Palette** drawn from terracotta: warm clay orange, black gloss, cream, with accents from fresco blues and bronze. Light "papyrus" mode and dark "black-figure" mode.
- **Ornament** used with restraint: meander (Greek key) borders, palmette and wave motifs, dividers inspired by vase bands, subtle clay and stone textures.
- **Typography**: a superb Greek typeface for the texts (options to evaluate: GFS Didot, Gentium Plus, Brill, Noto Serif with full polytonic support) — polytonic Greek must render perfectly everywhere. Elegant display type for headings, a highly readable body face for English.
- **Illustrations and icons** in black-figure / red-figure silhouette style for navigation, section headers and empty states.
- **Animation** that feels crafted and purposeful: page transitions like turning a scroll, a slowly rotating vase on the home page, figures animating along a vase band, map zooms, the word panel sliding open, gentle reveal of wiki sections as you scroll. Keep it smooth and fast, never blocking the reader, and respect the "reduce motion" setting.
- **PC-first layout**: make full use of wide screens — multi-pane reading (text / translation / word panel / notes side by side), resizable panels, keyboard shortcuts, hover interactions. Then make sure it degrades gracefully on tablet and phone.
- **Home page**: a beautiful hero, a "Start learning Greek" path, a "Passage of the day" with its translation, a "From the wiki" feature (rotate in the dark-side and archaeology topics too), and recent forum activity.
- **Accessibility**: good contrast, keyboard access everywhere, screen-reader labels, readable text sizes.

---

## Technical expectations

- Suggested default (propose alternatives if you have good reasons, and explain them in plain English): a modern web framework deployed on **Vercel**, a hosted database for accounts, forum and synced user data, and a service worker plus browser storage for offline use.
- Fast: pages should load quickly even with large texts; process the raw corpora into efficient formats ahead of time rather than parsing huge XML files in the browser.
- Secure accounts, sensible privacy, no tracking beyond what's needed.
- Automated tests for the important parts: search, word parsing display, offline mode and sync, notes.
- Well organised code with a README so another agent could pick the project up later.

---

## How to work

1. **Start by confirming the plan.** Summarise the architecture, the data pipeline and the build order in plain English, and list any decisions you need from me.
2. **Build in phases**, each ending with something I can open and click through:
   - Phase 1: Design system and site shell (theme, typography, the Greek area names, navigation, home page) — built from the start so pages change without reloading, which the floating reader depends on
   - Phase 2: Library and reader, with word look-up, passage actions (bookmark, favourite, editable notes, highlight), side-by-side reading, and Share (link, text, and image with the highlight-or-skip step)
   - Phase 3: Search, Echoes and Metre
   - Phase 4: My Library (notes, saved words, word study, favourites, places, author notes)
   - Phase 5: Offline mode and Reconnect, the floating reader, remembering where you left off, and scrollbar markers
   - Phase 6: Study section
   - Phase 7: Wiki, maps and archaeology — starting with at least 25 fully sourced flagship entries across all categories, including the dark side and archaeology
   - Phase 8: The Town Hall and accounts, including the Pnyx debates and "Ask in the forum" from the reader
   - Phase 9: Polish, performance, accessibility and a full review
3. **After each phase**, send me a short plain-English report: what's done, how to try it, what's next, any open questions.
4. **Fact-check your own wiki work**: before marking a wiki entry done, re-check every claim, date, quotation and citation against its source.
5. If something in this brief is impossible, unwise or conflicts with a licence, tell me and propose the best alternative rather than quietly dropping it.

---

## Working across many sessions and models

This project will be built over many separate sessions, sometimes with different models. Each session starts with no memory of the previous ones, so the folder itself must carry everything the next session needs.

All work happens in this one project folder. This is a brand-new site: do not copy from, change or depend on any older Greek reader projects I may have elsewhere, unless I explicitly ask.

### PROGRESS.md — the project's memory
Create and maintain a file called **PROGRESS.md** in the project folder. Keep it up to date at the end of every piece of work (not just at the end of a session, in case a session stops unexpectedly). It must contain:
- **Current status**: which phase we're in and what's finished, in progress, and not started
- **Decisions log**: every significant decision (technology choices, data sources, how something works), with the date and a one-line reason — so later sessions don't undo good decisions by accident
- **Known problems**: bugs, unfinished bits and TODOs, each with enough detail that a fresh session could fix it
- **Next steps**: what the next session should do first
- **Review history**: which phases have been reviewed, when, and what was found

Keep it concise and current: update or remove outdated lines rather than letting it grow into a diary.

### Start of every session
Every session, whatever model, begins by:
1. Reading this prompt file and PROGRESS.md
2. Checking that the site still builds and runs
3. Telling me in two or three plain-English sentences where things stand and what it plans to do, before starting

### Which kind of session does which work
- **Build sessions (stronger model, high effort)**: planning, architecture, and the hard parts — the data pipeline for the Perseus and First1KGreek texts, word parsing, search, Echoes, metrical scansion, offline mode and sync, the floating reader, accounts and security, and fact-checking wiki content.
- **Routine sessions (a cheaper model is fine)**: clearly defined, low-risk jobs — styling and layout adjustments, adding straightforward pages, small fixes where the problem and the fix are already known and written down in PROGRESS.md.
- A routine session must **not** change architecture, data formats or anything listed in the decisions log. If it thinks such a change is needed, it writes the reason in PROGRESS.md under Known problems and stops, leaving it for a build session.

### Review sessions — fresh eyes
After each phase is built, a **separate, fresh session** (not the one that wrote the code) reviews it, using a strong model. The reviewer:
- Reads this prompt, PROGRESS.md and the phase's code without assuming the builder got it right
- Runs the automated tests and actually uses the features, checking them against what this prompt asks for
- Checks the facts in any wiki or study content against their sources
- Lists every problem found in PROGRESS.md, ranked by how serious it is, and reports to me in plain English
- Fixes only clear, contained bugs itself; anything bigger goes in PROGRESS.md for a build session

A phase counts as done only after it has passed a review.
