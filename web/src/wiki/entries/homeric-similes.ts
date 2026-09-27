import type { Entry } from "../types";

const entry: Entry = {
  slug: "homeric-similes",
  title: "Homer's similes",
  greek: "ὡς δʼ ὅτε…",
  category: "beautiful",
  kicker: "Windows onto a world at peace, opened in the middle of a war",
  image: "octopus-stirrup-jar",
  hook: `The *Iliad* is a poem about a few weeks of killing outside Troy. Yet again and again, just as the fighting is at its fiercest, Homer stops and says "as when…", and for a few lines we are somewhere else: on a mountain under the stars, in a snowstorm, beside a mother with a crying child. These long comparisons, the Homeric similes, are among the most beautiful things in Greek, and they are a good reason to learn to read it.`,
  body: `## "As when…"

A simile compares one thing to another with "like" or "as". Homer's are often long, and they grow: the comparison starts with a single point in common and then unfolds into a scene of its own, with details the story does not need. Most begin with the same words, *hōs d' hote*, "and as when".

## Leaves

When the Trojan ally Glaucus meets the Greek Diomedes on the battlefield, and Diomedes asks who he is, Glaucus answers with a simile about why the question hardly matters.

{{quote:leaves}}

!! The image has had a long afterlife. Virgil borrowed it for the dead crowding the bank of the river in the underworld, and Milton, through Virgil, for the fallen angels lying "thick as autumnal leaves".

## Fires like stars

At the end of Book 8 the Trojans, winning for once, camp on the plain for the night. Homer describes their thousand watch-fires by comparing them to stars on a clear night.

{{quote:stars}}

The simile goes on: all the stars are seen, and [the shepherd is glad at heart](cts:tlg0012.tlg001:8.559). *So many* were the fires between the ships and the river. The shepherd does not belong in the story at all, and that is the point: for a moment, the Trojans' hope looks like the calm of a shepherd's night.

## A little girl

The most surprising similes compare heroes to the weakest people. When Patroclus comes to Achilles in tears, begging to be allowed to fight, Achilles teases him.

{{quote:girl}}

The simile ends with the child [looking up at her mother in tears](cts:tlg0012.tlg001:16.10) until she is picked up. Within a day Patroclus will be dead, and Achilles will weep for him.

## Stones like snow

In Book 12 the two armies hurl stones at each other over the Greek wall, [as thick as snow](cts:tlg0012.tlg001:12.278) falling on a still winter day, when Zeus lulls the winds and covers the mountain peaks, the fields and the harbours, and only the edge of the sea keeps it off. The violence is turned into silence and whiteness.

## The octopus

The *Odyssey* has fewer long similes, but some of the strangest. Shipwrecked and flung against the rocks of Scheria, Odysseus clings on until a wave tears him loose.

{{quote:octopus}}

Homer's word for the octopus, *polypous*, means "many-foot". Anyone who has pulled an octopus off a rock knows how exactly, and how painfully, the picture fits.

## Why they matter

{debated} Scholars have argued about where the similes come from, and how they fit the oral tradition in which the poems were composed. Many of them draw on a world of farms, flocks, weather and wild animals that seems closer to the poet's audience than the heroes' world. What nobody disputes is their effect: they let the listener see the war from outside, and they are some of the most imitated passages in European poetry.

{{timeline}}`,
  quotes: {
    leaves: {
      work: "tlg0012.tlg001", ref: "6.146", label: "Homer, Iliad 6.146–149",
      grc: "οἵη περ φύλλων γενεὴ τοίη δὲ καὶ ἀνδρῶν.\nφύλλα τὰ μέν τʼ ἄνεμος χαμάδις χέει, ἄλλα δέ θʼ ὕλη\nτηλεθόωσα φύει, ἔαρος δʼ ἐπιγίγνεται ὥρη·\nὣς ἀνδρῶν γενεὴ ἣ μὲν φύει ἣ δʼ ἀπολήγει.",
      tr: "Even as are the generations of leaves, such are those also of men. As for the leaves, the wind scattereth some upon the earth, but the forest, as it bourgeons, putteth forth others when the season of spring is come; even so of men one generation springeth up and another passeth away.",
      trFrom: "corpus", trBy: "A. T. Murray (1924)",
    },
    stars: {
      work: "tlg0012.tlg001", ref: "8.555", label: "Homer, Iliad 8.555–558",
      grc: "ὡς δʼ ὅτʼ ἐν οὐρανῷ ἄστρα φαεινὴν ἀμφὶ σελήνην\nφαίνετʼ ἀριπρεπέα, ὅτε τʼ ἔπλετο νήνεμος αἰθήρ·\nἔκ τʼ ἔφανεν πᾶσαι σκοπιαὶ καὶ πρώονες ἄκροι\nκαὶ νάπαι·",
      tr: "Even as in heaven about the gleaming moon the stars shine clear, when the air is windless, and forth to view appear all mountain peaks and high headlands and glades,",
      trFrom: "corpus", trBy: "A. T. Murray (1924)",
    },
    girl: {
      work: "tlg0012.tlg001", ref: "16.7", label: "Homer, Iliad 16.7–9",
      grc: "τίπτε δεδάκρυσαι Πατρόκλεες, ἠΰτε κούρη\nνηπίη, ἥ θʼ ἅμα μητρὶ θέουσʼ ἀνελέσθαι ἀνώγει\nεἱανοῦ ἁπτομένη, καί τʼ ἐσσυμένην κατερύκει,",
      tr: "Why, Patroclus, art thou bathed in tears, like a girl, a mere babe, that runneth by her mother's side and biddeth her take her up, and clutcheth at her gown, and hindereth her in her going,",
      trFrom: "corpus", trBy: "A. T. Murray (1925)",
    },
    octopus: {
      work: "tlg0012.tlg002", ref: "5.432", label: "Homer, Odyssey 5.432–435",
      grc: "ὡς δʼ ὅτε πουλύποδος θαλάμης ἐξελκομένοιο\nπρὸς κοτυληδονόφιν πυκιναὶ λάιγγες ἔχονται,\nὣς τοῦ πρὸς πέτρῃσι θρασειάων ἀπὸ χειρῶν\nῥινοὶ ἀπέδρυφθεν·",
      tr: "And as when an octopus is dragged from its den, and many pebbles cling to its suckers, so the skin of his strong hands was torn off against the rocks.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "8th–7th c. BC", what: "The Iliad and the Odyssey take their final form.", certainty: "debated" },
    { when: "6th c. BC", what: "Homer is recited at the Panathenaic festival in Athens, by later tradition from the time of Hipparchus.", certainty: "debated" },
    { when: "c. 19 BC", what: "Virgil's Aeneid reworks Homer's leaves, and many other similes.", certainty: "well" },
    { when: "1667", what: "Milton's Paradise Lost: \"Thick as autumnal leaves\".", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0012.tlg001", ref: "6.119", to: "6.236", label: "Iliad 6.119–236", why: "Glaucus and Diomedes: the leaves, and an exchange of armour." },
    { work: "tlg0012.tlg001", ref: "8.553", to: "8.565", label: "Iliad 8.553–565", why: "The Trojan watch-fires." },
    { work: "tlg0012.tlg001", ref: "16.1", to: "16.100", label: "Iliad 16.1–100", why: "Patroclus begs Achilles to let him fight." },
  ],
  related: ["black-and-red-figure", "school"],
  primary: [
    { work: "tlg0012.tlg001", ref: "6.144", to: "6.151", label: "Iliad 6.144–151" },
    { work: "tlg0012.tlg001", ref: "8.553", to: "8.565", label: "Iliad 8.553–565" },
    { work: "tlg0012.tlg001", ref: "12.278", to: "12.289", label: "Iliad 12.278–289" },
    { work: "tlg0012.tlg001", ref: "16.2", to: "16.19", label: "Iliad 16.2–19" },
    { work: "tlg0012.tlg002", ref: "5.424", to: "5.440", label: "Odyssey 5.424–440" },
  ],
  secondary: [
    { id: "moulton-similes", note: "How the similes are placed and linked across each poem." },
    { id: "scott-simile", note: "The similes as part of an oral tradition." },
  ],
  written: "2026-09-27",
};
export default entry;
