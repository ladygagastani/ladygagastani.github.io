# Fact-check, group 2 (2026-10-02)

Articles: reading-the-layers, parthenon-marbles, school, troy, knossos, helots, spartan-upbringing,
eleusinian-mysteries, melos, ostracism, hipparchia (all in `web/src/wiki/entries/`).

Method: I opened all 60 distinct `cts:` links with `scripts/passage.ts` and read each passage against the sentence
that links to it. I checked other passages the text relies on without linking them (Plutarch, Lycurgus 16.5–16.7 and
28.1–28.3; Plato, Laws 633; Diodorus 12.58.6–7). I checked modern facts, dates and numbers on the web and spot-checked
every bibliography entry and several `checked` links. No site file was edited.

Summary: 11 findings in 11 articles. Two are serious, both in parthenon-marbles. Most of the rest are minor.

---

## reading-the-layers.ts

- **Claim:** "It held [thousands of finds](https://cyclades.culture.gov.gr/…), and the museum on Mykonos was founded to house them; its pottery runs from the eighth century to the fifth."
- **Problem:** The linked Ephorate page confirms Stavropoullos, 1897, the winter of 426/5 and "thousands of finds". It gives no date range for the pottery. Other descriptions of the Rheneia material mention 9th-century Cycladic pottery and some earlier pieces, so "from the eighth century" may start too late. I could not find a good source that settles the range.
- **Evidence:** https://cyclades.culture.gov.gr/en/location/the-archaeological-museum-of-mykonos/ (no pottery range given); secondary summaries mention "9th- to 8th-century BC ceramic pottery" from Rheneia.
- **Suggested fix:** "its pottery spans several centuries, down to the fifth", or find a source that gives the range and cite it.
- **Confidence:** low

- **Claim:** timeline: `{ when: "2006, 2018", what: "The buried olive tree, then a year-by-year tree-ring record, re-date the Thera eruption.", certainty: "well" }`
- **Problem:** The body labels this matter `{debated}` and says "The debate is not over". The timeline line presents the re-dating as settled, which contradicts the body. The 17th/16th-century line just above it is correctly labelled debated.
- **Evidence:** The article's own body; Friedrich 2006 (1627–1600 BC) and Pearson 2018 (16th c. BCE) do not agree with each other.
- **Suggested fix:** change the certainty to `"debated"`, or reword to "new radiocarbon dates for the Thera eruption are published".
- **Confidence:** medium

- **Claim:** "The Athenians, [following an oracle](cts:tlg0003.tlg001:3.104.1), cleared every grave from the island, forbade anyone to die or give birth there, and moved the dead across to the neighbouring island of Rheneia."
- **Problem:** This is a minor sourcing gap, not an error. Thucydides 3.104.2 says the graves were removed and that, from then on, the dying and women about to give birth were to be taken to Rheneia. He does not say the dead were reburied there. Diodorus says it, and so does the Rheneia pit.
- **Evidence:** Thuc. 3.104.2: "proclaimed that thereafter no one should either die or give birth … but should first be carried over to Rheneia." Diod. 12.58.7: ἀνασκάψαντες … τὰς ἐν τῇ Δήλῳ θήκας μετήνεγκαν εἰς τὴν Ῥήνειαν ("digging up the graves on Delos they moved them to Rheneia").
- **Suggested fix:** optionally add a citation link: "and [moved the dead](cts:tlg0060.tlg001:12.58.7) across to … Rheneia".
- **Confidence:** high (that the sentence goes beyond Thucydides); the fact itself is sound

