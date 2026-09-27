import type { Entry } from "../types";

const entry: Entry = {
  slug: "delphi",
  title: "Delphi and the oracle",
  greek: "Δελφοί",
  category: "religion",
  kicker: "Where kings asked Apollo, and the answers could ruin them",
  hook: `On a ledge of Mount Parnassus, for a thousand years and more, a woman sat on a tripod in the innermost room of Apollo's temple and spoke for the god. Cities asked her where to found colonies, kings asked whether to go to war, and ordinary people asked about marriages and debts. What happened in that room is still argued over: divine inspiration, theatre, trance, or, as geologists proposed in 2001, gas rising through a crack in the rock.`,
  body: `## The priestess on the tripod

The god's voice at Delphi was the *Pythia*, a woman of the town who served as Apollo's priestess. The geographer Strabo, writing around the time of Augustus, reports what people said of the seat of the oracle.

{{quote:strabo}}

Plutarch, who was himself a priest at Delphi around AD 100, adds a detail that has fascinated modern scientists. From time to time, not regularly, the room where visitors waited was filled with a sweet smell.

{{quote:fragrance}}

## Answers that could be read two ways

The oracle's most famous answers are the ambiguous ones. Herodotus tells how Croesus, king of Lydia, asked whether he should make war on Persia and was told that [he would destroy a great empire](cts:tlg0016.tlg001:1.53.3). He attacked, and the empire he destroyed was his own. When Croesus complained, the god answered that [he should have asked which empire was meant](cts:tlg0016.tlg001:1.91.4).

{debated} The American scholar Joseph Fontenrose sorted every recorded response into those reported by contemporaries and those known only from later stories. The riddling, doom-laden answers belong almost entirely to the second group. The responses that inscriptions and contemporary writers record are mostly plain answers to practical questions: which god to sacrifice to, whether a proposed course of action was acceptable.

## A trance, and a death

{legend} Plutarch describes a session that went wrong. A foreign delegation had come; the omens were bad, but the priests forced them. The Pythia went down into the shrine unwillingly, answered in a harsh voice, then, he says, with a terrible cry rushed for the exit and threw herself down. Everyone fled. She was carried out still conscious, and lived for only a few days.

## Was there a vapour?

Ancient writers speak of a *pneuma*, a breath or vapour, rising from a chasm under the tripod. When French archaeologists excavated the temple around 1900 they found no chasm, and for most of the twentieth century scholars treated the vapour as a myth.

{debated} In 2001 a team led by the geologist Jelle de Boer and the archaeologist John Hale reported that two geological faults cross beneath the temple and that the local spring water contains traces of light hydrocarbon gases, among them ethylene, which has a sweet smell. They suggested that the Pythia's trance was a mild intoxication. Other researchers have replied that the amounts of gas measured would have been far too small to produce any trance, and that the ancient descriptions do not fit ethylene. The question is open.

!! Plutarch wrote a whole dialogue on why oracles were falling silent in his day. One of the explanations his speakers offer is that the vapour itself had grown weaker.

## Why cities kept asking

However it worked, Delphi mattered because the Greeks believed it. It sanctioned the founding of colonies, arbitrated between cities, received the treasuries and statues that rival states set up along the Sacred Way, and hosted the Pythian Games. Its authority survived the Persian Wars, in which it had advised caution, and lasted until the late fourth century AD, when Christian emperors closed the pagan sanctuaries.

{{timeline}}`,
  quotes: {
    strabo: {
      work: "tlg0099.tlg001", ref: "9.3.5", label: "Strabo 9.3.5",
      grc: "φασὶ δʼ εἶναι τὸ μαντεῖον ἄντρον κοῖλον κατὰ βάθους οὐ μάλα εὐρύστομον, ἀναφέρεσθαι δʼ ἐξ αὐτοῦ πνεῦμα ἐνθουσιαστικόν, ὑπερκεῖσθαι δὲ τοῦ στομίου τρίποδα ὑψηλόν, ἐφʼ ὃν τὴν Πυθίαν ἀναβαίνουσαν δεχομένην τὸ πνεῦμα ἀποθεσπίζειν ἔμμετρά τε καὶ ἄμετρα",
      tr: "They say that the seat of the oracle is a cave that is hollowed out deep down in the earth, with a rather narrow mouth, from which arises breath that inspires a divine frenzy; and that over the mouth is placed a high tripod, mounting which the Pythian priestess receives the breath and then utters oracles in both verse and prose",
      trFrom: "corpus", trBy: "H. L. Jones (1927)",
    },
    fragrance: {
      work: "tlg0007.tlg092", ref: "50", label: "Plutarch, On the Obsolescence of Oracles 50",
      grc: "ὁ γὰρ οἶκος, ἐν ᾧ τοὺς χρωμένους τῷ θεῷ καθίζουσιν, οὔτε πολλάκις οὔτε τεταγμένως ἀλλʼ ὡς ἔτυχε διὰ χρόνων εὐωδίας ἀναπίμπλαται καὶ πνεύματος",
      tr: "the room in which they seat those who would consult the god is filled, not frequently or with any regularity, but as it may chance from time to time, with a delightful fragrance coming on a current of air",
      trFrom: "corpus", trBy: "F. C. Babbitt (1936)",
    },
  },
  timeline: [
    { when: "8th c. BC", what: "The oracle of Apollo at Delphi becomes known across the Greek world.", certainty: "well" },
    { when: "c. 547 BC", what: "Croesus attacks Persia after consulting Delphi, and loses his kingdom.", certainty: "legend" },
    { when: "c. AD 100", what: "Plutarch, a priest at Delphi, writes on the oracle's decline.", certainty: "well" },
    { when: "Late 4th c. AD", what: "The pagan sanctuaries are closed under Christian emperors.", certainty: "well" },
    { when: "1892–1903", what: "The French 'Great Excavation' uncovers the sanctuary; no chasm is found.", certainty: "well" },
    { when: "2001", what: "De Boer and Hale propose that gases rising along faults caused the trance.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0016.tlg001", ref: "1.46.1", to: "1.56.3", label: "Herodotus 1.46–56", why: "Croesus tests the oracles, then asks about Persia." },
    { work: "tlg0016.tlg001", ref: "1.91.1", to: "1.91.6", label: "Herodotus 1.91", why: "Apollo's answer to Croesus' complaint." },
    { work: "tlg0099.tlg001", ref: "9.3.5", label: "Strabo 9.3.5", why: "The chasm, the vapour and the tripod." },
    { work: "tlg0007.tlg092", ref: "50", to: "51", label: "Plutarch, On the Obsolescence of Oracles 50–51", why: "The fragrance, and the priestess who died." },
  ],
  related: [],
  primary: [
    { work: "tlg0016.tlg001", ref: "1.46.1", to: "1.56.3", label: "Herodotus 1.46–56" },
    { work: "tlg0016.tlg001", ref: "1.91.1", to: "1.91.6", label: "Herodotus 1.91" },
    { work: "tlg0099.tlg001", ref: "9.3.5", label: "Strabo, Geography 9.3.5" },
    { work: "tlg0007.tlg092", ref: "50", to: "51", label: "Plutarch, On the Obsolescence of Oracles 50–51" },
  ],
  secondary: [
    { id: "scott-delphi", note: "The whole history of the sanctuary." },
    { id: "fontenrose-delphic", note: "Every recorded response, sorted by how well it is attested." },
    { id: "deboer-hale-2001", note: "The gas hypothesis." },
    { id: "foster-lehoux-2007", note: "The case against it." },
  ],
  written: "2026-09-27",
};
export default entry;
