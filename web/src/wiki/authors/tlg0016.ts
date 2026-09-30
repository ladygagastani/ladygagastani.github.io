/**
 * Herodotus. Checked on 2026-09-30 against the sources listed at the bottom (notes on each claim:
 * pipeline/drafts/CHECKED.md). The old site's draft said things that could not be confirmed and they are
 * left out: Plutarch reporting readers who changed "of Halicarnassus" to "of Thurii", the dates of most
 * manuscripts, the Acharnians parody, the move to Thurii in 443, and the Suda's life.
 */
import type { AuthorArticle } from "../author-articles";

export const herodotus: AuthorArticle = {
  id: "tlg0016",
  summary: `Open Herodotus and he introduces himself before he says anything else: «Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε», “This is the display of the inquiry of Herodotus of Halicarnassus”. He promises that great and marvellous deeds, Greek and non-Greek alike, will not fade with time, and that he will tell you what made the two sides go to war.[^1] His word for “inquiry”, ἱστορίη, is the ancestor of our word *history*.[^2]

Cicero's verdict has stuck. In his dialogue *On the Laws* he calls Herodotus “the father of history”, and in the same sentence admits that Herodotus and the historian Theopompus are both full of countless stories.[^3]

{debated} We cannot say exactly when he lived. The ancient count, which Aulus Gellius takes from a writer called Pamphila, makes him fifty-three when the Peloponnesian War broke out in 431 BC, so born about 484.[^4] Modern books move it by a few years; Livius.org gives c. 480 to c. 429.[^5] What the *Histories* themselves show is that he was still writing after 430 BC: he mentions Spartan envoys put to death at Athens,[^6] an event Thucydides places at the end of the war's second summer.[^7]

He went to see things for himself. He reached Egypt's city of Elephantine, “to look myself”,[^8] and sailed to Tyre to ask about the temple of Heracles.[^9] And he tells you exactly where his own eyes stop. Up to one point in Egypt, “all I have said is the record of my own autopsy and judgment and inquiry”; after it, “I will record Egyptian chronicles, according to what I have heard”.[^10] His rule for the rest of the book: “although it is my business to set down that which is told me, to believe it is none at all of my business”.[^11]

Not everyone was charmed. Plutarch wrote a whole pamphlet, *On the Malice of Herodotus*, arguing that the simple, friendly style hides a spiteful streak, aimed above all at Boeotians and Corinthians.[^12]

{legend} Later writers told stories about how he shared his work. Plutarch passes on, from a historian called Diyllus, that Athens voted Herodotus ten talents on a motion by Anytus.[^13] Lucian, writing long after, has him reciting the *Histories* to the crowd at the Olympic Games, so delighting them that the nine books were named after the Muses.[^14]

He wrote in Ionic, and you can hear it in the first line. LSJ, the standard dictionary, notes each of these as Ionic forms of the words Attic Greek uses: ἱστορίη for ἱστορία, θωμαστά (“marvellous”) for θαυμαστά, κότε for πότε (“when?”, at [9.122.2](cts:tlg0016.tlg001:9.122.2)) and ἀπίκετο for ἀφίκετο (“arrived”, at [6.43.3](cts:tlg0016.tlg001:6.43.3)).[^15][^1][^16][^17]

### Three things readers still argue about

**A speech the Greeks would not believe.** In Book 3, after a coup in Persia, seven nobles debate how the empire should be ruled, and Otanes argues for handing power to the people. Herodotus knows that the speeches “to some Greeks seem incredible”, and insists “there is no doubt that they were spoken”.[^18] In Book 6 he says it again, for “those Greeks who will not believe” it.[^17]

**A meeting that cannot have happened.** In Book 1 the Athenian lawgiver Solon visits the rich Lydian king Croesus, and tells him “it is necessary to see how the end of every affair turns out”.[^21] Dating makes the meeting very hard to accept. Plutarch already knew it: some, he says, “prove by chronology that it is fictitious”, but he would not give up so good a story.[^19][^20]

**An ending that stops short.** The *Histories* close with Cyrus telling the Persians that “soft lands breed soft men”.[^16] Jona Lendering thinks the work is probably unfinished: at [7.213](cts:tlg0016.tlg001:7.213.3) Herodotus says he will tell “later in my history” why Ephialtes was killed, and, Lendering notes, he never does.[^22][^23]`,

  timeline: [
    { year: -484, approx: true, kind: "writing", certainty: "debated", what: "Born at Halicarnassus, by the ancient count that makes him fifty-three when the Peloponnesian War began", src: [4] },
    { year: -430, kind: "writing", what: "Spartan envoys are put to death at Athens, an event Herodotus mentions, so he was still writing after this", src: [6, 7] },
    { year: -350, approx: true, kind: "reception", what: "Aristotle, in the *Rhetoric*, quotes the opening as “of Thurii”", src: [30, 1] },
    { year: -250, approx: true, kind: "copy", what: "Scholars at Alexandria divide the *Histories* into nine books", src: [26] },
    { year: 200, approx: true, kind: "copy", what: "A papyrus scrap of Book 4 (4.97.3–5) is written, in the late 2nd or early 3rd century", src: [24] },
    { year: 950, approx: true, kind: "copy", what: "The Florence manuscript Laurentianus plut. 70.3, a main medieval witness to the text, is made in the 10th century", src: [25, 24] },
    { year: 1474, kind: "print", what: "Lorenzo Valla's Latin translation is printed at Venice by Jacobus Rubeus, the first printed Herodotus", src: [27, 28] },
    { year: 1502, kind: "print", what: "Aldus Manutius prints the Greek text at Venice", src: [29] },
    { year: 2015, kind: "print", what: "N. G. Wilson's Oxford Classical Text replaces Hude's", src: [32, 33] },
  ],

  transmission: `What we read today comes from two families of medieval manuscripts.[^24] The “Florentine” family is led by a book in Florence (Laurentianus plut. 70.3, called A) and one in Rome (Angelicanus gr. 83, B). The “Roman” family is led by two in the Vatican (gr. 2369, D, and gr. 123, R), one now at Emmanuel College, Cambridge (S) and one in Vienna (V). A few others, called C and P, mix readings from both.[^24] A is a parchment book of 374 leaves, made in the tenth century.[^25]

The papyri are older than either family. Forty-four had been published when Gertjan Verhasselt edited one more, a scrap of Book 4, and they agree with neither family all the time, sometimes giving readings the medieval books do not have.[^24]

Our division into nine books goes back, Jona Lendering says, to scholars at Alexandria in the third century BC.[^26] By Lucian's day they were known by the Muses' names.[^14]

Herodotus came into print in Latin first: Valla's translation was published at Venice in 1474,[^27][^28] and the Greek text followed from Aldus Manutius in 1502.[^29]`,

  variants: `Even the first line wobbles. Our manuscripts call him “Herodotus of Halicarnassus”; Aristotle, quoting the opening in his *Rhetoric*, has “Herodotus of Thurii”.[^30][^1]

Copyists also had to decide how much Ionic to keep. Verhasselt's papyrus shows that in Roman times “versions of Herodotus circulated that had both (East) Ionic forms … and koine forms”.[^24] You can see a split at [4.97.4](cts:tlg0016.tlg001:4.97.4), where Coes of Mytilene tells Darius that if the Scythians are found, “we have a way of return” (ἄποδος). The Florentine family and three other manuscripts read ἄποδος; the Roman family reads ἄφοδος.[^24][^31]

How many families are there, really? B. Hemmerdinger (1981) went further than the usual two-family view and argued that only three manuscripts, A, D and C, matter.[^24]

When N. G. Wilson made the new Oxford text (2015), he collated two neglected manuscripts of the Roman family.[^32][^33]`,

  editions: [
    { text: "A. D. Godley, *Herodotus*, 4 vols (Loeb Classical Library, 1920–25).[^34]", note: "The Greek and English shown in the Scroll are Perseus's copy of this edition." },
    { text: "N. G. Wilson, *Herodoti Historiae*, 2 vols (Oxford Classical Texts, 2015).[^32]", note: "The standard modern Greek text; it replaces Hude's." },
    { text: "H. B. Rosén, *Herodoti Historiae* (Teubner, Leipzig), vol. 1, Books I–IV, 1987; vol. 2, Books V–IX, 1997.[^35]" },
    { text: "D. Asheri, A. Lloyd and A. Corcella, *A Commentary on Herodotus Books I–IV*, ed. O. Murray and A. Moreno (Oxford University Press, 2007).[^36]", note: "The commentary to read beside the text." },
  ],

  sources: [
    { label: "Herodotus 1.1 (the opening), in the Scroll", cite: { work: "tlg0016.tlg001", ref: "1.1.0" } },
    { label: "Wiktionary, “history”: the word's path from Greek ἱστορίᾱ through Latin and French", url: "https://en.wiktionary.org/wiki/history" },
    { label: "Cicero, On the Laws 1.5 (Latin text, The Latin Library)", url: "https://www.thelatinlibrary.com/cicero/leg1.shtml" },
    { label: "Aulus Gellius, Attic Nights 15.23, after Pamphila (LacusCurtius)", url: "https://penelope.uchicago.edu/Thayer/L/Roman/Texts/Gellius/15*.html" },
    { label: "Livius.org, Herodotus of Halicarnassus", url: "https://www.livius.org/articles/person/herodotus/" },
    { label: "Herodotus 7.137, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "7.137.1", to: "7.137.3" } },
    { label: "Thucydides 2.67, in the Scroll (with 2.47.1, which ends the war's first year)", cite: { work: "tlg0003.tlg001", ref: "2.67.1", to: "2.67.3" } },
    { label: "Herodotus 2.29, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.29.1" } },
    { label: "Herodotus 2.44, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.44.1" } },
    { label: "Herodotus 2.99, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.99.1" } },
    { label: "Herodotus 7.152, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "7.152.3" } },
    { label: "Plutarch, On the Malice of Herodotus, chapter 1, in the Scroll", cite: { work: "tlg0007.tlg123", ref: "1" } },
    { label: "Plutarch, On the Malice of Herodotus, chapter 26, in the Scroll", cite: { work: "tlg0007.tlg123", ref: "26" } },
    { label: "Lucian, Herodotus or Aëtion, section 1, in the Scroll", cite: { work: "tlg0062.tlg056", ref: "1" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries ἱστορία, θαυμαστός, κότε and ἀφικνέομαι (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Herodotus 9.122, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "9.122.2", to: "9.122.3" } },
    { label: "Herodotus 6.43, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "6.43.3" } },
    { label: "Herodotus 3.80, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "3.80.1", to: "3.80.2" } },
    { label: "Plutarch, Solon 27.1, in the Scroll", cite: { work: "tlg0007.tlg007", ref: "27.1" } },
    { label: "Alexander Hollmann, “Solon in Herodotus”, Trends in Classics 7 (2015), 85–109; note 68 observes that Plutarch already knew the chronological problem", url: "https://classics.washington.edu/sites/classics/files/documents/research/hollmann_solon_in_herodotus_de_gruyter.pdf" },
    { label: "Herodotus 1.29–33 (Solon at Sardis), in the Scroll", cite: { work: "tlg0016.tlg001", ref: "1.29.1", to: "1.33.1" } },
    { label: "Livius.org (Jona Lendering), The end of Herodotus' Histories", url: "https://www.livius.org/articles/person/herodotus/the-end-of-herodotus-histories/" },
    { label: "Herodotus 7.213, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "7.213.3" } },
    { label: "Gertjan Verhasselt, edition of a Herodotus papyrus (Historiae IV 97.3–5), KU Leuven repository: the manuscript families, the papyri and the apparatus", url: "https://lirias.kuleuven.be/retrieve/524918" },
    { label: "Biblissima, Florence, Biblioteca Medicea Laurenziana, Plut. 70.3 (tenth century, parchment, 374 leaves)", url: "https://iiif.biblissima.fr/collections/manifest/55b6d0425f4cc7afc7c8a39299d101bb69540042" },
    { label: "Livius.org, Herodotus' Histories (the division into nine books)", url: "https://www.livius.org/articles/person/herodotus/herodotus-histories/" },
    { label: "Jeremy Norman's History of Information, “The First Printed Editions of Herodotus”", url: "https://www.historyofinformation.com/detail.php?id=4103" },
    { label: "Whitmore Rare Books, catalogue entry for Valla's Latin Herodotus, naming the printings of 1474 (Venice) and 1475 (Rome)", url: "https://www.whitmorerarebooks.com/pages/books/1962/herodotus/historiae-herodoti-halicarnasei-libri-novem-tr-laurentius-valla-ed-antonius-mancinellus" },
    { label: "Wikipedia, List of editiones principes in Greek (Herodotus, Aldus Manutius, Venice, 1502)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Aristotle, Rhetoric 3.9 (1409a), in Perseus", url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0060%3Abook%3D3%3Achapter%3D9" },
    { label: "Herodotus 4.97, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "4.97.4" } },
    { label: "Oxford University Press, N. G. Wilson, Herodoti Historiae (Oxford Classical Texts, 2015)", url: "https://global.oup.com/academic/product/herodoti-historiae-9780199560714" },
    { label: "Gauthier Liberman's review of Wilson's edition, Journal of Hellenic Studies 136 (2016), 193–196", url: "https://www.cambridge.org/core/journals/journal-of-hellenic-studies/article/abs/ng-wilson-herodotus-histories-books-14-herodoti-historiae-libri-iiv-and-herodotus-histories-books-59-herodoti-historiae-libri-vix-oxford-classical-textsscriptorum-classicorum-bibliotheca-oxoniensis-oxford-oxford-university-press-2015-pp-496-and-450-40-per-volume-9780199560707-and-9780199560714-ng-wilson-herodotea-studies-on-the-text-of-herodotus-oxford-oxford-university-press-2015-pp-xxvi-202-50-9780199672868/BAD58471D9B53D943870109E5DAF66B9" },
    { label: "Perseus's copy of A. D. Godley's Loeb Herodotus (1920–25), the Greek and English shown in the Scroll; the edition is named in the file's header", cite: { work: "tlg0016.tlg001", ref: "1.1.0" } },
    { label: "The Classical Review on Rosén's Teubner edition, vol. 1 (Leipzig 1987, lxxxviii + 458 pp.)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/new-teubner-of-herodotus-haiim-b-rosen-herodoti-historiae-i-libros-iiv-continens-bibl-teubneriana-pp-lxxxviii-458-leipzig-teubner-1987-148-m/2C94DB60F0DE5FD46FCC96E52AE27D7F" },
    { label: "Bryn Mawr Classical Review 2008.07.35 on Asheri, Lloyd and Corcella, A Commentary on Herodotus Books I–IV (Oxford University Press, 2007)", url: "https://bmcr.brynmawr.edu/2008/2008.07.35/" },
  ],
  checked: "2026-09-30",
};
