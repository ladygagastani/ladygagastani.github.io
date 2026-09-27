import type { Entry } from "../types";

const entry: Entry = {
  slug: "knossos",
  title: "Knossos and the labyrinth",
  greek: "Κνωσός",
  category: "archaeology",
  kicker: "Minos' city in legend, and the palace Arthur Evans dug up and rebuilt in concrete",
  image: "knossos-north-entrance",
  hook: `Homer knew Knossos as "a great city" where Minos was king, and later Greeks told of the labyrinth that Daedalus built there for the Minotaur. In 1900 the English archaeologist Arthur Evans began digging the low hill where Knossos had stood and uncovered a Bronze Age palace so large and so intricate that it seemed to explain the legend. He named a whole civilisation after Minos. Then he rebuilt parts of the palace in reinforced concrete, so that visitors today walk through Evans' idea of Knossos as much as through Knossos itself.`,
  body: `## Minos' city

In the *Odyssey*, Odysseus, in disguise, spins Penelope a tale of Crete, an island of ninety cities and many languages, and names its greatest:

{{quote:minos}}

{debated} What the rare word *enneōros* means here is uncertain. The translation above takes it as "nine years old"; others understand "for nine years", or "in periods of nine years", and Plato already read Homer as saying that Minos [went every ninth year to consult his father Zeus](cts:tlg0059.tlg034:1.624).

In the *Iliad*, the god Hephaestus decorates Achilles' shield with a dancing floor [like the one Daedalus made for Ariadne in wide Knossos](cts:tlg0012.tlg001:18.590-18.592). By the fifth century BC Minos had become a figure of history as well as of myth. Thucydides makes him the first ruler of the sea:

{{quote:navy}}

{legend} No evidence outside Greek tradition names a king Minos. Whether "Minos" was one man, a title, or a memory of Crete's real Bronze Age power cannot be settled.

## The labyrinth

The later mythographers told the rest: the bull from the sea, Queen Pasiphae's passion for it, the Minotaur born of their union, and the prison built to hold him.

{{quote:labyrinth}}

{debated} Evans believed the legend remembered the palace itself, with its maze of rooms and corridors, and he connected the word *labyrinthos* with *labrys*, a word that Plutarch says [the Lydians used for an axe](cts:tlg0007.tlg084b:45): the double axe is one of the commonest religious signs at Knossos. The idea is attractive and has never been proved.

## Before Evans

{well} Evans was not the first to dig at Knossos. In 1878 a Cretan merchant and antiquarian, Minos Kalokairinos, cut trial trenches into the hill and found the palace's western storerooms, still lined with enormous storage jars (*pithoi*), but his work was soon stopped. Crete was then under Ottoman rule. Once the island had won its autonomy, Evans was able to buy the site, and by early 1900 he held both the land and a permit to dig.

## The palace of Minos

{well} Work began on 23 March 1900. Evans' workmen uncovered a vast complex of courtyards, halls, staircases and storerooms, and clay tablets written in scripts that no one could read; Evans distinguished two of them, which he called Linear A and [Linear B](wiki:linear-b). He coined the word "Minoan" for the civilisation of Bronze Age Crete, and spent much of the rest of his life on it, publishing his results in the many volumes of *The Palace of Minos at Knossos*.

{well} The site is far older than Evans' palace. People lived on the hill in the Neolithic, thousands of years earlier, and the palace itself was built and rebuilt through the second millennium BC.

## Rebuilt in concrete

{well} Much of Knossos had been built of rubble, mud brick and timber, and its wooden columns and upper floors had long since burned or rotted away. To protect what he found and to show what he believed had stood there, Evans had parts of the palace rebuilt. The Grand Staircase had been restored by 1905. Later he turned to what he called "reconstitutions" in the most modern material of his day, reinforced concrete, with columns painted red and black. The wall paintings, found in fragments, were completed by the Swiss artist Émile Gilliéron and his son, sometimes from small fragments, and it is often their versions that are reproduced on the site and in books.

{debated} The reconstructions saved parts of the site that would otherwise have crumbled, and they let visitors imagine a building that is otherwise hard to read. But they fix one man's interpretation in concrete. Even in Evans' lifetime scholars began to doubt some of his reconstructions and interpretations, and historians such as Cathy Gere and J. A. MacGillivray have shown how much his peaceful, goddess-worshipping Minoans owed to the hopes of his own age.

## What Evans could not accept

{well} Evans was wrong about one great question. He believed that Minoan Crete had dominated the Greek mainland to the end, and he never accepted that the relationship had changed. In 1952, eleven years after his death, Michael Ventris showed that the Linear B tablets from Knossos were written in Greek: in the palace's last phase, its administrators wrote in the language of the mainland.

!! The first man to dig at Knossos was himself called Minos: the Cretan antiquarian Minos Kalokairinos, whose trenches of 1878 reached the palace's storerooms more than twenty years before Evans. The British School at Athens later inherited Evans' excavations and still carries out research at Knossos.

{{timeline}}`,
  quotes: {
    minos: {
      work: "tlg0012.tlg002", ref: "19.178", label: "Homer, Odyssey 19.178–179",
      grc: "τῇσι δʼ ἐνὶ Κνωσός, μεγάλη πόλις, ἔνθα τε Μίνως ἐννέωρος βασίλευε Διὸς μεγάλου ὀαριστής,",
      tr: "Among their cities is the great city Cnosus, where Minos reigned when nine years old, he that held converse with great Zeus,",
      trFrom: "corpus", trBy: "A. T. Murray (1919)",
    },
    navy: {
      work: "tlg0003.tlg001", ref: "1.4.1", label: "Thucydides 1.4",
      grc: "Μίνως γὰρ παλαίτατος ὧν ἀκοῇ ἴσμεν ναυτικὸν ἐκτήσατο καὶ τῆς νῦν Ἑλληνικῆς θαλάσσης ἐπὶ πλεῖστον ἐκράτησε",
      tr: "Minos is the earliest of all those known to us by tradition who acquired a navy. He made himself master of a very great part of what is now called the Hellenic Sea,",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    labyrinth: {
      work: "tlg0548.tlg001", ref: "3.1.4", label: "Apollodorus, Library 3.1.4",
      grc: "Μίνως δὲ ἐν τῷ λαβυρίνθῳ κατά τινας χρησμοὺς κατακλείσας αὐτὸν ἐφύλαττεν. ἦν δὲ ὁ λαβύρινθος, ὃν Δαίδαλος κατεσκεύασεν, οἴκημα καμπαῖς πολυπλόκοις πλανῶν τὴν ἔξοδον.",
      tr: "and Minos, in compliance with certain oracles, shut him up and guarded him in the Labyrinth. Now the Labyrinth which Daedalus constructed was a chamber “that with its tangled windings perplexed the outward way.”",
      trFrom: "corpus", trBy: "J. G. Frazer (1921)",
    },
  },
  timeline: [
    { when: "Neolithic", what: "The first settlement on the hill of Knossos.", certainty: "well" },
    { when: "2nd millennium BC", what: "The palace is built, destroyed and rebuilt.", certainty: "well" },
    { when: "14th c. BC (disputed)", what: "The Linear B archive, written in Greek.", certainty: "debated" },
    { when: "5th c. BC", what: "Thucydides makes Minos the first master of the sea.", certainty: "well" },
    { when: "1878", what: "Minos Kalokairinos digs trial trenches and finds the storerooms.", certainty: "well" },
    { when: "23 March 1900", what: "Arthur Evans begins his excavations.", certainty: "well" },
    { when: "by 1905", what: "The Grand Staircase is restored.", certainty: "well" },
    { when: "1952", what: "Michael Ventris shows that Linear B is Greek.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0012.tlg002", ref: "19.172", to: "19.180", label: "Odyssey 19.172–180", why: "Crete of the ninety cities, and Minos." },
    { work: "tlg0548.tlg001", ref: "3.1.3", to: "3.1.4", label: "Apollodorus 3.1.3–4", why: "Minos, the bull, the Minotaur and the labyrinth." },
    { work: "tlg0003.tlg001", ref: "1.4.1", label: "Thucydides 1.4", why: "Minos, the first sea power." },
  ],
  related: ["linear-b", "mycenae", "reading-the-layers"],
  places: ["589872"],
  primary: [
    { work: "tlg0012.tlg002", ref: "19.172", to: "19.179", label: "Homer, Odyssey 19.172–179" },
    { work: "tlg0012.tlg001", ref: "18.590", to: "18.592", label: "Homer, Iliad 18.590–592" },
    { work: "tlg0003.tlg001", ref: "1.4.1", label: "Thucydides 1.4.1" },
    { work: "tlg0548.tlg001", ref: "3.1.4", label: "Apollodorus, Library 3.1.4" },
    { work: "tlg0007.tlg084b", ref: "45", label: "Plutarch, Greek Questions 45" },
    { work: "tlg0059.tlg034", ref: "1.624", label: "Plato, Laws 624a–b" },
  ],
  secondary: [
    { id: "gere-knossos", note: "Evans' Knossos and what the twentieth century made of it." },
    { id: "macgillivray-minotaur", note: "A critical life of Evans." },
    { id: "kotsonas-2016", note: "Minos Kalokairinos, the first excavator." },
    { id: "dickinson-aegean", note: "Minoan Crete in its Bronze Age setting." },
  ],
  written: "2026-09-28",
};
export default entry;