Checked, no problems found in: Thuc. 1.8.1 (Carians, more than half, weapons and burial custom); Thuc. 3.104.1 (oracle;
Peisistratus purified only the part in sight of the temple); Hdt. 1.64.2 (Peisistratus, "within sight of the temple");
Hdt. 8.53.2; winter 426/5; Stavropoullos 1897 and the pit (Ephorate page); Harris matrix 1973; Perserschutt found in
the 1880s; Stewart 2008 (the AJA abstract confirms it word for word: only one deposit looks like pure Perserschutt and
it held only Archaic material; the rest are fills of c. 467–430; Severe Style pieces up to 40 years later); Libby, late
1940s; Friedrich 2006, 1627–1600 BC; Pearson 2018, 16th century; the image (Met 14.130.14, Hirschfeld Workshop,
c. 750–735 BC); all five bibliography entries.
**3 findings (1 medium, 2 low).**

---

## parthenon-marbles.ts

- **Claim:** "In September 2026 Prime Minister Kyriakos Mitsotakis put it simply: \"We cannot borrow parts of our own monument.\""
- **Problem:** He did not say these words. The quotation is a paraphrase presented in quotation marks. In his Guardian article (24 Sept. 2026) he wrote that Greece cannot accept "a plan that would mean that we 'borrow' parts of our own monument." That breaks the site's rule against invented quotations.
- **Evidence:** https://en.protothema.gr/2026/09/24/mitsotakis-article-in-the-guardian-let-us-reunite-the-parthenon-sculptures-britain-would-not-dismember-the-bayeux-tapestry/ : "Greece cannot accept any arrangement that would require it to recognise the British Museum's ownership of the Sculptures, nor a plan that would mean that we 'borrow' parts of our own monument." (Bloomberg's wording: "a scheme that would mean we 'borrow' parts of our own monument.") The exact sentence quoted on the site does not appear.
- **Suggested fix:** "In September 2026 Prime Minister Kyriakos Mitsotakis wrote that Greece could not accept any arrangement that would mean that it 'borrow' parts of its own monument." Or quote the real sentence in full, from the Guardian original.
- **Confidence:** high

- **Claim:** "No sculpture remains on the building itself: everything still on it has been moved into the Acropolis Museum, which opened in 2009, and replaced with copies."
- **Problem:** False. Nine of the fourteen west metopes (and, according to Wikipedia, a few metopes on the other sides) are still on the Parthenon, because they cannot be removed for technical reasons. Only four west metopes came down, in 2012.
- **Evidence:** Acropolis Museum, https://www.theacropolismuseum.gr/en/parthenon-west-metope-1 : "Four of the west metopes are exhibited in the Acropolis Museum (nrs. 1, 2, 13, 14). They were removed from the monument in 2012 … The remaining nine are still in their original position on the Parthenon as they cannot be taken off the monument for technical reasons." Also https://en.wikipedia.org/wiki/Metopes_of_the_Parthenon ("South I, XXIV, XXV and XXVII to north XXXII and the fourteen metopes of the west façade are still in place").
- **Suggested fix:** "Almost all the sculpture still on the building has been moved into the Acropolis Museum, which opened in 2009, and replaced with copies; only some badly weathered metopes, most of them on the west side, remain in place."
- **Confidence:** high

