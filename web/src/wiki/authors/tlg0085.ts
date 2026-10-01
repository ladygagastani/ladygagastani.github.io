/**
 * Aeschylus. Checked on 2026-09-30 (notes: pipeline/drafts/CHECKED.md). Left out because nothing
 * reliable could be found: the "Doric colouring" of the choral songs, the reading ἑλέναυς at
 * Agamemnon 689 (both Greek texts in the Scroll print ἑλένας), the exact lines M has lost from the
 * Agamemnon, the siglum and date of each Triclinian manuscript, "among the most corrupt texts in Greek",
 * and a second Teubner edition in 1998.
 */
import type { AuthorArticle } from "../author-articles";

export const aeschylus: AuthorArticle = {
  id: "tlg0085",
  summary: `Aeschylus was born about 525 BC at Eleusis, a small town some 27 km from Athens, and he fought for Athens against Persia.[^1] In 490 BC he and his brother Cynegeirus stood in the line at Marathon.[^1] Herodotus tells how Cynegirus son of Euphorion died there, his hand cut off with an axe as he took hold of a Persian ship to stop it getting away.[^3,1] Aeschylus fought again ten years later, at sea, off Artemisium and at Salamis.[^2]

When he came to write his own epitaph, he left out the plays. Pausanias says he recorded only his name, his father's name and his city, and “that he had witnesses to his valor in the grove at Marathon and in the Persians who landed there”.[^2]

He first competed in 499 BC, when he was 26, and won his first victory in 484.[^1] He wrote an estimated 70 to 90 plays, and seven survive; the ancient *Life of Aeschylus* says he took first prize at the City Dionysia thirteen times.[^1]

His *Persians* won first prize in 472 BC, with Pericles paying for the production as *choregos*.[^1,4] It is the oldest Greek play that survives, and the only surviving tragedy about events of its own day: the Persian Wars.[^4] It was a risky subject. Some twenty years earlier Phrynichus had staged *The Fall of Miletus*; the whole theatre wept, and the Athenians fined him a thousand drachmas “for bringing to mind a calamity that affected them so personally”.[^5]

In 468 BC he lost to a newcomer, the young Sophocles, and Plutarch says he took it so hard that he soon left Athens for Sicily.[^6] He had been there before, invited by Hieron of Syracuse in the 470s.[^1] Back in Athens, *Seven against Thebes* and its trilogy won first prize in 467.[^7] *The Suppliants* was long taken to be his earliest play; a papyrus published in 1952 showed it was one of his last, probably staged in 463.[^8] In 458 the *Oresteia* (*Agamemnon*, *Libation Bearers*, *Eumenides*) won first prize. It is the only complete trilogy of Greek plays that survives, and of *Proteus*, the satyr play that followed it, only fragments are left.[^9,1] He died at Gela, in Sicily, in 456 or 455 BC.[^1]

{legend} Valerius Maximus has a stranger ending: an eagle, looking for a rock to crack a tortoise on, dropped it on the poet's head.[^1]

### What he changed

Aristotle says Aeschylus “first raised the number of the actors from one to two”; he cut down the chorus and gave the leading part to the dialogue. Sophocles then added a third actor and painted scenery.[^10]

His words were famous for their size. In Aristophanes' *Frogs*, which won first prize in 405 BC, half a century after his death, the character of Euripides mocks him: halfway through a play he would come out with «ῥήματʼ ἂν βόεια δώδεκʼ εἶπεν», “a dozen ox-sized words” (our translation).[^31,11] He could also play with a name until it rang like a bell. The chorus of the *Agamemnon* sings that Helen was named truly, «ἑλένας, ἕλανδρος» and the rest: in Smyth's English, “a Hell she proved to ships, Hell to men, Hell to city”.[^12]

{debated} He was also said to have given away something he should not have. Aristotle, explaining how a man can do wrong without knowing it, mentions people who say “they were not aware that the matter was a secret, as Aeschylus said of the Mysteries”.[^13] Aristotle says no more. The story is usually told as a charge of impiety, for revealing some of the secrets of the Mysteries on stage.[^1]

After his death his plays were honoured in a way no one else's were: his were the only tragedies allowed to be staged again at the competitions.[^1]`,

  timeline: [
    { year: -525, approx: true, kind: "writing", what: "Born at Eleusis, in Attica, about 525 BC", src: [1] },
    { year: -499, kind: "writing", what: "First competes as a playwright, aged 26", src: [1] },
    { year: -490, kind: "writing", what: "Fights at Marathon, where his brother Cynegeirus is killed", src: [1, 3] },
    { year: -484, kind: "writing", what: "First victory at the Dionysia", src: [1] },
    { year: -480, kind: "writing", what: "Fights at sea off Artemisium and at Salamis", src: [2] },
    { year: -472, kind: "writing", what: "*Persians* wins first prize; Pericles pays for the production", src: [1, 4] },
    { year: -468, kind: "writing", what: "Beaten by the young Sophocles; leaves for Sicily", src: [6] },
    { year: -467, kind: "writing", what: "*Seven against Thebes* and its trilogy win first prize", src: [7] },
    { year: -463, approx: true, kind: "writing", what: "*The Suppliants* and its trilogy, probably in 463", src: [8] },
    { year: -458, kind: "writing", what: "The *Oresteia* wins first prize", src: [9] },
    { year: -456, approx: true, kind: "writing", what: "Dies at Gela, in Sicily (456 or 455 BC)", src: [1] },
    { year: -405, kind: "reception", what: "Aristophanes' *Frogs* wins first prize, with Aeschylus as a character", src: [31, 11] },
    { year: -336, approx: true, kind: "copy", what: "In the years of Lycurgus (in charge of the city's money from 336 BC) a law has official copies of the three tragedians kept; actors must not depart from them", src: [30, 14] },
    { year: 975, approx: true, kind: "copy", what: "The Medicean manuscript (M), with all seven plays, is written in the late tenth century or about AD 1000", src: [16, 27] },
    { year: 1423, kind: "copy", what: "M arrives in Florence", src: [16] },
    { year: 1518, kind: "print", what: "First printed edition (Aldine press, Venice): six plays, with the *Agamemnon* and *Libation Bearers* run together", src: [18] },
    { year: 1552, kind: "print", what: "Robortello's Venice edition separates the two plays for the first time", src: [18] },
    { year: 1952, kind: "print", what: "A papyrus published this year re-dates *The Suppliants* to the 460s", src: [8] },
  ],

  transmission: `**From Athens to Alexandria.** Athens itself kept an official text. A law of the statesman Lycurgus, who ran the city's finances from 336 BC,[^30] had the tragedies of Aeschylus, Sophocles and Euripides written out and kept in a public archive; the clerk of the city read them to the actors, and it was “unlawful to depart from the authorized text in acting”.[^14]

{legend} Galen tells what happened to those copies. Ptolemy III of Egypt borrowed them against a deposit of fifteen talents, had fine copies made, sent the copies back, and kept the originals, letting Athens keep the money.[^15]

**One book in Florence.** In 1423 a manuscript arrived in Florence that had been written about AD 1000: the Medicean manuscript, called M, now Laurentianus 32.9. It holds all seven plays, including the *Libation Bearers* (though its beginning is lost) and *The Suppliants*.[^16] The same book holds Sophocles and Apollonius of Rhodes.[^27] Those two plays, the *Libation Bearers* and *The Suppliants*, exist only in M and its copies.[^16]

**Three plays for school.** In Byzantine times a smaller selection was read: *Prometheus*, *Seven against Thebes* and *Persians*, the “Byzantine triad”. Of about 150 manuscripts of Aeschylus, almost all contain only these three.[^16]

**The Agamemnon.** Besides M and its copies, the *Agamemnon* and *Eumenides* survive in three other manuscripts, at least one of them the work of the fourteenth-century scholar Demetrius Triclinius.[^16] For a large part of the *Agamemnon* two of these manuscripts (called Tr and F) are the only basis for the text.[^17]

**Print.** The first printed edition came from the Aldine press at Venice in 1518. It has only six plays: its manuscripts had fused the *Agamemnon* and the *Libation Bearers*, leaving out lines 311–1066 of the *Agamemnon*. The error was first put right in 1552, in Francesco Robortello's edition at Venice.[^18]`,

  variants: `**A lost opening, saved by a joke.** The *Libation Bearers* has lost its opening in M.[^16] Its first lines are known because Aristophanes quotes them in the *Frogs*, where “Euripides” picks at them: «ἥκω γὰρ ἐς γῆν τήνδε καὶ κατέρχομαι» “I have come to this land and I return”, he says, is saying the same thing twice.[^19] In the Scroll's Greek text of the play these opening lines are printed as the editor's additions, with gaps where words are still missing.[^20]

{debated} **Is *Prometheus Bound* his?** No one doubted it in antiquity. Since the nineteenth century scholars have questioned it on grounds of language, metre, vocabulary and style; Mark Griffith (1977) made the case at length, and Martin West suggested it could be the work of Aeschylus' son Euphorion, also a playwright. The question is still argued.[^21]

{debated} **A new ending for *Seven against Thebes*.** The play ends with a herald announcing that Polynices must not be buried, and Antigone saying she will bury him anyway (from line 1011 in the Scroll's text).[^22] Many think this ending was written about fifty years after Aeschylus died, because Sophocles' *Antigone* had made the story popular.[^7]

**Actors' changes.** Lycurgus' law forbade actors to depart from the official text, which suggests they had been doing so.[^14]`,

  editions: [
    { text: "H. W. Smyth, *Aeschylus*, 2 vols (Loeb Classical Library, 1922–26).[^23]", note: "The Greek text and the English translation of the plays in the Scroll are Perseus's copies of Smyth's." },
    { text: "A. Sidgwick, *Aeschyli Tragoediae* (Oxford, Clarendon Press, 1902).[^23]", note: "The Scroll's second Greek text of each play." },
    { text: "Robert Browning's translation of the *Agamemnon*.[^23]", note: "The Scroll's second English *Agamemnon*, from *The Poetical Works of Robert Browning* (London, 1889)." },
    { text: "D. L. Page, *Aeschyli Septem Quae Supersunt Tragoedias* (Oxford Classical Texts, 1972).[^24]" },
    { text: "M. L. West, *Aeschyli Tragoediae* (Teubner, Stuttgart, 1990).[^25]" },
    { text: "A. H. Sommerstein, *Aeschylus*, 3 vols (Loeb Classical Library 145, 146 and 505, 2008).[^26]", note: "The third volume holds the fragments of the lost plays." },
    { text: "S. Radt, *Tragicorum Graecorum Fragmenta*, vol. 3: *Aeschylus* (Göttingen, 1985).[^28]", note: "The standard edition of the fragments." },
    { text: "E. Fraenkel, *Aeschylus: Agamemnon*, 3 vols (Oxford, 1950).[^29]", note: "A famous commentary on one play." },
  ],

  sources: [
    { label: "Wikipedia, Aeschylus (his life, the plays, victories, Sicily, the Mysteries, restaging after his death)", url: "https://en.wikipedia.org/wiki/Aeschylus" },
    { label: "Pausanias, Description of Greece 1.14.5, in the Scroll (the epitaph; Artemisium and Salamis)", cite: { work: "tlg0525.tlg001", ref: "1.14.5" } },
    { label: "Herodotus, Histories 6.114, in the Scroll (Cynegirus at Marathon)", cite: { work: "tlg0016.tlg001", ref: "6.114.1" } },
    { label: "Wikipedia, The Persians (472 BC, Pericles, the oldest surviving play)", url: "https://en.wikipedia.org/wiki/The_Persians" },
    { label: "Herodotus, Histories 6.21.2, in the Scroll (Phrynichus fined)", cite: { work: "tlg0016.tlg001", ref: "6.21.2" } },
    { label: "Plutarch, Cimon 8, in the Scroll", cite: { work: "tlg0007.tlg035", ref: "8.7", to: "8.8" } },
    { label: "Wikipedia, Seven Against Thebes (467 BC; the rewritten ending)", url: "https://en.wikipedia.org/wiki/Seven_Against_Thebes" },
    { label: "Wikipedia, The Suppliants (Aeschylus) (the papyrus of 1952 and the date)", url: "https://en.wikipedia.org/wiki/The_Suppliants_(Aeschylus)" },
    { label: "Wikipedia, Oresteia (458 BC; the only surviving trilogy; Proteus)", url: "https://en.wikipedia.org/wiki/Oresteia" },
    { label: "Aristotle, Poetics 4.16, in the Scroll", cite: { work: "tlg0086.tlg034", ref: "4.16" } },
    { label: "Aristophanes, Frogs 924, in the Scroll", cite: { work: "tlg0019.tlg009", ref: "924" } },
    { label: "Aeschylus, Agamemnon 685–690, in the Scroll", cite: { work: "tlg0085.tlg005", ref: "685", to: "690" } },
    { label: "Aristotle, Nicomachean Ethics 3.1, in the Scroll", cite: { work: "tlg0086.tlg010", ref: "3.1" } },
    { label: "Plutarch (attributed), Lives of the Ten Orators: Lycurgus, in the Scroll", cite: { work: "tlg0007.tlg121", ref: "7.1" } },
    { label: "Wikipedia, Library of Alexandria (Galen's story of Ptolemy III and the Athenian copies)", url: "https://en.wikipedia.org/wiki/Library_of_Alexandria" },
    { label: "Roger Pearse, Notes on the transmission of Aeschylus (after T. G. Rosenmeyer, The Art of Aeschylus, 1982)", url: "https://www.roger-pearse.com/weblog/2011/05/26/notes-on-the-transmission-of-aeschylus/" },
    { label: "Bryn Mawr Classical Review 2025.07.38, review of Edith Hall, Aeschylus: Agamemnon (Liverpool, 2024)", url: "https://bmcr.brynmawr.edu/2025/2025.07.38/" },
    { label: "Wikipedia, Editio princeps (Aeschylus, Venice 1518; Robortello 1552)", url: "https://en.wikipedia.org/wiki/Editio_princeps" },
    { label: "Aristophanes, Frogs 1126–1174, in the Scroll", cite: { work: "tlg0019.tlg009", ref: "1126", to: "1174" } },
    { label: "Aeschylus, Libation Bearers 1–5, in the Scroll", cite: { work: "tlg0085.tlg006", ref: "1", to: "5" } },
    { label: "Wikipedia, Prometheus Bound (the authorship question)", url: "https://en.wikipedia.org/wiki/Prometheus_Bound" },
    { label: "Aeschylus, Seven against Thebes 1011, in the Scroll", cite: { work: "tlg0085.tlg004", ref: "1011" } },
    { label: "Perseus's copies of Aeschylus shown in the Scroll: each file's header names its edition (Smyth, Heinemann 1922 and 1926; Sidgwick, Clarendon Press 1902; Browning, Smith, Elder 1889)", cite: { work: "tlg0085.tlg002", ref: "1" } },
    { label: "Oxford University Press, Aeschylus, Septem Quae Supersunt Tragoediae (Page, Oxford Classical Texts)", url: "https://global.oup.com/academic/product/septem-quae-supersunt-tragoediae-9780198145707" },
    { label: "The Classical Review 42.2 (1992), “The New Teubner Aeschylus”: review of M. L. West, Aeschyli Tragoediae (Stuttgart, 1990)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/the-new-teubner-aeschylus-westmartin-l-aeschyli-tragoediae-bibl-teubneriana-pp-lxxxv-508-stuttgart-b-g-teubner-1990-dm-195-westmartin-l-studies-in-aeschylus-beitrage-zur-altertumskunde-1-pp-x-408-stuttgart-b-g-teubner-1990-dm-184/3A5ACBC33DBE5EDA49B0244C9515CE87" },
    { label: "Harvard University Press, Aeschylus I: Persians, Seven against Thebes, Suppliants, Prometheus Bound (Sommerstein, Loeb Classical Library 145, 2008)", url: "https://www.hup.harvard.edu/books/9780674996274" },
    { label: "Biblissima, Florence, Biblioteca Medicea Laurenziana, Plut. 32.9 (tenth century; Sophocles, Aeschylus, Apollonius Rhodius)", url: "https://iiif.biblissima.fr/collections/manifest/1fdd391bd6dc0adca9472aea0d71aec3dc37e49a" },
    { label: "The Classical Review, review of S. Radt, Tragicorum Graecorum Fragmenta, vol. 3: Aeschylus (Göttingen, 1985)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/fragments-of-aeschylus-s-radt-tragicorum-graecorum-fragmenta-vol-3-aeschylus-tragicorum-graecorum-fragmenta-pp-592-gottingen-vandenhoeck-ruprecht-1985-dm-268/D1BFC60FD1579FBA499EEA8500ABC126" },
    { label: "The Classical Review, “Fraenkel's Agamemnon”: review of E. Fraenkel, Aeschylus: Agamemnon, 3 vols (Oxford, 1950)", url: "https://www.cambridge.org/core/journals/classical-review/article/abs/fraenkels-agamemnon-aeschylus-agamemnon-edited-with-a-commentary-by-eduard-fraenkel-3-vols-vol-i-pp-xvi-195-vols-ii-and-iii-pp-viii-850-oxford-clarendon-press-1950-cloth-4-4s-net/4E493B098FBBA152324E9521F3A2B312" },
    { label: "Wikipedia, Lycurgus of Athens (his years in charge of the finances; the law on the tragedians)", url: "https://en.wikipedia.org/wiki/Lycurgus_of_Athens" },
    { label: "Wikipedia, The Frogs (Lenaia, 405 BC, first prize)", url: "https://en.wikipedia.org/wiki/The_Frogs" },
  ],
  outsideQuotes: [
    "a dozen ox-sized words",
    "I have come to this land and I return",
  ],
  checked: "2026-09-30",
};
