import type { Entry } from "../types";

const entry: Entry = {
  slug: "linear-b",
  title: "Linear B",
  category: "language",
  kicker: "The oldest written Greek, read at last in 1952",
  image: "linear-b-pylos",
  hook: `For half a century after they were dug up, thousands of clay tablets from the Bronze Age palaces of Crete and mainland Greece kept their secret. Their script, which the archaeologist Arthur Evans called "Linear B", matched no known language. In 1952 an English architect, Michael Ventris, showed that it was Greek: Greek written some five hundred years before Homer, in the accounts of palace clerks counting sheep, bronze, perfume and slaves.`,
  body: `## Tablets that were never meant to last

The tablets are lists and receipts, written on unbaked clay and kept only as long as they were needed. They survive because the palaces that kept them burned, and the fires baked the clay hard. Arthur Evans found the first large archive at Knossos in Crete, which he began excavating in 1900. In 1939 the American Carl Blegen found a second archive at Pylos in the south-western Peloponnese, the kingdom that Homer gives to old Nestor.

{{quote:pylos}}

{debated} The Pylos tablets date from the destruction of the palace, around 1200 BC. The date of the Knossos archive has been argued over since Evans' day; most scholars now place it in the fourteenth century BC, some later.

## A script of syllables

Linear B is not an alphabet. It has about ninety signs, most standing for a syllable (*da*, *me*, *po*), plus pictures for the things being counted: men, women, horses, chariot wheels, tripods, jars. The syllables fit Greek badly: final consonants are left out, and *l* and *r* are written with the same signs. So Greek *tripos*, "tripod", appears as *ti-ri-po*, and the god Poseidon as *po-se-da-o*.

## How it was cracked

The decisive preparation was done by Alice Kober, a classicist at Brooklyn College, who showed from the tablets alone that the language had endings that changed with grammar, and grouped the signs that shared a consonant or a vowel. She died in 1950, before the solution.

{well} Michael Ventris, working on a grid built on Kober's method, tested the guess that some words were place names in Crete. The words came out as Knossos, Amnisos and Tulisos, and then as recognisable Greek. He announced the result in 1952, and with the Cambridge philologist John Chadwick published the proof in 1953.

!! The clinching evidence arrived by post. In 1953 Blegen wrote to Ventris about a newly cleaned tablet from Pylos, which listed vessels beside little drawings of them. Read with Ventris' values, the signs beside a drawing of a three-legged cauldron spelled *ti-ri-po*: tripod.

## What the tablets say

The tablets show a world of palace bureaucracy that Homer's poems barely remember: rations for named workers, flocks counted to the animal, bronze issued to smiths, and offerings to gods whose names were already Greek. Zeus, Hera, Poseidon and even Dionysus appear, centuries before any Greek literature.

{debated} Whether Homer knew anything of writing is itself argued. His only mention of it is the story of Bellerophon, sent to Lycia carrying a folded tablet of "baneful signs" that asked for his own death. Some read the *sēmata* as writing, others as a secret code of marks.

{{quote:signs}}

## After the palaces

When the palaces fell, around 1200 BC, Linear B disappeared with them. On the Greek mainland and in the Aegean no writing survives for about four centuries, until the Greeks adapted the Phoenician alphabet in the eighth century BC, the ancestor of the letters in this sentence. Only on Cyprus did Greeks go on writing their language, in a related syllabic script.

{{timeline}}`,
  quotes: {
    pylos: {
      work: "tlg0012.tlg001", ref: "2.591", label: "Iliad 2.591",
      grc: "οἳ δὲ Πύλον τʼ ἐνέμοντο καὶ Ἀρήνην ἐρατεινὴν",
      tr: "and they that dwelt in Pylos and lovely Arene",
      trFrom: "site", trBy: "this site",
    },
    signs: {
      work: "tlg0012.tlg001", ref: "6.168", label: "Iliad 6.168–169",
      grc: "πόρεν δʼ ὅ γε σήματα λυγρὰ\nγράψας ἐν πίνακι πτυκτῷ θυμοφθόρα πολλά,",
      tr: "gave him baneful tokens, graving in a folded tablet many signs and deadly,",
      trFrom: "corpus", trBy: "A. T. Murray (1924)",
    },
  },
  timeline: [
    { when: "14th c. BC", what: "The Knossos archive (its date is disputed).", certainty: "debated" },
    { when: "c. 1200 BC", what: "Fire destroys the palace of Pylos, baking its tablets.", certainty: "well" },
    { when: "1900", what: "Arthur Evans begins excavating Knossos and finds tablets.", certainty: "well" },
    { when: "1939", what: "Carl Blegen finds the Pylos archive.", certainty: "well" },
    { when: "1950", what: "Alice Kober dies, her method in place.", certainty: "well" },
    { when: "1952", what: "Michael Ventris announces that Linear B is Greek.", certainty: "well" },
    { when: "1953", what: "Ventris and Chadwick publish the proof; the Pylos tripod tablet confirms it.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0012.tlg001", ref: "6.155", to: "6.211", label: "Iliad 6.155–211", why: "Bellerophon and the folded tablet: Homer's only mention of writing." },
    { work: "tlg0012.tlg001", ref: "2.591", to: "2.602", label: "Iliad 2.591–602", why: "Nestor's kingdom of Pylos in the Catalogue of Ships." },
    { work: "tlg0012.tlg001", ref: "2.645", to: "2.652", label: "Iliad 2.645–652", why: "Knossos and the Cretans of Idomeneus." },
  ],
  related: [],
  primary: [
    { work: "tlg0012.tlg001", ref: "2.591", to: "2.602", label: "Iliad 2.591–602" },
    { work: "tlg0012.tlg001", ref: "2.645", to: "2.652", label: "Iliad 2.645–652" },
    { work: "tlg0012.tlg001", ref: "6.155", to: "6.211", label: "Iliad 6.155–211" },
  ],
  secondary: [
    { id: "ventris-chadwick-1953", note: "The decipherment, published." },
    { id: "chadwick-decipherment", note: "The story, told by Ventris' collaborator, for general readers." },
    { id: "fox-labyrinth", note: "The decipherment, and Alice Kober's part in it." },
  ],
  written: "2026-09-27",
};
export default entry;
