# Fact-check: author articles (2026-10-02)

Scope: `web/src/wiki/authors/` tlg0016 (Herodotus), tlg0012 (Homer), tlg0003 (Thucydides), tlg0059 (Plato),
tlg0011 (Sophocles), tlg0086 (Aristotle), tlg0006 (Euripides), tlg0085 (Aeschylus). No site file was edited.

Method: every `cite` source that carries a load-bearing claim was opened with `scripts/passage.ts`; `url` sources were
fetched (Wikipedia pages also read as raw wikitext where the summary was doubtful); dates, shelfmarks and editions were
compared with catalogue, publisher, BMCR and reference pages. Quotations were not re-checked word for word (the CORPUS test
does that). Only substantive problems are listed.

---

## Herodotus (tlg0016.ts)

### 1. The papyrus count
- **Claim:** "Forty-four had been published when Gertjan Verhasselt edited one more" (transmission).
- **Problem:** The number is correctly taken from Verhasselt, but it reads as the current total, and it clashes with OUP's
  description of Wilson's 2015 edition, which says Wilson used new readings "from over 80 papyri". The two counts may be
  counted differently (Verhasselt may count only some kinds of papyri), but a reader told "forty-four" is misled.
- **Evidence:** Verhasselt (lirias.kuleuven.be/retrieve/524918): "The Herodotus papyri published thus far (44 in total)".
  OUP page for *Herodoti Historiae* (global.oup.com/academic/product/herodoti-historiae-9780199560714), as shown in search
  results: Wilson "has taken into account new readings from over 80 papyri".
- **Suggested fix:** "When Gertjan Verhasselt edited a scrap of Book 4, he counted forty-four papyri already published;
  Wilson's Oxford text (2015) draws on readings from more than eighty." (add the OUP page as a source), or drop the number.
- **Confidence:** medium

### 2. The Florentine family (minor)
- **Claim:** "The 'Florentine' family is led by a book in Florence (Laurentianus plut. 70.3, called A) and one in Rome
  (Angelicanus gr. 83, B)."
- **Problem:** Verhasselt names three main Florentine manuscripts for Book 4: A, B and T (Laurentianus plut. 70.6). "Led
  by" is defensible, so this is a small incompleteness, not an error.
- **Evidence:** Verhasselt: "the main manuscripts of the a-family are Laurentianus plut. 70.3 (A), Romanus Angelicanus gr.
  83 (B) and Laurentianus plut. 70.6 (T)".
- **Suggested fix:** "...led by two books in Florence (Laurentianus plut. 70.3, called A, and plut. 70.6, T) and one in
  Rome (Angelicanus gr. 83, B)."
- **Confidence:** high (that T is listed); low importance

Checked, no problems found in: the opening and 1.1; ἱστορίη → *history*; Cicero *Leg.* 1.5; Gellius/Pamphila (53 in 431);
Livius.org c. 480–c. 429; 7.137 with Thuc. 2.67 (end of the second summer, 430); 2.29, 2.44, 2.99, 7.152; Plutarch
*Malice* 1 (Boeotians, Corinthians) and 26 (Diyllus, ten talents, Anytus); Lucian *Herodotus* 1; the Ionic forms (κότε at
9.122.2, ἀπίκετο at 6.43.3); 3.80 and 6.43.3; Solon/Croesus and Plutarch *Solon* 27.1; 9.122.3; Lendering on the unfinished
end and the Ephialtes promise (7.213.3); D, R, S, V and C/P "contaminated both families"; Hemmerdinger 1981 (A, D, C);
the papyrus date (late 2nd or early 3rd century); ἄποδος (a + M, C, P = "Florentine family and three other manuscripts") vs
ἄφοδος (d) at 4.97.4; the Ionic/koine quotation; Laur. plut. 70.3 (10th century, parchment, 374 leaves, Biblissima);
the nine books at Alexandria in the 3rd century BC (Livius.org); Valla printed at Venice by Jacobus Rubeus, 1474, the first
printed Herodotus; Aldus 1502; Aristotle *Rhet.* 3.9 "of Thurii"; Wilson OCT 2015 replacing Hude, two neglected Roman-family
manuscripts collated; Rosén vol. 1 1987 and vol. 2 1997; Asheri–Lloyd–Corcella 2007; Godley 1920–25; timeline marks.
Not re-verified: Hollmann's note 68 (PDF not reopened; the claim is modest and matches Plutarch *Solon* 27.1).

