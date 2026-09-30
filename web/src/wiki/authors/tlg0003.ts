/**
 * Thucydides. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing
 * reliable could be found: the manuscript families (ABEFM and CG) and most manuscripts' dates, the
 * claim that chapter 3.84 is rejected by editors, the unrevised books 5 and 8, the ancient divisions
 * into nine and thirteen books, "c. 400 BC" for his death, and his return to Athens after 404.
 */
import type { AuthorArticle } from "../author-articles";

export const thucydides: AuthorArticle = {
  id: "tlg0003",
  summary: `He starts with his own name, and then with the war: «Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον τῶν Πελοποννησίων καὶ Ἀθηναίων», “Thucydides, an Athenian, wrote the history of the war waged by the Peloponnesians and the Athenians against one another”. He began at the very outset, sure that it would be great and noteworthy above all the wars before it.[^1] Even the spelling is old-fashioned: ξυνέγραψε has the ξυν- that LSJ calls the old Attic form of σύν-.[^2]

Thucydides tells you a good deal about himself. He caught the plague at Athens and recovered: “For I had the disease myself and saw others sick of it”.[^3] In the eighth year of the war he was one of the generals in Thrace. When Brasidas marched on Amphipolis, the city's defenders sent for Thucydides, who was at Thasos, half a day's sail away.[^4][^5] He held the right to work gold mines in that part of Thrace and was influential among its leading men.[^6] His ships reached Eion on the evening Amphipolis fell, and saved Eion by a night.[^7] He was then banished from Athens for twenty years “after my command at Amphipolis”, and he says that exile gave him time to know “affairs on both sides”, especially the Peloponnesians'.[^8]

Then comes how he worked. The speeches, he admits, could not be recalled word for word. They are given in the language which, “as it seemed to me”, each speaker would have used, sticking as closely as possible to the general sense of what was really said.[^9] He describes the plague's symptoms so that anyone could recognise it if it ever returned.[^3] He names “the truest explanation” of the war, “although it has been the least often advanced”: the growth of Athens, which frightened Sparta into fighting.[^10] And he says what he hopes for the book: not “a prize-essay to be heard for the moment, but … a possession for all time”, κτῆμα ἐς αἰεί.[^11]

He lived to see the war end: he writes that it lasted twenty-seven years, until the Spartans took the Long Walls and the Piraeus.[^8] Yet the book stops in mid-story. Its last sentence is about Tissaphernes: “And so he came first to Ephesus and offered sacrifice to Artemis.”[^12] Xenophon's *Hellenica* begins as if in the next breath: “After this, not many days later, Thymochares came from Athens with a few ships”.[^13]

{debated} The ending is usually taken to mean the work was left unfinished.[^14] Simon Hornblower, in his commentary, defends some passages of Book 8 against the charge of incompleteness and suggests that Thucydides' narrative art was changing.[^15]

### A note on the books

Thucydides did not divide his work into eight books. The division is most likely the work of later librarians, probably in the Library of Alexandria.[^16]`,

  timeline: [
    { year: -460, approx: true, kind: "writing", what: "Born at Halimous, near Athens, son of Olorus, a name linked with Thrace", src: [16] },
    { year: -431, kind: "writing", what: "The war begins, and he begins to write “at the very outset”", src: [1] },
    { year: -430, kind: "writing", what: "The plague reaches Athens; he catches it and recovers", src: [3] },
    { year: -424, approx: true, kind: "writing", what: "As a general in Thrace he sails to save Amphipolis, but arrives too late; he is banished for twenty years", src: [4, 5, 7, 8] },
    { year: -411, approx: true, kind: "writing", what: "The narrative breaks off in mid-story, near the end of the war's twenty-first year", src: [12, 14] },
    { year: -404, kind: "writing", what: "The war ends; he later writes that it lasted twenty-seven years", src: [8] },
    { year: 50, approx: true, kind: "copy", what: "About twenty papyrus fragments of Thucydides are copied at Oxyrhynchus between the 1st and 6th centuries AD", src: [14] },
    { year: 1450, approx: true, kind: "print", what: "Lorenzo Valla makes the first Latin translation, between 1448 and 1452", src: [16] },
    { year: 1502, kind: "print", what: "Aldus Manutius prints the first Greek edition, at Venice", src: [17, 16] },
    { year: 1629, approx: true, kind: "print", what: "Thomas Hobbes publishes the first English translation made directly from the Greek (sources give 1628 or 1629)", src: [16] },
    { year: 1942, kind: "print", what: "Jones and Powell's Oxford Classical Text appears in two volumes", src: [18] },
    { year: 2008, kind: "print", what: "Hornblower's three-volume commentary is completed", src: [15] },
  ],

  transmission: `**Papyri.** Grenfell and Hunt found about twenty papyrus fragments of Thucydides at Oxyrhynchus, copied between the first and sixth centuries AD; two are known as P.Oxy. 16 and 17.[^14]

**Medieval manuscripts.** The manuscripts editors use include Laurentianus Plut. 69.2 (Florence), Vaticanus gr. 126, Parisinus suppl. gr. 255, Palatinus gr. 252 (tenth century, annotated and corrected by John Tzetzes in the twelfth), two in Munich (Monacensis gr. 430 and gr. 228) and one in the British Library.[^14]

**Translations and print.** Lorenzo Valla made the first European translation, into Latin, between 1448 and 1452.[^16] The first Greek edition was printed by Aldus Manutius in 1502.[^17][^16] Thomas Hobbes was the first to translate Thucydides into English directly from Greek.[^16]

**Continuations.** Xenophon wrote his *Hellenica* as a continuation, beginning where Thucydides stops.[^14][^13]`,

  variants: `**An ending that stops.** Book 8 breaks off mid-story, and Hornblower's commentary argues about which passages there really show incompleteness, and which only show Thucydides changing his narrative art.[^14][^15]

**Old spellings.** Thucydides writes ξυν- where later Attic has συν-, which LSJ records as the old Attic form.[^2] That is one reason his Greek looks different from fourth-century prose.`,

  editions: [
    { text: "H. S. Jones and J. E. Powell, *Thucydidis Historiae*, 2 vols (Oxford Classical Texts, 1942).[^18]", note: "The Greek in the Scroll is Jones's Oxford text, in Perseus's copy (published 1910, reprinted 1942).[^19]" },
    { text: "Richard Crawley's translation (1914 edition) and Thomas Hobbes's (the 1843 reprint of his English Works).[^19]", note: "The English translations in the Scroll, beside French, German, Italian and Latin versions." },
    { text: "G. B. Alberti, *Thucydidis Historiae*, 3 vols (Rome, Istituto Poligrafico e Zecca dello Stato, 1972–2000).[^20]" },
    { text: "S. Hornblower, *A Commentary on Thucydides*, 3 vols (Oxford University Press, 1991–2008).[^15][^21]", note: "The commentary to read beside the text." },
  ],

  sources: [
    { label: "Thucydides 1.1, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "1.1.1" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry σύν, “old Att. ξύν” (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Thucydides 2.47–48 (the plague), in the Scroll", cite: { work: "tlg0003.tlg001", ref: "2.47.3", to: "2.48.3" } },
    { label: "Thucydides 4.104, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "4.104.4" } },
    { label: "Thucydides 4.116.3, in the Scroll (the winter of Amphipolis ends the war's eighth year)", cite: { work: "tlg0003.tlg001", ref: "4.116.3" } },
    { label: "Thucydides 4.105.1, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "4.105.1" } },
    { label: "Thucydides 4.106, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "4.106.3", to: "4.106.4" } },
    { label: "Thucydides 5.26, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "5.26.1", to: "5.26.5" } },
    { label: "Thucydides 1.22.1, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "1.22.1" } },
    { label: "Thucydides 1.23.6, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "1.23.6" } },
    { label: "Thucydides 1.22.4, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "1.22.4" } },
    { label: "Thucydides 8.109, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "8.109.1", to: "8.109.2" } },
    { label: "Xenophon, Hellenica 1.1.1, in the Scroll", cite: { work: "tlg0032.tlg001", ref: "1.1.1" } },
    { label: "Wikipedia, History of the Peloponnesian War (where the text stops; the manuscripts; Oxyrhynchus)", url: "https://en.wikipedia.org/wiki/History_of_the_Peloponnesian_War" },
    { label: "Bryn Mawr Classical Review 2010.01.24 on Hornblower, A Commentary on Thucydides, vol. 3 (Oxford University Press, 2008)", url: "https://bmcr.brynmawr.edu/2010/2010.01.24/" },
    { label: "Wikipedia, Thucydides (his birth and family, Valla, Hobbes, the eight books)", url: "https://en.wikipedia.org/wiki/Thucydides" },
    { label: "Wikipedia, Editio princeps (Thucydides, Aldus Manutius, Venice, 1502)", url: "https://en.wikipedia.org/wiki/Editio_princeps" },
    { label: "Oxford University Press, Thucydides, Historiae (Jones and Powell, Oxford Classical Texts)", url: "https://global.oup.com/academic/product/historiae-9780198145509" },
    { label: "Perseus's copies of Thucydides shown in the Scroll; each file's header names its edition (Jones's Oxford text; Crawley, Dent 1914; Hobbes, 1843)", cite: { work: "tlg0003.tlg001", ref: "1.1.1" } },
    { label: "G. B. Alberti, Thucydidis Historiae: volumes and years (The Great Thinkers)", url: "https://thegreatthinkers.org/thucydides/major-works/alberti-g-b-ed-thucydidis-historiae/" },
    { label: "Oxford University Press, Simon Hornblower, A Commentary on Thucydides", url: "https://global.oup.com/academic/product/a-commentary-on-thucydides-9780198148814" },
  ],
  checked: "2026-09-30",
};
