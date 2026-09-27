import type { Entry } from "../types";

const entry: Entry = {
  slug: "olympic-games",
  title: "The Olympic Games",
  greek: "τὰ Ὀλύμπια",
  category: "daily",
  kicker: "A crown of wild olive, a truce, and statues paid for by cheats",
  image: "panathenaic-runners",
  hook: `Every four years for more than a thousand years, Greeks from all over the Mediterranean travelled to the sanctuary of Zeus at Olympia to watch naked men run, wrestle, box and race chariots. The prize was a wreath of wild olive. The Games were a religious festival first, and they came with rules: a sacred truce for travellers, fines for cheats, and death for any married woman caught watching.`,
  body: `## Beginnings

Greeks counted years in Olympiads, four-year periods beginning with the first recorded Games, traditionally dated to 776 BC. At first, Pausanias says, [there was a single foot race](cts:tlg0525.tlg001:5.8.6), the *stadion*, one length of the stadium, and its first recorded winner was Coroebus of Elis. The double-length race was added at the fourteenth Games, the long race at the fifteenth, and wrestling, boxing, the pentathlon, the chariot race and the brutal all-in fighting called the *pankration* followed over the next century and a half.

{debated} The date 776 BC comes from a list of victors drawn up about 400 BC by the scholar Hippias of Elis, and even Plutarch warned that Hippias [had nothing reliable to go on](cts:tlg0007.tlg005:1.4). Offerings at Olympia are older than that, and historians doubt how reliable the early part of the list is.

## A wreath, not money

The victors received a wreath cut from a sacred [wild olive tree](cts:tlg0525.tlg001:5.15.3) growing behind the temple of Zeus. Herodotus tells a story about it from 480 BC, when Xerxes' army was invading Greece. Some Arcadian deserters told the Persians that the Greeks were busy holding the Olympic Games, and that the prize was an olive crown.

{{quote:crown}}

Back home, of course, a victor might be showered with honours: statues, victory odes by poets such as Pindar, and in Athens [free meals for life](cts:tlg0059.tlg002:36) at the city's expense, which Socrates at his trial said he deserved far more than any Olympic winner.

## The truce and the rules

A sacred truce, the *ekecheiria*, protected people travelling to and from the festival. In 420 BC the Eleans, who ran the Games, accused Sparta of sending soldiers into Lepreum [during the Olympic truce](cts:tlg0003.tlg001:5.49.1) and fined it two thousand minas. The Spartans refused to pay and were banned from the Games that year.

Cheats paid too. At the entrance to the stadium stood a row of bronze statues of Zeus, the *Zanes*, [paid for out of fines](cts:tlg0525.tlg001:5.21.2) on athletes who broke the rules. The first six were set up in 388 BC, after a boxer named Eupolus bribed three of his opponents.

{{quote:zanes}}

{well} The stone bases of the Zanes are still in place at Olympia, in a line beside the vaulted passage into the stadium.

## Women at Olympia

Married women were forbidden to watch, on pain of being [thrown from a cliff](cts:tlg0525.tlg001:5.6.7), but unmarried girls [could attend](cts:tlg0525.tlg001:6.20.9), and one woman, the priestess of Demeter Chamyne, watched from an altar opposite the judges. Pausanias says only one woman was ever caught.

{{quote:callipateira}}

Women could, however, win. A victory in the chariot race went to the owner of the horses, not the driver, and a Spartan princess, [Cynisca](cts:tlg0525.tlg001:3.8.1), daughter of King Archidamus, became the first woman to win at Olympia, in 396 BC and again in 392 BC. She set up a bronze chariot group with her statue at Olympia.

!! Part of the inscribed base of Cynisca's monument was found in the excavations at Olympia. Its epigram boasts that she was the only woman in all Greece to have won the crown.

## The end

{debated} The Games are usually said to have ended in AD 393 under the Christian emperor Theodosius I, who banned pagan festivals. The date rests on Byzantine writers of much later centuries, and finds at Olympia suggest that some kind of contests went on into the fifth century.

{{timeline}}`,
  quotes: {
    crown: {
      work: "tlg0016.tlg001", ref: "8.26.3", label: "Herodotus 8.26.3",
      grc: "παπαῖ Μαρδόνιε, κοίους ἐπʼ ἄνδρας ἤγαγες μαχησομένους ἡμέας, οἳ οὐ περὶ χρημάτων τὸν ἀγῶνα ποιεῦνται ἀλλὰ περὶ ἀρετῆς.",
      tr: "Good heavens, Mardonius, what kind of men are these that you have pitted us against? It is not for money they contend but for glory of achievement!",
      trFrom: "corpus", trBy: "A. D. Godley (1925)",
    },
    zanes: {
      work: "tlg0525.tlg001", ref: "5.21.4", label: "Pausanias 5.21.4",
      grc: "ἐθέλει δὲ τὸ μὲν πρῶτον τῶν ἐλεγείων δηλοῦν ὡς οὐ χρήμασιν ἀλλὰ ὠκύτητι τῶν ποδῶν καὶ ὑπὸ ἰσχύος σώματος Ὀλυμπικὴν ἔστιν εὑρέσθαι νίκην,",
      tr: "The first of the inscriptions is intended to make plain that an Olympic victory is to be won, not by money, but by swiftness of foot and strength of body.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1926)",
    },
    callipateira: {
      work: "tlg0525.tlg001", ref: "5.6.8", label: "Pausanias 5.6.8",
      grc: "αὕτη προαποθανόντος αὐτῇ τοῦ ἀνδρός, ἐξεικάσασα αὑτὴν τὰ πάντα ἀνδρὶ γυμναστῇ, ἤγαγεν ἐς Ὀλυμπίαν τὸν υἱὸν μαχούμενον·",
      tr: "She, being a widow, disguised herself exactly like a gymnastic trainer, and brought her son to compete at Olympia.",
      trFrom: "corpus", trBy: "W. H. S. Jones (1926)",
    },
  },
  timeline: [
    { when: "776 BC", what: "The first Olympic Games, by the traditional reckoning.", certainty: "legend" },
    { when: "480 BC", what: "The Games go ahead while Xerxes invades Greece.", certainty: "well" },
    { when: "c. 470–456 BC", what: "The temple of Zeus at Olympia is built.", certainty: "well" },
    { when: "420 BC", what: "Sparta is banned for breaking the Olympic truce.", certainty: "well" },
    { when: "396 and 392 BC", what: "Cynisca of Sparta wins the chariot race, the first woman to win at Olympia.", certainty: "well" },
    { when: "388 BC", what: "The first Zanes, paid for by fines for bribery.", certainty: "well" },
    { when: "AD 393?", what: "The Games end under Theodosius I, by the usual account.", certainty: "debated" },
    { when: "1875–1881", what: "German excavations uncover the sanctuary.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0525.tlg001", ref: "5.7.6", to: "5.9.6", label: "Pausanias 5.7–9", why: "The legends of the Games' founding, and the order in which events were added." },
    { work: "tlg0525.tlg001", ref: "5.21.1", to: "5.21.18", label: "Pausanias 5.21", why: "The Zanes, and the cheats who paid for them." },
    { work: "tlg0016.tlg001", ref: "8.26.1", to: "8.26.3", label: "Herodotus 8.26", why: "The Persians learn what the Greeks compete for." },
  ],
  related: ["symposium", "black-and-red-figure"],
  primary: [
    { work: "tlg0525.tlg001", ref: "5.6.7", to: "5.6.8", label: "Pausanias 5.6.7–8" },
    { work: "tlg0525.tlg001", ref: "5.8.6", label: "Pausanias 5.8.6" },
    { work: "tlg0525.tlg001", ref: "5.21.2", to: "5.21.4", label: "Pausanias 5.21.2–4" },
    { work: "tlg0525.tlg001", ref: "3.8.1", label: "Pausanias 3.8.1" },
    { work: "tlg0016.tlg001", ref: "8.26.2", to: "8.26.3", label: "Herodotus 8.26.2–3" },
    { work: "tlg0003.tlg001", ref: "5.49.1", to: "5.50.4", label: "Thucydides 5.49–50" },
  ],
  secondary: [
    { id: "miller-athletics", note: "A full, well-illustrated account, by the excavator of Nemea." },
    { id: "swaddling-olympic", note: "A short introduction from the British Museum." },
  ],
  written: "2026-09-27",
};
export default entry;
