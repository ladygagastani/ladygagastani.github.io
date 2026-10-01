/**
 * Plato. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing reliable
 * could be found: the dates and sigla of most manuscripts (only the Clarke Plato is kept), papyri "from
 * the third century BC", the claim that the order of the dialogues rests on counting features of style,
 * the Budé series, the Hippias Major as doubtful, and the suggestion that Book 1 of the Republic began as
 * a separate dialogue (only what Diogenes Laertius reports about revisions is kept).
 */
import type { AuthorArticle } from "../author-articles";

export const plato: AuthorArticle = {
  id: "tlg0059",
  summary: `Plato hardly ever appears in his own books. Diogenes Laertius noticed: he names himself only in the *Phaedo* and the *Apology*.[^1] In the *Phaedo* it is a throwaway line, when the narrator lists who was with Socrates on his last day and adds that Plato was ill.[^2] In the *Apology* he is one of the friends standing by at the trial.[^3]

{debated} Apollodorus' chronology puts his birth in 428/7 BC, and Hermippus says he died at a wedding feast in 348/7, in his eighty-first year.[^4] Some modern books give c. 428–347.[^5] He came from an aristocratic and influential Athenian family, and two relatives were leaders of the oligarchy that seized Athens in 404 BC: Critias was one of the Thirty, and Charmides one of the Ten who ruled in Piraeus. Xenophon tells how [both died in the same battle](cts:tlg0032.tlg001:2.4.19).[^5]

{debated} A letter that bears his name, the Seventh, says that he first reached Syracuse “being about forty years old”.[^6] It also gives his most famous political verdict: humankind “will have no cessation from evils until either the class of those who are right and true philosophers attains political supremacy”, or rulers become true philosophers.[^7] Whether Plato wrote the letter is itself disputed.[^5]

He founded the Academy in the 380s BC, and Aristotle arrived there in 367.[^5]

His best-known picture is a cave. “Picture men dwelling in a sort of subterranean cavern”, says Socrates in the *Republic*, “fettered from childhood”, able to look only at shadows.[^8] The same book imagines a city that exists only “in the ideal”.[^9] And the *Euthyphro* shows the method on a smaller scale: Socrates asks what holiness is, and the two of them tangle over whether the gods love the holy *because* it is holy, or whether it is holy *because* they love it.[^10]

You can hear the conversation in the replies. Socrates' partners keep agreeing with πάνυ μὲν οὖν and πάνυ γε, roughly “quite certainly” and “very much so” (our translation). They fill the first book of the *Republic*.[^11] LSJ glosses πάνυ as “altogether”, and in use “perfectly” or “very”.[^12]

### Things readers still argue about

**Which works are really Plato's?** Plato's complete works are believed to have survived, which is rare for an ancient author, but the collection also holds works by others.[^5] Scholars broadly doubt *Alcibiades II*, *Epinomis*, *Hipparchus*, *Minos*, *Lovers* and *Theages*, and are more divided over *Alcibiades I*, *Clitophon*, the *Letters* and *Menexenus*. Nine more, among them the *Definitions* and the *Axiochus*, were already counted as spurious in the first century AD.[^5]

**Can the dialogues be put in order?** The usual early, middle and late groups are a modern reconstruction. Writers are increasingly sceptical that the order of Plato's writings can be fixed with any precision.[^5]

**Who finished the *Laws*, and did the *Republic* change?** Some said that Philip of Opus copied out the *Laws*, which Plato left on waxen tablets, and that he wrote the *Epinomis*. Euphorion and Panaetius reported that the beginning of the *Republic* was found several times revised and rewritten.[^1]`,

  timeline: [
    { year: -428, approx: true, kind: "writing", certainty: "debated", what: "Born at Athens, in 428/7 BC by Apollodorus' chronology", src: [4, 5] },
    { year: -388, approx: true, kind: "writing", certainty: "debated", what: "Reaches Syracuse “being about forty”, by the Seventh Letter, whose authorship is disputed", src: [6, 5] },
    { year: -385, approx: true, kind: "writing", what: "Founds the Academy, in the 380s BC", src: [5] },
    { year: -367, kind: "writing", what: "Aristotle arrives at the Academy, shortly before Plato leaves again for Syracuse", src: [5] },
    { year: -348, approx: true, kind: "writing", certainty: "debated", what: "Dies at Athens in 348/7 BC, at a wedding feast according to Hermippus", src: [4] },
    { year: 50, approx: true, kind: "copy", what: "Thrasyllus arranges the dialogues in nine tetralogies (the first century AD)", src: [13, 5] },
    { year: 895, kind: "copy", what: "The Clarke Plato is written for Arethas of Caesarea: the oldest surviving manuscript for about half the dialogues", src: [14] },
    { year: 1484, kind: "print", what: "Ficino's Latin translation is printed at Florence", src: [5] },
    { year: 1513, kind: "print", what: "Aldus Manutius prints the Greek text at Venice, edited by Marcus Musurus", src: [16] },
    { year: 1578, kind: "print", what: "Henri Estienne (Stephanus) prints Plato at Geneva; its page numbers become the standard way to cite him", src: [15] },
    { year: 1905, approx: true, kind: "print", what: "Burnet's Oxford Classical Text appears in five volumes (1900–07)", src: [19, 21] },
    { year: 1995, kind: "print", what: "A new Oxford text of volume 1 (Euthyphro to Politicus) replaces Burnet's", src: [17, 18] },
    { year: 2003, kind: "print", what: "Slings' Oxford text of the *Republic* appears", src: [20] },
  ],

  transmission: `**Nine groups of four.** Thrasyllus says Plato published his dialogues in tetralogies, like the tragic poets; he counts fifty-six genuine dialogues (the *Republic* as ten, the *Laws* as twelve) in nine tetralogies.[^13] The text we have rests on that arrangement from the first century AD, by Thrasyllus of Mendes.[^5]

**Manuscripts.** Some 250 Byzantine manuscripts of Plato survive.[^5] The oldest for about half the dialogues is the “Clarke Plato” in Oxford's Bodleian Library (MS. E. D. Clarke 39), written in 895 by a professional calligrapher for Arethas of Caesarea, who paid 21 gold coins for it and added notes in the margin. It holds the first six tetralogies: twenty-four works, from the *Euthyphro* and *Apology* to the *Meno*.[^14]

**The page numbers.** References such as *Republic* 514a come from a three-volume edition of Plato's complete works printed in Geneva in 1578 by Henri Estienne (Henricus Stephanus), with a Latin translation by Joannes Serranus; each page is split into sections lettered a to e.[^15]

**Print.** Ficino's Latin translation was printed in Florence in 1484, in 1025 copies.[^5] The first Greek edition, edited by Marcus Musurus, was printed by Aldus Manutius at Venice in 1513.[^16]`,

  variants: `**Works in doubt.** Most of the open questions about Plato's text are about whole works, not single words: which dialogues and letters are his, and which belong to his school.[^5]

**Tablets and drafts.** The *Laws* was said to have been left on wax tablets and copied out by Philip of Opus; the opening of the *Republic* was said to have been found in several versions.[^1]`,

  editions: [
    { text: "J. Burnet, *Platonis Opera*, 5 vols (Oxford Classical Texts, 1900–07).[^19]", note: "The Greek *Republic* in the Scroll is Burnet's text, in Perseus's copy.[^21]" },
    { text: "E. A. Duke and others, *Platonis Opera*, vol. 1 (Oxford Classical Texts, 1995).[^17][^18]", note: "It replaces Burnet's first volume, from the *Euthyphro* to the *Politicus*." },
    { text: "S. R. Slings, *Platonis Respublica* (Oxford Classical Texts, 2003).[^20]" },
    { text: "Paul Shorey's translation of the *Republic* (Loeb Classical Library; the Scroll's copy is the printing of 1935–37).[^21]", note: "The English *Republic* in the Scroll." },
    { text: "J. M. Cooper (ed.), *Plato: Complete Works* (Hackett, 1997).[^22]", note: "Modern translations of everything attributed to Plato in antiquity, in one volume." },
  ],

  sources: [
    { label: "Diogenes Laertius 3.37, in the Scroll (Plato names himself only in two dialogues; the Laws and the Epinomis; the Republic revised)", cite: { work: "tlg0004.tlg001", ref: "3.1.37" } },
    { label: "Plato, Phaedo 59b, in the Scroll", cite: { work: "tlg0059.tlg004", ref: "59" } },
    { label: "Plato, Apology 34a, in the Scroll", cite: { work: "tlg0059.tlg002", ref: "34" } },
    { label: "Diogenes Laertius 3.2, in the Scroll (Apollodorus on his birth, Hermippus on his death)", cite: { work: "tlg0004.tlg001", ref: "3.1.2" } },
    { label: "Wikipedia, Plato (his family, the Academy, Aristotle, survival of the works, doubtful works, Thrasyllus, manuscripts, Ficino, the Seventh Letter)", url: "https://en.wikipedia.org/wiki/Plato" },
    { label: "Plato (attributed), Letter 7, 324a, in the Scroll", cite: { work: "tlg0059.tlg036", ref: "7.324" } },
    { label: "Plato (attributed), Letter 7, 326a–b, in the Scroll", cite: { work: "tlg0059.tlg036", ref: "7.326" } },
    { label: "Plato, Republic 514a, in the Scroll (the cave)", cite: { work: "tlg0059.tlg030", ref: "514a" } },
    { label: "Plato, Republic 592b, in the Scroll", cite: { work: "tlg0059.tlg030", ref: "592b" } },
    { label: "Plato, Euthyphro 11b, in the Scroll", cite: { work: "tlg0059.tlg001", ref: "11" } },
    { label: "Plato, Republic 330d–331d, in the Scroll", cite: { work: "tlg0059.tlg030", ref: "330d", to: "331d" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry πάνυ (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Diogenes Laertius 3.56–57, in the Scroll (Thrasyllus and the tetralogies)", cite: { work: "tlg0004.tlg001", ref: "3.1.56", to: "3.1.57" } },
    { label: "Biblissima, Oxford, Bodleian Library, MS. E. D. Clarke 39 (the Clarke Plato, 895)", url: "https://iiif.biblissima.fr/collections/manifest/6132de9c6ca8e5acff4d95487199446028cca46b" },
    { label: "Wikipedia, Stephanus pagination", url: "https://en.wikipedia.org/wiki/Stephanus_pagination" },
    { label: "Wikipedia, List of editiones principes in Greek (Plato, Aldus Manutius, Venice, 1513)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Oxford University Press, Plato, Opera, vol. 1 (Duke, Hicken, Nicoll, Robinson and Strachan, Oxford Classical Texts, 1995)", url: "https://global.oup.com/academic/product/opera-9780198145691" },
    { label: "Bryn Mawr Classical Review 1997.01.08 on Plato, Opera, vol. 1 (Oxford Classical Texts, 1995)", url: "https://bmcr.brynmawr.edu/1997/1997.01.08/" },
    { label: "PhilPapers, J. Burnet (ed.), Plato Opera (Oxford Classical Texts, 1900–07)", url: "https://philpapers.org/rec/BURPOV" },
    { label: "Oxford University Press, Platonis Respublica (S. R. Slings, Oxford Classical Texts, 2003)", url: "https://global.oup.com/academic/product/platonis-respublica-9780199248490" },
    { label: "Perseus's copies of Plato's Republic shown in the Scroll: each file's header names its edition (Burnet, Clarendon Press, 1905; Shorey, Loeb, 1935–37)", cite: { work: "tlg0059.tlg030", ref: "327a" } },
    { label: "PhilPapers, J. M. Cooper (ed.), Plato: Complete Works (Hackett, 1997)", url: "https://philpapers.org/rec/COOPCW-3" },
  ],
  outsideQuotes: [
    "altogether",
    "perfectly",
    "very",
    "quite certainly",
    "very much so",
  ],
  checked: "2026-09-30",
};
