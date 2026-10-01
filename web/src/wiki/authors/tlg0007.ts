/**
 * Plutarch. Checked on 2026-10-02 against the sources listed at the bottom (notes on each claim:
 * pipeline/drafts/checked/tlg0007.md). Left out because nothing reliable could be found or the sources
 * disagree: his Greek style (Koine, avoidance of hiatus); his death at Chaeronea (the place is not given);
 * a visit to Rome in 90 and lecturing there in that year; the "two-volume" arrangement of the Lives;
 * Laurentianus 69.6 and Marcianus gr. 385; Parisinus gr. 1672 as "fourteenth century" (its date is disputed,
 * so the dispute is given instead); the Epaminondas and Scipio as the pair that "opened the series"; the
 * dates of Ziegler's Teubner Lives (1957–80) and of the Teubner Moralia (1925–78); the Lamprias letter as a
 * forgery; his years as manager of the Amphictyonic League.
 */
import type { AuthorArticle } from "../author-articles";

export const plutarch: AuthorArticle = {
  id: "tlg0007",
  summary: `Plutarch spent most of his life in Chaeronea, a small town in Boeotia about 30 km east of Delphi.[^1] He knew what that cost a writer of history, who ought, he says, to live in a famous, populous city full of books. «ἡμεῖς δὲ μικρὰν οἰκοῦντες πόλιν, καὶ ἵνα μὴ μικροτέρα γένηται φιλοχωροῦντες»: “I live in a small city, and I prefer to dwell there that it may not become smaller still”.[^2]

As a young man he studied philosophy at Athens with a Platonist called Ammonius, while Nero was in Greece, in 66/67.[^3,1] He remembered it long afterwards: in his essay *The E at Delphi* he recalls what, “when Nero was here some years ago, I had heard Ammonius and others discussing”.[^4]

{debated} His birth date is worked out from that remark. If he was not more than twenty when he studied with Ammonius, he was born between AD 45 and 47.[^3]

He stayed on at Athens long enough to become an Athenian citizen, and travelled widely, to Rome and to Alexandria.[^3] About AD 70 he visited Rome with Lucius Mestrius Florus, an associate of the new emperor Vespasian, who sponsored him as a Roman citizen.[^1] In Rome and Italy, he says, he was too busy with “my public duties and the number of my pupils in philosophy” to practise Latin: “It was therefore late and when I was well on in years that I began to study Roman literature”.[^2]

{debated} As a Roman citizen he was possibly called Lucius Mestrius Plutarchus.[^1]

His father was Autobulus, his brothers Timon and Lamprias. He married Timoxena, and they had at least four sons and a daughter, two of whom died in childhood.[^1] A letter survives in which he comforts his wife after their little girl died: “This daughter was born after four sons, when you were longing to bear a daughter; which made me call her by your own name.” She lived two years, and he asks his wife to count “the two years of her life” among their blessings.[^5]

### Priest at Delphi

About AD 95 he became one of the two priests of Apollo's temple at Delphi.[^1] In an essay urging an old man to stay in public life, he holds himself up as the example: “I have been serving the Pythian Apollo for many Pythiads”.[^6] He wrote several works about Delphi and its rites:[^3] [*The E at Delphi*](cts:tlg0007.tlg090:1), [*The Oracle at Delphi No Longer Given in Verse*](cts:tlg0007.tlg091:1) and [*The Obsolescence of Oracles*](cts:tlg0007.tlg092:1). *The E at Delphi* opens with him sending a friend “some of our Pythian discourses”, and has him sitting near the temple with his sons and some visitors, puzzling over the letter E dedicated there.[^4]

{legend} One of the Delphic dialogues, *The Obsolescence of Oracles*, holds a strange story, told by one of the speakers. On a ship off the island of Paxi a voice called to the Egyptian pilot Thamus, and told him to announce «Πὰν ὁ μέγας τέθνηκε», “Great Pan is dead”; when he did, a great cry of lament went up, and the emperor Tiberius had the story looked into.[^7]

He was still alive in 119, the year in which, by a notice in Eusebius' *Chronicle*, Hadrian made him procurator of Achaea;[^3] Wikipedia calls the post nominal.[^1]

### The Parallel Lives

The *Lives* pair a famous Greek with a famous Roman. Twenty-three pairs survive, and four single Lives: Artaxerxes, Aratus, Galba and Otho.[^1] They were probably written at the beginning of the second century.[^8] He addresses the *Theseus* to Sosius Senecio,[^9] a Roman senator who was consul in 99 and again in 107.[^10] He knows the ground grows soft the further back he goes, and says so with a picture: just as mapmakers write on the edges of their maps that the rest is desert and wild beasts, so of the oldest times he might say “What lies beyond is full of marvels and unreality”.[^9]

What he wanted was character, not campaigns. The *Alexander* opens: «οὔτε γὰρ ἱστορίας γράφομεν, ἀλλὰ βίους», “For it is not Histories that I am writing, but Lives”, and “a slight thing like a phrase or a jest often makes a greater revelation of character than battles where thousands fall”.[^11] He says he began the work for others, and kept on for his own sake, «ὥσπερ ἐν ἐσόπτρῳ τῇ ἱστορίᾳ», “using history as a mirror” for his own life.[^12]

Not everything survives. His earliest biographies were Lives of the Roman emperors from Augustus to Vitellius, and of these only *Galba* and *Otho* are left. Lives of Heracles, Philip II of Macedon, Epaminondas and the two Scipios are lost.[^1] Epaminondas had been paired with a Scipio, and both halves are gone.[^8]

### The Moralia

Everything else he wrote is gathered under the title *Moralia*: seventy-eight essays and speeches.[^1,13] The range is wide: [*Isis and Osiris*](cts:tlg0007.tlg089:1), [*Advice to Bride and Groom*](cts:tlg0007.tlg078:1), [*Concerning Talkativeness*](cts:tlg0007.tlg101:1), [*Whether Land or Sea Animals Are Cleverer*](cts:tlg0007.tlg129:1), [*the face in the moon*](cts:tlg0007.tlg126:1) and the [*Table Talk*](cts:tlg0007.tlg112:1.0.1). The name *Moralia* was first given to a set of eleven ethical works in a fourteenth-century manuscript.[^3] An ancient list of his writings, the Lamprias catalogue, supposedly drawn up by a son called Lamprias, names 227 works.[^3,1]

Two speeches against eating meat, from his youth, show what their modern editors call “a foible of Plutarch’s early manhood”, the Pythagorean or Orphic refusal of animal food.[^14] And he could be fierce. In *On the Malice of Herodotus* he takes on the historian for his treatment of the Boeotians and Corinthians, saying “I think myself obliged to defend our ancestors and the truth”.[^15]

### His readers

In 1559 Jacques Amyot published a French translation of the *Lives*, and in 1572 of the *Moralia*. Sir Thomas North put Amyot's French into English in 1579,[^1] and Shakespeare used North for his *Coriolanus*, *Julius Caesar* and *Antony and Cleopatra*.[^16] You can watch it happen. Plutarch's Cleopatra sails up the river Cydnus “in a barge with gilded poop, its sails spread purple”;[^17] in North she has a barge “the poop whereof was of gold, the sales of purple” (*sales*: sails, in North's spelling), and the barge speech in Shakespeare's play closely follows North.[^18]

Philemon Holland made the first complete English *Moralia* from the Greek in 1603; in 1683 John Dryden oversaw a translation of the *Lives*. Montaigne's *Essays* refer to Plutarch more than four hundred times, and Emerson called the *Lives* “a bible for heroes”.[^1] Shelley found the speeches on meat-eating inspiring, and in 1813 wrote that he had translated them; the translation is lost.[^14]`,

  timeline: [
    { year: 46, approx: true, kind: "writing", what: "Born at Chaeronea in Boeotia, between AD 45 and 47", src: [3, 1] },
    { year: 66, kind: "writing", what: "Studies philosophy at Athens with Ammonius, while Nero is in Greece (66/67)", src: [3, 1, 4] },
    { year: 70, approx: true, kind: "writing", what: "Visits Rome with Lucius Mestrius Florus", src: [1] },
    { year: 95, approx: true, kind: "writing", what: "Becomes one of the two priests of Apollo at Delphi", src: [1, 6] },
    { year: 100, approx: true, kind: "writing", what: "The *Parallel Lives*, probably written at the beginning of the second century", src: [8] },
    { year: 119, kind: "writing", what: "Still alive; made procurator of Achaea by Hadrian", src: [3, 1] },
    { year: 1296, kind: "copy", what: "A professional scribe finishes Parisinus gr. 1671 on 11 July: the *Lives* and the *Moralia*, revised by Maximus Planudes", src: [20] },
    { year: 1302, kind: "copy", what: "Planudes adds a list of 69 Plutarch titles to his manuscript of the Greek Anthology", src: [21] },
    { year: 1470, approx: true, kind: "print", what: "The *Lives* are first printed, in a Latin translation, at Rome", src: [8] },
    { year: 1509, kind: "print", what: "Aldus Manutius prints the Greek *Moralia* at Venice; Erasmus is one of its proofreaders", src: [13, 22] },
    { year: 1517, kind: "print", what: "The Greek *Lives* are first printed, by Philippus Junta at Florence", src: [16, 22] },
    { year: 1519, kind: "print", what: "The Aldine *Lives*, from better manuscripts at Venice", src: [16] },
    { year: 1559, kind: "print", what: "Jacques Amyot's French translation of the *Lives*", src: [1, 16] },
    { year: 1572, kind: "print", what: "Amyot's French *Moralia*; the Stephanus edition sets the *Moralia* in fourteen books", src: [1, 13] },
    { year: 1579, kind: "print", what: "Thomas North's English *Lives*, from Amyot's French: Shakespeare's source", src: [1, 16] },
    { year: 1603, kind: "print", what: "Philemon Holland's English *Moralia*, the first complete one from the Greek", src: [1] },
    { year: 1683, kind: "print", what: "The *Lives* in a translation overseen by John Dryden", src: [1] },
    { year: 1813, kind: "reception", what: "Shelley writes that he has translated the speeches *On the Eating of Flesh*", src: [14] },
    { year: 1914, kind: "print", what: "The first Teubner volume of Lindskog and Ziegler's *Lives*, and Perrin's first Loeb volume", src: [23, 9] },
    { year: 2016, kind: "print", what: "The first papyrus of the *Life of Alexander* is published, in the Oxyrhynchus Papyri", src: [19] },
  ],

  transmission: `**Papyri.** A volume of the Oxyrhynchus Papyri published in 2016 contains a small fragment of Plutarch: the first copy of the *Life of Alexander* known on papyrus.[^19]

**The Lives.** Bernadotte Perrin, introducing the Loeb *Lives* in 1914, named the oldest manuscripts. The Codex Sangermanensis (Sg), of the tenth century, is the oldest, but holds only fifteen Lives. The Codex Seitenstettensis (S), from the monastery of Seitenstetten in Austria, is of the eleventh century and holds sixteen; only since 1870 has it been known as the best manuscript of all. Three Paris manuscripts, numbered 1671 (A), 1672 (C) and 1674 (D), he called “of supreme importance”.[^16]

**Planudes.** The Byzantine scholar Maximus Planudes had a hand in the Plutarch we read. Parisinus gr. 1671 was written by a single professional scribe, who finished on 11 July 1296, and was “revised and corrected by Planudes” (our translation); it holds the *Lives*, arranged in three volumes, and the *Moralia*.[^20] In 1302 Planudes wrote into his manuscript of the Greek Anthology a list of the titles of sixty-nine works of Plutarch.[^21]

{debated} Only one manuscript, Parisinus gr. 1672, contains all seventy-eight works of the *Moralia*. G. R. Manton (1949) dated it soon after 1302 and took it to have been made at Planudes' prompting;[^21] Philippe Hoffmann (1983) says that the great book, long thought to come from Planudes' workshop, is at least half a century later than his death.[^20]

**Print.** The *Lives* first appeared in Latin, at Rome, about 1470.[^8] The Greek *Moralia* came first, from Aldus Manutius at Venice in March 1509, edited by Demetrius Ducas, with Erasmus and Girolamo Aleandro as its proofreaders.[^13,22] The Greek *Lives* followed in 1517 from Philippus Junta at Florence, from Florentine manuscripts that Perrin judged “of relatively inferior value”; the Aldine *Lives* of 1519 used better ones from Venice.[^16,22] Since the Stephanus edition of 1572 the *Moralia* have been arranged in fourteen books.[^13]

**The modern text.** Modern work on the *Lives* begins, in Yitzhak Dana's account, with Konrat Ziegler's study of their manuscripts in 1907. Ziegler and Claes Lindskog then compared all the Greek manuscripts available to them, and the first volume of their Teubner edition came out in 1914.[^23]`,

  variants: `**The order of the Lives.** The order in which the *Lives* are printed is not Plutarch's own: “the order of the Lives in our collection is not the original one”, as Perrin put it.[^16] Plutarch numbers some of the books himself. *Demosthenes and Cicero* is “this fifth book of my Parallel Lives”,[^2] *Pericles and Fabius* “this tenth book”,[^24] and *Dion and Brutus* “the twelfth book of my Parallel Lives”.[^25] In the Scroll's list, *Pericles and Fabius* is the fifth pair, and *Demosthenes and Cicero* comes near the end. He also says he wrote *Lycurgus and Numa* before *Theseus and Romulus*, which now come first.[^9]

**Two traditions.** According to Dana's review of the Teubner text, only for the first volume of the *Lives* are there two lines of manuscripts, “a better textual tradition versus an inferior one”.[^23] The Alexander papyrus of 2016 is said to be of “some text-critical interest” for the wording of that Life.[^19]

**Damaged works.** Some of the *Moralia* reach us broken. *On the Face which Appears in the Orb of the Moon* is, its Loeb editor writes, “certainly mutilated at the beginning, although one cannot tell whether much or little has been lost”, and he adds that he holds this “despite statements to the contrary”.[^26] The speeches *On the Eating of Flesh* are worse: the text we have comes from someone who made extracts from them and, the editors think, added “stupid interpolations” and a passage from another work.[^14]

**Works that are not his.** The *Moralia* as printed include works Plutarch did not write. Of the first, *The Education of Children*, its Loeb translator writes: “It is generally believed that the essay which stands first in the collected works of Plutarch cannot have been written by him.”[^27] The *Lives of the Ten Orators*, *On the Opinions of the Philosophers*, *On Fate* and *On Music* are counted among the works of an unknown “Pseudo-Plutarch”.[^13] So are the *Consolation to Apollonius*, *Whether Fire or Water is More Useful* and the *Greek and Roman Parallel Stories*.[^28] All of these are in the Scroll under Plutarch's name: [*The Lives of the Ten Orators*](cts:tlg0007.tlg121:1.1), [*On Fate*](cts:tlg0007.tlg108:1), [*A Letter of Condolence to Apollonius*](cts:tlg0007.tlg076:1), [*Whether Water or Fire Is More Useful*](cts:tlg0007.tlg128:1) and [*Greek and Roman Parallel Stories*](cts:tlg0007.tlg085:1).

**And works the old list misses.** The Lamprias catalogue is not a safe guide either way. The speeches on meat-eating are “one of the eighteen works of the received Corpus of Plutarch that do not appear in the Lamprias Catalogue”, and so, their editors point out, is the *Table Talk*: “the Symposiacs themselves are not to be found there”.[^14]`,

  editions: [
    { text: "B. Perrin, *Plutarch's Lives*, 11 vols (Loeb Classical Library, 1914–26).[^9]", note: "The Greek text and English translation of the *Lives* in the Scroll are Perseus's copies of Perrin's." },
    { text: "*Plutarch's Moralia*, in sixteen volumes (Loeb Classical Library), translated by F. C. Babbitt, W. C. Helmbold, H. N. Fowler, H. Cherniss and others.[^29,4,6,26]", note: "Many of the Scroll's English *Moralia*, and some of its Greek, come from these volumes." },
    { text: "F. H. Sandbach, *Plutarch's Moralia*, vol. XV: *Fragments* (Loeb Classical Library, 1969).[^29]", note: "The fragments of the lost works." },
    { text: "G. N. Bernardakis, *Plutarchi Chaeronensis Moralia* (Teubner, Leipzig, from 1888).[^4]", note: "Much of the Scroll's Greek *Moralia*; the volumes used are dated 1888 to 1895." },
    { text: "W. W. Goodwin (ed.), *Plutarch's Morals*, 5 vols (Boston, Little, Brown, 1874).[^5]", note: "Translations by many hands, edited by Goodwin; the Scroll's second English *Moralia*." },
    { text: "Cl. Lindskog and K. Ziegler, *Plutarchi Vitae Parallelae* (Teubner, from 1914); vol. I, fasc. 1, fifth edition by H. Gärtner (K. G. Saur, 2000).[^23]", note: "The critical text built on Ziegler's study of the manuscripts." },
    { text: "R. Flacelière and É. Chambry, *Plutarque, Vies* (Budé, Les Belles Lettres); for example tome XII, *Démosthène–Cicéron* (Paris, 1976).[^30]", note: "Greek text with a French translation." },
    { text: "R. Waterfield (trans.), with introduction and notes by P. A. Stadter, *Plutarch: Greek Lives* (Oxford World's Classics, 1998).[^31]", note: "A modern English translation." },
  ],

  sources: [
    { label: "Wikipedia, Plutarch (Chaeronea, family, Ammonius, Florus and the Roman name, the priesthood at Delphi, Hadrian, the Lives and Moralia, lost Lives, Amyot, North, Holland, Dryden, Montaigne, Emerson)", url: "https://en.wikipedia.org/wiki/Plutarch" },
    { label: "Plutarch, Demosthenes 2.1–3.1, in the Scroll (the small city; Latin learned late; the fifth book)", cite: { work: "tlg0007.tlg054", ref: "2.1", to: "3.1" } },
    { label: "George Karamanolis, “Plutarch”, Stanford Encyclopedia of Philosophy (birth 45–47, Ammonius under Nero, travels, the Lamprias catalogue, the name Moralia, Hadrian in 119)", url: "https://plato.stanford.edu/entries/plutarch/" },
    { label: "Plutarch, The E at Delphi 1, in the Scroll (Ammonius and Nero; the Pythian discourses). The Greek is Bernardakis's Teubner text (vol. 3, 1891) and the English Babbitt's Loeb, as the files' headers say", cite: { work: "tlg0007.tlg090", ref: "1" } },
    { label: "Plutarch, Consolation to His Wife 2–8, in the Scroll; the English is from Goodwin's Plutarch's Morals (Boston, 1874), as the file's header says", cite: { work: "tlg0007.tlg111", ref: "2", to: "8" } },
    { label: "Plutarch, Whether an Old Man Should Engage in Public Affairs 17, in the Scroll", cite: { work: "tlg0007.tlg117", ref: "17" } },
    { label: "Plutarch, The Obsolescence of Oracles 17, in the Scroll (Great Pan is dead)", cite: { work: "tlg0007.tlg092", ref: "17" } },
    { label: "Wikipedia, Parallel Lives (date of writing; Epaminondas and Scipio lost; the Latin edition of about 1470)", url: "https://en.wikipedia.org/wiki/Parallel_Lives" },
    { label: "Plutarch, Theseus 1.1–1.2, in the Scroll (Sosius Senecio; the edges of the map; Lycurgus and Numa written first). The Greek and English are Perrin's Loeb (vol. 1, 1914), as the files' headers say", cite: { work: "tlg0007.tlg001", ref: "1.1", to: "1.2" } },
    { label: "Wikipedia, Quintus Sosius Senecio (senator; consul in 99 and 107; Plutarch's dedications)", url: "https://en.wikipedia.org/wiki/Quintus_Sosius_Senecio" },
    { label: "Plutarch, Alexander 1.1–1.3, in the Scroll", cite: { work: "tlg0007.tlg047", ref: "1.1", to: "1.3" } },
    { label: "Plutarch, Timoleon, preface (0.1–0.2), in the Scroll", cite: { work: "tlg0007.tlg018", ref: "0.1", to: "0.2" } },
    { label: "Wikipedia, Moralia (78 essays; the Aldine edition of March 1509 and its proofreaders; the Stephanus edition of 1572; works by Pseudo-Plutarch)", url: "https://en.wikipedia.org/wiki/Moralia" },
    { label: "Plutarch, On the Eating of Flesh 1, in the Scroll, with the introduction of its Loeb translators, H. Cherniss and W. C. Helmbold (1957)", cite: { work: "tlg0007.tlg131", ref: "1" } },
    { label: "Plutarch, On the Malice of Herodotus 1, in the Scroll", cite: { work: "tlg0007.tlg123", ref: "1" } },
    { label: "Bernadotte Perrin, Translator's Introduction to the Loeb Plutarch's Lives, vol. 1 (1914), on LacusCurtius (manuscripts, first editions, Amyot, North and Shakespeare)", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Introduction*.html" },
    { label: "Plutarch, Antony 26.1–26.3, in the Scroll (Cleopatra's barge)", cite: { work: "tlg0007.tlg058", ref: "26.1", to: "26.3" } },
    { label: "Mark Womack, “The Barge Speech from Antony and Cleopatra” (North's text beside Shakespeare's)", url: "https://drmarkwomack.com/engl-3306/handouts/sources-and-adaptations/the-barge-speech-from-antony-cleopatra/" },
    { label: "Bryn Mawr Classical Review 2017.06.39, review by Michael Zellmann-Rohrer of The Oxyrhynchus Papyri, vol. LXXXII (2016)", url: "https://bmcr.brynmawr.edu/2017/2017.06.39/" },
    { label: "Philippe Hoffmann, “Deux témoins apparentés des Vies de Plutarque: les Parisini gr. 1671 (A) et 1674 (D)”, Scriptorium 37 (1983), 259–264 (Persée)", url: "https://www.persee.fr/doc/scrip_0036-9772_1983_num_37_2_1319" },
    { label: "G. R. Manton, “The Manuscript Tradition of Plutarch Moralia 70–71”, The Classical Quarterly 43 (1949)", url: "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/B5870248E55A0882FE7B8295838F65E0/S0009838800028068a.pdf/manuscript_tradition_of_plutarch_moralia_7071.pdf" },
    { label: "Wikipedia, List of editiones principes in Greek (Moralia: Venice, Aldus, 1509, ed. Demetrius Ducas; Lives: Florence, Junta, 1517)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Bryn Mawr Classical Review 2001.05.08, Yitzhak Dana on Plutarchus, Vitae Parallelae, vol. I, fasc. 1, fifth edition by Hans Gärtner (2000)", url: "https://bmcr.brynmawr.edu/2001/2001.05.08" },
    { label: "Plutarch, Pericles 2.4, in the Scroll (the tenth book)", cite: { work: "tlg0007.tlg012", ref: "2.4" } },
    { label: "Plutarch, Dion 2.7, in the Scroll (the twelfth book)", cite: { work: "tlg0007.tlg060", ref: "2.7" } },
    { label: "Plutarch, On the Face which Appears in the Orb of the Moon 1, in the Scroll, with H. Cherniss's Loeb introduction (1957)", cite: { work: "tlg0007.tlg126", ref: "1" } },
    { label: "Plutarch (attributed), The Education of Children 1, in the Scroll, with F. C. Babbitt's Loeb introduction", cite: { work: "tlg0007.tlg067", ref: "1" } },
    { label: "Wikipedia, Pseudo-Plutarch (the works wrongly attributed to Plutarch)", url: "https://en.wikipedia.org/wiki/Pseudo-Plutarch" },
    { label: "WorldCat, Plutarch's Moralia: in sixteen volumes, vol. XV, Fragments, ed. and trans. F. H. Sandbach (Heinemann and Harvard University Press, 1969)", url: "https://search.worldcat.org/title/plutarchs-moralia-in-sixteen-volumes-vol-xv-fragments-ed-and-transl-by-fh-sandbach/oclc/768909932" },
    { label: "Revue des Études Anciennes 85 (1983), J. Puiggali's review of Plutarque, Vies, tome XII, Démosthène–Cicéron, ed. and trans. R. Flacelière and E. Chambry (Les Belles Lettres, 1976) (Persée)", url: "https://www.persee.fr/doc/rea_0035-2004_1983_num_85_1_5540_t1_0139_0000_2" },
    { label: "Robin Waterfield, Plutarch: Greek Lives (Oxford World's Classics, 1998; introduction and notes by Philip Stadter)", url: "https://robinwaterfield.com/book/plutarch-greek-lives/" },
  ],
  outsideQuotes: [
    "the poop whereof was of gold, the sales of purple",
    "a bible for heroes",
    "of supreme importance",
    "revised and corrected by Planudes",
    "of relatively inferior value",
    "the order of the Lives in our collection is not the original one",
    "a better textual tradition versus an inferior one",
    "some text-critical interest",
  ],
  checked: "2026-10-02",
};