Checked, no problems found in: Plutarch, Pericles 13.4 (Pheidias the overseer, Callicrates and Ictinus); Pausanias
1.24.5 (east pediment, birth of Athena; west, contest with Poseidon); 92 metopes; frieze of about 160 m; 26 Sept. 1687,
Venetian shell and Ottoman powder; "by 1800 about half … lost" (the British Museum's own wording); Elgin as ambassador
from 1799, the 1800 team of artists, removals from 1801; the letter from the Grand Vizier's deputy surviving in Italian;
the 1816 select committee and sale; the Ministry of Culture figures (97/56/40 frieze blocks, 64/48/15 metopes, 28/19/9
pediment figures: they match culture.gov.gr word for word); the Louvre and Copenhagen pieces; Acropolis Museum 2009; the
Fagan fragment from Palermo (2022) and the Vatican fragments (2023); British Museum Act 1963; talks stalled in September
2026 and the Museum's "willingness … remains unchanged" (keeptalkinggreece, Bloomberg, GreekReporter); the frieze cast
(east frieze block IV, whose original is in London); bibliography (St Clair 1998 OUP; Beard 2010 revised).
**2 findings (both high).**

---

## school.ts

No substantive problems found.

Checked, no problems found in: Plato, Lysis 208c (the paidagogos, a slave, takes him to school); Protagoras 325c–d (nurse,
mother, tutor, father; "a bent and twisted piece of wood"; threats and blows); Protagoras 326 (the writing-master's lines
on the tablet; poets learned by heart; kitharistes and lyric poets; the paidotribes so that the body does not let the
mind down in war; the rich start earliest and leave latest); Xenophon, Symposium 3.5–6 (Niceratus; the rhapsodes);
Clouds 964–965 (march in good order to the kitharistes, even if it snowed; 423 BC); Hdt. 6.27.2 (Chios, 120 boys, one
escaped, shortly before Lade, 494 BC); Thuc. 7.29.5 (Mycalessus, 413 BC); the Douris cup (Berlin F 2285, c. 480 BC; it
shows a lyre lesson, a teacher with a writing tablet and a boy reciting to a man holding a scroll). The literacy and
girls' education paragraphs are fairly labelled debated. Bibliography: Marrou (trans. Lamb, 1956) and Beck (1964) exist
as described.
**0 findings.**

---

## troy.ts

- **Claim:** "Strabo also cites [Hestiaea of Alexandria](cts:tlg0099.tlg001:13.1.36), a woman who wrote a book on the *Iliad* and asked whether the war could really have been fought around the Ilion of her own day."
- **Problem:** This is a misattribution. In Strabo, Demetrius of Scepsis is the one who cites Hestiaea as a witness, and Strabo reports it. Also, "Alexandrian" (Ἀλεξανδρίνη) is often understood to mean Alexandria Troas, not Alexandria in Egypt. That point is uncertain, so it is safer to keep her city vague.
- **Evidence:** Strabo 13.1.36: παρατίθησι δ’ ὁ Δημήτριος καὶ τὴν Ἀλεξανδρίνην Ἑστίαιαν μάρτυρα, "Demetrius cites also Hestiaea of Alexandreia as a witness."
- **Suggested fix:** "Demetrius, as Strabo reports, also called as a witness [Hestiaea](cts:tlg0099.tlg001:13.1.36), a woman scholar who wrote a book on the *Iliad* and asked whether …"
- **Confidence:** high (that Demetrius is the one citing her); the point about her city is low

Checked, no problems found in: Iliad 6.447–449; Hdt. 7.43 (Xerxes, Athena of Ilion, a thousand cattle); Arrian
1.11.7–8 (sacrifice to Athena of Ilion, armour dedicated, sacred arms from the Trojan War carried before him by the
hypaspists; told as "they say", so `{legend}` is fair); Strabo 13.1.27 (Demetrius visiting as a lad, no tiled roofs;
Strabo then argues Homer's Ilion was elsewhere); Strabo 13.1.35 (the Village of the Ilians, 30 stadia); Calvert bought
part of Hisarlik in 1864 and dug in 1863/1865 (Schliemann Museum); Schliemann met him in 1868 and began in 1870; Priam's
Treasure 1873, Troy II, Berlin 1881, Moscow 1945, acknowledged 1993 (some sources say the Pushkin Museum admitted it in
1994; Russia's official acknowledgement was August 1993, so 1993 is defensible); Troy I c. 3000 BC; lower town about
30 ha; Korfmann from 1988; UNESCO 1998; Wilusa and Latacz. Bibliography: Cline 2013, Latacz 2004, Robinson 2006
(Xlibris; BMCR review), Traill 1995 all exist as described.
**1 finding (high).**

---

## knossos.ts

- **Claim:** "He coined the word \"Minoan\" for the civilisation of Bronze Age Crete"
- **Problem:** Evans popularised the term but did not invent it. Karl Hoeck had already used "minoisch" in 1825, in his *Kreta*.
- **Evidence:** https://en.wikipedia.org/wiki/Minoan_civilization : "It was popularized by Arthur Evans, possibly drawing on an earlier suggestion by Karl Hoeck."
- **Suggested fix:** "He made the word \"Minoan\" the name of the civilisation of Bronze Age Crete"
- **Confidence:** medium

- **Claim:** secondary: `{ id: "kotsonas-2016", note: "Minos Kalokairinos, the first excavator." }`, used in support of the 1878 trenches and storerooms paragraph
- **Problem:** The article exists as listed (BSA 111, 2016, 299–324). Its subject, though, is Kalokairinos' investigations of *Greek and Roman* Knossos, not his 1878–79 trenches in the Bronze Age palace. It is not the best support for that paragraph.
- **Evidence:** the `checked` Cambridge page: the abstract speaks of "pioneering investigations of the topography and monuments of Greek and Roman Knossos".
- **Suggested fix:** keep it, but change the note to something like "Kalokairinos' work at Knossos, chiefly on its Greek and Roman remains". Consider adding a source on the 1878 palace trenches.
- **Confidence:** low

Checked, no problems found in: Odyssey 19.178–179 (and the reading of ἐννέωρος); Plato, Laws 624a–b (Minos visiting Zeus
every ninth year); Iliad 18.590–592 (Daedalus' dancing floor for Ariadne in wide Knossos); Thuc. 1.4.1; Apollodorus
3.1.4; Plutarch, Greek Questions 45 (the Lydians call the axe *labrys*); Kalokairinos 1878 and the west storerooms;
23 March 1900; Grand Staircase found in 1901, with Fyfe (1901–04) and Doll (1905–10) restoring; the Gilliérons;
Ventris 1952, eleven years after Evans' death (1941). Not verified: "The Grand Staircase had been restored by 1905". I
found the 1901 discovery and Doll's 1905 restoration drawing, but no source giving a completion date. Bibliography: Gere
2009, MacGillivray 2000, Dickinson 1994 exist as described.
**2 findings (1 medium, 1 low).**

---

## helots.ts

No substantive problems found.

Checked, no problems found in: Thuc. 1.101.2 (most helots descended from the old Messenians; Ithome); Tyrtaeus in Paus.
4.14.5 (half of the harvest); Hdt. 9.28.2 (5,000 Spartiates, 35,000 helots, seven each); Thuc. 4.80.3–4 (the two
thousand, "nobody ever knew"); Plutarch, Lycurgus 28.1–3 (daggers and food; hiding by day; killing on the roads by night;
"oftentimes" killing the sturdiest in the fields; Aristotle cited for the krypteia being Lycurgan; Plutarch's doubt); Lyc.
28.4 (ephors declare war on taking office, so the hook's "each year" is right); Plato, Laws 633b–c (spoken by Megillus
the Spartan; barefoot, no bedding, roaming by night and day, no killing mentioned); Xen. Hell. 3.3.6 (eat them raw); the
earthquake of the 460s and Ithome; Messene in 369 BC. One remark, not counted as a finding: Plutarch's krypteia paragraph
is labelled `{legend}`, though it rests on Aristotle (fr. 538 Rose). `{debated}` would match the next paragraph's
framing better. Bibliography: Luraghi & Alcock 2003, Cartledge 2002, Hornblower vol. II 1996 exist as described.
**0 findings.**

---

## spartan-upbringing.ts

No substantive problems found.

Checked, no problems found in: Plutarch, Agesilaus 20.2 (Agesilaus told Xenophon to bring up his sons at Sparta); Xen.
Lac. Pol. 2.1 (paidagogoi, teachers of letters, music, palaestra; sandals, clothes, food), 2.2 (the paidonomos), 2.3
(barefoot), 2.4 (one cloak a year), 2.5 (little food), 2.6 (stealing), 2.8 (punished for stealing badly), 2.9 (cheeses at
Orthia, whipping); Plut. Lyc. 16.1 (elders of the tribe, the Apothetae by Taygetus), 16.4–5 (agelai at seven, the most
sensible and bravest boy as leader, older men setting them to fight), 16.6 (letters only for use; at twelve no tunic,
one cloak a year, few baths), 18.1 (the fox cub; youths dying at the altar of Orthia); Plut. Cleomenes 11.2 (agoge
restored with Sphaerus); the BSA excavation 1906–1910 and the 3rd-century AD theatre. Bibliography: Kennell 1995, Ducat
2006, Dawkins 1929 exist as described.
**0 findings.**

---

## eleusinian-mysteries.ts

- **Claim:** "informers claimed that young aristocrats, among them the general Alcibiades, had [performed the Mysteries in private houses](cts:tlg0003.tlg001:6.28.1) as a drunken mockery."
- **Problem:** A small overstatement of the linked passage. Thucydides puts "drunken sport" (μετὰ παιδιᾶς καὶ οἴνου) with the earlier mutilation of *other statues*. The Mysteries are simply performed "in mockery" (ἐφ’ ὕβρει). Thucydides also says only "younger men", not "aristocrats", although the people named elsewhere were indeed from leading families.
- **Evidence:** Thuc. 6.28.1: "certain mutilations of other statues perpetrated by younger men in drunken sport, and also that the mysteries were being performed in private houses in mockery; and Alcibiades, among others, was implicated."
- **Suggested fix:** "… had [performed the Mysteries in private houses](cts:…) in mockery."
- **Confidence:** medium

Checked, no problems found in: Hymn to Demeter 480–482 and 208–210 (the kykeon of barley meal, water and pennyroyal);
Isocrates, Panegyricus 28 (two gifts, "sweeter hopes") and 157 (Eumolpidae and Kerykes bar barbarians "as men guilty of
murder"); Hdt. 8.65.4 (any Athenian or other Greek; the Iacchus cry; Dicaeus and Demaratus); Aristotle, Nicomachean
Ethics 3.1 (Aeschylus did not know it was secret); Thuc. 6.61.6 (Alcibiades slips away at Thurii); Pausanias 1.38.7 (the
dream forbade him); Hippolytus 5.8.39–40 (the reaped ear of grain shown in silence; the hierophant at night under a
great fire); Clement's formula (the passage is Protrepticus 2.21; the label is right); about 22 km Athens–Eleusis;
Alaric 395/6 (labelled debated). Bibliography: Mylonas 1961 and Burkert 1987 exist as described. Image: Met 14.130.9, a
Roman copy of the Great Eleusinian Relief (the date given matches the Met's Augustan dating as far as I could tell; the
Met site was rate-limiting me, so I could not reopen the page).
**1 finding (medium).**

---

## melos.ts

No substantive problems found.

Checked, no problems found in: Thuc. 5.84.1 (30 Athenian + 6 Chian + 2 Lesbian = 38 ships; 1,200 hoplites, 300 archers,
20 mounted archers, about 1,500 allied hoplites); 5.84.2 (colonists of the Lacedaemonians; neutral until their land was
ravaged); 5.84.3 (heard before "the magistrates and the few"); 5.89; 5.104.1 ("god-fearing men … against men who are
unjust"; kinship and shame); 5.105.2; 5.112.2 (700 years); 5.114.1 (wall divided among the contingents); 5.115–116
(two break-outs, Philocrates, treachery, men killed, women and children enslaved, 500 colonists); 3.91.1–3 (Nicias, 60
ships, 2,000 hoplites, 426 BC); 1.22.1; Birds 186 (414 BC); Xen. Hell. 2.2.3 and 2.2.9. Bibliography: Hornblower
vol. III 2008, HCT IV 1970, Kagan 1981 exist as described. Image (Met 25.78.26, a "Melian" relief): I could not reopen
the Met record because of rate limiting. One web source describes 25.78.26 as Eurykleia washing Odysseus' feet, which
fits "Odysseus' homecoming". Note that where the so-called Melian reliefs were made is not certain, so "made on Melos"
in the image title could be softened to "a 'Melian' relief".
**0 findings.**

---

## ostracism.ts

- **Claim:** "About 9,000 ostraka have been excavated in the Kerameikos"
- **Problem:** A minor understatement. Brenne's catalogue of the Kerameikos ostraka has 9,367 entries ("over 9,000").
- **Evidence:** BMCR 2020.08.16 (the entry's own `checked` link): Brenne publishes "over 9000 ostraka", "9367 ostraka" in the catalogue; the same review gives Lang's Agora total as 1,145, which confirms "more than a thousand".
- **Suggested fix:** "More than 9,000 ostraka have been excavated in the Kerameikos"
- **Confidence:** low (minor)

Checked, no problems found in: Ath. Pol. 22.1 (the law among Cleisthenes' laws), 22.3, 22.4 (Hipparchus son of Charmus,
a relative of Peisistratus, first ostracised), 22.5–6 (Megacles; three years of the tyrants' friends; Xanthippus first
"of those unconnected with the tyranny"), 22.8 (all recalled in the archonship of Hypsichides, 481/0); 43.5 (vote by
show of hands in the sixth prytany); Plutarch, Aristides 7.3–7.6 (Hyperbolus, Alcibiades and Nicias; the fenced space;
archons count; fewer than 6,000 void; ten years keeping his property; "it is said"; the illiterate countryman); Hdt.
6.131.2 (Xanthippus the father of Pericles); Thuc. 8.73.3; the 488/7, 487/6, 485/4, 483/2 dates; the 6,000 dispute
(Philochorus); Broneer's 1937 north-slope find of 190 Themistocles ostraka. Bibliography: Rhodes 1981, Forsdyke 2005,
Brenne 2018, Lang 1990, Broneer 1938 exist as described.
**1 finding (low).**

---

## hipparchia.ts

- **Claim:** timeline: `{ when: "328–325 BC", what: "The 113th Olympiad, when Crates \"flourished\" according to Diogenes Laertius.", certainty: "debated" }`
- **Problem:** The 113th Olympiad covers 328–324 BC: its four years run from summer 328 to summer 324.
- **Evidence:** Olympiad 113.1 = 328/7 BC, 113.4 = 325/4 BC; DL 6.87: "He flourished in the 113th Olympiad."
- **Suggested fix:** "328–324 BC"
- **Confidence:** medium

Checked, no problems found in: DL 6.87 (Crates sold his property and gave it to the citizens; told on Antisthenes'
authority, with Diocles' variant); DL 6.96 (Hipparchia, sister of Metrocles, both from Maroneia; suitors' wealth, birth,
beauty; threatened to kill herself; Crates' "this is the bridegroom"); DL 6.97 (same dress, went about with him, dinners;
Lysimachus' banquet; the sophism against Theodorus; he tried to strip her cloak; she was not alarmed); DL 6.98; Bacchae
1236–1237 (Agave leaves her shuttles at the looms for hunting beasts with her hands); Sextus, Outlines 1.153 (Crates and
Hipparchia in public); Bacchae staged after Euripides' death (c. 405). Diogenes Laertius gives a life of her own to no
other woman, so that claim is right. Bibliography: Branham & Goulet-Cazé 1996 and Desmond 2008 exist as described.
**1 finding (medium).**

---

## Totals

| Article | Findings |
|---|---|
| reading-the-layers | 3 (1 medium, 2 low) |
| parthenon-marbles | 2 (2 high) |
| school | 0 |
| troy | 1 (high) |
| knossos | 2 (1 medium, 1 low) |
| helots | 0 (one remark on a certainty label) |
| spartan-upbringing | 0 |
| eleusinian-mysteries | 1 (medium) |
| melos | 0 |
| ostracism | 1 (low) |
| hipparchia | 1 (medium) |
| **Total** | **11** |

Could not verify: the completion date of the Grand Staircase restoration (knossos); the exact date range of the pottery
in the Rheneia pit (reading-the-layers); the Met records for 25.78.26 and 14.130.9 (the Met site was rate-limiting me).
