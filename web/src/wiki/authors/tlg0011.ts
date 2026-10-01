/**
 * Sophocles. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing
 * reliable could be found: "eighteen" victories, the Antigone 904–920 interpolation doubt and
 * Goethe's hope, the nearly 200 manuscripts of the triad as a count of each play, Pearson's OCT,
 * Lobeck's Ajax, the Budé, and the "Doric colouring" of the choral songs.
 */
import type { AuthorArticle } from "../author-articles";

export const sophocles: AuthorArticle = {
  id: "tlg0011",
  summary: `Sophocles was a public man as well as a dramatist. In 443/2 BC he was one of the Hellenotamiai, the treasurers who received the tribute of Athens' allies,[^1,17] and the *Life of Sophocles* says he was elected one of the ten generals in 441, a junior colleague of Pericles, and served in the campaign against Samos.[^1] An old story says Athens made him general because of his *Antigone*. Hugh Lloyd-Jones calls that “most improbable”.[^1]

He wrote more than 120 plays, and only seven survive complete. He entered thirty competitions, won twenty-four, and was never placed lower than second.[^1] His first triumph came in 468 BC, at the Dionysia, when he beat Aeschylus.[^1]

{legend} Plutarch tells how it happened. The spectators were so partisan that the archon Apsephion did not choose the judges by lot. When Cimon and the other generals came into the theatre to pour the usual offering to the god, he made them swear the oath and sit as judges, ten in all. Sophocles, still young and with his first plays, won, and Aeschylus, “in great distress and indignation”, soon left Athens for Sicily.[^2]

The seven plays that survive are *Ajax*, *Antigone*, *Oedipus the King*, *Women of Trachis*, *Electra*, *Philoctetes* and *Oedipus at Colonus*. *Philoctetes* won first prize in 409 BC. *Oedipus at Colonus* was put on only in 401, after his death, at the wish of his grandson.[^1] Aristotle used *Oedipus the King* in his *Poetics* as an example of the highest achievement in tragedy.[^1]

One more play came back from the sand. *The Tracking Satyrs* (*Ichneutae*) is a satyr play found at Oxyrhynchus in Egypt: some 400 lines of a play that was probably about 800 long, in which satyrs track Apollo's stolen cows and find that the thief is his newborn brother Hermes.[^3] It was written out on a papyrus roll of the second century AD and published in 1912.[^4][^5]

His Greek can say two things at once. The famous ode in *Antigone* begins πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει (line 333 in the Scroll's text).[^6] LSJ lists for δεινός both “fearful, terrible” and “wondrous, marvellous, strange”, so the line can be heard as “Many things are wondrous and dreadful, and none more so than man” (our translation).[^7]

### Things worth knowing about the text

**The brother lines.** In *Antigone* Antigone says she would never have defied the citizens for a husband or for children; a lost husband might be replaced, and so might a child. But with her mother and father in the grave, no brother can ever be born.[^8] Aristotle quotes that last thought in his *Rhetoric* as an example of how to back up a claim that might seem hard to believe.[^9]

**A hero after death.** Sophocles was chosen in 420 BC to receive the image of Asclepius, and for this the Athenians gave him, after his death, the epithet Dexion.[^1]`,

  timeline: [
    { year: -497, approx: true, kind: "writing", what: "Born at Colonus, in Attica, about 497/6 BC", src: [1] },
    { year: -480, approx: true, kind: "writing", certainty: "legend", what: "Said to have led the paean for the victory at Salamis", src: [1] },
    { year: -468, kind: "writing", what: "First prize at the Dionysia, beating Aeschylus", src: [1, 2] },
    { year: -443, kind: "writing", what: "One of the Hellenotamiai, the treasurers of the allies' tribute (443/2)", src: [1, 17] },
    { year: -441, kind: "writing", what: "Elected one of the ten generals, a junior colleague of Pericles, and serves against Samos", src: [1] },
    { year: -420, approx: true, kind: "writing", what: "Chosen to receive the image of Asclepius; afterwards called Dexion", src: [1] },
    { year: -409, kind: "writing", what: "*Philoctetes* wins first prize", src: [1] },
    { year: -406, approx: true, kind: "writing", what: "Dies at Athens, aged 90 or 92 (406/5)", src: [1] },
    { year: -401, kind: "writing", what: "*Oedipus at Colonus* is performed for the first time, at his grandson's wish", src: [1] },
    { year: 150, approx: true, kind: "copy", what: "A papyrus roll of the *Tracking Satyrs* is written out in the second century AD", src: [4, 5] },
    { year: 950, approx: true, kind: "copy", what: "The Florence codex Laurentianus 32.9 (L), the main medieval witness, is made in the tenth century", src: [10, 11] },
    { year: 1502, kind: "print", what: "Aldus Manutius prints the first edition of the Greek text at Venice", src: [12] },
    { year: 1912, kind: "print", what: "Hunt publishes the *Tracking Satyrs* among the Oxyrhynchus Papyri", src: [5, 4] },
    { year: 1990, kind: "print", what: "Lloyd-Jones and Wilson publish their Oxford Classical Text and, beside it, *Sophoclea*", src: [13, 14] },
  ],

  transmission: `**The main manuscript.** The Florence codex Laurentianus 32.9, called L, is of the tenth century.[^10][^11] It holds Sophocles, Aeschylus (where it is called M) and Apollonius Rhodius.[^10][^11] Its twin in Leiden, BPG 60A, is a palimpsest, and most of it can no longer be read.[^10]

**Three plays for school.** In Byzantine times most copies held only three of the seven plays: *Ajax*, *Electra* and *Oedipus the King*. About two hundred medieval copies of Sophocles survive.[^10]

**Families and a reviser.** The most important member of the “Paris” family is Parisinus gr. 2712 (A).[^10] In the fourteenth century the scholar Demetrius Triclinius made his own recension of the plays, preserved in Paris gr. 2711 (T).[^10]

**The papyrus.** One play, the *Tracking Satyrs*, is known from a single papyrus roll found at Oxyrhynchus in 1907 and published in 1912.[^3][^4][^5]

**Print.** The first edition of the Greek text was printed by Aldus Manutius at Venice in 1502.[^12]`,

  variants: `**A reviser's recension.** In the fourteenth century the scholar Demetrius Triclinius made his own recension of the plays, preserved in Paris gr. 2711 (T).[^10]

**A play on one papyrus.** The *Tracking Satyrs* has no medieval copy at all. Its text is what a single papyrus roll, broken and gapped, gives us.[^3][^4][^5]

**Line numbers.** The Scroll's text of *Antigone* numbers the first line of the famous ode 333.[^6]`,

  editions: [
    { text: "F. Storr, *Sophocles*, 2 vols (Loeb Classical Library, 1912–13).[^15]", note: "The Greek of the plays in the Scroll is Perseus's copy of this edition; the *Tracking Satyrs* is Hunt's papyrus text of 1912." },
    { text: "R. C. Jebb's translations (Cambridge University Press).[^15]", note: "The English *Antigone* in the Scroll is Jebb's, of 1891; the *Tracking Satyrs* is translated by Anne Mahoney." },
    { text: "H. Lloyd-Jones and N. G. Wilson, *Sophoclis Fabulae* (Oxford Classical Texts, 1990), and their *Sophoclea: Studies on the Text of Sophocles* (Oxford, 1990).[^13][^14]", note: "The standard Greek text." },
    { text: "H. Lloyd-Jones, *Sophocles*, 3 vols (Loeb Classical Library, 1994–96).[^16]" },
  ],

  sources: [
    { label: "Wikipedia, Sophocles (his offices, victories, plays, the seven survivors, Poetics, hero cult)", url: "https://en.wikipedia.org/wiki/Sophocles" },
    { label: "Plutarch, Cimon 8, in the Scroll", cite: { work: "tlg0007.tlg035", ref: "8.7", to: "8.8" } },
    { label: "Sophocles, The Tracking Satyrs (Ichneutae), in the Scroll, with its introduction", cite: { work: "tlg0011.tlg008", ref: "1" } },
    { label: "Wikipedia, Ichneutae (the papyrus, its date and its publication)", url: "https://en.wikipedia.org/wiki/Ichneutae" },
    { label: "Oxyrhynchus Papyri, part 9, no. 1174 (A. S. Hunt, Egypt Exploration Fund, 1912), the papyrus behind the Scroll's Greek text", cite: { work: "tlg0011.tlg008", ref: "1" } },
    { label: "Sophocles, Antigone 333, in the Scroll", cite: { work: "tlg0011.tlg002", ref: "333" } },
    { label: "Liddell–Scott–Jones, Greek–English Lexicon: the entry δεινός (Perseus Digital Library)", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057" },
    { label: "Sophocles, Antigone 904–912, in the Scroll", cite: { work: "tlg0011.tlg002", ref: "904", to: "912" } },
    { label: "Aristotle, Rhetoric 3.16 (1417a), in Perseus", url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0060%3Abook%3D3%3Achapter%3D16" },
    { label: "Roger Pearse, Some manuscript traditions of the Greek classics (the Sophocles section)", url: "https://www.tertullian.org/rpearse/manuscripts/greek_classics.htm" },
    { label: "Biblissima, Florence, Biblioteca Medicea Laurenziana, Plut. 32.9 (tenth century; Sophocles, Aeschylus, Apollonius Rhodius)", url: "https://iiif.biblissima.fr/collections/manifest/1fdd391bd6dc0adca9472aea0d71aec3dc37e49a" },
    { label: "Wikipedia, Editio princeps (Sophocles, Aldus Manutius, Venice, 1502)", url: "https://en.wikipedia.org/wiki/Editio_princeps" },
    { label: "Oxford University Press, Sophocles, Fabulae (Lloyd-Jones and Wilson, Oxford Classical Texts, 1990)", url: "https://global.oup.com/academic/product/fabulae-9780198145776" },
    { label: "Revue des études grecques, review of Lloyd-Jones and Wilson, Sophoclis Fabulae (Oxford 1990) and Sophoclea", url: "https://www.persee.fr/doc/reg_0035-2039_1991_num_104_495_2512_t1_0291_0000_2" },
    { label: "Perseus's copies of Sophocles shown in the Scroll: each file's header names its edition (Storr, Heinemann 1912; Jebb, Cambridge 1891; Mahoney; Hunt, 1912)", cite: { work: "tlg0011.tlg002", ref: "1" } },
    { label: "Loeb Classical Library, Sophocles, Ajax, Electra, Oedipus Tyrannus (H. Lloyd-Jones, 1994)", url: "https://www.loebclassics.com/view/LCL020/1994/pb_LCL020.19.xml" },
    { label: "Wikipedia, Hellenotamiae (the ten magistrates who received the contributions of the allied states)", url: "https://en.wikipedia.org/wiki/Hellenotamiae" },
  ],
  outsideQuotes: [
    "most improbable",
    "Many things are wondrous and dreadful, and none more so than man",
    "fearful, terrible",
    "wondrous, marvellous, strange",
  ],
  checked: "2026-09-30",
};
