# Fact-check: the five new author articles

Articles: Demosthenes (`tlg0014.ts`), Plutarch (`tlg0007.ts`), Xenophon (`tlg0032.ts`), Aristophanes (`tlg0019.ts`), Pindar (`tlg0033.ts`),
all in `web/src/wiki/authors/`. Checked 2026-10-02.

Method. Every `cite` source was opened with `scripts/passage.ts` and read against the sentence that points to it. Every `url` source
was fetched where possible: Wikipedia (as wikitext), Stanford Encyclopedia, BMCR reviews, BnF and Princeton records, Persée, GRBS
PDFs, Internet Archive scans of Sandys's Loeb and Grenfell–Hunt's *Oxyrhynchus Papyri*, and LacusCurtius. Edition dates were also
compared with the Perseus TEI headers in `pipeline/.cache`. The researchers' logs in `pipeline/drafts/checked/` were read but not
relied on. The exact wording of every claim below was re-checked against the article files.

Totals: **26 findings** (Demosthenes 7, Plutarch 7, Xenophon 4, Aristophanes 6, Pindar 2). No misquotations and no footnotes
pointing at the wrong passage were found. Most findings are dropped qualifications or slightly overstated wording. A handful are
real factual slips:
- Demosthenes: the statue went up about 280 BC, some 42 years after his death, not "a little later".
- Demosthenes: the *Lives of the Ten Orators* credits the verses to Demetrius of Magnesia, not to itself.
- Aristophanes: the Hall–Geldart Oxford text first appeared in 1900; 1906–07 is the revised edition.
- Aristophanes: *Connus* came second, so it was not "one of the winners".
- Plutarch: the Hadrian notice comes from Eusebius *via Syncellus*.
- Plutarch: Goodwin's *Morals* first came out in 1870, not 1874.

---

## Fact check: Demosthenes (web/src/wiki/authors/tlg0014.ts)