**Herodotus: 2 findings (1 medium, 1 minor).**

---

## Homer (tlg0012.ts)

### 1. Nagy's "date"
- **Claim:** "Proposals range much wider, from the eighth century (Richard Janko) to the middle of the second century BC
  (Gregory Nagy), with Martin West at 660–650."
- **Problem:** Nagy does not propose that the poems were composed in the 2nd century BC; he holds that the tradition stayed
  fluid and did not stop changing until then. Read in a sentence about dates of composition, the wording misrepresents him.
  West's figure is also a lower limit for the *Iliad* only ("at the earliest"), with the *Odyssey* later.
- **Evidence:** Wikipedia, Homeric Question: Nagy sees Homer as "a continually evolving tradition ... which did not fully
  cease to continue changing and evolving until as late as the middle of the second century BC"; West: "the Iliad must have
  been composed around 660–650 BC at the earliest, with the Odyssey up to a generation later."
- **Suggested fix:** "Richard Janko dates both poems to the eighth century; Martin West puts the *Iliad* no earlier than
  660–650 and the *Odyssey* up to a generation later; Gregory Nagy sees an evolving tradition that did not stop changing until
  the middle of the second century BC."
- **Confidence:** high

### 2. Parry and Lord "from about 1928 ... studying singers in the Balkans"
- **Claim:** "From about 1928 Milman Parry and Albert Lord, studying singers in the Balkans, argued that the poems were
  composed in performance from traditional phrases" (summary; timeline "1928 ... Milman Parry begins the work").
- **Problem:** Telescoped chronology (copied from Wikipedia's own compressed sentence). Parry's 1928 Paris theses were a
  study of formulas in the Homeric text; the Balkan fieldwork came in 1933–35, and Lord joined only on the second trip. The
  timeline entry is fine; the summary sentence implies Balkan fieldwork with Lord from 1928.
- **Evidence:** Wikipedia, Milman Parry: dissertations "published in French in 1928"; "Between 1933 and 1935 Parry ... made
  two visits to Yugoslavia ... with the help on his second visit of his assistant Albert Lord".
- **Suggested fix:** "In 1928 Milman Parry showed how much of Homer's style is built from fixed formulas; in 1933–35 he and
  later his assistant Albert Lord recorded oral singers in Yugoslavia. Their 'oral-formulaic theory' ... won very wide
  acceptance." (add the Milman Parry page as a source)
- **Confidence:** high (on the dates); medium importance

### 3. Zenodotus and Aristarchus marked as "print" (minor)
- **Claim:** timeline entries `{ year: -284, kind: "print", ... Zenodotus ... }` and `{ year: -150, kind: "print", ...
  Aristarchus ... }`.
- **Problem:** The "print" kind is labelled "Print and editions: Printed texts, translations and modern editions". Ancient
  hand-written editions shown under a "print" marker can suggest printing. A classification point, but readers see the label.
- **Suggested fix:** use `kind: "copy"` (or add an "edition" kind), or reword the label to "Editions and print".
- **Confidence:** low (presentation)

Checked, no problems found in: *Iliad* 1.1, 2.134 (nine years), *Odyssey* 2.175 (twentieth year); the lives as legend,
"most" make him blind, Chios and Smyrna in fifth-century writers, later Cyme, Argos, Pylos, Athens; Hymn to Apollo 172 and
Thuc. 3.104.4–6; late 8th / early 7th century, *Iliad* first; Herodotus 2.53 and 2.117; the chorizontes; works attributed
in antiquity; ἀγορή, ἄμμες (LSJ "Aeol. and Ep. for ἡμεῖς"), -οιο; Wolf 1795; Cicero *De or.* 3.137; *Hipparchus* 228b;
Zenodotus appointed 284 BC, first critical editor; Aristarchus 153–145, signs, severity, 24 books (he "or more probably"
Zenodotus — the article's "either he or Zenodotus" is fair); papyri 3rd c. BC–7th c. AD, plus/minus verses, c. 150 BC
(Dué); Bird 2010 (Hellenic Studies 43); Venetus A (10th century, Marc. gr. Z. 454 = 822, Villoison 1788 with the B
scholia); editio princeps Florence 1488–89, Chalcondyles; digamma (lost in Ionic before the 7th-century writing down;
restored editions out of favour); Iliad 1.7 hiatus; *wa-na-ka*; West's *Odyssey* (De Gruyter 2017; "more than doubles"
the papyri, "mostly" Oxyrhynchus; "broadly confirm"); West's *Ilias* 1998–2000; Monro–Allen 3rd ed.; Murray 1919 and
1924–25; Butler/Power/Nagy; Kirk 1985–93; Heubeck et al. 1988–92.

**Homer: 3 findings (1 high, 1 medium, 1 low).**

---

## Thucydides (tlg0003.ts)

### 1. Where the narrative breaks off
- **Claim:** timeline: "The narrative breaks off in mid-story, near the end of the war's twenty-first year" (year -411).
- **Problem:** Wrong. Thucydides' years run summer + winter. The twentieth year ends at 8.60.3; the twenty-first begins at
  8.61.1 ("the following summer, at the very opening of spring"), and 8.109 still belongs to that same summer of 411. So
  the text stops in the summer, roughly halfway through the twenty-first year, not near its end. The cited Wikipedia page
  only says it ends "in 411 BC".
- **Evidence:** Thuc. 8.60.3: "So this winter ended, and with it the twentieth year of this war"; 8.61.1: "During the
  following summer season, at the very opening of spring..."; the narrative then never reaches the end of that summer.
- **Suggested fix:** "The narrative breaks off in mid-story in the summer of 411 BC, in the war's twenty-first year"
  (add 8.60.3 as a source).
- **Confidence:** high

### 2. Jones's Oxford text "published 1910, reprinted 1942"
- **Claim:** editions note: "The Greek in the Scroll is Jones's Oxford text, in Perseus's copy (published 1910, reprinted
  1942)."
