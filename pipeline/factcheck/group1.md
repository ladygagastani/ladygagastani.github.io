# Fact-check, group 1

Articles: drugs-and-poisons, love-sex-and-marriage, slavery, womens-lives, household, mycenae, pericles, painted-statues
(all in `web/src/wiki/entries/`). Checked 2026-10-02.

Method. I opened every `cts:` link (48 in all) with `scripts/passage.ts` and read each one against the sentence that links to it. I also read
the quotation passages in their context where a claim depends on it (Athenaeus 6.90, Plutarch *Phocion* 36, Theophrastus 9.11.5–6,
Pausanias 2.16.6). Dates, names and claims about modern scholarship were checked on the web: Bryn Mawr Classical Review, the
Metropolitan Museum's collection API, Penn Museum *Expedition*, PubMed Central, *Archaeology* magazine, PhilPapers and Wikipedia as a
starting point. LSJ glosses were checked against the site's own LSJ data (`pipeline/.cache/packs-publish/lsj`).

Totals: **10 findings** (drugs 3, love 2, slavery 1, women 0, household 0, mycenae 3, pericles 0, painted statues 0), plus a few minor notes.

---

## Drugs and poisons (`drugs-and-poisons.ts`)

### 1. Xenophon did not lead the Ten Thousand alone
- **Claim:** "In 401–400 BC Xenophon led the ten thousand Greek soldiers of the *Anabasis* north through the mountains to the Black Sea."
- **Problem:** This is a misleading simplification. Xenophon was one of several generals chosen after the Greek commanders were seized
  (Anabasis 3.1). On the march north the Spartan Cheirisophus led the van and was the senior commander. Xenophon led the rearguard.
- **Evidence:** Xenophon, *Anabasis* 3.1–3.2 and 4.1–4.8, where Cheirisophus commands the van throughout the march to Trapezus.
- **Suggested fix:** "In 401–400 BC the ten thousand Greek soldiers of Xenophon's *Anabasis*, Xenophon among their generals, marched north…"
- **Confidence:** medium

### 2. The identification "thorn-apple, *Datura stramonium*" needs a warning
- **Claim:** "LSJ identifies the maddening *strychnos* as thorn-apple, *Datura stramonium*, following the later herbal of Dioscorides"
- **Problem:** LSJ does say this. Its entry στρύχνον 3 reads "thorn-apple, Datura Stramonium, Dsc. 4.73" and cites Thphr. HP 9.11.6. But
  *D. stramonium* is widely thought to be a New World plant that reached Europe only after Columbus. That would make this particular
  identification especially doubtful. Other candidates include *Atropa belladonna*, *Datura metel* and *Withania*. The paragraph is
  already labelled {debated}, so this is a matter of completeness rather than an error.
- **Evidence:** LSJ s.v. στρύχνον (site data). Wikipedia, "Datura stramonium": "likely origin was in Central America… probably introduced
  into Europe" after the New World voyages (https://en.wikipedia.org/wiki/Datura_stramonium). Delpinoa 39–40 (1997–98), "Datura stramonium
  L.: Old or New World?" shows that the origin is itself argued.
- **Suggested fix:** Add: "…but thorn-apple is usually thought to have come from the Americas, so the ancient plant was probably something
  else, perhaps deadly nightshade; identifications of ancient plant names…"
- **Confidence:** low–medium

### 3. Minor: the Mysteries and the vapour at Delphi
- **Claim:** "The same is true of the vapour said to inspire the priestess at Delphi."
- **Problem:** This is not wrong as it stands. Note only that ancient sources (Strabo 9.3.5, Plutarch *De def. or.*) *do* name a vapour or
  pneuma, though not a drug. "The same is true" is loose. If it is meant as "no ancient source names a drug", it is fine.
- **Suggested fix:** Optional: "Nor does any ancient source name a drug behind the vapour said to inspire…"
- **Confidence:** low

