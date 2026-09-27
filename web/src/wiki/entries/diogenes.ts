import type { Entry } from "../types";

const entry: Entry = {
  slug: "diogenes",
  title: "Diogenes the Cynic",
  greek: "Διογένης ὁ κύων",
  category: "weird",
  kicker: "The philosopher who lived in a jar and told Alexander to move",
  image: "gerome-diogenes",
  hook: `Diogenes of Sinope owned a cloak, a staff, a bag and, for a while, a cup, until he saw a child drinking from its hands and threw the cup away. He slept in a large storage jar in the middle of Athens, ate and did everything else in public, and answered kings and philosophers with insults. People called him "the Dog", *kyōn*, and "Cynic", doglike, became the name for those who followed his way of life. Almost everything we know about him comes as anecdotes, and the good ones are too good to be entirely true.`,
  body: `## A man with a past

Diogenes came from Sinope, a Greek city on the Black Sea coast, and lived in the fourth century BC. He left it under a cloud. Diogenes Laertius, who compiled lives of the philosophers some six hundred years later, collects the versions: his father, a banker, [adulterated the coinage](cts:tlg0004.tlg001:6.2.20); or Diogenes did it himself and admitted as much in one of his own writings; or the oracle at Delphi told him to "alter the currency" and he took it literally. The phrase became his motto for a whole way of life: deface the false coin of custom.

{legend} The coinage story may be true, may be a joke that grew out of the motto, or both. The ancient sources themselves disagree.

## The jar

{{quote:jar}}

The *pithos* was a huge clay storage jar, the kind used for grain or oil, and the Metroon was the sanctuary of the Mother of the Gods in the Athenian Agora. Later tradition turned it into a wooden barrel or "tub", which is how it appears in most modern pictures.

In summer, the same passage says, he rolled in hot sand; in winter he hugged statues covered with snow, to harden himself.

## Against custom

Diogenes' teaching was a performance. He wanted to live "according to nature", which meant rejecting everything he saw as mere convention: wealth, reputation, shame, even cities.

- He lit a lamp in broad daylight and walked about [saying "I am looking for a man"](cts:tlg0004.tlg001:6.2.41).
- When Plato defined man as a featherless animal that walks on two legs, Diogenes [plucked a chicken](cts:tlg0004.tlg001:6.2.40) and brought it into the lecture room: "Here is Plato's man."
- Asked where he came from, he said he was a [*kosmopolitēs*](cts:tlg0004.tlg001:6.2.63), a citizen of the world: he is the first person reported to have used the word.

{{quote:cup}}

## The king and the dog

The most famous story of all is his meeting with Alexander the Great at Corinth.

{{quote:alexander}}

{legend} The meeting is reported by many ancient authors and may have happened; Alexander was in Corinth in 336 BC. But nothing in these stories can be checked, and the exchange was retold for centuries precisely because it was so quotable.

## An odd death, several times over

!! Diogenes Laertius gives at least three ways Diogenes died, [at nearly ninety](cts:tlg0004.tlg001:6.2.76): from eating a raw octopus, by holding his breath until he stopped living, or from a dog bite on the tendon of his foot while sharing an octopus with some dogs. His friends, he says, believed the breath-holding version.

{debated} Diogenes' own writings are lost, apart from quotations and letters later attributed to him that are generally thought to be forgeries. Historians therefore separate the man, of whom little is certain, from the legendary Diogenes, the Cynic hero of a thousand anecdotes.

{{timeline}}`,
  quotes: {
    jar: {
      work: "tlg0004.tlg001", ref: "6.2.23", label: "Diogenes Laertius 6.23",
      grc: "τὸν ἐν τῷ Μητρῴῳ πίθον ἔσχεν οἰκίαν",
      tr: "he took for his abode the tub in the Metroön",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
    cup: {
      work: "tlg0004.tlg001", ref: "6.2.37", label: "Diogenes Laertius 6.37",
      grc: "Θεασάμενός ποτε παιδίον ταῖς χερσὶ πῖνον ἐξέρριψε τῆς πήρας τὴν κοτύλην, εἰπών, παιδίον με νενίκηκεν εὐτελείᾳ.",
      tr: "One day, observing a child drinking out of his hands, he cast away the cup from his wallet with the words, A child has beaten me in plainness of living.",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
    alexander: {
      work: "tlg0004.tlg001", ref: "6.2.38", label: "Diogenes Laertius 6.38",
      grc: "ἐν τῷ Κρανείῳ ἡλιουμένῳ αὐτῷ Ἀλέξανδρος ἐπιστάς φησιν, αἴτησόν με ὃ θέλεις. καὶ ὅς, ἀποσκότησόν μου, φησί.",
      tr: "When he was sunning himself in the Craneum, Alexander came and stood over him and said, Ask of me any boon you like. To which he replied, Stand out of my light.",
      trFrom: "corpus", trBy: "R. D. Hicks (1925)",
    },
  },
  timeline: [
    { when: "c. 410–400 BC", what: "Diogenes is born at Sinope on the Black Sea.", certainty: "debated" },
    { when: "4th c. BC", what: "Exile; he lives in Athens and later Corinth, and is nicknamed \"the Dog\".", certainty: "well" },
    { when: "336 BC", what: "Alexander at Corinth: the traditional date of their meeting.", certainty: "legend" },
    { when: "c. 323 BC", what: "Death at Corinth, by one of several reported means.", certainty: "debated" },
    { when: "3rd c. AD", what: "Diogenes Laertius collects the anecdotes in his Lives of the Philosophers.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0004.tlg001", ref: "6.2.20", to: "6.2.81", label: "Diogenes Laertius 6.20–81", why: "The whole life, with hundreds of sayings." },
    { work: "tlg0004.tlg001", ref: "6.2.76", to: "6.2.79", label: "Diogenes Laertius 6.76–79", why: "The competing stories of his death." },
  ],
  related: ["hipparchia"],
  primary: [{ work: "tlg0004.tlg001", ref: "6.2.20", to: "6.2.81", label: "Diogenes Laertius, Lives of the Philosophers 6.20–81" }],
  secondary: [
    { id: "branham-cynics", note: "The Cynic movement, from Diogenes onwards." },
    { id: "desmond-cynics", note: "A clear introduction." },
  ],
  written: "2026-09-27",
};
export default entry;
