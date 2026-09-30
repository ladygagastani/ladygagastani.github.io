/**
 * Euripides. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing
 * reliable could be found: the names and dates of the manuscripts M, V, B, L and P (only L and P as
 * the homes of the alphabetical plays), the "Byzantine triad", the Parian Marble's 485/4, the lists
 * of which plays are in which stream, the disputed passages (Medea 38–43, the Phoenician Women's
 * ending, the ending of Iphigenia at Aulis), actors' interpolations, Vettori's 1545 Electra, Janus
 * Lascaris by name, and "the youngest of the three".
 */
import type { AuthorArticle } from "../author-articles";

export const euripides: AuthorArticle = {
  id: "tlg0006",
  summary: `More of Euripides' plays survive than of Aeschylus' and Sophocles' put together. Nineteen have come down to us more or less complete, though one of them, the *Rhesus*, is often thought not to be his. Some ancient scholars credited him with ninety-five plays; the Suda says ninety-two at most.[^1] Part of the reason so many survive is that his popularity grew as theirs declined: in the Hellenistic Age he became a cornerstone of ancient literary education.[^1]

He did not win easily. He first competed in 455 BC, and did not win first prize until 441. In all he won first prize only five times: four in his lifetime and one after his death, when the *Bacchae* and *Iphigenia at Aulis* were produced in 405.[^1] *Alcestis* (438) took second prize and stood in the place normally held by a satyr play. *Medea* (431) was third, *Hippolytus* (428) first and the *Trojan Women* (415) second.[^1] Aristophanes made him a character in at least three plays, the *Acharnians*, the *Thesmophoriazusae* and the *Frogs*.[^1]

He is the tragedian who sounds most like people talking. Aristotle says so in the *Rhetoric*: art is best hidden when the speaker “chooses his words from ordinary language and puts them together like Euripides, who was the first to show the way”.[^2]

{legend} Tradition says he was born on the island of Salamis, about 480 BC, on the very day of the battle there, and that he ended his life at the “rustic court” of King Archelaus in Macedon, dying in 406.[^1] Some modern scholars think he may never have gone to Macedonia at all.[^1]

### Things readers still argue about

**Is the *Rhesus* his?** It is among the nineteen, but its authorship is a matter of dispute.[^1]

**How many plays did he write?** Some ancient scholars said ninety-five; the Suda said ninety-two at most.[^1]`,

  timeline: [
    { year: -480, approx: true, kind: "writing", certainty: "legend", what: "Born on Salamis, by tradition on the day of the battle", src: [1] },
    { year: -455, kind: "writing", what: "First competes at the Dionysia", src: [1] },
    { year: -441, kind: "writing", what: "Wins first prize for the first time", src: [1] },
    { year: -438, kind: "writing", what: "*Alcestis* takes second prize, in the place usually held by a satyr play", src: [1] },
    { year: -431, kind: "writing", what: "*Medea* is placed third", src: [1] },
    { year: -428, kind: "writing", what: "*Hippolytus* wins first prize", src: [1] },
    { year: -415, kind: "writing", what: "The *Trojan Women* takes second prize", src: [1] },
    { year: -408, kind: "writing", what: "*Orestes* is produced", src: [1] },
    { year: -406, approx: true, kind: "writing", certainty: "legend", what: "Dies, traditionally in Macedon at the court of Archelaus", src: [1] },
    { year: -405, kind: "writing", what: "The *Bacchae* and *Iphigenia at Aulis* are produced after his death and win first prize", src: [1] },
    { year: 200, approx: true, kind: "copy", what: "A select edition of ten plays circulates, about AD 200, possibly for schools", src: [1] },
    { year: 1494, approx: true, kind: "print", what: "The first printed Euripides appears at Florence, with four plays: *Medea*, *Hippolytus*, *Alcestis* and *Andromache*", src: [3] },
    { year: 1503, kind: "print", what: "Aldus Manutius prints all the plays but *Electra* at Venice", src: [3] },
    { year: 1994, kind: "print", what: "Diggle's third volume completes his Oxford Classical Text (volumes of 1981, 1984 and 1994)", src: [5, 6] },
    { year: 2004, kind: "print", what: "Kannicht's edition of the fragments of Euripides (*TrGF* 5) is published at Göttingen", src: [10] },
  ],

  transmission: `**Two streams.** The plays reached the Middle Ages by two routes. One was a select edition of ten plays, circulated about AD 200 and “possibly for use in schools”; its plays survive in many medieval manuscripts. The other was a group of nine plays in alphabetical order. “Some unknown Byzantine scholar” put the two together, which gave the nineteen plays we have.[^1]

**Two manuscripts for nine plays.** The alphabetical plays are preserved in L, in the Laurentian Library at Florence, and P, in the Palatine Library.[^1]

**Fragments on papyrus.** The fragments of the lost *Hypsipyle* are extensive enough to allow tentative reconstructions of the play.[^1]

**Print.** Four plays were printed at Florence in about 1494 (*Medea*, *Hippolytus*, *Alcestis* and *Andromache*), and Aldus Manutius printed all the plays but the *Electra* at Venice in 1503.[^3]`,

  variants: `**Plays with only two witnesses.** The nine alphabetical plays survive through L and P alone, so they have no second route to fall back on.[^1]

**A play in dispute.** The authorship of the *Rhesus* is a matter of dispute.[^1]

**Fragments.** What survives of his lost plays is gathered in Kannicht's *TrGF* 5.[^10]`,

  editions: [
    { text: "G. Murray, *Euripidis Fabulae* (Oxford Classical Texts, 1902–13).[^4]", note: "The Greek plays in the Scroll are Perseus's copies of Murray's text." },
    { text: "E. P. Coleridge's translations (1906), T. A. Buckley's *Bacchae* (1850) and Gilbert Murray's *Rhesus* (1913).[^4]", note: "The English in the Scroll." },
    { text: "J. Diggle, *Euripidis Fabulae*, 3 vols (Oxford Classical Texts, 1981–94).[^5][^6]", note: "The standard modern Greek text." },
    { text: "D. Kovacs, *Euripides*, 6 vols (Loeb Classical Library, 1994–2003).[^7][^8]" },
    { text: "D. J. Mastronarde, *Euripides: Medea* (Cambridge Greek and Latin Classics, 2002).[^9]", note: "With a commentary." },
    { text: "R. Kannicht, *Tragicorum Graecorum Fragmenta*, vol. 5, *Euripides* (Göttingen, 2004).[^10]", note: "The fragments." },
  ],

  sources: [
    { label: "Wikipedia, Euripides (his plays, victories, the streams of manuscripts, L and P, Rhesus, the papyri)", url: "https://en.wikipedia.org/wiki/Euripides" },
    { label: "Aristotle, Rhetoric 3.2.5, in the Scroll", cite: { work: "tlg0086.tlg038", ref: "3.2.5" } },
    { label: "Wikipedia, List of editiones principes in Greek (Euripides, about 1494 and 1503)", url: "https://en.wikipedia.org/wiki/List_of_editiones_principes_in_Greek" },
    { label: "Perseus's copies of Euripides shown in the Scroll; each file's header names its edition (Murray's Oxford text, 1902–13; Coleridge, 1906; Buckley, 1850; Gilbert Murray, 1913)", cite: { work: "tlg0006.tlg003", ref: "1" } },
    { label: "Oxford University Press, Euripides, Fabulae (J. Diggle, Oxford Classical Texts)", url: "https://global.oup.com/academic/product/fabulae-9780198145950" },
    { label: "The Classical Review, “The Re-Editing of Euripides”, on Diggle's Euripidis Fabulae, vol. 2 (1981)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/reediting-of-euripides-james-diggle-euripidis-fabulae-tomus-ii-supplices-electra-hercules-troades-iphigenia-in-tauris-ion-oxford-classical-texts-pp-xiii373-oxford-clarendon-press-1981-625/63B02DA7667C0A906A72134D4DA633CD" },
    { label: "Loeb Classical Library, Euripides, Cyclops, Alcestis, Medea (D. Kovacs, 1994)", url: "https://www.loebclassics.com/view/LCL012/1994/volume.xml" },
    { label: "Loeb Classical Library, Euripides, Bacchae, Iphigenia at Aulis, Rhesus (D. Kovacs, 2003)", url: "https://www.loebclassics.com/view/LCL495/2003/volume.xml" },
    { label: "Bryn Mawr Classical Review 2003.07.23 on D. J. Mastronarde, Euripides: Medea (Cambridge University Press, 2002)", url: "https://bmcr.brynmawr.edu/2003/2003.07.23" },
    { label: "Bryn Mawr Classical Review 2006.05.23 on R. Kannicht, Tragicorum Graecorum Fragmenta, vol. 5, Euripides (Göttingen, 2004)", url: "https://bmcr.brynmawr.edu/2006/2006.05.23/" },
  ],
  outsideQuotes: [
    "possibly for use in schools",
    "Some unknown Byzantine scholar",
    "rustic court",
  ],
  checked: "2026-09-30",
};
