/**
 * Aristotle. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing
 * reliable could be found: Cicero's "golden stream" (the page would not open), Strabo's cellar story,
 * the dates of Andronicus of Rhodes, "over a thousand" manuscripts, the dates of Parisinus 1854 and
 * Marcianus 213, Grosseteste's translation, Arabic translations at Baghdad in the 9th and 10th
 * centuries, the glosses of οὐσία and τέλος, Ross's other Oxford texts, and "Magna Moralia is disputed"
 * (Wikipedia lists it as generally agreed spurious).
 */
import type { AuthorArticle } from "../author-articles";

export const aristotle: AuthorArticle = {
  id: "tlg0086",
  summary: `Diogenes Laertius gives the outline of Aristotle's life. He was born at Stagira (384–322 BC), the son of Nicomachus, who lived at the court of Amyntas, king of Macedon, as physician and friend.[^1] By Apollodorus' chronology he joined Plato at seventeen and stayed with him twenty years.[^2] When Plato died, he went to Hermias and stayed three years; he came to Philip's court when Alexander was in his fifteenth year; he arrived back in Athens and lectured at the Lyceum for thirteen years; then he retired to Chalcis, where he died a natural death at about sixty-three, the same year Demosthenes died at Calauria.[^3]

{legend} Some said differently. Eumelus claimed that Aristotle died at Chalcis by drinking aconite, at seventy. Diogenes answers that he is mistaken, since Aristotle lived to sixty-three.[^4] And “it is said” that he displeased the king by introducing Callisthenes to him.[^3]

After Plato's death Aristotle left Athens with Xenocrates for Assos in Asia Minor. There he and Theophrastus did extensive research in botany and marine biology, which they carried on at nearby Lesbos.[^5] He returned to Athens, founded the Lyceum, and from it his school took the name Peripatetic.[^5]

Only about a third of what he wrote survives, and the treatises we have are generally thought to be lecture aids for his students.[^5] The polished dialogues he published, among them *On Philosophy*, *Eudemus*, *On Justice* and *On Good Birth*, survive only in fragments.[^6] His books had a strange journey. Plutarch says Sulla seized the library of Apellicon of Teos, in which were most of the treatises of Aristotle and Theophrastus, “not yet well known” to the public. In Rome Tyrannio the grammarian arranged them, and Andronicus of Rhodes was given copies, published them and drew up the lists then current. The older Peripatetics, Plutarch adds, had known these writings neither widely nor exactly, because the estate of Neleus of Scepsis, to whom Theophrastus left his books, fell to careless and uneducated people.[^7] Andronicus' edition was the first complete edition of the works, and the texts we have are based on it.[^6]

His Greek builds technical terms from plain words. τὸ τί ἦν εἶναι, literally “what it was to be” (our translation), is his phrase for what makes a thing what it is, and Book 7 of the *Metaphysics* turns it over at length.[^8] ἐνέργεια, in LSJ's words “activity, operation”, is another; LSJ's first example is from his *Nicomachean Ethics*.[^9]

### Things readers still argue about

**Who wrote the *Constitution of the Athenians*?** It is attributed to Aristotle or one of his students. A papyrus of it was bought in Egypt in 1890 and acquired for the British Museum, and Frederic Kenyon published the first edition in January 1891. Some think Aristotle wrote it himself as a model for the rest; a number of prominent scholars doubt it.[^10]

**One ethics or two?** Books 5, 6 and 7 of the *Nicomachean Ethics* are identical to Books 4, 5 and 6 of the *Eudemian Ethics*.[^11] The *Nicomachean Ethics* also handles pleasure in two places: Book 7, chapters 11–14, and Book 10, chapters 1–5.[^12][^13]

**What is really his?** Many works carried under his name are generally agreed to be spurious, among them *On Colours*, *On Things Heard*, *Physiognomonics*, *On Plants*, *On Marvellous Things Heard*, *Mechanics*, *On Indivisible Lines*, the *Rhetoric to Alexander*, *On Virtues and Vices* and the *Magna Moralia*. The authenticity of the *Problemata* and the *Economics* is disputed.[^6]`,

  timeline: [
    { year: -384, kind: "writing", what: "Born at Stagira, in Chalcidice, in the first year of the 99th Olympiad by Apollodorus' count", src: [1, 2] },
    { year: -367, approx: true, kind: "writing", what: "Joins Plato's Academy at seventeen, and stays about twenty years", src: [2, 5] },
    { year: -347, approx: true, kind: "writing", what: "Plato dies; Aristotle leaves Athens, going to Hermias, and to Assos and Lesbos for research", src: [2, 5] },
    { year: -343, approx: true, kind: "writing", what: "Goes to the court of Philip of Macedon, to teach the young Alexander", src: [3, 5] },
    { year: -335, approx: true, kind: "writing", what: "Back in Athens, he lectures at the Lyceum for thirteen years", src: [3, 5] },
    { year: -322, kind: "writing", what: "Dies at Chalcis, aged about sixty-three, the year Demosthenes also died", src: [3] },
    { year: 950, approx: true, kind: "copy", what: "The Florence codex Laurentianus LXXXI.11 (Kb), the oldest surviving manuscript of the *Nicomachean Ethics*, is made in the 10th century", src: [11] },
    { year: 1495, approx: true, kind: "print", what: "Aldus Manutius prints the Greek Aristotle in five volumes at Venice (1495–98)", src: [15] },
    { year: 1508, kind: "print", what: "The Aldine press prints the Greek *Poetics*, inside an anthology called *Rhetores graeci*", src: [14] },
    { year: 1831, kind: "print", what: "The Berlin Academy's edition begins (1831–70); its page and column numbers, such as 1094a, are still the standard way to cite Aristotle", src: [6] },
    { year: 1891, kind: "print", what: "Frederic Kenyon publishes the *Constitution of the Athenians*, from a papyrus bought in Egypt in 1890", src: [10] },
  ],

  transmission: `**Sulla's library and Andronicus.** Plutarch's account of Apellicon's library, its arrival in Rome and Andronicus' lists is above; it is the ancient story of how the treatises came into the form we have.[^7][^6]

**The page numbers.** References like 1094a are Bekker numbers, based on the pages of the Prussian Academy of Sciences' edition, *Aristotelis Opera*, published in Berlin from 1831 to 1870; the letter marks a column.[^6]

**Print.** The first printed Greek Aristotle was Aldus Manutius' five volumes at Venice, 1495–98.[^15]

**The oldest *Ethics*.** The oldest surviving manuscript of the *Nicomachean Ethics* is the Florence codex Laurentianus LXXXI.11, called Kb, of the tenth century.[^11]

**The *Poetics* on a thin thread.** The accepted Greek source is the eleventh-century manuscript Paris 1741. A second route is an Arabic version, made from a Syriac one that descends from a Greek manuscript of before AD 700 and is independent of Paris 1741. William of Moerbeke made an accurate Latin translation in 1278, which was virtually ignored. Only the first part survives, on tragedy and epic; the second, on comedy, is lost. The Greek text was first printed by the Aldine press in 1508.[^14]

**The *Constitution*.** Two papyrus fragments were found in the Fayum in 1879 and published in 1880. A much larger papyrus was bought in Egypt in 1890 and acquired for the British Museum, and Kenyon published it in 1891.[^10]`,

  variants: `**An Arabic witness.** The Arabic version of the *Poetics* descends from a Syriac translation that departed widely in vocabulary from the original, and Wikipedia's account says it started a misreading of Aristotle that lasted through the Middle Ages.[^14]

**Three shared books.** The same three books are printed in both ethical works, and editors must decide how to handle the duplication.[^11]

**Doubtful works.** Whole works are in question, rather than readings: many are generally agreed to be spurious, and two are disputed.[^6]`,

  editions: [
    { text: "I. Bywater, *Aristotelis Ethica Nicomachea* (Oxford Classical Texts, 1894).[^16]", note: "The Greek *Nicomachean Ethics* in the Scroll, with H. Rackham's Loeb translation (1926).[^18]" },
    { text: "W. D. Ross's Oxford text of the *Rhetoric* and J. H. Freese's Loeb translation (1926, reprinted 1947).[^18]", note: "The *Rhetoric* in the Scroll." },
    { text: "R. Kassel, *Aristotelis De arte poetica liber* (Oxford Classical Texts, 1965).[^17]", note: "The Greek *Poetics* in the Scroll, with W. H. Fyfe's Loeb translation (1939).[^18]" },
    { text: "I. Bekker (ed.), *Aristotelis Opera*, for the Prussian Academy of Sciences (Berlin, 1831–70).[^6]", note: "The source of the Bekker numbers." },
    { text: "R. A. Gauthier and J. Y. Jolif, *L'Éthique à Nicomaque* (Louvain and Paris, 1970, revising the first edition of 1958–59).[^19]", note: "With commentary." },
    { text: "J. Barnes (ed.), *The Complete Works of Aristotle: The Revised Oxford Translation*, 2 vols (Princeton University Press, 1984).[^20]" },
  ],

  sources: [
    { label: "Diogenes Laertius 5.1 (the life of Aristotle), in the Scroll", cite: { work: "tlg0004.tlg001", ref: "5.1.1" } },
    { label: "Diogenes Laertius 5.9, in the Scroll (Apollodorus' chronology; twenty years with Plato)", cite: { work: "tlg0004.tlg001", ref: "5.1.9" } },
    { label: "Diogenes Laertius 5.10, in the Scroll (Philip's court, the Lyceum, Chalcis, death)", cite: { work: "tlg0004.tlg001", ref: "5.1.10" } },
    { label: "Diogenes Laertius 5.6, in the Scroll (Eumelus and the aconite)", cite: { work: "tlg0004.tlg001", ref: "5.1.6" } },
    { label: "Wikipedia, Aristotle (his life: Assos and Lesbos, Alexander, the Lyceum, the surviving works)", url: "https://en.wikipedia.org/wiki/Aristotle" },
    { label: "Wikipedia, Corpus Aristotelicum (Andronicus, Bekker numbers, lost dialogues, spurious works)", url: "https://en.wikipedia.org/wiki/Corpus_Aristotelicum" },
    { label: "Plutarch, Sulla 26, in the Scroll", cite: { work: "tlg0007.tlg033", ref: "26.1", to: "26.2" } },
    { label: "Aristotle, Metaphysics 7.4, in the Scroll", cite: { work: "tlg0086.tlg025", ref: "7.4" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry ἐνέργεια (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Wikipedia, Constitution of the Athenians (Aristotle): the papyri, Kenyon, the authorship question", url: "https://en.wikipedia.org/wiki/Constitution_of_the_Athenians_(Aristotle)" },
    { label: "Wikipedia, Nicomachean Ethics (the manuscript Kb, the books shared with the Eudemian Ethics)", url: "https://en.wikipedia.org/wiki/Nicomachean_Ethics" },
    { label: "Aristotle, Nicomachean Ethics 7.11–14, in the Scroll", cite: { work: "tlg0086.tlg010", ref: "7.11", to: "7.14" } },
    { label: "Aristotle, Nicomachean Ethics 10.1–5, in the Scroll", cite: { work: "tlg0086.tlg010", ref: "10.1", to: "10.5" } },
    { label: "Wikipedia, Poetics (Aristotle): its manuscripts, translations and first printing", url: "https://en.wikipedia.org/wiki/Poetics_(Aristotle)" },
    { label: "Wikipedia, Editio princeps (Aristotle, Aldine Press, Venice, 1495–98)", url: "https://en.wikipedia.org/wiki/Editio_princeps" },
    { label: "PhilPapers, Ingram Bywater (ed.), Ethica Nicomachea (Oxford Classical Texts, 1894)", url: "https://philpapers.org/rec/BYWEN" },
    { label: "Oxford Scholarly Editions, Aristotelis De arte poetica liber (R. Kassel, Oxford Classical Texts, 1965)", url: "https://www.oxfordscholarlyeditions.com/display/10.1093/actrade/9780198145646.book.1/actrade-9780198145646-book-1" },
    { label: "Perseus's copies of Aristotle shown in the Scroll; each file's header names its edition (Bywater 1894 and Rackham 1926; Ross and Freese; Kassel 1965 and Fyfe 1939)", cite: { work: "tlg0086.tlg010", ref: "1.1" } },
    { label: "WorldCat, Gauthier and Jolif, L'éthique à Nicomaque (Louvain, 1970)", url: "https://www.worldcat.org/title/ethique-a-nicomaque/oclc/546332" },
    { label: "PhilPapers, Jonathan Barnes (ed.), Complete Works of Aristotle, vol. 2: The Revised Oxford Translation", url: "https://philpapers.org/rec/BARCWO-2" },
  ],
  outsideQuotes: [
    "what it was to be",
    "activity, operation",
  ],
  checked: "2026-09-30",
};