**Checked, no problems found in:**
- Homer, *Odyssey* 4.220ff (Helen's Egyptian drug), 10.233–240 (Circe's cheese, barley, honey, Pramnian wine, baneful drugs) and 10.302–306
  (moly, black root, milk-white flower, 10.304).
- Plato, *Phaedrus* 275a (Theuth, the king Thamus, "not of memory but of reminding").
- Theophrastus 9.8.8 (mandrake circles, facing west, dance and talk of sex, ἐπιθέτοις ἔοικεν), 9.11.6 (dosage scale) and 9.16.8 (Thrasyas of
  Mantinea, hemlock and poppy, a drachma's weight).
- Xenophon, *Hellenica* 2.3.56 (Theramenes, kottabos, the toast to Critias).
- Plutarch, *Phocion* 36.3–4 (the poison ran short, 12 drachmas, "cannot even die for free"). 318 BC is correct.
- Strabo 10.5.6 (the Ceos law, given as hearsay).
- Xenophon, *Anabasis* 4.8.20–22: honey, nobody died, third or fourth day, two stages to Trapezus.
- Herodotus 4.73.2 and 4.75.1–2 (poles, felt, a trough of red-hot stones, "instead of washing").
- *Homeric Hymn to Demeter* 208–210 (barley, water, pennyroyal, kykeon).
- LSJ φάρμακον "drug, whether healing or noxious".
- Gill (CQ 1973) and Ober (NY State J. Med. 1977, a pathologist) against Bloch (2002).
- Penn *Expedition* (Rubinson): "a set of poles, a bronze container filled with stones and hemp seeds, and a cloth covering".
- Jansen et al. 2012: opens with Xenophon, names *R. ponticum* and *R. luteum*, says "in humans, intoxication is rarely lethal", eastern Black Sea.
- Ren et al. 2019 (Jirzankal, wooden braziers, c. 500 BC).
- Wasson, Hofmann and Ruck 1978.
- Hippocratic Oath.
- The David painting (Met 31.45, 1787).
- Bibliography: Rinella 2010 confirmed (Stanford record), Hort Loeb 79, Bloch in Brickhouse and Smith 2002, Rudenko 1970, Ren 2019, Jansen 2012, Wasson 1978.

**Count: 3 findings (1 medium, 1 low–medium, 1 low).**

---

## Love, sex and marriage (`love-sex-and-marriage.ts`)

### 1. The formal prosecutor of Neaera was Theomnestus
- **Claim:** "In the mid-4th century BC Apollodorus prosecuted Neaera…"
- **Problem:** The indictment was brought by Theomnestus. Apollodorus spoke as his supporting speaker (*synegoros*) and delivered most of
  the speech, including §122. The site's own linked passage says so.
- **Evidence:** [Dem.] 59.16 (linked in the article): "the law under which Theomnestus preferred this indictment". See also 59.1–15, where
  Theomnestus speaks first.
- **Suggested fix:** "In the mid-4th century BC Theomnestus and his brother-in-law Apollodorus, who gave most of the speech, prosecuted Neaera…"
- **Confidence:** medium–high

### 2. Minor: why Euphiletus' wife moved downstairs
- **Claim:** "where he had given the ground floor to his wife so that she could see to the baby at night"
- **Problem:** Lysias 1.9 gives the reason that she should not risk the stairs each time the baby had to be washed. Night feeding comes in
  1.10. This is a small imprecision, not a real error.
- **Evidence:** Lysias 1.9 (in the article's own quotation): "in order that, each time that it had to be washed, she might avoid the risk of
  descending by the stairs".
- **Suggested fix:** "…so that she would not have to go up and down the stairs with the baby"
- **Confidence:** low

**Checked, no problems found in:**
- [Dem.] 59.16 (the law against an alien living as the wife of an Athenian) and 59.122.
- Hesiod, *Works and Days* 695–699.
- Aristotle, *Politics* 7.1335a (18 and 37).
- Xenophon, *Oeconomicus* 7.5.
- *Iliad* 18.491–493.
- The Met lekythos 56.11.1: attributed to the Amasis Painter, c. 550–530 BCE. Its catalogue text says "earliest and most complete known
  representation of an Attic wedding" and "cart drawn by two donkeys". The woman in the lead holds two torches, and the groom's mother is
  probably at the door.
- Longinus 10.1–3 (Sappho fr. 31).
- *Symposium* 189–193 (round people, all three pairings at 191d–192b) and 182 (Elis and Boeotia; Ionia "under foreign sway"; Athens complicated).
- Thucydides 6.54.1–3 (a love affair the cause; Hipparchus, 514 BC).
- Plutarch, *Alcibiades* 8.3–4.
- Lysias 1 (killing the adulterer; seducer versus rapist in 1.32–33).
- Harris, CQ 40 (1990).
- *Lysistrata* 212–236 (oath lines repeated by Calonice; 411 BC).
- Bibliography: Oakley and Sinos 1993, Dover 1978, Kapparis 1999 and Harris 1990 all exist as described. The muse.jhu.edu "checked" link
  is behind a bot challenge and could not be opened.

**Count: 2 findings (1 medium–high, 1 low).**

---

## Slavery (`slavery.ts`)

### 1. "The only ancient figure for Athens" is not right
- **Claim:** "The only ancient figure for Athens comes from a lost chronicle by Ctesicles, again quoted by Athenaeus…"
- **Problem:** There is at least one other ancient total. After Chaeronea (338 BC) Hyperides proposed arming "more than 150,000" slaves
  "from the silver mines and the rest of the countryside" (Hyperides fr. 29 Jensen, preserved in the Suda). Modern discussions of
  Athenian slave numbers always set it beside the Ctesicles figure. Thucydides 7.27.5 (20,000 deserters, cited later in the same article)
  is a further, partial figure.
- **Evidence:** Akrigg, *Population and Economy in Classical Athens* (CUP 2019), ch. 4 "Population Size 2: Non-Citizens"
  (https://www.cambridge.org/core/books/population-and-economy-in-classical-athens/population-size-2-noncitizens/5B4418529EDF6E9DC300F43190ECDF6E),
  which discusses Hyperides' "150,000 or more slaves from the silver mines and from the rest of the countryside".
- **Suggested fix:** "The best-known ancient figure for Athens comes from a lost chronicle by Ctesicles…". Optionally add: "(the orator
  Hyperides, in 338 BC, spoke of more than 150,000 slaves in the mines and countryside)".
- **Confidence:** high

**Checked, no problems found in:**
- Aristotle, *Politics* 1.1253b (the "live article of property"; the opposing view; the self-moving tools), 1.1254b–1255a (the natural
  slave) and 1.1255b ("in some instances it is not the case that one set are slaves… by nature").
- *Odyssey* 17.322–323 (Eumaeus, spoken over Argos) and 15.403–484 (kidnapped by the Phoenician nurse, sold to Laertes).
- Athenaeus 6.88 (Theopompus on Chios), 6.90 (Drimakos). The hook's "masters sacrificed" is supported: "to whomsoever he appears, they…
  sacrifice to him". 6.103 (the Ctesicles census).
- Demosthenes 27.9 (sword-makers at 5–6 minas) and Thucydides 7.27.5 (more than 20,000 slaves).
- Isaeus 8.12.
- Demosthenes 36.4, 36.8, 36.43 and 36.48 (Pasion, Antisthenes and Archestratus, the lease of bank and shield workshop, marriage to the
  widow by the will, "Pasio belonged to Archestratus").
- Thucydides 8.40.2 (Chian slaves most numerous after Sparta, harshly punished, deserting).
- Peter Hunt's review of Andreau and Descat (BMCR 2012.10.26) contains the quoted words exactly: "a suspiciously high number even for the
  peak of Athens' fifth-century empire". Note that it continues "and even less plausible in the late fourth century", so the site's use is fair.
- Melos 416 BC. Gagarin 1996. Forsdyke 2012.
- Image `stele-woman-and-servant`: Met 36.11.1, "Marble grave stele of a young woman and servant", c. 400–390 BCE, matches.

**Count: 1 finding (high).**

---

## Women's lives (`womens-lives.ts`)

No substantive problems found.

**Checked, no problems found in:**
- Thucydides 2.45.2.
- Schaps, CQ 27 (1977) 323–330 (the claim about which women orators named matches his argument).
- LSJ κύριος "guardian of a woman" (site data).
- Isaeus 10.10 (the barley law).
- Euripides, *Medea* 230–234 and 248–251 (431 BC).
- Met 247106: "Painted limestone funerary stele with a woman in childbirth", late 4th–early 3rd century BCE, "Early Hellenistic", acc.
  04.17.1, matches.
- Demosthenes 57.45 (the ribbon-seller and wet-nurse; women as nurses, wool-workers and grape-pickers in the city's misfortunes).
- *Lysistrata* 641–647.
- Lysimache, 64 years, portrait statue on the Acropolis. This is confirmed in Keesling's review: "served for a remarkable 64 years,
  received a portrait statue on the Acropolis".
- Connelly against Keesling. Keesling (BMCR 2007.08.43) does stress "how much of the available evidence is Athenian, and by how late in
  date most of it is" and "the yawning gap between the practices attested in the fifth century B.C. and the elaborate public honors of
  later periods".
- Xenophon, *Lac. Pol.* 1.3–4.
- Aristotle, *Politics* 2.1270a ("nearly two-fifths… owned by women").
- Plutarch, *Lycurgus* 14.4 (Gorgo).
- Plato, *Republic* 5.456a.
- Image `fountain-house-hydria` (Met 06.1021.77, c. 510–500 BCE, Class of Hamburg 1917.477) matches.
- Bibliography: Blundell 1995, Pomeroy 1975, Schaps 1977 and Connelly 2007 all exist as described.

**Count: 0 findings.**

---

## The household (`household.ts`)

No substantive problems found.

**Checked, no problems found in:**
- Hesiod, *WD* 405.
- Aristotle, *Politics* 1.1252b ("the ox serves instead of a servant for the poor") and 1.1253b.
- Olynthos sacked by Philip II in 348 BC; Robinson's excavations in the 1920s–30s.
- House plan (court at centre or south, pastas, square andron with off-centre door, cement floors with mosaics, clay bathtub). This matches
  the Olynthos Project description as quoted in search results. The project page itself is behind a Cloudflare challenge and could not be
  opened directly.
- Xenophon, *Oeconomicus* 9.4 (house fronts south), 7.35–36, 9.3 (storeroom), 7.37 (nursing sick slaves; the wife's reply) and 9.5 (bolted door).
- Cahill (BMCR 2002.10.26): "a more complex process of abandonment, looting and salvaging, probably over a period of years, both before and
  after 348", and on gendered space "no clear division of space is discernible". Both match the article exactly.
- Demosthenes 27.4 (aged seven), 27.9 (estate) and 27.10 (ivory, iron, wood; house of 3,000 drachmas; his mother's jewellery).
- LSJ τοιχωρύχος "one who digs through the wall, housebreaker, burglar" (site data).
- Thucydides 2.14.1 (woodwork of the houses).
- Bibliography: Cahill 2002, Nevett 1999 and Pomeroy 1994 exist as described.

Minor note, not a finding: the hook says Robinson uncovered "more than a hundred houses", the body says "some hundred" and the timeline
says "about a hundred". These are consistent enough, but you may want one wording.

**Count: 0 findings.**

---

## Mycenae (`mycenae.ts`)

### 1. "At least three hundred years before any date… proposed for a Trojan War" is wrong
- **Claim:** "They belong to the sixteenth century BC, at least three hundred years before any date that ancient or modern writers have
  proposed for a Trojan War."
- **Problem:** The last burials in Grave Circle A date to about 1500 BC. The earliest major ancient date for the Trojan War, Duris of Samos'
  1334 BC, is only about 170 years later. Herodotus' date of c. 1250 is about 250 years later. Modern candidates for a historical
  destruction of Troy (Troy VIh c. 1300, VIIa c. 1180) also fall within 300 years for the earlier of them. "At least three hundred years
  before any date" therefore overstates the gap.
- **Evidence:** Wikipedia, "Grave Circle A, Mycenae": "the last interment took place circa 1500 BC"
  (https://en.wikipedia.org/wiki/Grave_Circle_A,_Mycenae). Wikipedia, "Trojan War" and "Duris of Samos": Duris dated it to 1334 BC,
  Herodotus c. 1250, Eratosthenes 1184/3 (https://en.wikipedia.org/wiki/Trojan_War).
- **Suggested fix:** "They belong to the sixteenth century BC, two to three centuries earlier than the dates usually given for a Trojan War."
- **Confidence:** high

### 2. People did live at Mycenae after the Argives destroyed it
- **Claim:** "People went on living at Mycenae, on a smaller scale, until the Argives ended it."
- **Problem:** This is misleading as a final statement. Mycenae was resettled in the Hellenistic period (3rd–2nd century BC) as a village
  of Argos. The citadel wall and the Archaic temple were repaired, and a small theatre was built over the approach to the "Tomb of
  Clytemnestra", a tomb the article itself mentions. Diodorus' "uninhabited until our times" (11.65.5) is itself contradicted by the archaeology.
- **Evidence:** Wikipedia, "Mycenae" and "Tomb of Clytemnestra": in the Hellenistic period "the people of Argos founded a village on the
  Mycenae hill… built a small theatre over the walkway to the tholos Tomb of Clytemnestra" (https://en.wikipedia.org/wiki/Tomb_of_Clytemnestra).
  Elizabeth French, *Mycenae: Agamemnon's Capital* (2002), already in the bibliography, covers the Hellenistic town.
- **Suggested fix:** "…until the Argives ended it in the 460s. Argos later refounded a small Hellenistic village there, with a theatre built
  over the approach to the 'Tomb of Clytemnestra'."
- **Confidence:** high

### 3. Not all the graves Pausanias was shown were of men murdered at the feast
- **Claim:** "Pausanias was also shown the graves of Atreus, of Agamemnon, of his charioteer, of Cassandra's twin sons, all murdered by
  Aegisthus at the homecoming feast"
- **Problem:** Pausanias lists the grave of Atreus *together with* the graves of those who came back from Troy with Agamemnon and were
  murdered at Aegisthus' banquet. Atreus was not one of the feast's victims; he belongs to the previous generation. As written, "all
  murdered… at the homecoming feast" includes Atreus.
- **Evidence:** Pausanias 2.16.6: "There is the grave of Atreus, along with the graves of such as returned with Agamemnon from Troy, and
  were murdered by Aegisthus after he had given them a banquet… Agamemnon has his tomb, and so has Eurymedon the charioteer, while another
  is shared by Teledamus and Pelops, twin sons… of Cassandra".
- **Suggested fix:** "Pausanias was also shown the grave of Atreus, and the graves of Agamemnon, of his charioteer, of Cassandra's twin sons
  and of the others murdered by Aegisthus at the homecoming feast…"
- **Confidence:** medium–high

**Checked, no problems found in:**
- *Iliad* 11.45–46 (πολυχρύσοιο Μυκήνης).
- Thucydides 1.10.2.
- Herodotus 7.202.1 (80 Mycenaeans).
- Diodorus 11.65.1–5 (archon Theagenides = 468/7; Mycenae alone of the Argolid fought at Thermopylae; siege, enslavement, razing).
- Strabo 8.6.10.
- Pausanias 2.16.5 (wall, gate, lions, Cyclopes) and 2.16.7.
- Schliemann 1876; Grave Circle A, six graves; Stamatakis completed Grave VI in 1877.
- Grave Circle B found 1951 near the Tomb of Clytemnestra, c. 1650 BC (late 17th c.).
- Lion Gate and walls 13th c.; destruction c. 1200.
- Linear B at Mycenae.
- *Archaeology* 52.4 (Harrington): Calder argues forgery, Demakopoulou "The Case for Authenticity", Lapatin "Not a forgery, how about a
  pastiche?". The page says Schliemann "never identified it as belonging to Agamemnon", which supports the article's "Did you know?" box.
- Image `mask-of-agamemnon` (NAMA 624, 16th c. BC).
- Bibliography: Traill 1995, Gere 2006, French 2002, Dickinson 1994, Papazoglou-Manioudaki et al. BSA 104 (2009), Harrington 1999 all exist
  as described.

**Count: 3 findings (2 high, 1 medium–high).**

---

## Pericles (`pericles.ts`)

No substantive problems found.

**Checked, no problems found in:**
- Plutarch, *Pericles* 3.1 (Xanthippus at Mycale; Agariste and Cleisthenes), 3.2 (squill-head, helmets), 8.2 (reasons for "Olympian"),
  9.4 (Ephialtes stripped the Areopagus, with Pericles behind him), 12.2, 16.3 ("no less than fifteen" years of continuous generalships
  after the ostracism of Thucydides son of Melesias), 37.5 (the son enrolled; executed after Arginusae) and 38.4.
- *Ath. Pol.* 27.1 (took some powers from the Areopagites; first made his name prosecuting Cimon), 27.3 (first to pay jurors, to outbid
  Cimon, who fed the Laciadae) and 26.3 (archon Antidotus = 451/0, both parents citizens).
- Aristophanes, *Acharnians* 530–531.
- Thucydides 1.22.1, 2.37.1, 2.65.3 (fined, re-elected) and 2.65.9.
- Plato, *Gorgias* 515e ("idle, cowardly, talkative, and avaricious… public fees").
- Dates: 479, 462/1, 454, 451/0, 447, c. 443, 431, 430, 429.
- Image `pericles-bust` (British Museum, Roman copy of a c. 440–430 BC original).
- Bibliography: Azoulay 2014, Stadter 1989 and Rhodes 1981 exist as described.

**Count: 0 findings.**

---

## Greek statues were painted (`painted-statues.ts`)

No substantive problems found.

**Checked, no problems found in:**
- Plato, *Republic* 4.420c–d (quotation context).
- Euripides, *Helen* 262–263 (412 BC).
- LSJ ἄγαλμα ("statue in honour of a god").
- The Acropolis korai buried after 480 BC.
- Egyptian blue's infrared luminescence under visible light (Verri, ABC 394 (2009) 1011–1021).
- Winckelmann 1764.
- *Bunte Götter* / *Gods in Color* first shown at the Munich Glyptothek, December 2003 to February 2004.
- *Chroma* (2025), eds. Hemingway, Lepinski and Brinkmann, Metropolitan Museum: confirmed.
- Brinkmann and Wünsche, *Gods in Color* (2007).

Could not verify: the image `peplos-kore-colour` is described as a reconstruction "by Vinzenz Brinkmann and Ulrike Koch-Brinkmann", and
the Commons file name calls it "Peplos Kore as Athena". I did not check which version of the reconstruction this is. It is worth a glance
but is not likely to be an error.

**Count: 0 findings.**

---

## Summary

| Article | Findings |
|---|---|
| drugs-and-poisons | 3 (medium, low–medium, low) |
| love-sex-and-marriage | 2 (medium–high, low) |
| slavery | 1 (high) |
| womens-lives | 0 |
| household | 0 |
| mycenae | 3 (high, high, medium–high) |
| pericles | 0 |
| painted-statues | 0 |

All 48 `cts:` links point to passages that support the sentence they are attached to. None is a wrong reference.