### 1. The statue was not set up "a little later": its own source dates it about 42 years after his death
- **Claim:** "A little later Athens set up a bronze statue of him, with the verses …"
- **Problem:** Plutarch (Dem. 30.5, source 20) does say "a little while after his death". But the article's other source, [Plutarch], *Lives of the Ten Orators* 8.1 (source 2, already cited in the next sentence), dates the statue in the market-place to the archonship of Gorgias, on the request of his nephew Demochares. Gorgias was archon in 280/79 BC (some give 281/80). So the statue went up about 42 years after his death in 322. The Wikipedia page (source 1) says "Years after Demosthenes's suicide". Its picture caption dates Polyeuctus' bronze to "c. 280 BC".
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg121 8.1` (English): "At a later time the Athenians voted maintenance in the Prytaneum to the relatives of Demosthenes and erected to him after his death the statue in the Market-place, in the archonship of Gorgias. The grants to him were requested by his nephew Demochares". Wikipedia, Demosthenes: "Years after Demosthenes's suicide, the Athenians erected a statue…" and the caption "bronze posthumous commemorative statue in the Ancient Agora of Athens by Polyeuctus (c. 280 BC)". The Met and the Museo Barracco also date the Polyeuktos statue to 280 BC.
- **Suggested fix:** "Some forty years later, about 280 BC, Athens set up a bronze statue of him in the market-place, at his nephew Demochares' request, with the verses …[^20,2]"
- **Confidence:** high

### 2. The *Lives of the Ten Orators* does not say outright that he wrote the verses; it says Demetrius of Magnesia said so
- **Claim:** "Plutarch says those who claim Demosthenes wrote them himself “talk utter nonsense”; the *Lives of the Ten Orators* says he did.[^2]"
- **Problem:** The *Lives* gives this as someone else's report. It says Demosthenes asked for writing materials and wrote the couplet, "so Demetrius of Magnesia says". It is not the author's own statement.
- **Evidence:** tlg0007.tlg121 8.1, Greek: «αἰτήσας τε γραμματεῖον ἔγραψεν, ὡς μὲν Δημήτριος ὁ Μάγνης φησί, τὸ ἐπὶ τῆς εἰκόνος αὐτοῦ ἐλεγεῖον». English: "asking for writing materials he wrote - so Demetrius of Magnesia says - the distich which was later inscribed by the Athenians upon his statue". The researcher's own log also records "Demetrius of Magnesia on the distich".
- **Suggested fix:** "… the *Lives of the Ten Orators* reports, on the word of Demetrius of Magnesia, that he did.[^2]"
- **Confidence:** high

### 3. Elatea fell in late 339, not 338, so the speech came about nine years later, not eight
- **Claim:** "In 338 Philip seized the town of Elatea.[^1] Demosthenes remembered the moment eight years later: …"
- **Problem:** The Wikipedia page *Demosthenes* (source 1) does put Philip's entry into Phocis in 338. But the article's own source 7 (Wikipedia, *Battle of Chaeronea*) says "Philip probably arrived in Phocis in November 339 BC, but the Battle of Chaeronea did not occur until August 338 BC". Wikipedia's *Elateia* page and the usual modern accounts also date the seizure of Elatea to late 339, at the start of the winter of 339/8. *On the Crown* was given in 330, so "eight years later" depends on the 338 date. "That August" in the next paragraph is still right, because the battle was in August 338.
- **Evidence:** https://en.wikipedia.org/wiki/Battle_of_Chaeronea_(338_BC): "Philip probably arrived in Phocis in November 339 BC". https://en.wikipedia.org/wiki/Elateia: "When Philip II of Macedon entered Phocis in 339 BC … he seized Elateia".
- **Suggested fix:** "Late in 339 Philip seized the town of Elatea.[^7] Demosthenes remembered the moment nine years later: …" Keep "That August (338) the allies met Philip at Chaeronea".
- **Confidence:** medium (the two Wikipedia pages disagree; the late-339 date is the one usually given by modern historians)

### 4. The poisoned pen is one story among several, but the article tells it as fact
- **Claim:** "When Antipater's man Archias came for him, he asked to write a letter, and “he put his pen to his mouth and bit it”; the poison was already working when he walked out past the altar and fell.[^20]"
- **Problem:** The same cited passage (Plutarch, Dem. 30.1–30.4, within source 20) says this is Ariston's version. Plutarch goes on to give others: Pappus/Hermippus (the Thracian guards said he swallowed poison from a cloth), Eratosthenes (poison kept in a hollow bracelet), and Demochares, his relative, who held that his death was not caused by poison at all. Plutarch also notes that "very many" divergent stories exist. The death by poison is generally accepted. The pen detail is not certain, but the article states it without any certainty label.
- **Evidence:** tlg0007.tlg054 30.1: "As for the poison, Ariston says he took it from the pen, as I have said; but a certain Pappus … says …". 30.3: "Eratosthenes himself says that Demosthenes kept the poison in a hollow bracelet … the divergent stories of all the others who have written about the matter, and they are very many". 30.4: "Demochares … says that in his opinion it was not due to poison".
- **Suggested fix:** "… and, in the version Plutarch follows, “he put his pen to his mouth and bit it”; the poison was already working when he walked out past the altar and fell. Plutarch adds that the stories of how he took the poison were many and differed.[^20]" Alternatively, put a {legend} or {debated} label on the detail.
- **Confidence:** medium

### 5. Plutarch only suggests, with "unless", that the "take/retake" joke was aimed at the Halonnesus speech
- **Claim:** "Plutarch took a comic poet's jest about taking and retaking to be aimed at Demosthenes, who told the Athenians “not to take the island from Philip, but to retake it”.[^34]"
- **Problem:** Plutarch says plainly that a comic poet mocked Demosthenes' fondness for antithesis. The link to the Halonnesus speech is put forward only as a possibility: "Unless, indeed, this, too, was a jest of Antiphanes upon the speech…". The article's real point still stands: Plutarch treats *On Halonnesus* as Demosthenes' speech.
- **Evidence:** tlg0007.tlg054 9.5: "Unless, indeed, this, too, was a jest of Antiphanes upon the speech of Demosthenes concerning Halonnesus, in which the orator counselled the Athenians not to take the island from Philip, but to retake it."
- **Suggested fix:** "Plutarch wondered whether a comic poet's jest about taking and retaking was aimed at Demosthenes' speech on Halonnesus, in which, he says, the orator told the Athenians “not to take the island from Philip, but to retake it”.[^34]"
- **Confidence:** medium (the substance is right; the wording overstates Plutarch's certainty)

### 6. "Universally accepted" for S sits badly beside the article's own account of a long quarrel
- **Claim:** "S is “universally accepted as having the greatest authority for the corpus Demosthenicum”.[^27]" Compare variants: "Editors have long quarrelled over whether to follow S or the other old manuscripts, A, F and Y."
- **Problem:** The quotation does appear word for word in McGay's Fordham abstract. But the article presents it in its own voice, and its own sources disagree. The BMCR review (source 28) describes a past controversy over preferring A F Y against S or the reverse. Wikipedia (*Works of Demosthenes*) says S is "considered to be the most reliable by many scholars". The same abstract also adds that for speech 54 "S does not always bear the correct reading".
- **Evidence:** https://research.library.fordham.edu/dissertations/AAI3169389/ ("Although universally accepted as having the greatest authority … for the text of or. 54 S does not always bear the correct reading"). https://bmcr.brynmawr.edu/2006/2006.09.28/ ("Bevorzugung … etwa A F Y gegenüber S oder umgekehrt … Kontroverse").
- **Suggested fix:** "Many scholars count S the most authoritative copy; one study of the manuscripts calls it “universally accepted as having the greatest authority for the corpus Demosthenicum”.[^27]"
- **Confidence:** low (a matter of attribution, not a false fact)

### 7. Source 1 dates the embassy to 347, not 346
- **Claim:** "In 346 Athens made peace with Philip, the Peace of Philocrates,[^7] and Demosthenes sat on the embassy that went to Philip's court with Aeschines and Philocrates.[^1]" Timeline: `{ year: -346, … "Demosthenes serves on the embassy to Philip", src: [7, 1, 8] }`
- **Problem:** The article's 346 is right by modern reckoning: the embassies went in 346, in the archon year 347/6. But the cited source 1 says "In 347 BC, an Athenian delegation, comprising Demosthenes, Aeschines and Philocrates, was officially sent to Pella". So the footnote does not support the year as written. Aeschines 34–35 (source 8) gives no year.
- **Evidence:** Wikipedia, Demosthenes: "In 347 BC, an Athenian delegation, comprising Demosthenes, Aeschines and Philocrates, was officially sent to Pella to negotiate a peace treaty."
- **Suggested fix:** No change to the wording is needed. Either accept that source 7 carries the year, or add a source that dates the embassies to 346.
- **Confidence:** low

---

**Checked, no problems found in:**
- Against Aphobus I 4: "nearly fourteen talents", "a son, myself, aged seven", a sister of five (the quotations and the paraphrase match).
- [Plutarch], Lives of the Ten Orators 8.1: the deme Paeania; orphaned at seven with a five-year-old sister; "Delivery" three times; "Sixty-five genuine speeches of Demosthenes are current".
- Plutarch, Dem. 4.2–8.4: the guardians; first speeches jeered, "confused by long periods"; the underground study for "two or three months"; the half-shaved head; Pytheas and the "lamp wicks". 6.1: "not even a small fraction of his patrimony", practice and confidence.
- Plutarch, Dem. 11.1–2: Demetrius of Phalerum told by Demosthenes in old age; pebbles; running and steep places.
- First Philippic 10–11 (both quotations). Third Philippic 65. On the Crown 169 (Elatea), 208 (the oath; Greek as quoted), 54–55 (the indictment), 118 (Ctesiphon's decree), 167 (Philip's letter to the Thebans). On Halonnesus 5.
- Aeschines, On the Embassy 34–35 (the breakdown before Philip), rightly marked {debated} as a rival's story.
- Plutarch, Dem. 15.1–3 (Apollodorus, Phormio, the cutlery-shop; the doubtful trial; Idomeneus' thirty votes). 20.2–21.2 (flight at Chaeronea; Philip's drunken chant; the eulogy). 24.1–2 (under a fifth of the votes; Rhodes and Ionia). 25.1–27.6 (Harpalus' cup and twenty talents; the Areopagus; fifty talents; escape; owl, serpent and people; the trireme; the altar of Zeus the Saviour for fifty talents). 28.1–29.5 (Demades' motion; Calauria; Archias; the letter; falling past the altar). 30.5 ("utter nonsense"; the verses).
- Plutarch, Cicero 48.4 (Cicero named them Philippics).
- Longinus 16.2 (the Marathon oath; «καθάπερ ἐμπνευσθεὶς ἐξαίφνης ὑπὸ θεοῦ») and 12.4 (thunderbolt against Cicero's spreading fire).
- Wikipedia, Demosthenes: 384–322; "widely considered one of the greatest orators of all time"; sword-maker of Paeania; of age in 366; Against Aphobus 363–362; damages of ten talents; only part recovered; the warning that the training stories may not be factual; On the Navy 354; First Philippic 351–350; Olynthiacs 349; Aeschines the greatest rival; False Embassy 343 and thirty votes; the Theban alliance; fought "as a mere hoplite"; Ctesiphon 336, trial 330; Harpalus 324; fine of 50 talents; Grote ("innocent") against Hansen ("it appears likely … that he was justly found guilty"); Cicero's Philippics inspired; Longinus' thunderbolt; "publishing many or even all of his orations"; texts in Athens and Alexandria; 61 orations, 56 prologues, six letters "hotly debated"; Blass's five disputed works; Vince's five spurious speeches including On the Treaty with Alexander.
- Wikipedia, Works of Demosthenes: 258 Byzantine manuscripts and 21 of extracts; F Marcianus 416, A Monacensis (Augustanus) 485, Y Parisinus 2935, S Parisinus 2934; the Aldine from three manuscripts of F's family, not F, hence the order; Callimachus and the prologues; Schaefer's 29; Third Philippic additions; Hegesippus by "virtually everyone"; speech 12 and MacDowell.
- Wikipedia, Third Philippic (341). Wikipedia, On the Crown (336 / 330). Wikipedia, Battle of Chaeronea (Peace of Philocrates 346; August 338). Wikipedia, Apollodorus of Acharnae (seven speeches, six to a pseudo-Demosthenes, often Apollodorus). Wikipedia, Didymus (the "scrupulous compiler", not an original researcher).
- Wikipedia, editiones principes: Demosthenes, Aldus, Venice, 1504; Epistolae in the 1499 Aldine *Epistolae diversorum*, edited by Musurus.
- Princeton papyri page: AM 9051, P. Oxy. XI 1377, I c. BC, Oxyrhynchus, On the Crown 167–169, published 1915. A search also confirmed it begins inside Philip's letter at 167.
- BMCR 2007.04.16: Didymus active in the second half of the 1st c. BC; papyrus with orations 9, 10, 11, 13; the commentary was little known before 1904; "the only extensive ancient commentary on a Greek prose author"; a student in the late 2nd or early 3rd c. AD; no pronounced affinity, like other papyri; Harding's view; Clarendon Ancient History Series 2006.
- BnF Grec 2934: end of the 9th c.; parchment; 534 ff.; Constantinople "bien plus vraisemblable"; Sosandra in Bithynia in the 13th c.; Ridolfi, Catherine de Médicis, the royal library at the very end of the 16th c.; Omont's facsimile 1892–1893.
- BMCR 2006.09.28: S A F Q Y plus P (useful only at a few places in speeches 19–24); S against A F Y decided case by case; scriptio plena where S and A or one of them have it, so more hiatus shows on the page; strict hiatus removal since the 19th c., without basis in medieval or ancient copies; testimonia; Butcher–Rennie 1903–1931; Budé 13 vols 1924–1987; Dilts 4 vols 2002–2009.
- BMCR 2001.09.19: the documents spurious, found in the major manuscripts and some papyri; Yunis excludes them; Worthington doubts any were included; MacDowell's Dem. 21 (Oxford 1990) and Dem. 19 (Oxford 2000); Cambridge Greek and Latin Classics.
- BMCR 2009.12.13 (Harris, Speeches 20–22, Oratory of Classical Greece 12, Univ. of Texas Press, 2008). BMCR 2014.04.48 (Worthington, OUP 2013, "a flawed one").
- Quintilian 10.1.76 (Latin Library): "longe princeps Demosthenes ac paene lex orandi fuit".
- Perseus file headers in pipeline/.cache: Butcher, Clarendon 1903 and 1907; Rennie 1921 and 1931; translations by Murray, the Vinces and the DeWitts (Harvard UP / Heinemann, 1926–1949).
- Timeline years and kinds; approx marks on -50, -40, 200, 890, 1250 are appropriate. Certainty labels on the training stories ({legend}), the embassy breakdown and Harpalus ({debated}) are appropriate.

**Could not verify / not checked in depth:**
- The original Reynolds and Wilson wording behind the Wikipedia Didymus sentence (Wikipedia was read, not the book).
- The Budé count of 13 volumes (1924–87): taken from the BMCR review only, not checked against a Budé catalogue.
- McGay's dissertation itself (only the abstract was read).
- "Olynthus, an ally of Athens" was not traced to a specific line of source 1. It is standard (the alliance of 349), but the footnote was not confirmed sentence by sentence.

**Findings: 7** (2 high-confidence, 3 medium, 2 low).

---

## Fact check: Plutarch (web/src/wiki/authors/tlg0007.ts)

Checked 2026-10-02. All `cite` sources were run through `scripts/passage.ts`, the TEI headers were read for the edition claims, and every `url` source was opened (Wikipedia: Plutarch, Parallel Lives, Moralia, Pseudo-Plutarch, Q. Sosius Senecio, editiones principes; SEP; Perrin on LacusCurtius; Womack; BMCR 2017.06.39 and 2001.05.08; Hoffmann on Persée; the Manton PDF; WorldCat; the REA review; Waterfield's page).

### 1. Consolation to Apollonius stated flatly as not Plutarch's

- **Claim:** "So are the *Consolation to Apollonius*, *Whether Fire or Water is More Useful* and the *Greek and Roman Parallel Stories*.[^28]" (following "...are counted among the works of an unknown 'Pseudo-Plutarch'")
- **Problem:** Wikipedia's Pseudo-Plutarch page does list it. But scholars disagree about who wrote the *Consolatio ad Apollonium*, and the article presents the matter as settled with no {debated} label. The Scroll's own Loeb introduction to this work (Babbitt, the text the article links) says only that it has "fallen under suspicion as being perhaps not the work of Plutarch". It then argues against the main stylistic objection: "for every departure from accepted Plutarchean style a striking instance of conformity ... may be cited". The fire-or-water essay is in a different position: its Loeb editors (Cherniss and Helmbold) say Sandbach "has shown conclusively that it cannot be genuine", so the claim is safe for that work.
- **Evidence:** `npx tsx scripts/passage.ts tlg0007.tlg076 1`: Babbitt's introduction, as quoted above. `tlg0007.tlg128 1`: Cherniss and Helmbold's introduction.
- **Suggested fix:** "So are *Whether Fire or Water is More Useful* and the *Greek and Roman Parallel Stories*.[^28] {debated} The *Consolation to Apollonius* is often counted with them too,[^28] though its Loeb translator, F. C. Babbitt, thought the case against it weak." If you add that, also add the Apollonius introduction (tlg0007.tlg076 1) as a source.
- **Confidence:** medium

### 2. The procuratorship notice is not in "Eusebius' Chronicle" as we have it, but in Syncellus

- **Claim:** "He was still alive in 119, the year in which, by a notice in Eusebius' *Chronicle*, Hadrian made him procurator of Achaea;[^3]"
- **Problem:** The cited source qualifies this. The SEP says the notice is "Eusebius' *Chronicle* in Syncellus": it survives in the 9th-century Byzantine chronicler George Syncellus. Wikipedia (source 1) gives it as "according to the 8th/9th-century historian George Syncellus". Dropping "in Syncellus" makes the evidence look earlier and more direct than it is.
- **Evidence:** https://plato.stanford.edu/entries/plutarch/: "must have died after 119 CE, the date at which he was appointed procurator (epitropos) of Achaea by Hadrian" (Eusebius' *Chronicle* in Syncellus). https://en.wikipedia.org/wiki/Plutarch: "According to the 8th/9th-century historian George Syncellus, late in Plutarch's life, Emperor Hadrian appointed him nominal procurator of Achaea."
- **Suggested fix:** "...the year in which, by a notice from Eusebius' *Chronicle* preserved by the Byzantine chronicler George Syncellus, Hadrian made him procurator of Achaea;[^3]"
- **Confidence:** medium-high

### 3. "Stayed on at Athens long enough to become an Athenian citizen" is not in the source

- **Claim:** "He stayed on at Athens long enough to become an Athenian citizen, and travelled widely, to Rome and to Alexandria.[^3]"
- **Problem:** The SEP says only that he "became an Athenian citizen" (citing *Table Talk* 628A). It says nothing about how long he stayed in Athens, and nothing about citizenship being earned by living there. The cause-and-effect ("long enough to") is the article's own addition.
- **Evidence:** https://plato.stanford.edu/entries/plutarch/: "He became an Athenian citizen (Quaest. Conv. 628A) ... travelled extensively, including Rome (Demetrius 2) and Alexandria".
- **Suggested fix:** "He became an Athenian citizen, and travelled widely, to Rome and to Alexandria.[^3]"
- **Confidence:** medium

### 4. Who sponsored his Roman citizenship: the sentence can be read as Vespasian

- **Claim:** "About AD 70 he visited Rome with Lucius Mestrius Florus, an associate of the new emperor Vespasian, who sponsored him as a Roman citizen.[^1]"
- **Problem:** Wikipedia names Florus as the sponsor. As written, "who" comes straight after "Vespasian", so a reader can easily take the emperor to be the sponsor. That is a factual misreading the sentence invites, not only a matter of style.
- **Evidence:** https://en.wikipedia.org/wiki/Plutarch: "His sponsor was Lucius Mestrius Florus, who was an associate of the new emperor Vespasian".
- **Suggested fix:** "About AD 70 he visited Rome with Lucius Mestrius Florus, an associate of the new emperor Vespasian; it was Florus who sponsored him as a Roman citizen.[^1]"
- **Confidence:** medium (on the ambiguity; the underlying fact is right)

### 5. Hoffmann's hedge on the scribe of Parisinus gr. 1671 is dropped

- **Claim:** "Parisinus gr. 1671 was written by a single professional scribe, who finished on 11 July 1296" (and in the timeline: "A professional scribe finishes Parisinus gr. 1671 on 11 July").
- **Problem:** Hoffmann is sure there was a single scribe and sure of the date. He says only that the scribe "seems to have been" a professional calligrapher.
- **Evidence:** https://www.persee.fr/doc/scrip_0036-9772_1983_num_37_2_1319: «l'œuvre d'un seul et même scribe, qui semble avoir été un calligraphe de métier et qui a achevé son travail le 11 juillet 1296».
- **Suggested fix:** "was written by a single scribe, apparently a professional calligrapher, who finished on 11 July 1296". In the timeline: "A single scribe finishes Parisinus gr. 1671 on 11 July..."
- **Confidence:** medium (small, but it is a dropped qualification of the kind the brief asks about)

### 6. Goodwin's *Plutarch's Morals* first came out in 1870, not 1874

- **Claim:** "W. W. Goodwin (ed.), *Plutarch's Morals*, 5 vols (Boston, Little, Brown, 1874).[^5]"
- **Problem:** The researcher "corrected" the draft's 1870 to 1874, because 1874 is the date in the Scroll's file headers. But Goodwin's five-volume edition, with Emerson's introduction, was first published by Little, Brown in 1870 (copyright 1870; HathiTrust records an 1871 issue). 1874 is the date of the printing the Scroll's files came from, not the date of the edition. Listing it as "1874" is defensible only as a description of that copy.
- **Evidence:** TEI headers (e.g. `tlg0007.tlg111.perseus-eng2.xml`) give "Boston, Little, Brown, and Company ... 1874". Search results (Online Library of Liberty, HathiTrust record 001913607, Wellcome Collection) give the first edition as Boston, Little, Brown, 1870, "entered according to Act of Congress in 1870".
- **Suggested fix:** "W. W. Goodwin (ed.), *Plutarch's Morals*, 5 vols (Boston, Little, Brown, 1870; the Scroll's copies are dated 1874)."
- **Confidence:** medium (I did not open a scan of the 1870 title page myself; the 1870 date rests on library and catalogue records found by search)

### 7. The *E at Delphi* quotation is set at Delphi, not Athens

- **Claim:** "As a young man he studied philosophy at Athens with a Platonist called Ammonius, while Nero was in Greece, in 66/67.[^3,1] He remembered it long afterwards: in his essay *The E at Delphi* he recalls what, 'when Nero was here some years ago, I had heard Ammonius and others discussing'.[^4]"
- **Problem:** In the passage, "here" is Delphi: Plutarch is seated with visitors near the temple when he recalls it. The quotation is about hearing Ammonius at Delphi during Nero's visit. The article joins it ("remembered it") to studying at Athens, so readers may think the quotation describes the Athens schooling. Each fact is sourced (Athens from Wikipedia and the SEP, the remark from the text), but they are run together. Wikipedia mentions Delphi separately: "He attended the games of Delphi where the emperor Nero competed".
- **Evidence:** `tlg0007.tlg090 1`: "I found them seats, therefore, near the temple ... influenced as I was by the place ... I remembered what, when Nero was here some years ago, I had heard Ammonius and others discussing".
- **Suggested fix:** "He remembered those days long afterwards: in his essay *The E at Delphi*, sitting by the temple, he recalls what, 'when Nero was here some years ago, I had heard Ammonius and others discussing' (here being Delphi, which Nero visited)."
- **Confidence:** low-medium

---

**Checked, no problems found in:**
- Chaeronea about 30 km east of Delphi; lived most of his life there (Wikipedia). The small-city and late-Latin quotations and "this fifth book" (*Demosthenes* 2.1–3.1).
- Ammonius while Nero was in Greece 66/67, birth 45–47 on the "not more than twenty" assumption (correctly marked {debated}), travels to Rome and Alexandria, 227 works in the Lamprias catalogue "supposedly" by his son, the name *Moralia* from eleven ethical works in a 14th-century manuscript (SEP).
- Florus and Vespasian, c. AD 70; the Roman name "possibly" (marked {debated}); Autobulus, Timon, Lamprias, Timoxena, at least four sons and a daughter, two dying in childhood; two priests at Delphi c. 95; "nominal" procurator (Wikipedia).
- *Consolation to His Wife*: born after four sons, named after her mother, "the two years of her life" (Goodwin/Creech, Scroll).
- "Serving the Pythian Apollo for many Pythiads" (*An seni* 17); the Pythian discourses, the sons and visitors by the temple (*E at Delphi* 1); Great Pan, Thamus, Paxi, Tiberius's inquiry, told by a speaker, Philip (*Def. orac.* 17), correctly marked {legend}.
- 23 pairs and 4 single Lives; the emperor Lives with only *Galba* and *Otho* left; lost Heracles, Philip II, Epaminondas, the Scipios (Wikipedia). "Probably" the early 2nd century, Epaminondas–Scipio lost, the Latin edition at Rome about 1470 (Wikipedia, Parallel Lives).
- Senecio a senator, consul in 99 and 107, the *Theseus* dedication; the map edges and Lycurgus–Numa written first (*Theseus* 1.1–1.2); "not Histories but Lives" (*Alexander* 1.2); the mirror (*Timoleon* preface in Perrin's arrangement).
- The tenth book (*Pericles* 2.4) and the twelfth (*Dion* 2.7); in the Scroll's catalogue order *Pericles–Fabius* really is the fifth pair and *Demosthenes–Cicero* comes near the end.
- 78 works; the Aldine *Moralia*, March 1509, with Erasmus and Aleandro as proofreaders; Stephanus 1572 and fourteen books; the Ten Orators, Opinions of the Philosophers, On Fate and On Music as Pseudo-Plutarch (Wikipedia, Moralia). Ducas as editor of 1509; Junta, Florence, 1517 (editiones principes list).
- *On the Eating of Flesh* introduction: a youthful work, "a foible...", the excerptor's "stupid interpolations" and the extract from another work, Shelley in 1813 and the lost translation, the eighteen works missing from the Lamprias catalogue, the Symposiacs missing too. *On the Malice of Herodotus* 1: Boeotians and Corinthians, the "defend our ancestors" quotation.
- Perrin's introduction: Sg 10th century, fifteen Lives; S 11th century, sixteen Lives, known as the best since 1870; Paris 1671 A, 1672 C, 1674 D "of supreme importance"; 1517 Junta from inferior Florentine manuscripts; Aldine 1519 from better Venetian ones; "the order of the Lives ... is not the original one"; Amyot 1559, North 1579, and Shakespeare's three plays.
- Amyot 1559 and 1572, North 1579 from Amyot, Holland 1603 "complete ... from the original Greek", Dryden 1683, Montaigne's 400+ references, Emerson's "a bible for heroes" (Wikipedia).
- Cleopatra's barge (*Antony* 26.1) and North's wording (Womack). Womack actually argues the speech does more than versify North, but "closely follows" is fair.
- P.Oxy. LXXXII (2016): the first *Alexander* on papyrus, "some text-critical interest" (BMCR 2017.06.39).
- Hoffmann: 1671 finished 11 July 1296, revised by Planudes, the three-volume Lives plus the *Moralia*; 1672 at least fifty years after Planudes' death, long thought to be from his workshop. Manton: 1672 the only manuscript with all 78, made at Planudes' prompting, "may be dated soon after 1302"; the 69 titles in Marc. 481 in 1302. Correctly marked {debated}.
- Dana (BMCR 2001.05.08): modern scholarship from Ziegler's 1907 study, the study of all the manuscripts, Teubner vol. I in 1914, Gärtner's fifth edition (Saur, 2000), two lines of transmission only for vol. I.
- *Face in the Moon*: "certainly mutilated at the beginning ... despite statements to the contrary" (Cherniss). *Education of Children*: "generally believed ... cannot have been written by him" (Babbitt).
- Editions: Perrin 11 vols 1914–26 (vol. 1 is 1914 in the headers); Bernardakis Teubner vols dated 1888–95 in the headers (vol. 3 1891, vol. 5 1893, vol. 6 1895); Babbitt, Fowler, Cherniss and Helmbold in the Loeb headers; Sandbach vol. XV *Fragments* 1969 (WorldCat); Budé tome XII, Flacelière and Chambry, 1976 (REA 85, reviewed by Puiggali); Waterfield and Stadter, OWC 1998.
- The cts links: every linked work id resolves to the named work under Plutarch in the catalogue (tlg076, 078, 085, 089, 090, 091, 092, 101, 108, 112 ref 1.0.1, 121 ref 1.1, 126, 128, 129).
- The timeline matches the prose and its sources. The years, kinds and approx flags are appropriate.

**Could not verify / not independently checked:**
- That Erasmus actually proofread the 1509 Aldine *Moralia*. This rests on Wikipedia only. Erasmus was in Venice in 1508 and the claim is widely repeated, but I did not open a primary or scholarly source.
- Whether the Latin *Lives* of about 1470 (Rome) is correctly dated. Wikipedia only; I did not check an incunable catalogue.
- Holland 1603 as "from the original Greek": Wikipedia says so. Some scholars note that Holland also leaned on Latin and French versions. I did not research this.
- Goodwin 1870 (finding 6): based on search-result catalogue records, not a scan I viewed.

**Findings: 7.** By confidence: 1 medium-high (#2), 5 medium (#1, #3, #4, #5, #6), 1 low-medium (#7). None is a serious factual error. They are dropped qualifications, one attribution presented as settled when it is disputed, one unsupported inference, and one edition date.

---

## Fact check: Xenophon (web/src/wiki/authors/tlg0032.ts)

Checked 2026-10-02. Every `cite` source was run through `scripts/passage.ts`; the web sources were fetched (Wikipedia: Xenophon, Anabasis, Hellenica, Cyropaedia, Ways and Means, Constitution of the Athenians, List of editiones principes; Encyclopaedia Iranica; Pearse; Pinakes; Internet Archive; the four BMCR reviews; Harvard Book Store). The GRBS PDFs (Stadter 1976, Schmoll 1990, Cirignano 1993, Paradeisopoulos 2013) were downloaded and read. The Loeb note at Anabasis 7.8.25 was read in the Perseus file.

The article is in good shape. None of the findings is a plain factual error. All four are about wording that says a little more than the source does.

### 1. Diogenes' "preface to each book" said for certain to be the bracketed summaries

- **Claim:** "Brownson brackets those short summaries too, as at [2.1.1](cts:tlg0032.tlg006:2.1.1). Yet they were already in the text Diogenes knew: the *Anabasis*, he says, has “a preface to each separate book but not one to the whole work”." The text also says: "the Loeb's note at 7.8.25 says that these figures, like the summaries at the head of each book, …"
- **Problem:** The article states as fact that Diogenes' "prefaces" are the summaries that survive. Diogenes does not describe them, so this is an inference. It is also an imperfect fit: the surviving summaries open only books 2, 3, 4, 5 and 7. Book 6 starts straight into the story ("After this, while they delayed at Cotyora…"), with no brackets. So "the summaries at the head of each book" is not accurate either. The Loeb itself says "the summaries prefixed to the several books", which is vaguer. The {debated} label is right, but the sentence under it states the inference as certain.
- **Evidence:** Diogenes Laertius 2.6.57: «Τήν τʼ Ἀνάβασιν, ἧς κατὰ βιβλίον μὲν ἐποίησε προοίμιον, ὅλης δὲ οὔ» (Hicks: "with a preface to each separate book but not one to the whole work"). There is no description of what these prefaces were. Anabasis 6.1.1 in the Scroll has no summary; 2.1.1, 3.1.1, 4.1.1, 5.1.1 and 7.1.1 do. The Loeb note in tlg0032.tlg006.perseus-eng2.xml at 7.8.25 reads "like the summaries prefixed to the several books".
- **Suggested fix:** "…as at 2.1.1. Diogenes, though, seems to have known them: the *Anabasis*, he says, has “a preface to each separate book but not one to the whole work”." Also change "like the summaries at the head of each book" to "like the summaries at the head of most of the books".
- **Confidence:** medium

### 2. Demetrius of Magnesia's doubt: the item Diogenes lists is the "Constitution of the Athenians and Lacedaemonians"

- **Claim:** "Doubts are old: Diogenes Laertius lists it, and adds that Demetrius of Magnesia, a writer of the first century BC, denied it was Xenophon's.[^25,51]"
- **Problem:** Diogenes lists one combined item, "Constitution of the Athenians and Lacedaemonians", and Demetrius' doubt ("ἥν", singular) refers to that item. The source does not separate the Athenian pamphlet from the *Constitution of the Lacedaemonians*. Wikipedia applies the remark to the pseudo-Xenophontic *Athenian Constitution* alone, but Diogenes' own wording is less specific. The researcher's log says that "doubts about the … Constitution of the Lacedaemonians" were left out. Diogenes' sentence may cover that work as well.
- **Evidence:** DL 2.6.57: «Ἀγησίλαόν τε καὶ / Ἀθηναίων καὶ Λακεδαιμονίων Πολιτείαν, / ἥν φησιν οὐκ εἶναι Ξενοφῶντος ὁ Μάγνης Δημήτριος» (Hicks: "The Constitutions of Athens and Sparta. Demetrius of Magnesia denies that the last of these works is by Xenophon"). Wikipedia, Constitution of the Athenians: Diogenes "notes that the first-century BC historian Demetrius of Magnesia disputed Xenophon's authorship."
- **Suggested fix:** "Doubts are old: Diogenes Laertius lists a “Constitution of the Athenians and Lacedaemonians” among his works, and adds that Demetrius of Magnesia, a writer of the first century BC, denied that it was Xenophon's."
- **Confidence:** medium

### 3. Why he was exiled: Diogenes gives both reasons

- **Claim:** "Pausanias gives the reason as his part in Cyrus' expedition, since Cyrus was the enemy of the Athenian people;[^22] Diogenes says it was for siding with Sparta.[^23]"
- **Problem:** At 2.51 Diogenes does say "for siding with Sparta". But in the next passage his own epigram on Xenophon's death gives the Cyrus reason: "condemned thee … to exile on account of thy friendship for Cyrus". The neat contrast between Pausanias (Cyrus) and Diogenes (Sparta) overstates the difference. This is minor, because the sentence is true as far as 2.51 goes.
- **Evidence:** DL 2.6.51 (source 23): "About this time he was banished by the Athenians for siding with Sparta." DL 2.6.58 (inside source 25's range): "the countrymen of Cranaus and Cecrops condemned thee, Xenophon, to exile on account of thy friendship for Cyrus".
- **Suggested fix:** "…Diogenes says it was for siding with Sparta,[^23] though his own epigram on Xenophon blames his friendship with Cyrus.[^25]"
- **Confidence:** medium (that the text is incomplete); low (that it matters)

### 4. "He died, Diogenes says, at Corinth": Diogenes is quoting Demetrius, and gives a different year

- **Claim:** "He died, Diogenes says, at Corinth, “obviously at an advanced age”.[^25] Most modern scholars put his death in 355 or 354 BC.[^3]" The timeline adds: "Dies, probably in 355 or 354 BC, at Corinth by Diogenes' account".
- **Problem:** Diogenes cites Demetrius of Magnesia for Corinth. In the same sentence he cites Ctesiclides for a death in Ol. 105.1 (360/359 BC), which conflicts with the modern date and with *Ways and Means* (355). Leaving out the exact year was deliberate. Still, "Diogenes says" hides that this is Demetrius' report, and a reader who opens source 25 will see a different year right beside it. This is low priority.
- **Evidence:** DL 2.6.56: "He died, according to Ctesiclides of Athens … in the first year of the 105th Olympiad, in the archonship of Callidemides… He died at Corinth, as is stated by Demetrius of Magnesia, obviously at an advanced age."
- **Suggested fix:** "He died at Corinth, Diogenes says, citing Demetrius of Magnesia, “obviously at an advanced age”. Diogenes' date, 360 BC, is too early, since *Ways and Means* was written in 355. Most modern scholars put his death in 355 or 354 BC." A shorter alternative is to keep the current wording with "citing Demetrius of Magnesia".
- **Confidence:** high (on what Diogenes says); low (on whether it needs changing)

---

**Checked, no problems found in:**
- Anabasis 3.1.4–7 (Proxenus' invitation, Socrates, Delphi, the question asked wrongly), 3.1.47 ("Xenophon the Athenian in place of Proxenus"), 1.7.10 (10,400 hoplites and 2,500 peltasts), 1.8.27, 2.6.1 (beheaded), 4.7.21–25 (Theches, the shout, the rearguard, the horse, tears, cairn), 5.3.7–13 (Scillus, Megabyzus, the temple "small as compared with great", cypress against gold, the festival and hunting), 7.7.57 ("not yet had sentence of exile"), 7.8.24 (Thibron).
- Anabasis 2.2.6, 5.5.4 and 7.8.25–26 are all in square brackets in Brownson. The Loeb note at 7.8.25 ("must have been the contribution of a late editor") is there word for word in the Perseus file.
- Diogenes 2.48 (the narrow passage, the stick, "Then follow me … and learn", first to publish the conversations), 2.51–52 (the Megabyzus deposit, Scillus, "hunted, entertained his friends, and worked at his histories"), 2.53–55 (Elis takes Scillus, the flight to Corinth, the sons sent to serve Athens, Gryllus with the cavalry at Mantinea, the garland, "I knew my son was mortal", the march in the year before Socrates' death), 2.56–59 (some forty books, the list of works, the Attic Muse, Plato, Thucydides' history, Istrus on Eubulus' two decrees).
- Memorabilia 1.1.1 and 4.8.11; Apology 1–2 (others had written; Hermogenes); Symposium 1.1; Oeconomicus 1.1; Hellenica 1.1.1, 3.1.2 (Themistogenes) and 7.5.26–27; Cyropaedia 1.1.3 and 8.7 (a very old man in Persia, his sons and friends, "covered himself over, and so died"); Herodotus 1.205–214 (Tomyris, Cyrus falls, the head in a skin of blood); Ways and Means 4.1; On Horsemanship 1.1 (Simon).
- Plutarch, Agesilaus 18.1 and 20.2; Plutarch, De gloria Ath. 1 (Themistogenes, "referring to himself in the third person"); Pausanias 5.6.5–6 (Spartans gave Scillus; exiled for joining Cyrus; the Elean trial, pardon, tomb and Pentelic marble statue).
- Arrian, Anabasis of Alexander 1.12.3: the march up of the Ten Thousand and the march down that Xenophon led are "far more famous because of Xenophon" than Alexander's deeds; the paraphrase is fair. Arrian, On Hunting 1.1–4: same name, same city, hunting, generalship and wisdom; filling the gaps.
- Stadter 1976: he imitated Herodotus and Thucydides "but most of all Xenophon"; Arrian was "called Xenophon"; footnote 2 has "part or all" and "the very dubious first chapter", and says Arrian accepted the whole work.
- Paradeisopoulos 2013: 7.8.25 often thought an interpolation because its items do not seem historically accurate and it names nations missing from the narrative; he concludes the four paragraphs (2.2.6, 5.5.4, 7.8.25, 7.8.26) were "probably … not interpolation but his own".
- Schmoll 1990: five manuscripts of the Apology; Vat. gr. 1335 (A) parchment, 246 folios, its contents, *Ways and Means* missing its last thirty words, Diller tenth century against eleventh or twelfth; Orsini's bequest; "the earliest extant witness for its Xenophontic contents"; "an editor needs only A"; Marchant and others relied on faulty collations of one or two manuscripts; "the longer works … await reinvestigation".
- Cirignano 1993: two families of the shorter works, one headed by A and one by a lost hyparchetype; the Symposium only in the second; 23 manuscripts and 25 texts.
- Pearse: Anabasis families c and f, the old preference for c, the papyri; Hellenica Vienna papyrus of the third century confirming B and keeping right readings; B = Paris gr. 1738, early 14th century. Pinakes: Paris gr. 1640, dated 1320, *Cyropaedia* and *Anabasis*, owned by Lascaris, Ridolfi and Catherine de' Medici. Pearse's "9-10" for this manuscript is wrong, and the article rightly does not use it.
- First printed editions: Hiero (Florence, 1494–96, Lascaris), Hellenica (Aldus, Venice, 1503, confirmed by the Folger catalogue record of the 1503 Aldine *Xenophontis omissa*), Giunta 1516 without the Apology, Agesilaus or Ways and Means, Reuchlin at Hagenau 1520, Aldine 1525 with *Ways and Means* and the Athenian Constitution.
- Wikipedia: about 430 BC, Erchia, Gryllus; "most modern scholars" 355 or 354; the Anabasis ends in 399 with Thibron; Phillips and Willcock 1999; 401 BC, Cunaxa, treachery, the march north, "one of the first unabridged texts"; the Themistogenes "most scholars" sentence is tagged "citation needed", but the article names Wikipedia as its source. Hellenica 411–362, no preface, first part to 2.3.10 "probably" in the mid-380s. Cyropaedia: partly fictional, Scipio "is said to have", Alexander, Caesar, mirrors for princes, Machiavelli, Filelfo 1467, Barker 1567 "first full translation into English". Ways and Means: 355, "believed to be" the last work. Old Oligarch: Gilbert Murray, 443–406.
- Iranica (Tuplin, 2000, updated 2013): Coronea 394 against Athenians; "Whether this caused or reflected formal exile is disputed, but exiled he certainly was"; over 20 years at Scillus; 371 and Corinth; Gryllus "an Athenian cavalryman at Mantinea (362)"; not known whether he returned; 14 works, all extant; the Agesilaus an encomium.
- Editions: Marchant's OCT dates (the file headers give 1900–1921); the Loeb translators and dates (Brownson's Hellenica 1918–21 and Anabasis 1921–22, Marchant 1923 and 1925, Todd 1923, Miller 1914, all from the file headers); Loeb 90 revised by Dillery 1998; Landmark Hellenika (Strassler, tr. Marincola, Pantheon, New York 2009); Landmark Anabasis (Brennan and Thomas, Pantheon 2021: the maps "extensive and helpful", "The translation is sound"); Flower 2012 (OUP); Cambridge Companion 2016 (fading in the 20th century, "banner decades" in the '90s and '00s); Paap 1970 (Brill, Leiden, vol. 18).
- Timeline years, kinds and `approx` flags all agree with the sources. The 1467 Filelfo entry is the date of the translation, not of its printing (the first printed edition is reported as 1477). It sits under "print", which the type defines as "printed texts, translations and modern editions", so it passes.
- The certainty labels are right: the meeting with Socrates and the garland are {legend}; the exile, the Elean version, the interpolations, On Hunting and the stages of the Hellenica are {debated}.

**Could not verify:**
- Paap's book (only the catalogue record was seen), so not exactly which works its papyri cover beyond the title.
- The Huitink and Rood Classical Review page (not opened; the title and series are well known and the URL slug matches).
- The 1477 date for the first printing of Filelfo's Latin Cyropaedia rests on one search result and is not used by the article.
- Whether the 1516 Giunta edition really lacked the Athenian Constitution. The article implies it did, following the Wikipedia list, and no second source was checked.

**Findings: 4** (none high-severity; #1 and #2 medium, #3 and #4 low).

---

## Fact check: Aristophanes (web/src/wiki/authors/tlg0019.ts)

Checked 2026-10-02. I read every passage cited from the Scroll with `scripts/passage.ts` and fetched all the Wikipedia pages as wikitext. I also read BMCR 2013.08.48, 2008.07.50, 1999.05.17 and 1994.03.26, the Bridwell exhibit, Murray's Frogs notes on Wikisource, Grenfell and Hunt's *Oxyrhynchus Papyri* II (archive.org text), and the Perseus TEI headers in `pipeline/.cache/corpus/perseus/data/tlg0019`.

### 1. The Hall and Geldart Oxford text dates from 1900, not 1906
- **Claim:** "For a century the Oxford Classical Text was F. W. Hall and W. M. Geldart's (1906–07), the Greek text the Scroll uses." Also the timeline entry `{ year: 1906, kind: "print", what: "Hall and Geldart's Oxford Classical Text (1906–07), the Greek text in the Scroll" }`.
- **Problem:** The Oxford Classical Text by Hall and Geldart first came out in 1900 (vol. 1) and 1901 (vol. 2). 1906–07 is the date of the revised second edition. That second edition is the one Perseus, and so the Scroll, uses: the TEI headers give Clarendon Press 1906 for vol. 1 and 1907 for vol. 2. As written, the sentence and the timeline say the Oxford text began in 1906. The article's own source 40 says otherwise.
- **Evidence:** BMCR 2008.07.50 (source 40): "l'obsolète … édition oxonienne de Hall et Geldart (1900, revue 1906-1907)". The TEI `sourceDesc` for Clouds gives 1906, vol. 1, and for Frogs 1907, vol. 2.
- **Suggested fix:** "For a century the Oxford Classical Text was F. W. Hall and W. M. Geldart's (first published 1900, revised 1906–07; the Scroll uses the revised text)." Timeline: either move the pin to 1900 ("Hall and Geldart's Oxford Classical Text; revised 1906–07, the Greek text in the Scroll") or reword it as "Second, revised edition of Hall and Geldart's Oxford Classical Text (1906–07)…". In the editions list, the entry could say "2nd edn, 1906–07".
- **Confidence:** high for the 1900 first edition (the article's own source says it). Medium for the exact 1901 date of vol. 2, which I did not open a source for.

### 2. The year of Hyperbolus's ostracism is stated as certain
- **Claim:** "attacks on the politician Hyperbolus, who was ostracised in 416. That puts the revision somewhere between 421 and 416 BC."
- **Problem:** Nobody knows the exact year. Ancient historians put it anywhere from 417 to 415, and 416 or 415 is the usual modern view. Source 12 (Wikipedia, The Clouds) says 416 in its body, but its own opening gives the revision as "between 420 and 417 BC". So the end date of the revision is uncertain too. The paragraph is marked {debated}, but the ostracism date itself is given as fact.
- **Evidence:** Wikipedia, Hyperbolus: "Sometime between the years 417 and 415 BC, Hyperbolus was ostracised"; "In 416 or 415 BC, he was the last Athenian to be ostracised." Wikipedia, The Clouds, opening: "It was revised between 420 and 417 BC".
- **Suggested fix:** "…attacks on the politician Hyperbolus, who was ostracised in about 416 (the year is uncertain). That puts the revision somewhere between about 421 and 416 BC." The timeline pin (-418, approx, "probably between 421 and 416") can stay.
- **Confidence:** medium

### 3. Ameipsias' *Connus* came second, so it was not a "winner"
- **Claim:** "One of the winners, Ameipsias' Connus, also made fun of Socrates."
- **Problem:** Three plays competed. Cratinus' *Pytine* won, *Connus* came second and *Clouds* came third. Calling a second-placed play "one of the winners" is wrong. The source says only that it was one of the plays that beat the *Clouds*.
- **Evidence:** Wikipedia, The Clouds (source 12): "one of the plays that defeated The Clouds in 423 was called Connus, written by Ameipsias, and it too lampooned Socrates." Wikipedia, The Knights: Cratinus "won first prize with The Bottle … the same year Aristophanes came third and last with The Clouds".
- **Suggested fix:** "One of the two plays that beat it, Ameipsias' *Connus*, also made fun of Socrates."
- **Confidence:** medium-high

### 4. Whether P. Oxy. 212 is by Aristophanes is not certain
- **Claim:** "At Oxyrhynchus in 1897 Grenfell and Hunt found three scraps of a comedy by Aristophanes…". The timeline (year 100) says "A roll of one of his comedies is copied…".
- **Problem:** The first editors headed the text "ARISTOPHANES ?". They gave it to him only because one line seems to match a line Athenaeus quotes from an unnamed play of Aristophanes. They called any link to a particular play "quite hypothetical". The Wikipedia stub (source 35) leaves the doubt out.
- **Evidence:** Grenfell and Hunt, *Oxyrhynchus Papyri* II (1899), no. CCXII, "ARISTOPHANES ?": "Three fragments from a comedy… Fr. (b) 6 … coincides, so far as it goes, with a line quoted by Athenaeus 15, 701 b … from Aristophanes… It is not known from what play of Aristophanes Athenaeus was quoting." (archive.org, oxyrhynchuspappt02grenuoft)
- **Suggested fix:** "…three scraps of a comedy that is probably by Aristophanes (one line seems to match a line quoted from him), from a roll copied in the first or second century AD". Timeline: "A roll of a comedy, probably his, is copied…".
- **Confidence:** medium. Kassel and Austin may print it among Aristophanes' fragments, but I could not check how firmly they assign it.

### 5. "Mnesilochus" is not named in the play
- **Claim:** "*Women at the Thesmophoria* … sends Euripides' elderly relative Mnesilochus, disguised as a woman, to spy on a women's festival".
- **Problem:** The cited source qualifies this and the article drops the qualification. The text of the play never names the character. "Mnesilochus" comes from the list of characters in the manuscripts and from the ancient commentators, and modern editions often call him just "Kinsman" or "In-law".
- **Evidence:** Wikipedia, Thesmophoriazusae (source 22): "Euripides' aged in-law (never named within the play but recorded in the 'dramatis personae' as Mnesilochus)".
- **Suggested fix:** "…sends Euripides' elderly in-law (never named in the play; the ancient cast list calls him Mnesilochus), disguised as a woman, …".
- **Confidence:** medium (on what the source says: high)

### 6. Araros's productions "after his death" are uncertain and fit badly with the article's own dates
- **Claim:** "His son Araros was also a comic poet. He may have helped to produce *Wealth*, and he is thought to have put on two of his father's plays after his death."[^1]
- **Problem:** Source 1 does support the sentence ("thought to have been responsible for the posthumous performances of … Aeolosicon II and Cocalus"). But the same paragraph of Wikipedia dates *Cocalus* to 387, and the article says Aristophanes died "about 386". The ancient tradition, as other reference works summarise it, says Aristophanes himself brought out these last two plays in his son's name, soon after 388. That suggests he was still alive.
- **Evidence:** Wikipedia, Aristophanes: "…posthumous performances of the now lost plays Aeolosicon II and Cocalus, and it is possible that the last of these won the prize at the City Dionysia in 387." Wikipedia, Araros: "Aristophanes wrote two more comedies, Cocalus and Aeolosikon, which were brought out in the name of Araros, probably very soon after the above date [388]."
- **Suggested fix:** "…and he put on his father's last two plays, *Cocalus* and *Aeolosicon*, in his own name, perhaps after his father's death."
- **Confidence:** low-medium. I could not open the Greek hypothesis to *Wealth* itself; the APGRD page was blocked.

---

**Checked, no problems found in:**
- Passages in the Scroll, each read in Greek (with English where there is one) and matched to its sentence:
  - Acharnians 130–132 (eight drachmas, the private treaty for himself, his children and his wife), 377–382 (Cleon, "last year's comedy", the council chamber, lies) and 515–516
  - Knights 40–45 (Demos, the newly bought Paphlagonian tanner), 230–233 (the mask-makers) and 512–516 (the author-director's hard job)
  - Clouds 218–234 (the basket, "creature of a day", ἀεροβατῶ), 518–562 (ὦ θεώμενοι; "cleverest of my comedies"; the virgin and the exposed child; Cleon struck in the belly; Hyperbolus; Eupolis' *Maricas*), 591–594 (convict Cleon, part of the parabasis epirrhema), 1435–1440 (1437–1439 spoken by Strepsiades in the TEI) and 94 ("thinking-shop" in Hickie)
  - Birds 817–821 (Nephelococcygia at 819b) and Lysistrata 120–124
  - Frogs 66–72, 209–210, 686–705 (ἐξισῶσαι τοὺς πολίτας; ἄτιμον … μηδένα) and 1418–1471 (choosing the poet who gives the city the best advice; 1471)
  - Euripides, Hippolytus 612, and Murray's notes tying Frogs 101 and 1471 to it
  - Plato: Apology 19; Symposium 185 (hiccough, Eryximachus, sneezing), 189, 191 and 221 ("to use a phrase of yours, Aristophanes", marsh-goose)
- Life (Wikipedia, Aristophanes):
  - born c. 446 and died c. 386; son of Philippus; deme of Kydathenaion; forty plays, eleven virtually complete
  - *Banqueters* second at the City Dionysia in 427; the first three plays directed by Callistratus and Philoneides, who were used again later; "hardly … more than 18"
  - *Babylonians*: the allies as slaves at a mill, foreign visitors, Cleon's charge of slander
  - *Knights* the first play he directed himself, and the chorus quotation
  - the *Frogs*' unique repeat performance; Araros and *Wealth*; the *Symposium* as doubtful evidence; the epitaph "reputedly" by Plato (rightly marked {legend}); Kassel–Austin as the standard edition of the fragments
- HUP / Loeb 502 blurb: over forty plays read in antiquity, nearly a thousand fragments (confirmed through a search summary; the page itself is behind bot protection).
- Old Comedy (Wikipedia): only Aristophanes' plays survive complete, a chorus of 24, eight plays named after the chorus. My own count agrees.
- The plays (Wikipedia):
  - Acharnians 425, Callistratus, first at the Lenaia; whether Cleon prosecuted the poet or Callistratus is uncertain
  - Knights 424, first at the Lenaia
  - Clouds 423, last of three; the reasoning for the revision; written circulation; 399 and both sides of the debate
  - Wasps, Lenaia 422, and the swap of 1265–91 with 1450–73
  - Peace, second in 421, days before the Peace of Nicias, Cleon dead a few months
  - Birds 414, second, the longest play (on the rendered page)
  - Lysistrata, Lenaia 411
  - Thesmophoriazusae 411, probably the City Dionysia, result unknown
  - Frogs, Lenaia 405, first; Euripides jealous of Aeschylus
  - Assemblywomen 391 (and c. 392 on the Aristophanes page), counted as Middle Comedy
  - Plutus 388
- Frogs' second production (BMCR 2013.08.48): Dicaearchus "because of the parabasis"; Hypothesis Ic gives no "next year"; Sommerstein's 404 and the Thirty against Cleophon.
- Wilson's text (BMCR 2008.07.50):
  - Sommerstein 1980–2002 as the edition of reference "for a time"
  - dated papyri listed before each play; a fairly small number of manuscripts; corrections made from the Ravennas facsimile
  - speaker attribution: papyri and manuscripts of little or no reliability, and no way to settle disagreements
  - the excision of Clouds 1437–1439, "que personne ne semble avoir soupçonnés avant Wilson"
  - "the deterioration of texts … almost two thousand years", and the reviewer's agreement
- Ravenna manuscript (Wikipedia, Codex Ravennas 429): mid-tenth century, the oldest with all eleven plays, the only medieval witness for Thesmophoriazusae and a quarter of Lysistrata, Aurispa and Niccoli in 1423, Giunti, Pisa to Classe in 1712.
- Byzantine triad (German Wikipedia): Wealth, Clouds, Frogs; heavily annotated and copied, the other plays copied less.
- Aldine edition (Bridwell): July 1498, nine plays as listed, Musurus of Crete, text in the centre, scholia compiled by Musurus.
- Giunti edition of Lysistrata and Thesmophoriazusae: Wikipedia, Editio princeps gives Florence 1515; the Codex page gives 1516. The article already says the sources disagree.
- Editions: Hickie (Bohn 1853) and the anonymous Birds (Random House 1938) match the TEI headers. Henderson's Loeb, LCL 178–180, 488 and 502, 1998–2007, matches the BMCR header. Kassel–Austin PCG III.2 (de Gruyter 1984), Dover's *Clouds* (Clarendon 1968) and Dover's *Frogs* (Clarendon 1993) match.
- Timeline years, kinds and `approx` marks. The certainty labels ({debated} on the "eighteen" reading, the revision, the deleted lines, the Wasps song and the restaging date; {legend} on the epitaph) are appropriate.

**Could not verify:**
- The exact year of vol. 2 of the first Hall–Geldart edition (1901): I saw only the 1900 date, in BMCR.
- The HUP and Loeb pages directly (bot protection); I relied on a search snippet. I also did not confirm the editions note that Henderson's text is "newly edited": BMCR 1999.05.17 does not say so explicitly, though it is very likely.
- The Cambridge Core review pages for Kassel–Austin and Dover's *Clouds*. Their URL slugs carry the bibliographic details, and the details are correct from general knowledge.
- How firmly Kassel and Austin assign P. Oxy. 212 to Aristophanes.
- The Greek text of the *Wealth* hypothesis on Araros (APGRD page blocked).

**Count:** 6 findings: 1 high, 3 medium or medium-high, 2 low or low-medium.

---

## Fact check: Pindar (web/src/wiki/authors/tlg0033.ts)

Checked 2026-10-02. Every `cite` source was printed with `scripts/passage.ts`; the url sources were read directly: the Wikipedia raw wikitext (Pindar; List of editiones principes), the OCR text of Sandys's Loeb on the Internet Archive, Österdahl's thesis PDF, the Fries GRBS PDF, the OCR text of the Grenfell–Hunt P.Oxy. 5 volume on the Internet Archive, Quintilian on LacusCurtius, and the Milton Reading Room page. I also looked up LSJ in the site's own copy (`web/public/data/lsj`).

The article is in very good shape. I found two small problems and no serious ones.

### 1. P.Oxy. 2438 was published in 1961, not found then

- **Claim:** "In 1961 a papyrus with a short life of Pindar (P.Oxy. 2438) came to light.[^1]"
- **Problem:** "Came to light" tells the reader the papyrus was found in 1961. In fact 1961 is the year it was first published: E. Lobel printed it in *The Oxyrhynchus Papyri* vol. XXVI (London, 1961). The papyrus itself came out of the Oxyrhynchus digs decades earlier. Wikipedia, the source cited, says "discovered in 1961", which is loose wording. The article softens that wording but keeps the same impression.
- **Evidence:** Wikipedia, Pindar: "a short biography discovered in 1961 on an Egyptian papyrus … (P.Oxy.2438)". Published edition: FGrHist 1132 entry "Anonymous, Pindar (P.Oxy. XXVI 2438)" (academia.edu), and search results giving "The Oxyrhynchus Papyri, XXVI, London 1961" with Lobel's dating of the hand to the late 2nd or early 3rd century AD. Österdahl (source 22, ch. 2) also refers to "Lobel's supplement" in P.Oxy. 2438.
- **Suggested fix:** "In 1961 Edgar Lobel published a papyrus from Oxyrhynchus with a short life of Pindar (P.Oxy. 2438)." Alternatively keep "came to light" and change it to "was first published". If Lobel is named, a source that names him is needed, for example Österdahl, which is already source 22.
- **Confidence:** medium. That 1961 is the publication year is certain. I did not find the exact year the papyrus was dug up.

### 2. The cited passage does not say "boy wrestler"

- **Claim:** "Near the end of *Pythian 8*, for a boy wrestler from Aegina, Pindar says what a human being is: … [^8]"
- **Problem:** The only footnote is [^8], the passage Pythian 8.95–97, and it does not say Aristomenes was a boy. The Scroll's own heading for the ode (source 10, Pythian 8.1) says "Wrestling 446 B. C. E.". By contrast, Pythian 10's heading spells out "Boys' Double Foot Race". Wikipedia's table also has just "Wrestling-Match". The claim itself is fine: Sandys, already source 3, says the ode is "on the victory gained in 446 by the boy-wrestler, Aristomenes of Aegina", and Nagy's notes call it the boys' wrestling. The problem is only that the footnote does not back it.
- **Evidence:** passage.ts tlg0033.tlg002 8.1 shows the heading "Pythian 8 For Aristomenes of Aegina / Wrestling 446 B. C. E." Sandys's introduction (Internet Archive OCR) says "the boy-wrestler, Aristomenes of Aegina".
- **Suggested fix:** Add [^3] to the sentence: "…for a boy wrestler from Aegina,[^3] Pindar says…".
- **Confidence:** low. This is a footnote fix only; the fact is supported.

---

**Checked, no problems found in:**
- Life:
  - Born about 518 and died about 438, at about eighty (Wikipedia).
  - 522 as the other proposed birth year (Sandys: "The most probable alternative is Ol. 64, 3, that is 522").
  - Born at Cynoscephalae.
  - Lasus as teacher. Sandys says only "probably", and the article's "is said to" is suitably careful.
  - Daughters took his ashes to Thebes; death at Argos (Wikipedia, Sandys).
- Best preserved of the nine lyric poets (Wikipedia). Quintilian 10.1.61 in Butler's wording, checked on LacusCurtius.
- The odes:
  - Four books of victory odes; seventeen books and their kinds (Wikipedia, Sandys).
  - Forty-five odes: refs list 14 Olympian, 12 Pythian, 11 Nemean, 8 Isthmian.
  - Patrons Hieron, Theron, Arcesilas; Aegina ordered about a quarter of the odes (Wikipedia).
  - Pythian 10 in 498, when Pindar was about twenty, for the ruling family of Thessaly, a boys' double foot race (heading and Wikipedia).
  - Olympian 1 in 476, single horse race; Pythian 12 for Midas, flute contest; Nemean 11 for Aristagoras as president of the council (headings).
  - Pythian 4 in 462 with thirteen triads; the shortest odes have one triad (Wikipedia).
- Pythian 8:
  - The 446 date (heading).
  - "Latest firmly dated" holds: Wikipedia's table has 446 for Pythian 8 without a question mark, while Nemean 11 (446?) and Nemean 10 (444?) are queried.
  - Quotation and Svarlien's English (passage).
- Language, music and performance:
  - LSJ in the site's copy: ἐπάμερος "Dor. and Aeol. for ἐφήμερος, Pi. P. 8.95"; ἡμέρα "Dor. ἀμέρα"; Μοῦσα "Aeol. Μοῖσα".
  - Olympian 1.6 has ἐν ἁμέρᾳ; Olympian 3.4 has Μοῖσα.
  - Boeotian, Doric, Aeolic and epic dialect mix (Wikipedia).
  - Pausanias 9.22.3 on Doric speech and Corinna's painting at Tanagra.
  - Olympian 3.8 lyre, flutes and words (Svarlien).
  - Music and dances by Pindar himself; chorus versus solo, rightly marked {debated} (Wikipedia).
- Lost poems:
  - Herodotus 3.38.4 (Greeks and the Callatian Indians; "custom is lord of all").
  - Plato, Gorgias 484 (Callicles, natural right of the stronger, "I do not know the poem well").
- Late sources and Bundy 1962 ("much of the material is clearly fanciful", Wikipedia).
- Legends, correctly marked {legend}:
  - Pausanias 9.23.2–4: tomb in the hippodrome; bees at Thespiae, "Such was the beginning…"; a share of the Delphic first-fruits; Persephone's dream; dead within ten days; the old kinswoman who wrote the hymn down.
  - Pausanias 10.24.5: iron chair near the hearth in the temple; the Greek ᾄδειν supports "sing".
  - Pausanias 1.8.4: statue at Athens.
  - Pausanias 9.25.3: ruins of the house beyond the Dirce.
  - Corinna's victories probably invented by commentators (Wikipedia).
  - The Theban fine and the Athenian double payment (Wikipedia gives 5,000 and 10,000 drachmae, the gift "said to" have been made).
  - Fragment 76, "bulwark of Hellas" (Wikipedia, Sandys).
- Alexander:
  - Alexander and Thebes in 335 (Wikipedia).
  - Arrian 1.9.10, which uses λέγουσιν, so "they say" is accurate.
  - Plutarch, Alexander 11.6, "the descendants of Pindar" set apart, the rest sold.
  - Milton, Sonnet 8, in *Poems* (1645), with the quoted lines exact (Milton Reading Room).
- Alexandrian scholarship (Österdahl):
  - Aristophanes of Byzantium (c. 257–180), "most probably" the authoritative edition in 17 books.
  - The Vita Thomana is called "an anonymous biography … found in medieval manuscripts" in Österdahl's own words. Its traditional ascription to Thomas Magister is disputed: Eustathius already knew it, and the ascription rests on a note by Triclinius. So "anonymous" is defensible.
  - Callimachus filed Pythian 2 among the Nemeans; Nemeans 9–11 are not Nemean wins.
  - Aristarchus wrote the first continuous commentary, with some 70 fragments; Didymus under Augustus, at least 68 fragments.
  - The athetesis of φιλέοντι δὲ Μοῖσαι on metrical grounds, still copied in the manuscripts. The Scroll's Olympian 2.25–27 lacks it.
  - Olympian 5 "not found in the edaphia", but Pindar's according to Didymus; the edaphia's compiler is disputed (Aristophanes, Zenodotus, or a collection from before Alexandria); the only poem whose authenticity the scholia question.
- Paeans papyrus (Grenfell–Hunt, P.Oxy. 5, 1908):
  - Find of 13 January 1906; "some 380 fragments".
  - Written on the verso of a cursive document.
  - Hand of "the earlier decades of the second century", with scholia.
  - Only "two small fragments (52 and 61)" previously assignable.
  - No epinician among the Oxyrhynchus Pindar papyri, though Eustathius called those the most popular.
  - Paean as a hymn "originally sung in honour of Apollo or Artemis".
- Manuscripts (Fries, GRBS 57):
  - None before the late twelfth century; two branches.
  - A redated by Mazzucchi from c. 1280 to the 1180s.
  - B c. 1180, 282 leaves, "the better part of Olympian 1 to Isthmian 8".
  - D (Laur. 32.52, early fourteenth century) the only near-complete copy.
  - Isaac Tzetzes's treatise. Fries says "early 12th century" and also dates it 1138, so the article follows her wording.
  - School syllabus and scholia.
  - A has Olympians 1–12 (Sandys, Wikipedia).
  - Sandys's 142 manuscripts and the Byzantine reworkings by Thomas Magister, Moschopulus and Triclinius: 15, 42 and 28 manuscripts respectively, so "many" is fair.
- Printing:
  - Aldus, Venice, 1513, and Callierges, Rome, 1515 (Sandys); Callierges printed the scholia for the first time (Wikipedia list of editiones principes).
  - Callierges used B (Wikipedia: "based his 1515 Roman edition on it").
  - Boeckh, Leipzig 1811–21, "A new epoch": text and metres (1811), scholia (1819), Latin translation and notes (1821) (Sandys).
- Variants:
  - Isthmians 3 and 4: Sandys says no two odes share a metre except these, "one of the reasons for regarding them as a single Ode". The headings confirm both are for Melissus.
  - Olympian 6.54: Sandys's critical note has βατιᾷ by Wilamowitz, βατείᾳ in the old manuscripts, ἀπερά(ν)τῳ in the old manuscripts, and ἀπειρίτῳ by Heyne; the Scroll's text matches.
  - Pausanias 6.13.8 on the incomplete Corinthian and Argive records. The Greek τηνικαῦτα means "at that time", so "in early times" is fair.
  - Every Nemean heading carries a "?"; Pythian 11 "474 or 454".
- Editions:
  - Sandys's Loeb: title page "First edition 1915 … Revised and reprinted 1937"; the Scroll's TEI header gives reprint 1937.
  - Svarlien 1990 (file header).
  - Snell–Maehler, Teubner, Leipzig 1987, pars 1 Epinicia (Internet Archive record).
  - Race, Loeb 56 and 485, 1997: loebclassics.com URLs "pindar-pythian_odes/1997/pb_LCL056" and "pindar-fragments/1997/pb_LCL485".
  - Grenfell–Hunt 1908, no. 841.
- Timeline: all years and kinds agree with the sources above. Marking 518 and 438 approx and 518 {debated} is right. 1180, about 200 BC and AD 120 are rightly approx.

**Could not verify:**
- The UCL Discovery record for Race (blocked with 403). I relied on the Loeb URLs instead.
- The Classical Review record of Carey's review of Maehler 1989 (not opened). That Maehler's pars II, *Fragmenta, Indices*, appeared in Leipzig in 1989 agrees with the Internet Archive record, which lists both parts.
- The exact year P.Oxy. 2438 was dug up (see finding 1).

**Findings: 2** (one medium, one low).

---

