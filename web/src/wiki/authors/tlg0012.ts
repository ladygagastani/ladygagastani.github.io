/**
 * Homer. Checked on 2026-09-30 against the sources listed at the bottom (notes on each claim:
 * pipeline/drafts/CHECKED.md). Left out because nothing reliable could be found: the counts of
 * papyri and manuscripts, the dates of Venetus B, the Townley Homer and the Odyssey manuscripts, the
 * Doloneia and Odyssey 23.296 arguments, Herodotus-style dates for the Trojan War, and Van Thiel.
 */
import type { AuthorArticle } from "../author-articles";

export const homer: AuthorArticle = {
  id: "tlg0012",
  summary: `The *Iliad* opens on a single word, *wrath*: «μῆνιν ἄειδε θεά», “The wrath sing, goddess”.[^1] By then the Greeks have been at Troy for nine years.[^2] The *Odyssey* follows one of them home, and in Ithaca a seer predicts that he will come back in the twentieth year.[^3]

Who was Homer? Nobody knows. The two best-known ancient biographies, the *Life of Homer* ascribed to Herodotus and the *Contest of Homer and Hesiod*, are treated by modern scholars as legend, and most of the ancient lives make him blind.[^4] Chios and Smyrna were already named as his home by fifth-century writers; later ones added Cyme, Argos, Pylos and Athens.[^4] One ancient text fits both the blindness and Chios: the singer of the *Hymn to Apollo* says τυφλὸς ἀνήρ, οἰκεῖ δὲ Χίῳ ἔνι παιπαλοέσσῃ, “a blind man, and he lives on rocky Chios” (our translation).[^5] Thucydides, quoting that hymn as Homer's, says that in it the poet “also mentions himself”.[^6]

{debated} Most scholars place the poems in the late eighth or early seventh century BC, the *Iliad* slightly before the *Odyssey*.[^4] Proposals range much wider, from the eighth century (Richard Janko) to the middle of the second century BC (Gregory Nagy), with Martin West at 660–650.[^7] Herodotus supposed that Homer and Hesiod lived “not more than four hundred years earlier than I”, which points to about the ninth century.[^8]

Was it one poet or two? The question is ancient. The *chōrizontes*, “separators”, held that the *Iliad* and *Odyssey* had different authors; only two of their names survive, Xenon and Hellanicus.[^9] Antiquity also credited Homer with a great deal more: the *Homeric Hymns*, epigrams, the comic *Margites* and poems of the Epic Cycle.[^4] Herodotus already refused him the *Cypria*, pointing out that they say Paris crossed to Troy with Helen in three days of fair wind, while the *Iliad* has him wander off course.[^10]

Homer's Greek is a literary dialect: mainly an archaic Ionic, with some Aeolic features and a few from Arcadocypriot.[^11] You can see it in small words. Where later Greek has ἀγορά, “assembly”, Homer has the Ionic ἀγορή; ἄμμες, “we”, is Aeolic and epic for ἡμεῖς; and the second-declension genitive can end in -οιο, as in πεδίοιο, “of the plain”, beside -ου.[^12][^11]

### Things readers still argue about

**How did the poems come down to us?** In 1795 Friedrich August Wolf argued that they began as short oral songs, carried in memory for centuries and assembled only in the sixth century BC; the modern “Homeric Question” grew from that.[^4][^7] From about 1928 Milman Parry and Albert Lord, studying singers in the Balkans, argued that the poems were composed in performance from traditional phrases, the “oral-formulaic theory”, which won very wide acceptance.[^4]

{legend} **Did an Athenian tyrant fix the text?** Cicero reports that Pisistratus is said to have been the first to arrange Homer's books, which had been in confusion, as we have them now.[^13] A short dialogue transmitted under Plato's name, the *Hipparchus*, says that Pisistratus' son Hipparchus first brought Homer's poems to Attica and made the rhapsodes recite them at the Panathenaea in relay, one following on another.[^14]`,

  timeline: [
    { year: -700, approx: true, kind: "writing", certainty: "debated", what: "The *Iliad* and *Odyssey* are composed, on most accounts between the late 8th and early 7th centuries BC, the *Iliad* first", src: [4, 7] },
    { year: -284, approx: true, kind: "print", what: "Zenodotus, the first head of the Library of Alexandria (appointed 284 BC), becomes the first critical editor of Homer", src: [15] },
    { year: -250, approx: true, kind: "copy", what: "The oldest surviving papyri of Homer are written (3rd century BC on); some have lines that later copies lack", src: [17, 18] },
    { year: -150, approx: true, kind: "print", what: "Aristarchus, head of the Library from 153 to 145 BC, makes the most historically important critical edition of Homer, with a system of critical signs", src: [16] },
    { year: -150, approx: true, kind: "copy", what: "From about now the papyri settle into a more uniform text", src: [17] },
    { year: 950, approx: true, kind: "copy", what: "The Venetus A (Marcianus Graecus Z. 454), the main source of the “A scholia”, is copied in the 10th century", src: [20] },
    { year: 1488, kind: "print", what: "The first printed Homer appears in Florence (1488–89), edited by Demetrius Chalcondyles", src: [21] },
    { year: 1788, kind: "print", what: "Villoison publishes the Venetus A with the B scholia of another Venice manuscript", src: [20] },
    { year: 1795, kind: "reception", what: "Wolf's *Prolegomena ad Homerum* opens the modern Homeric Question", src: [4, 7] },
    { year: 1928, approx: true, kind: "reception", what: "Milman Parry begins the work that becomes the oral-formulaic theory", src: [4] },
    { year: 2017, kind: "print", what: "M. L. West's Teubner *Odyssey* completes his edition of both poems", src: [25] },
  ],

  transmission: `**Alexandria.** Zenodotus, appointed the first director of the Library of Alexandria in 284 BC, was the first critical editor of Homer: he compared manuscripts, and marked or removed lines he doubted.[^15] Aristarchus, who led the Library from 153 to 145 BC, made the most historically important edition; his critical signs became known as the Aristarchian symbols, and his rejection of doubtful lines made his severity proverbial.[^16] Either he or Zenodotus probably divided each poem into twenty-four books.[^16]

**Papyri.** The papyri of Homer date from as early as the third century BC to the seventh century AD, and most were found in Egypt.[^17] The early ones have “plus verses”, lines missing from the medieval copies, and “minus verses”, lines the medieval copies have that they lack; only from about 150 BC do they begin to settle into a more uniform text.[^17] For his *Odyssey* (2017), M. L. West more than doubled the number of papyri known for that poem, mostly from Oxyrhynchus, and they “broadly confirm what we already know”.[^25]

**The Venetus A.** The main source of the “A scholia”, the notes drawn largely from Aristarchus' work, is a tenth-century *Iliad* in Venice (Marcianus Graecus Z. 454, now 822), whose margins also carry marks that reflect fairly accurately Aristarchus' own.[^20] Jean-Baptiste d'Ansse de Villoison rediscovered and published it, with the B scholia of another Venice manuscript, in 1788.[^20]

**Print.** The first printed Homer came out in Florence in 1488–89, edited by Demetrius Chalcondyles.[^21]`,

  variants: `**Wild papyri.** The earliest papyri have extra lines and sometimes different wording. Earlier scholars dismissed them as “eccentric” or “wild”; Graeme Bird (2010) argues instead that they show authentic variation, of the kind oral performance produces.[^18] The standard study of the Ptolemaic papyri is Stephanie West's (1967).[^19]

**A lost letter.** Homer's language once had a w-sound, the digamma (ϝ), which Ionic had probably lost before the poems were written down in the seventh century BC.[^22] No standard edition prints it, but the metre can show where it was. In the first line of the quarrel, Ἀτρεΐδης τε ἄναξ ἀνδρῶν, the τε is not cut short before ἄναξ,[^24] and ἄναξ began with a w: Mycenaean Greek wrote the word *wa-na-ka*.[^23] Some editions put the letter back, but they have largely fallen out of favour.[^22]`,

  editions: [
    { text: "D. B. Monro and T. W. Allen, *Homeri Opera*, vols 1–2, *Iliad* (Oxford Classical Texts, 3rd ed. 1920).[^27]", note: "The Greek *Iliad* in the Scroll is Perseus's copy of this text.[^31]" },
    { text: "A. T. Murray, *Odyssey* (Loeb Classical Library, 1919)[^32] and *Iliad* (Loeb, 1924–25).[^33]", note: "The Greek *Odyssey* in the Scroll, and one English translation of each poem, are Murray's.[^31]" },
    { text: "Samuel Butler's prose translations of both poems (the *Odyssey* revised by Timothy Power and Gregory Nagy).[^31]", note: "The other English translation in the Scroll." },
    { text: "M. L. West, *Homeri Ilias*, 2 vols (Teubner, 1998–2000)[^26] and *Homerus. Odyssea* (De Gruyter, 2017).[^25]", note: "The fullest modern critical editions." },
    { text: "G. S. Kirk (general editor), *The Iliad: A Commentary*, 6 vols (Cambridge University Press, 1985–93).[^28]" },
    { text: "A. Heubeck, S. West, J. B. Hainsworth and others, *A Commentary on Homer's Odyssey*, 3 vols (Oxford, 1988–92).[^29][^30]" },
  ],

  sources: [
    { label: "Iliad 1.1, in the Scroll", cite: { work: "tlg0012.tlg001", ref: "1.1" } },
    { label: "Iliad 2.134, in the Scroll", cite: { work: "tlg0012.tlg001", ref: "2.134" } },
    { label: "Odyssey 2.175, in the Scroll", cite: { work: "tlg0012.tlg002", ref: "2.175" } },
    { label: "Wikipedia, Homer (the lives, the cities, the date, Wolf, Parry)", url: "https://en.wikipedia.org/wiki/Homer" },
    { label: "Homeric Hymn 3, to Apollo, line 172, in the Scroll", cite: { work: "tlg0013.tlg003", ref: "172" } },
    { label: "Thucydides 3.104.4–6, in the Scroll", cite: { work: "tlg0003.tlg001", ref: "3.104.4", to: "3.104.6" } },
    { label: "Wikipedia, Homeric Question (the range of dates, Wolf)", url: "https://en.wikipedia.org/wiki/Homeric_Question" },
    { label: "Herodotus 2.53, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.53.2", to: "2.53.3" } },
    { label: "Harper's Dictionary of Classical Antiquities, “Chorizontes” (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0062%3Aentry%3Dchorizontes-harpers" },
    { label: "Herodotus 2.117, in the Scroll", cite: { work: "tlg0016.tlg001", ref: "2.117.1" } },
    { label: "Wikipedia, Homeric Greek (the dialect mix, the genitive in -οιο)", url: "https://en.wikipedia.org/wiki/Homeric_Greek" },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entries ἀγορά and ἄμμες (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Cicero, On the Orator 3.137 (Latin text, The Latin Library)", url: "https://www.thelatinlibrary.com/cicero/oratore3.shtml" },
    { label: "Plato (attributed), Hipparchus 228b, in the Scroll", cite: { work: "tlg0059.tlg015", ref: "228" } },
    { label: "Wikipedia, Zenodotus (the first director of the Library, the first critical editor of Homer)", url: "https://en.wikipedia.org/wiki/Zenodotus" },
    { label: "Wikipedia, Aristarchus of Samothrace (his edition, signs and term as head of the Library)", url: "https://en.wikipedia.org/wiki/Aristarchus_of_Samothrace" },
    { label: "Casey Dué, “Homer & the Papyri: Introduction”, Center for Hellenic Studies (Harvard)", url: "https://www-current.chs.harvard.edu/homer-the-papyri-introduction/" },
    { label: "Graeme D. Bird, Multitextuality in the Homeric Iliad: The Witness of the Ptolemaic Papyri, Hellenic Studies 43 (Center for Hellenic Studies, 2010)", url: "https://chs.harvard.edu/book/bird-graeme-d-multitextuality-in-the-homeric-iliad-the-witness-of-the-ptolemaic-papyri/" },
    { label: "Stephanie West, The Ptolemaic Papyri of Homer (Cologne, 1967)", url: "https://link.springer.com/book/10.1007/978-3-663-20347-6" },
    { label: "Wikipedia, Venetus A (date, contents, scholia, Villoison 1788)", url: "https://en.wikipedia.org/wiki/Venetus_A" },
    { label: "Wikipedia, List of editiones principes in Greek (Homer, Florence, 1488–89, Chalcondyles)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Wikipedia, Digamma (its loss in Ionic, its trace in the metre, editions that restored it)", url: "https://en.wikipedia.org/wiki/Digamma" },
    { label: "Wikipedia, Wanax (Homeric ἄναξ and Linear B wa-na-ka)", url: "https://en.wikipedia.org/wiki/Wanax" },
    { label: "Iliad 1.7, in the Scroll", cite: { work: "tlg0012.tlg001", ref: "1.7" } },
    { label: "Bryn Mawr Classical Review 2019.01.05 on M. L. West, Homerus. Odyssea (Berlin and Boston: De Gruyter, 2017)", url: "https://bmcr.brynmawr.edu/2019/2019.01.05/" },
    { label: "Bryn Mawr Classical Review 2000.09.12 on M. L. West, Homeri Ilias, 2 vols (Teubner, 1998–2000)", url: "https://bmcr.brynmawr.edu/2000/2000.09.12/" },
    { label: "Oxford University Press, Homer, Opera (Oxford Classical Texts, Monro and Allen, the Iliad)", url: "https://global.oup.com/academic/product/opera-9780198145288" },
    { label: "Cambridge University Press, The Iliad: A Commentary (general editor G. S. Kirk, 6 vols)", url: "https://www.cambridge.org/core/books/iliad-a-commentary/41AEE70A72AC5230CEBCDF15AE7D4C42" },
    { label: "Oxford University Press, A Commentary on Homer's Odyssey (Heubeck, West, Hainsworth and others)", url: "https://global.oup.com/academic/product/a-commentary-on-homers-odyssey-9780198147473" },
    { label: "The Classical Review on Heubeck, West and Hainsworth, vol. 1 (1988) and Heubeck and Hoekstra, vol. 2 (1989)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/odyssey-alfred-heubeck-stephanie-west-j-b-hainsworth-a-commentary-on-homers-odyssey-vol-i-introduction-and-booksiviii-pp-xii-396-oxford-clarendon-press-1988-45-a-heubeck-a-hoekstra-a-commentary-on-homers-odyssey-vol-ii-books-ixxvi-pp-xii-300-oxford-clarendon-press-1989-3750/3CA2F39B3CA76DF4BE34E3861225BBB9" },
    { label: "Perseus's copies of the Iliad and Odyssey shown in the Scroll; each file's header names its edition (Monro and Allen for the Greek Iliad, Murray for the Greek Odyssey, Murray and Butler for the English)", cite: { work: "tlg0012.tlg001", ref: "1.1" } },
    { label: "Loeb Classical Library, Homer, Odyssey, vol. I (A. T. Murray, 1919)", url: "https://www.loebclassics.com/display/LCL104/1919/pb_LCL104.7.xml" },
    { label: "Loeb Classical Library, Homer, Iliad, vol. I (A. T. Murray, 1924)", url: "https://www.loebclassics.com/view/LCL170/1924/pb_LCL170.7.xml" },
  ],
  outsideQuotes: [
    "oral-formulaic theory",
    "a blind man, and he lives on rocky Chios",
    "broadly confirm what we already know",
  ],
  checked: "2026-09-30",
};
