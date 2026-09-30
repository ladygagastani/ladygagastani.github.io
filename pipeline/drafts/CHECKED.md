# Author articles: what was checked, and what was left out

Method (owner's decision, 2026-09-30): take the old site's draft (`old-site-author-articles.json`), check every claim against a
real source, rewrite in plain, lively English, keep only what holds, and record the sources in `web/src/wiki/authors/<id>.ts`.
Ancient passages are cited as links into the Scroll (the site's own copy of the texts); modern works by publisher, catalogue or
review page. The reader can follow each footnote number to its source at the bottom of the author's page.

## Herodotus (tlg0016), checked 2026-09-30

**Confirmed and kept**
- Opening words, Halicarnassus, "inquiry", the cause of the war: Hdt. 1.1.0 (the site's text).
- ἱστορίη / θωμαστά / κότε / ἀπίκετο are Ionic forms: LSJ entries (ἱστορία "Ion. -ιη", θαυμαστός "Ion. θωμ-", κότε "Ion. for πότε", ἀφικνέομαι "Ion. ἀπ-"), read in the site's copy of LSJ.
- Cicero, *De Legibus* 1.5: "apud Herodotum patrem historiae et apud Theopompum sunt innumerabiles fabulae".
- Born about 484: Gellius 15.23 (Pamphila: Herodotus 53 at the war's start). Livius.org gives c. 480–c. 429, so the dates are marked debated.
- Still writing after 430: Hdt. 7.137.3 and Thuc. 2.67 (end of the second summer; 2.47.1 closes the first year).
- Travel and method: Hdt. 2.29.1, 2.44.1, 2.99.1, 7.152.3.
- Plutarch, *On the Malice of Herodotus*: chapter 1 (the charge, Boeotians and Corinthians); chapter 26 (Diyllus: ten talents, decree of Anytus). Marked as tradition.
- Lucian, *Herodotus* 1 (Olympia; books named after the Muses). Marked as tradition.
- The Persian debate: Hdt. 3.80.1–2, 6.43.3. Solon and Croesus: Hdt. 1.29–33; Plutarch, *Solon* 27.1 (some prove by chronology that it is fictitious); Hollmann 2015, n. 68.
- The ending and the unkept promise: Hdt. 9.122.2–3, 7.213.3; Jona Lendering (Livius.org) for "probably unfinished".
- Manuscript families, sigla, papyri, apparatus examples (ἄποδος / ἄφοδος at 4.97.4; Hemmerdinger): Verhasselt's edition of a Book 4 papyrus (KU Leuven repository). A (Laur. plut. 70.3): tenth century, parchment, 374 leaves: Biblissima.
- Nine books by Alexandrian scholars in the third century BC: Livius.org.
- Valla's Latin translation, Venice 1474 (Jacobus Rubeus): Whitmore catalogue, and the History of Information page (seen through a search result only: the page itself would not open).
- Aldine Greek edition 1502: Wikipedia's list of editiones principes (and its "Editio princeps" page).
- Editions: Godley (Loeb 1920–25, named in the TEI header of the site's Greek and English); Wilson OCT 2015 (two volumes; replaces Hude; two neglected Roman-family manuscripts collated), from the OUP page as quoted in a search result and the Journal of Hellenic Studies review record; Rosén (Teubner, vol. 1, 1987, lxxxviii + 458 pp.; vol. 2, 1997), Classical Review record; Asheri, Lloyd, Corcella (OUP 2007), BMCR review.

**Left out because it could not be confirmed**
- "Plutarch says many readers made that change" (of Halicarnassus to of Thurii): not found in Plutarch's essays read; Aristotle's "of Thurii" is kept.
- Dates for manuscripts B, D and the others (draft: eleventh / eleventh or twelfth century): no reliable source found; only A's date is kept.
- Travels "in Egypt, the Levant, Scythia" beyond what his own text says; "public readings at Athens" (the Olympia tale and the ten talents are kept as tradition); "joins the colony of Thurii in 443"; the Suda's life (the Suda's page would not open).
- The *Acharnians* parody of 425 and "death shortly after 425".
- Thucydides as an early critic (he never names Herodotus; scholars' reading could not be sourced).
- Nothing on the "Roman family: R, S, V" beyond Verhasselt's list.

**Corrected from the draft**
- "Hellenistic scholars" → third-century BC scholars at Alexandria (Livius.org).
- "The latest datable events belong to c. 431–425" → a firm date of 430 (Hdt. 7.137 with Thuc. 2.67).
- "Several dozen papyri, mostly from Oxyrhynchus" → 44 published (Verhasselt); "mostly Oxyrhynchus" not confirmed.
- "Neither family is consistently better" → not stated by the source; left out.

**Weak points to revisit**
- Bibliographic details of the OUP Wilson and the Loeb volumes rest on search-result summaries and review records because the publishers' pages would not open in the fetch tool.
- Wikipedia's list is the only source for the year of the Aldine edition (a bibliographic fact widely given; replace with a library catalogue record when one can be opened).

## Homer (tlg0012), checked 2026-09-30

**Confirmed and kept:** Iliad 1.1, 2.134 (nine years) and Odyssey 2.175 (the twentieth year); the Hymn to Apollo line 172 and Thucydides 3.104.4–6 (he quotes the hymn as Homer's and says the poet "also mentions himself"); Herodotus 2.53.2 (Homer and Hesiod "not more than four hundred years earlier than I") and 2.117 (he refuses the Cypria); the ancient lives, the cities, the blindness, the dates of composition (late 8th or early 7th century; Janko to Nagy; West 660–650), the works attributed, Wolf 1795 and Parry from about 1928 (Wikipedia: Homer, Homeric Question); the chorizontes, Xenon and Hellanicus (Harper's Dictionary, Perseus); the dialect mix and the genitive in -οιο (Wikipedia, Homeric Greek) with LSJ for ἀγορή and ἄμμες; the Pisistratus story (Cicero, De Oratore 3.137; the Hipparchus 228b, a dialogue transmitted under Plato's name); Zenodotus (first director of the Library, 284 BC, first critical editor) and Aristarchus (director 153–145 BC, his signs, his severity), from Wikipedia; the papyri (third century BC to seventh century AD, most found in Egypt, settling about 150 BC: Casey Dué, CHS) and the "wild" papyri (Graeme Bird, CHS 2010; Stephanie West 1967); the Venetus A (tenth century, A scholia, Villoison 1788: Wikipedia); the first printed Homer (Florence 1488–89, Chalcondyles: Wikipedia's list); the digamma and ἄναξ / wa-na-ka (Wikipedia: Digamma, Wanax) with Iliad 1.7; West's Teubner Iliad (1998–2000) and Odyssey (2017), with West "more than doubling" the Odyssey papyri (BMCR); Monro–Allen OCT 1920; Kirk's commentary (6 vols, 1985–93); Heubeck and others (3 vols, 1988–92); Murray's Loeb (Odyssey 1919, Iliad 1924–25) and Butler, as named in the site's own file headers.

**Left out because nothing reliable was found:** "well over 1,500 papyri"; "nearly 200 manuscripts of the Iliad and about 80 of the Odyssey"; the dates and shelfmarks of Venetus B, the Townley Homer, Laurentianus 32.24 and Palatinus gr. 45; the Judgement of Paris at Iliad 24.29–30; the Doloneia scholion; Odyssey 23.296 and the peras; Van Thiel's editions; Eratosthenes' date for Troy (1184/3) and the Trojan War as history.

**Corrected from the draft:** "c. 280 BC" for Zenodotus → appointed 284 BC; "150 BC" for Aristarchus → head of the Library 153–145; Chalcondyles 1488 → 1488–89.

**Weak points:** the history of Alexandrian scholarship, Wolf and Parry rests on Wikipedia pages (their own footnotes could be followed up); West 1967 and Bird 2010 are cited through a publisher page and the CHS page, not read; the Loeb and OUP pages would not open, so those details rest on search results and the files' own headers.

## Thucydides (tlg0003), checked 2026-09-30

**Confirmed and kept:** his own statements: 1.1.1 (began at the outset), 1.22.1 (the speeches, "as it seemed to me"), 1.22.4 (a possession for all time), 1.23.6 (the truest explanation), 2.47.3–2.48.3 (the plague; "I had the disease myself"), 4.104.4 (Thasos, half a day from Amphipolis), 4.105.1 (the gold mines), 4.106.3–4 (Eion saved by a night), 4.116.3 (the eighth year ends), 5.26.1–5 (twenty years' exile; the war lasted twenty-seven years), 8.109 (the last sentence); Xenophon, Hellenica 1.1.1; LSJ σύν ("old Att. ξύν"); Wikipedia (birth c. 460, Olorus and Thrace, Valla 1448–52, Hobbes 1628/9, Aldus 1502, the narrative ending in 411, the eight books by later librarians, the manuscripts and the Oxyrhynchus papyri, Xenophon continuing); Hornblower vol. III review (BMCR) for the incompleteness debate; editions: Jones–Powell OCT (Perseus file: Jones 1910, reprinted 1942), Crawley (Dent 1914) and Hobbes (1843 reprint) as named in the file headers, Alberti 1972–2000, Hornblower 1991–2008.

**Left out:** the two manuscript families (ABEFM and CG) and the dates of B and C; chapter 3.84 "rejected by most editors"; Books 5 and 8 as unrevised; ancient divisions into nine and thirteen books; "c. 400 BC" for his death and his return to Athens in 404; "Thracian connections" beyond Olorus's name and the mines.

**Corrected from the draft:** "failed to save Amphipolis" → the text says he arrived the evening it fell and saved Eion, and that he was banished "after my command at Amphipolis" (it does not say he was exiled *for* it); Hobbes 1629 → sources give 1628 or 1629.

**Weak points:** many details rest on Wikipedia; the years of the Alberti volumes come from a bibliography page.

## Plato (tlg0059), checked 2026-09-30

**Confirmed and kept:** Diogenes Laertius 3.2 (Apollodorus: birth 428/7; Hermippus: death 348/7 at a wedding feast), 3.37 (Plato names himself only in two dialogues; the Laws and the Epinomis; the Republic revised), 3.56–57 (Thrasyllus and the tetralogies); Phaedo 59b (Plato was ill) and Apology 34a (present at the trial); Seventh Letter 324a and 326 (about forty at Syracuse; philosophers and power), with the letter's authenticity marked disputed; Republic 514a, 592b, 330d–331d; Euthyphro 11b; LSJ πάνυ; Wikipedia (family, the Thirty, the Academy in the 380s, Aristotle in 367, the works surviving, doubtful works, Thrasyllus, about 250 Byzantine manuscripts, Ficino 1484); Stephanus pagination (Geneva 1578); the Clarke Plato (Biblissima's copy of the Bodleian record: 895, tetralogies 1–6, 24 works, Arethas, 21 gold coins); Aldus 1513 with Musurus (Wikipedia's list); Burnet OCT 1900–07, Duke and others 1995 (OUP, BMCR), Slings 2003, Cooper 1997; Shorey's Loeb Republic and Burnet's text as named in the Perseus file headers.

**Left out:** dates and sigla of manuscripts other than the Clarke Plato; "papyri from the third century BCE"; "the order of the dialogues rests partly on counting features of style" (Wikipedia does not say so); the Hippias Major as doubtful; the Budé series; the claim that Book 1 of the Republic began as a separate early dialogue (only the ancient report of revisions is kept).

**Corrected from the draft:** the Academy "around 387" → "in the 380s" (Wikipedia gives roughly 383–385); Sicily in 388 → "about forty" by the Seventh Letter; "Critias, his mother's cousin, and Charmides, her brother" → "two relatives" (the exact relationships were not confirmed); Plato's death "348" → 348/7 (Wikipedia has c. 347).

**Weak points:** the Seventh Letter's authenticity is disputed, so what it says about Plato's life is marked as such; the Clarke Plato details come from the Biblissima copy of the Bodleian catalogue because the Bodleian page would not open.

## The automatic check

`CORPUS=1 npx vitest run src/wiki/author-articles.corpus.test.ts` opens every passage an article cites, finds every Greek quotation «…» in a cited text, and finds every English quotation “…” in a cited translation, unless the article lists it under `outsideQuotes` (our own translation, or words from a web source). In these four articles it confirmed every quotation from the library and listed the ones that come from elsewhere.

## Sophocles (tlg0011), checked 2026-09-30

**Confirmed and kept:** Wikipedia (Sophocles): born c. 497/6 at Colonus, died 406/5, more than 120 plays and seven complete, thirty competitions and twenty-four wins and never below second, the first victory in 468 over Aeschylus, Hellenotamias in 443/2, general in 441 under the Life of Sophocles, Lloyd-Jones calling the Antigone-and-generalship story "most improbable", the Salamis paean, Dexion and the image of Asclepius (420), Philoctetes (409), Oedipus at Colonus performed in 401 at his grandson's wish, the seven plays, Aristotle's Poetics using Oedipus Rex. Plutarch, Cimon 8 (the archon Apsephion, Cimon and the generals as judges, Aeschylus leaving for Sicily; in the site's text). The Tracking Satyrs: the Scroll's own text and introduction (about 400 lines of perhaps 800; Oxyrhynchus; 1907; Hunt's edition of 1912 in the file header) and Wikipedia, Ichneutae (second-century papyrus, published 1912). Antigone 333 (the ode; numbered 333 in the Scroll's text) and LSJ δεινός (both "fearful, terrible" and "wondrous, marvellous, strange"). Antigone 904–912 (in the Scroll) and Aristotle, Rhetoric 1417a, quoting the brother lines (Perseus). The manuscripts: Pearse's page (L as Laurentianus 32.9, Aeschylus' M; the Leiden twin palimpsest; the triad; about two hundred copies; Triclinius in Paris gr. 2711; Paris gr. 2712) with Biblissima for the tenth century. Editions: Lloyd-Jones and Wilson OCT 1990 and Sophoclea (OUP; a review in the Revue des études grecques), Storr (Loeb 1912) and Jebb (1891 Antigone) and Mahoney as named in the file headers, Lloyd-Jones's Loeb (volume of 1994).

**Left out:** "eighteen" victories (Wikipedia gives twenty-four); Antigone 904–920 as a suspected interpolation and Goethe's hope (only Aristotle's quotation is kept, without the suspicion); the manuscript dates of A (thirteenth century) and the Leiden palimpsest ("around 950"); the ancient-source disagreement on victories; Pearson's OCT of 1924; Lobeck's Ajax; the Budé; "Doric colouring" of the choral songs; the Antigone's date.

**Corrected from the draft:** "Colonus near Athens" → Colonus in Attica; "general alongside Pericles" → per the Life of Sophocles; "papyrus published by Grenfell and Hunt" → Hunt's 1912 edition in Oxyrhynchus Papyri 9 (Wikipedia and the file header agree on 1912; the papyrus was found in 1907); the ode's line number → 333 in this text.

**Weak points:** most of the life rests on one Wikipedia page; Pearse's manuscript page is a secondary reference page; the OUP and Loeb pages would not open (details come from search results and file headers).

## Aristotle (tlg0086), checked 2026-09-30

**Confirmed and kept:** Diogenes Laertius 5.1 (Aristotle) in the Scroll: born at Stagira, father Nicomachus physician and friend of Amyntas (5.1), Eumelus on the aconite and Diogenes' correction (5.6), Apollodorus' chronology and the twenty years with Plato (5.9), Hermias, Philip's court, the Lyceum for thirteen years, Chalcis and death about sixty-three, the year Demosthenes died (5.10). Wikipedia (Aristotle): Assos and Lesbos with Theophrastus, the name Peripatetic, about a third of his output surviving, lecture aids. Wikipedia (Corpus Aristotelicum): Andronicus' first complete edition, Bekker numbers and the Berlin Academy edition (1831–70), the lost dialogues, the spurious and disputed works. Plutarch, Sulla 26.1–2 (Apellicon's library; Tyrannio and Andronicus; Neleus' heirs). Metaphysics 7.4 (τὸ τί ἦν εἶναι) and LSJ ἐνέργεια. Wikipedia (Constitution of the Athenians): the papyri, 1879/80, 1890, Kenyon in January 1891, authorship. Wikipedia (Nicomachean Ethics): Kb (Laurentianus LXXXI.11, tenth century) and the shared books; the two treatments of pleasure (NE 7.11–14 and 10.1–5, in the Scroll). Wikipedia (Poetics): Paris 1741 (eleventh century), the Arabic version from Syriac and independent of it, Moerbeke 1278, the lost second part, the 1508 Aldine. Wikipedia (Editio princeps): Aldine Aristotle 1495–98. Editions: Bywater 1894 (PhilPapers), Kassel 1965 (Oxford Scholarly Editions), Rackham, Freese and Fyfe as named in the file headers, Gauthier–Jolif (WorldCat), Barnes (PhilPapers).

**Left out:** Cicero's "golden stream" (the source page would not open); Strabo's cellar story; dates for Andronicus; "over a thousand manuscripts"; Parisinus gr. 1854 (Lb) and Marcianus gr. 213 (Mb) and their dates; Grosseteste's translation of about 1246; the Arabic translations at Baghdad in the ninth and tenth centuries; the glosses for οὐσία and τέλος; Ross's Metaphysics (1924) and other Oxford texts; "Magna Moralia is disputed" (Wikipedia lists it as generally agreed spurious); "Plato's death around the time he left" as 347 (Wikipedia: 348/47).

**Corrected from the draft:** "enters the Academy in 367" kept as approximate (seventeen years after 384); "tutor to Alexander at 343" kept (Wikipedia: 343/42; Diogenes: Alexander "in his fifteenth year", Wikipedia: thirteen, so Alexander's age is not stated); the Constitution's papyrus "identified in 1890" → bought in Egypt in 1890, published January 1891.

**Weak points:** much of the history of the corpus rests on Wikipedia pages (Corpus Aristotelicum, Poetics, Nicomachean Ethics).

## Euripides (tlg0006), checked 2026-09-30

**Confirmed and kept:** Wikipedia (Euripides): the ninety-five / ninety-two plays and nineteen survivors with Rhesus disputed; more plays survive than Aeschylus' and Sophocles' together; first competition 455, first victory 441, five wins (four and one posthumous); Alcestis 438, Medea 431, Hippolytus 428, Trojan Women 415, Orestes 408; the Bacchae and Iphigenia at Aulis in 405; Aristophanes' three plays; Salamis day and Archelaus and the doubt over Macedon; the two streams (a select edition of ten plays about AD 200; nine alphabetical plays) joined by a Byzantine scholar; L and P; Hypsipyle. Aristotle, Rhetoric 3.2.5 (in the Scroll). Wikipedia's list of editiones principes: about 1494 (four plays) and the Aldine of 1503 without Electra. Diggle's OCT (OUP; a Classical Review article), Kovacs' Loeb (Loeb pages), Mastronarde (BMCR), Kannicht TrGF 5 (BMCR); Murray, Coleridge, Buckley and G. Murray as named in the file headers.

**Left out:** the siglum and date of each manuscript (M, V, B, and the dates of L and Triclinius), the "Byzantine triad", the Parian Marble's 485/4, the lists of plays by stream, the disputed passages (Medea 38–43, the Phoenician Women's ending, the ending of Iphigenia at Aulis), actors' interpolations, Vettori's 1545 Electra, Janus Lascaris by name, the claim that he was "the youngest of the three", and Medea and others as "among the most performed".

**Corrected from the draft:** "about ninety plays" → ninety-five (some ancient scholars) or ninety-two at most (Suda); "first printing Lascaris c. 1495, four plays" → about 1494, with Wikipedia's list not naming Lascaris alone (Alopa's edition); Euripides' first victory 441 kept.

**Weak points:** this is the shortest article, because much of the old draft's detail could not be confirmed with sources that open; nearly all the life and manuscript facts rest on one Wikipedia page.
