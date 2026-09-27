import type { Entry } from "../types";

const entry: Entry = {
  slug: "eleusinian-mysteries",
  title: "The Eleusinian Mysteries",
  greek: "τὰ Ἐλευσίνια μυστήρια",
  category: "religion",
  kicker: "The secret kept by thousands for a thousand years",
  image: "great-eleusinian-relief",
  hook: `Every autumn for about a thousand years, crowds walked the fourteen miles from Athens to Eleusis to be initiated into the Mysteries of Demeter and her daughter Persephone. Men and women, citizens, foreigners and even slaves could take part, and many thousands did. They were promised a better lot after death. What happened in the great hall at Eleusis was never to be told, and it very nearly never was.`,
  body: `## The story behind the rite

The *Homeric Hymn to Demeter*, composed probably in the seventh or sixth century BC, tells the myth. Hades carried off Demeter's daughter Persephone, the Maiden (*Kore*), to be queen of the dead. Demeter searched the earth in grief, came in disguise to Eleusis, and in her anger kept the crops from growing until Zeus let Persephone return for part of every year. Before leaving Eleusis, the goddess taught its leaders her rites.

{{quote:hymn}}

For the Athenians, the Mysteries were one of the city's two great gifts to the world. The orator Isocrates, in the fourth century BC, put it this way: Demeter gave Attica [two gifts](cts:tlg0010.tlg011:28), grain, which raised men above the beasts, and the rite, which gives those who share it "sweeter hopes" about death and all eternity.

## Open to all, told to none

{well} Initiation was open to Greeks. At the start of the festival the heralds [warned non-Greeks away](cts:tlg0010.tlg011:157), as they warned away murderers, and Herodotus says [any Athenian or other Greek](cts:tlg0016.tlg001:8.65.4) who wished could be initiated. Women and slaves took part. There were two grades: the *mystai*, first-time initiates, and, a year or more later, the *epoptai*, "those who have seen".

The secret was taken seriously. Aristotle mentions in passing that Aeschylus, accused of revealing the Mysteries in one of his plays, [pleaded that he had not known](cts:tlg0086.tlg010:3.1) the matter was secret. In 415 BC, as the Athenian fleet prepared to sail for Sicily, informers claimed that young aristocrats, among them the general Alcibiades, had [performed the Mysteries in private houses](cts:tlg0003.tlg001:6.28.1) as a drunken mockery. Alcibiades was recalled to stand trial, and [slipped away](cts:tlg0003.tlg001:6.61.6) on the way home, to go over to Sparta.

Six hundred years later Pausanias, describing Eleusis, stopped at the sanctuary wall: [a dream forbade him](cts:tlg0525.tlg001:1.38.7) to describe what was inside.

## A ghostly procession

The festival began with a procession from Athens along the Sacred Way, with the cry of "Iacchus". Herodotus tells how in 480 BC, after the Persians had taken Attica and emptied it, two Greeks in the Persian camp saw a huge cloud of dust rising from Eleusis and heard the Iacchus cry, though no Athenian could be there. One explained it to the other.

{{quote:iacchus}}

{legend} The dust cloud was taken as a sign that the gods would destroy Xerxes' fleet, and a few days later it was destroyed at Salamis. Herodotus reports the story as he heard it.

## What did they see?

The only descriptions come from Christian writers of the second and third centuries AD, hostile witnesses who wanted to expose the pagan rites. Clement of Alexandria gives what he calls the password of the Eleusinian initiates.

{{quote:password}}

Hippolytus, quoting the writings of a Gnostic sect, says that the highest revelation, shown to the *epoptai* in silence, was [an ear of grain, reaped](cts:tlg2115.tlg060:5.8.39), and that the chief priest, the *hierophant*, cried out at night under a great fire that the goddess had borne a holy child.

{debated} How far to trust these writers is disputed. The kykeon, a drink of barley and water flavoured with pennyroyal, is also in the Homeric Hymn, where Demeter [breaks her fast with it](cts:tlg0013.tlg002:208). The rest may be accurate, garbled, or taken from other cults. What the initiates felt, they did not write down.

## The end

{debated} The sanctuary was damaged when the Goths under Alaric invaded Greece in AD 396, and the Christian emperors had already banned pagan cult. The last hierophants are known from late sources, and exactly when the rites stopped is not certain.

{{timeline}}`,
  quotes: {
    hymn: {
      work: "tlg0013.tlg002", ref: "480", label: "Homeric Hymn to Demeter 480–482",
      grc: "ὄλβιος, ὃς τάδʼ ὄπωπεν ἐπιχθονίων ἀνθρώπων·\nὃς δʼ ἀτελὴς ἱερῶν ὅς τʼ ἄμμορος, οὔποθʼ ὁμοίων\nαἶσαν ἔχει φθίμενός περ ὑπὸ ζόφῳ ἠερόεντι.",
      tr: "Happy is he among men upon earth who has seen these mysteries; but he who is uninitiate and who has no part in them, never has lot of like good things once he is dead, down in the darkness and gloom.",
      trFrom: "corpus", trBy: "H. G. Evelyn-White (1914)",
    },
    iacchus: {
      work: "tlg0016.tlg001", ref: "8.65.4", label: "Herodotus 8.65.4",
      grc: "τὴν δὲ ὁρτὴν ταύτην ἄγουσι Ἀθηναῖοι ἀνὰ πάντα ἔτεα τῇ Μητρὶ καὶ τῇ Κούρῃ, καὶ αὐτῶν τε ὁ βουλόμενος καὶ τῶν ἄλλων Ἑλλήνων μυεῖται· καὶ τὴν φωνὴν τῆς ἀκούεις ἐν ταύτῃ τῇ ὁρτῇ ἰακχάζουσι.",
      tr: "Every year the Athenians observe this festival for the Mother and the Maiden, and any Athenian or other Hellene who wishes is initiated. The voice which you hear is the ‘Iacchus’ they cry at this festival.",
      trFrom: "corpus", trBy: "A. D. Godley (1925)",
    },
    password: {
      work: "tlg0555.tlg001", ref: "2", label: "Clement of Alexandria, Exhortation to the Greeks 2.21",
      grc: "ἐνήστευσα, ἔπιον τὸν κυκεῶνα, ἔλαβον ἐκ κίστης, ἐργασάμενος ἀπεθέμην εἰς κάλαθον καὶ ἐκ καλάθου εἰς κίστην.",
      tr: "I fasted; I drank the kykeon; I took from the chest; having done my work, I put it into the basket, and from the basket into the chest.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "c. 1500 BC", what: "First buildings on the site of the later sanctuary at Eleusis.", certainty: "debated" },
    { when: "7th–6th c. BC", what: "The Homeric Hymn to Demeter is composed.", certainty: "debated" },
    { when: "480 BC", what: "The phantom Iacchus procession before Salamis, as Herodotus tells it.", certainty: "legend" },
    { when: "415 BC", what: "Alcibiades is accused of profaning the Mysteries.", certainty: "well" },
    { when: "c. AD 200", what: "Clement of Alexandria and, soon after, Hippolytus write against the Mysteries.", certainty: "well" },
    { when: "AD 396", what: "Alaric's Goths invade Greece; the sanctuary is damaged.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0013.tlg002", ref: "1", to: "495", label: "Homeric Hymn to Demeter", why: "The myth of Demeter and Persephone, and the founding of the rite." },
    { work: "tlg0016.tlg001", ref: "8.65.1", to: "8.65.6", label: "Herodotus 8.65", why: "The ghostly procession before Salamis." },
    { work: "tlg0003.tlg001", ref: "6.27.1", to: "6.29.3", label: "Thucydides 6.27–29", why: "The scandal of 415 BC." },
  ],
  related: ["delphi"],
  primary: [
    { work: "tlg0013.tlg002", ref: "473", to: "482", label: "Homeric Hymn to Demeter 473–482" },
    { work: "tlg0010.tlg011", ref: "28", label: "Isocrates, Panegyricus 28" },
    { work: "tlg0016.tlg001", ref: "8.65.1", to: "8.65.6", label: "Herodotus 8.65" },
    { work: "tlg0003.tlg001", ref: "6.28.1", label: "Thucydides 6.28" },
    { work: "tlg0525.tlg001", ref: "1.38.7", label: "Pausanias 1.38.7" },
    { work: "tlg0555.tlg001", ref: "2", label: "Clement of Alexandria, Exhortation to the Greeks 2" },
    { work: "tlg2115.tlg060", ref: "5.8.39", to: "5.8.40", label: "Hippolytus, Refutation of All Heresies 5.8.39–40" },
  ],
  secondary: [
    { id: "mylonas-eleusis", note: "The sanctuary and its history, by one of its excavators." },
    { id: "burkert-mystery", note: "Mystery cults compared, by a great historian of Greek religion." },
  ],
  written: "2026-09-27",
};
export default entry;