- **Problem:** The two dates come from the TEI header (`1910 1942`), but 1942 is not a reprint: it is the revised edition
  with J. E. Powell's corrected and enlarged apparatus, which the article itself lists in the line above ("H. S. Jones and
  J. E. Powell ... 1942"). Jones's OCT was also first published around 1900, so 1910 is a later printing. Could not open a
  catalogue record giving the exact first-edition years, so the 1910 point is low confidence.
- **Evidence:** the header of `tlg0003.tlg001.perseus-grc2.xml`: "Henry Stuart Jones Oxford Oxford University Press 1910
  1942"; the OCT volumes in print are titled as revised by Jones and Powell, 1942 (Oxford Scholarly Editions, "Revised
  Edition").
- **Suggested fix:** "The Greek in the Scroll is Jones's Oxford text, in Perseus's copy (the file names printings of 1910
  and 1942)."
- **Confidence:** medium (internal inconsistency), low (on the first-edition date)

Checked, no problems found in: 1.1.1; LSJ σύν "old Att. ξύν"; the plague (2.47–48) and "I had the disease myself"; 4.104.4
(Thasos, half a day's sail; the other general of the Thraceward region), 4.105.1 (gold mines), 4.106.3–4 (Eion by a night),
4.116.3 (eighth year); 5.26 (twenty years' exile, twenty-seven years, "affairs on both sides"); 1.22.1, 1.22.4, 1.23.6;
8.109 last sentence; Xen. *Hell.* 1.1.1; "usually taken as unfinished"; Hornblower's Book 8 defence and "changing narrative
art" (BMCR 2010.01.24); eight-book division by later (probably Alexandrian) librarians; born c. 460 at Halimous, son of
Olorus; about twenty Oxyrhynchus papyri found by Grenfell and Hunt, P.Oxy. 16 and 17; the manuscript list (Laur. 69.2, Vat.
gr. 126, Paris suppl. gr. 255, Pal. gr. 252 with Tzetzes, Monac. 430 and 228, British Library); Valla 1448–52; Aldus 1502;
Hobbes 1628/1629; Alberti 1972, 1992, 2000; Hornblower 1991–2008; Crawley 1914 and Hobbes 1843 (file headers).

**Thucydides: 2 findings (1 high, 1 medium/low).**

---

## Plato (tlg0059.ts)

### 1. Charmides was not one of the Thirty
- **Claim:** "two relatives, Critias and Charmides, were among the Thirty who ruled Athens in 404 BC."
- **Problem:** Charmides was one of the Ten who governed the Piraeus under the Thirty, not one of the Thirty. Xenophon's
  list of the Thirty names Critias but not Charmides, and when he reports their deaths he puts them in different boards.
  The cited Wikipedia sentence says the same as the article, so the footnote "supports" it, but the source is wrong and
  the primary source is in the site's own library.
- **Evidence:** Xen. *Hell.* 2.3.2 (in the Scroll, tlg0032.tlg001): the thirty names include Critias, no Charmides.
  2.4.19: "In this battle fell two of the Thirty, Critias and Hippomachus, one of the Ten who ruled in Piraeus, Charmides,
  the son of Glaucon".
- **Suggested fix:** "two relatives held power in the oligarchy of 404 BC: Critias as one of the Thirty, and Charmides as one
  of the Ten who governed the Piraeus under them." Cite Xen. *Hell.* 2.3.2 and 2.4.19.
- **Confidence:** high

### 2. The Clarke Plato ends with the *Meno*, not the *Gorgias*
- **Claim:** "It holds the first six tetralogies: twenty-four works, from the *Euthyphro* and *Apology* to the *Gorgias*."
- **Problem:** The sixth tetralogy is *Euthydemus*, *Protagoras*, *Gorgias*, *Meno*; the manuscript ends with the *Meno*.
  The cited Biblissima record says so.
- **Evidence:** Biblissima, MS. E. D. Clarke 39: "Tetralogies 1-6 containing 24 dialogues, beginning with Euthyphro and
  concluding with Meno."
- **Suggested fix:** "...twenty-four works, from the *Euthyphro* to the *Meno*."
- **Confidence:** high

### 3. Shorey's *Republic*: printing dates given as the edition's dates
- **Claim:** "Paul Shorey's translation of the *Republic* (Loeb Classical Library, 1935–37)."
- **Problem:** 1935–37 is the printing in the Perseus file header (`<date type="printing">1935-37</date>`). Shorey's Loeb
  *Republic* first came out in two volumes in 1930 (Books I–V) and 1935 (Books VI–X). The same habit appears in the Aristotle
  article (Fyfe "1939") and possibly Burnet ("Clarendon Press, 1905" in source 21; Burnet's *Republic* volume first
  appeared in 1902). I am confident about Shorey 1930/1935 from general bibliographic knowledge but did not open a
  catalogue record in this session.
- **Evidence:** TEI header of `tlg0059.tlg030.perseus-eng2.xml`: "Plato in Twelve Volumes ... vols 5-6 ... printing
  1935-37".
- **Suggested fix:** "(Loeb Classical Library, 1930–35; the Scroll uses the printing of 1935–37)", after checking a library
  record.
- **Confidence:** medium

### 4. LSJ's "word" for πάνυ (minor)
- **Claim:** "LSJ's word for πάνυ is 'altogether, perfectly, very'."
- **Problem:** The quotation marks suggest one continuous gloss. LSJ's entry opens "altogether"; "perfectly" appears as a
  rendering of one example (πάνυ μανθάνω), and "very" further down. A collage of glosses presented as a single quotation.
- **Evidence:** LSJ πάνυ (site's copy, `pipeline/.cache/lsj/lsj17.xml`): "πάνυ, Adv., (πᾶς) altogether ... π. μανθάνω
  perfectly, Ar. Ra. 65 ...".
- **Suggested fix:** "LSJ glosses πάνυ as 'altogether', and in use 'perfectly' or 'very'."
- **Confidence:** medium (low importance)

Checked, no problems found in: DL 3.37 (names himself only in *Phaedo* and *Apology*; Philip of Opus and the wax tablets;
Euphorion and Panaetius on the revised opening of the *Republic*); *Phaedo* 59b; *Apology* 34a; DL 3.2 (428/7; Hermippus,
wedding feast, 348/7, eighty-first year); Seventh Letter 324a ("about forty") and 326a–b; authenticity disputed; the Academy
"in the 380s" (Wikipedia: roughly 383) and Aristotle in 367; *Republic* 514a, 592b; *Euthyphro* 11 (the dilemma is restated
there; it is first posed at 10a, but the cite is fair); πάνυ μὲν οὖν / πάνυ γε in Book 1 (27 occurrences in 327a–354c, so
"they fill the first book" holds); complete works believed to survive; the doubted and divided lists; the nine spurious
works of the 1st century AD; scepticism about the order; Thrasyllus (DL 3.56–57, fifty-six dialogues, nine tetralogies);
about 250 Byzantine manuscripts; Clarke 39 (895, John the Calligrapher, Arethas, 21 gold coins, "about half the dialogues");
Stephanus 1578 Geneva with Serranus; Ficino 1484, 1025 copies; Aldus/Musurus 1513; Burnet OCT 1900–07; Duke et al. 1995;
Slings 2003; Cooper 1997.

**Plato: 4 findings (2 high, 1 medium, 1 minor).**

---

## Sophocles (tlg0011.ts)

### 1. The Hellenotamiai were not "the treasurers of Athena"
- **Claim:** "In 443/2 BC he was one of the Hellenotamiai, the treasurers of Athena" (summary) and the timeline "One of the
  Hellenotamiai, the treasurers of Athena (443/2)".
- **Problem:** The Hellenotamiai ("treasurers of the Greeks") were the financial officers of the Delian League, who
  received the allies' tribute. The "treasurers of Athena" (ταμίαι τῆς θεοῦ) were a different board. The error comes from
  the cited Wikipedia page on Sophocles, which says exactly this, but Wikipedia's own page on the office contradicts it.
- **Evidence:** Wikipedia, Hellenotamiae: they were the "chief financial officers of the Delian League", receiving the
  allies' contributions; after 453 BC they "paid the First Fruits to the treasury of Athena" (i.e. to a different body).
  Wikipedia, Sophocles: "one of the Hellenotamiai, or treasurers of Athena".
- **Suggested fix:** "In 443/2 BC he was one of the Hellenotamiai, the treasurers who received the tribute of Athens'
  allies" (add the Hellenotamiae page as a source), in both places.
- **Confidence:** high

### 2. The date of the Laurentian codex differs between two articles (minor)
- **Claim:** Sophocles timeline: "The Florence codex Laurentianus 32.9 (L) ... is made in the tenth century" (year 950);
  Aeschylus timeline (tlg0085.ts): "The Medicean manuscript (M) ... is written about AD 1000" (year 1000).
- **Problem:** The same book appears on two timelines of the site with different dates (950 and 1000). Both are defensible
  readings of the sources (Pearse's Sophocles notes: "soon after 950"; his Aeschylus notes: "ca. 1000"; Biblissima: tenth
  century), but a reader comparing the two pages sees a contradiction.
- **Suggested fix:** use one date on both pages, e.g. "the tenth century (about 950–1000)".
- **Confidence:** high (that they differ); low importance

Checked, no problems found in: general in 441 under the *Vita*, junior colleague of Pericles, Samos; Lloyd-Jones "most
improbable"; more than 120 plays, 30 competitions, 24 wins, never below second; first victory 468 over Aeschylus; Plutarch
*Cimon* 8 (Apsephion, Cimon and the generals as judges, ten in all, Aeschylus' departure); the seven plays; *Philoctetes*
409; *Oedipus at Colonus* 401 by his grandson; *Poetics* and *Oedipus*; Dexion and Asclepius (420); born 497/6 at Colonus,
died 406/5 aged 90–92; the Salamis paean (legend); *Ichneutae*: found at Oxyrhynchus in 1907, some 400 lines of about 800,
plot (the Scroll's introduction), 2nd-century roll, P.Oxy. IX 1174 published 1912 by Hunt; *Antigone* 333 in the Scroll
(332–3 in most editions, which the article handles by saying "in the Scroll's text"); LSJ δεινός "fearful, terrible" (the
"wondrous, marvellous, strange" sense was not re-read in this session); *Antigone* 904–912 and Aristotle *Rhet.* 3.16
(1417a); L: tenth century, Sophocles, Aeschylus (M), Apollonius; the Leiden palimpsest twin, mostly unreadable; the triad
and about two hundred copies; Paris gr. 2712 (A); Triclinius and Paris gr. 2711 (T); Aldus 1502; Lloyd-Jones and Wilson
1990 and *Sophoclea*; Storr 1912–13; Jebb's *Antigone* 1891 (file header); Lloyd-Jones Loeb 1994–96.

**Sophocles: 2 findings (1 high, 1 minor).**

---

## Aristotle (tlg0086.ts)

### 1. The *Magna Moralia* is marked "disputed", not "spurious", in the cited source
- **Claim:** "Many works carried under his name are generally agreed to be spurious, among them ... *On Virtues and Vices*
  and the *Magna Moralia*. The authenticity of the *Problemata* and the *Economics* is disputed." (The file's header note
  also says "Wikipedia lists it as generally agreed spurious".)
- **Problem:** The cited source (Wikipedia, Corpus Aristotelicum, now titled "Works of Aristotle") marks the *Magna Moralia*
  with an asterisk, "Authenticity disputed", exactly like the *Problems* and the *Economics*; it is not in brackets
  ("Generally agreed to be spurious"). The footnote does not support the sentence; the old draft's "disputed" was right.
- **Evidence:** wikitext of `Template:Corpus Aristotelicum table`: legend "`*` Authenticity disputed. `[ ]` Generally agreed
  to be spurious"; row: `''[[Magna Moralia|Great Ethics]]''*` / `Magna Moralia*`; *On Virtues and Vices*, *Rhetoric to
  Alexander*, *On Colors* etc. are in `{{bracket|...}}`.
- **Suggested fix:** "...*Rhetoric to Alexander* and *On Virtues and Vices*. The authenticity of the *Magna Moralia*, the
  *Problemata* and the *Economics* is disputed." Also "two are disputed" in the variants section → "three are disputed".
  Update the header comment.
- **Confidence:** high

### 2. Paris 1741 is not "the" Greek source, and its date
- **Claim:** "The accepted Greek source is the eleventh-century manuscript Paris 1741."
- **Problem:** Two issues. (a) Paris gr. 1741 is the main Greek witness but not the only independent one: the Riccardianus
  46 (B) is a second independent Greek witness, so the *Poetics* has four primary witnesses (two Greek, the Arabic and
  Moerbeke's Latin). "Thin thread" is fair; "the accepted Greek source" overstates. (b) The manuscript is usually dated to
  the tenth century (middle or second half), not the eleventh; "eleventh-century" is Wikipedia's wording.
- **Evidence:** search results summarising Tarán and Gutas's edition (monoskop.org/Aristotle/Poetics/Tarán): "Parisinus
  Graecus 1741 (A) is dated to about the middle or second part of the tenth century ... one of the four primary witnesses".
  Wikipedia, Poetics: "the currently-accepted 11th-century source designated Paris 1741".
- **Suggested fix:** "The main Greek source is a tenth-century manuscript in Paris (gr. 1741); a later Greek manuscript in
  Florence and two translations, Arabic and Latin, are independent witnesses." Confirm the date and Riccardianus 46 against
  Tarán–Gutas (2012) or Kassel's preface before publishing.
- **Confidence:** medium

### 3. What Diogenes says Eumelus got wrong (minor)
- **Claim:** "Eumelus claimed that Aristotle died at Chalcis by drinking aconite, at seventy. Diogenes answers that he is
  mistaken, since Aristotle lived to sixty-three."
- **Problem:** In Diogenes the word "mistaken" (διαπίπτων) is attached to Eumelus' other claim, that Aristotle was thirty
  when he came to Plato; the reply is "he lived sixty-three years and joined Plato at seventeen". The age of seventy is only
  implicitly refuted, and the aconite is not refuted at all.
- **Evidence:** DL 5.6 (tlg0004.tlg001 5.1.6): "The same authority makes him thirty years old when he came to Plato; but
  here he is mistaken. For Aristotle lived to be sixty-three, and he was seventeen when he became Plato's pupil."
- **Suggested fix:** "...at seventy, and that he came to Plato at thirty. Diogenes says he is mistaken: Aristotle lived to
  sixty-three and joined Plato at seventeen."
- **Confidence:** high (on the reading); low importance

### 4. Fyfe's *Poetics* "(1939)" (minor)
- **Claim:** "with W. H. Fyfe's Loeb translation (1939)".
- **Problem:** 1939 is the printing named in the file header. Fyfe's Loeb *Poetics* first appeared in 1927 (revised 1932).
  From memory, not checked against a catalogue in this session. Same pattern as Shorey in the Plato article.
- **Suggested fix:** "(Loeb, 1927; the Scroll uses a 1939 printing)", after checking a library record.
- **Confidence:** low

Checked, no problems found in: DL 5.1 (Stagira, Nicomachus at Amyntas' court), 5.9 (Apollodorus; seventeen; twenty
years; Hermias three years), 5.10 (Philip, Alexander in his fifteenth year, Lyceum thirteen years, Chalcis, about
sixty-three, Demosthenes at Calauria, Callisthenes "it is said"); Assos with Xenocrates, Theophrastus, botany and marine
biology, Lesbos; Lyceum and "Peripatetic"; about a third survives; lecture aids; the four lost dialogues; Plutarch *Sulla*
26 (Apellicon, Tyrannio, Andronicus, Neleus); Andronicus' first complete edition; τὸ τί ἦν εἶναι and *Met.* 7.4; LSJ
ἐνέργεια "activity, operation", first example *EN* 1098b33; *Ath. Pol.* (Fayum 1879/1880, bought 1890, British Museum,
Kenyon January 1891, authorship); *EN* V–VII = *EE* IV–VI; pleasure in *EN* 7.11–14 and 10.1–5; the bracketed spurious works
(other than the *Magna Moralia*); Bekker 1831–70; Aldus 1495–98; *Poetics* Arabic/Syriac (before 700, independent;
"misinterpretation" through the Middle Ages), Moerbeke 1278, Aldine *Rhetores graeci* 1508, lost second part; Kb (Laur.
81.11, 10th century); Bywater 1894; Rackham 1926; Ross and Freese (1926, 1947); Kassel 1965; Gauthier–Jolif 1970 (1958–59);
Barnes 1984; timeline years.

**Aristotle: 4 findings (1 high, 1 medium, 2 minor).**

---

## Euripides (tlg0006.ts)

No substantive problems found.

Checked, no problems found in: more plays than Aeschylus and Sophocles together; nineteen, *Rhesus* disputed; 95 / Suda
92; Hellenistic "cornerstone" of education; first competed 455, first win 441, five wins (four and one posthumous);
*Alcestis* 438 second in the satyr-play slot; *Medea* 431 third; *Hippolytus* 428 first; *Trojan Women* 415 second;
*Orestes* 408; *Bacchae* and *Iphigenia at Aulis* 405; Aristophanes' three plays; Aristotle *Rhet.* 3.2.5; born on Salamis
c. 480 (tradition), Archelaus' "rustic court", 406, doubts about Macedonia; select edition of ten c. AD 200 "possibly for
use in schools"; nine alphabetical plays; "some unknown Byzantine scholar"; L (Laurentian) and P (Palatine, Vatican);
*Hypsipyle*; editio princeps Florence c. 1494 (*Medea*, *Hippolytus*, *Alcestis*, *Andromache*) and Aldus 1503 without
*Electra*; Murray OCT 1902–13; Coleridge 1906, Buckley 1850, Gilbert Murray 1913 (file headers); Diggle 1981, 1984, 1994;
Kovacs 1994–2003; Mastronarde 2002; Kannicht 2004; certainty labels and timeline.
(A nuance only: some scholars think P copied the alphabetical plays from L, so "L and P alone" may overstate the
independence of the two witnesses; not a finding, since the cited source says what the article says.)

**Euripides: 0 findings.**

---

## Aeschylus (tlg0085.ts)

### 1. M's date (see Sophocles finding 2)
- **Claim:** timeline "The Medicean manuscript (M), with all seven plays, is written about AD 1000"; transmission "had been
  written about AD 1000".
- **Problem:** Same codex as Sophocles' L, dated "tenth century" (950) on the Sophocles page and by Biblissima (source 27 of
  this article, which says "tenth century" in its own label). Pearse's "ca. 1000" supports the sentence, but the article's
  own source 27 and the sister article give the tenth century.
- **Suggested fix:** "written in the tenth century (about 950–1000)" on both pages.
- **Confidence:** high (inconsistency); low importance

### 2. F called "Triclinian" (minor)
- **Claim:** "For a large part of the *Agamemnon* these Triclinian manuscripts (called Tr and F) are the only basis for
  the text."
- **Problem:** The BMCR review cited says Tr and F are the only basis, but does not call F Triclinian; Pearse says only one
  of the three is known to be Triclinius' work and the other two are "thought to be" his. "These Triclinian manuscripts"
  turns a likelihood into a fact.
- **Evidence:** BMCR 2025.07.38: "the manuscripts Tr and F, which are the only basis for our knowledge of a large part of
  the play"; Pearse: "at least one of which is known to be the work of Demetrius Triclinius, and the other two are thought to
  be his work also".
- **Suggested fix:** "For a large part of the *Agamemnon* two of these manuscripts (called Tr and F) are the only basis for
  the text."
- **Confidence:** medium (low importance)

Checked, no problems found in: born c. 525 at Eleusis, 27 km from Athens; Marathon with Cynegeirus; Hdt. 6.114
(Cynegirus, hand cut off with an axe); Pausanias 1.14.5 (Artemisium, Salamis, the epitaph); first competed 499 aged 26,
first win 484; 70–90 plays, seven survive, thirteen victories (the *Life*); *Persians* 472, Pericles *choregos*, the oldest
surviving play and only tragedy on contemporary events; Phrynichus (Hdt. 6.21.2, a thousand drachmas); 468 and Plutarch
*Cimon* 8; Hieron and the 470s; *Seven* 467; *Suppliants* re-dated by P.Oxy. 2256 fr. 3 (1952), probably 463; *Oresteia*
458, only complete trilogy, *Proteus* fragmentary; Gela 456/5; Valerius Maximus' eagle; *Poetics* 4.16 (second actor;
Sophocles' third actor and scene-painting); *Frogs* 924 and first prize 405; *Agamemnon* 685–690 and Smyth; *EN* 3.1 and the
Mysteries; restaging after death; Lycurgus (finances from 336; the law on official copies, Ps.-Plutarch *Lycurgus*);
Galen's Ptolemy III story (fifteen talents); M arriving in Florence in 1423, all seven plays, *Libation Bearers* (opening
lost) and *Suppliants* only in M and its copies; the triad and about 150 manuscripts; *Agamemnon* and *Eumenides* in three
other manuscripts; Aldine 1518 (six plays, *Ag.* 311–1066 lost in the fusion) and Robortello 1552; *Frogs* 1126–1174 and
the *Libation Bearers* opening; *Prometheus* authorship (Griffith 1977, West's Euphorion); the *Seven* ending (from 1011 in
the Scroll, the herald; Wikipedia states the late rewrite flatly, the article's "many think" is the more careful form);
Smyth 1922–26; Sidgwick 1902; Browning 1889; Page 1972; West 1990; Sommerstein 2008; Radt 1985; Fraenkel 1950; the
`[^3,1]` footnote form (supported by `markup.ts`).

**Aeschylus: 2 findings (1 inconsistency shared with Sophocles, 1 minor).**

---

## Totals

| Article | Findings | High-confidence errors |
|---|---|---|
| Herodotus | 2 | 0 |
| Homer | 3 | 1 (Nagy's "date") |
| Thucydides | 2 | 1 (where the text stops) |
| Plato | 4 | 2 (Charmides; the Clarke Plato's last dialogue) |
| Sophocles | 2 | 1 (Hellenotamiai) |
| Aristotle | 4 | 1 (*Magna Moralia*) |
| Euripides | 0 | 0 |
| Aeschylus | 2 | 0 |

A pattern worth fixing across all articles: where a TEI header gives a printing date (Shorey 1935–37, Fyfe 1939, Jones
1910/1942, Burnet 1905), the article presents it as the date of the edition. And where Wikipedia is the only source for a
specialist point (Hellenotamiai, Charmides, Paris 1741), it was wrong three times; the primary source or a specialist page
should be checked for such claims.
