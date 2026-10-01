import type { Entry } from "../types";

const entry: Entry = {
  slug: "reading-the-layers",
  title: "Reading the layers",
  category: "archaeology",
  kicker: "How archaeologists turn soil, graves and broken pots into dates, from Thucydides to tree rings",
  image: "geometric-krater",
  hook: `In the winter of 426 BC the Athenians dug up every grave on the sacred island of Delos and carried the bones across the strait. Thucydides drew a conclusion from what came out of the ground: more than half the dead had been Carians, recognisable by the weapons buried with them and by the way they were laid in the earth. It is one of the earliest archaeological arguments in Greek literature, and the reasoning behind it, what the dead were buried with and how, is still how the past is read from the soil. Its limits are still the same too.`,
  body: `## The graves of Delos

Thucydides wanted to show that the islands had once been held by pirates of other peoples, and he offered as proof the graves of Delos:

{{quote:carians}}

The occasion was a religious one. The Athenians, [following an oracle](cts:tlg0003.tlg001:3.104.1), cleared every grave from the island, forbade anyone to die or give birth there, and [moved the dead](cts:tlg0060.tlg001:12.58.7) across to the neighbouring island of Rheneia. The tyrant Peisistratus had done something similar a century before, but only for [the ground within sight of the temple](cts:tlg0016.tlg001:1.64.2).

{debated} Whether those graves really were Carian is another matter. Thucydides reasons that foreign weapons and a foreign way of burial mean a foreign people. Archaeologists have learned to handle that argument with care: objects travel by trade and gift, and customs change without the people changing.

## The pit on Rheneia

{well} The bones and grave goods from Delos did not disappear. In 1897 Dimitrios Stavropoullos, the Greek official supervising the French excavations on Delos, began digging on Rheneia and found the pit where the Athenians had deposited them in the winter of 426/5 BC. It held [thousands of finds](https://cyclades.culture.gov.gr/en/location/the-archaeological-museum-of-mykonos/), and the museum on Mykonos was founded to house them; its pottery spans several centuries, down to the fifth.

This is what archaeologists call a closed deposit: a group of objects sealed at one known moment. Everything in the Rheneia pit was already in the ground of Delos by 426/5 BC, so none of it can be later. A date like that, the latest possible date for everything found with it, is called a *terminus ante quem*.

## Deeper is older, usually

{well} The first rule of reading a site is borrowed from geology: layers of soil are laid down one on top of another, so the lower layer is the older. The exceptions are what make archaeology difficult. A pit dug later cuts down through older layers, a wall's foundation trench can carry late pottery deep into early ground, and builders fill hollows with earth scraped up from anywhere. In 1973 the archaeologist Edward Harris devised a simple diagram, now called the Harris matrix, that records each layer and each cut by what lies above and below it, so that the order of events on a site can be worked out step by step.

## A date from a disaster

On the Acropolis of Athens, the ground itself remembers a date. In 480 BC the Persians took the citadel:

{{quote:fire}}

{well} When the Athenians came back, they eventually buried the broken statues and offerings in the terraces of the rebuilt Acropolis, where excavators found them in the 1880s: many of the finest Archaic statues, some still with traces of their paint. The German word for this debris, *Perserschutt*, "Persian rubble", became a byword for a sealed deposit: anything in it had been made before 480.

{debated} But was it all really sealed in 480? In 2008 Andrew Stewart went back to the records of the nineteenth-century excavations and argued that only one of the deposits looks like pure debris from the Persian sack, and it held only Archaic material. The others were building fills for the new walls of the citadel, laid between about 467 and 430 BC, and the statues in the new, "Severe" style found in them could be up to forty years later than 480. The same layers, read more carefully, give a different history of Greek art.

## Pots as clocks

{well} Broken pottery is the archaeologist's commonest find, and the most useful. Clay pots break easily, are thrown away, and cannot be melted down and reused like metal, and their shapes and painted decoration changed quickly. Athenian painted pottery can be put in order, from the Geometric style of the vase on this page through [black-figure and red-figure](wiki:black-and-red-figure), closely enough that a sherd can often be dated within a generation. The sequence itself only gives the order. It becomes a calendar where it is tied to fixed points: deposits closed at known dates, like the Rheneia pit or the Persian destruction of Athens.

## The science of dates

{well} Radiocarbon dating, developed by the chemist Willard Libby in the late 1940s, measures how much of a slowly decaying form of carbon is left in something that was once alive: wood, seeds, bone. Its results have to be calibrated against tree rings, whose sequence can be counted back year by year for thousands of years.

{debated} Its most famous Greek puzzle is the eruption of the volcano on Thera (Santorini), which buried the Bronze Age town at Akrotiri. Archaeologists, linking Aegean pottery to Egyptian history, placed it around the middle of the sixteenth century BC or a little later. In 2006 an olive tree buried alive by the eruption gave a radiocarbon date of 1627–1600 BC, about a century earlier. In 2018 a new, year-by-year radiocarbon record from tree rings moved the likely range back into the sixteenth century, narrowing the gap. The debate is not over, and it matters: the eruption is one of the key fixed points for dating the Aegean Bronze Age.

{{timeline}}`,
  quotes: {
    carians: {
      work: "tlg0003.tlg001", ref: "1.8.1", label: "Thucydides 1.8.1",
      grc: "Δήλου γὰρ καθαιρομένης ὑπὸ Ἀθηναίων ἐν τῷδε τῷ πολέμῳ καὶ τῶν θηκῶν ἀναιρεθεισῶν ὅσαι ἦσαν τῶν τεθνεώτων ἐν τῇ νήσῳ, ὑπὲρ ἥμισυ Κᾶρες ἐφάνησαν, γνωσθέντες τῇ τε σκευῇ τῶν ὅπλων ξυντεθαμμένῃ καὶ τῷ τρόπῳ ᾧ νῦν ἔτι θάπτουσιν.",
      tr: "when Delos was purified by the Athenians in this war and the graves of all who had ever died on the island were removed, over half were discovered to be Carians, being recognized by the fashion of the armour found buried with them, and by the mode of burial, which is that still in use among them.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    fire: {
      work: "tlg0016.tlg001", ref: "8.53.2", label: "Herodotus 8.53.2",
      grc: "τῶν δὲ Περσέων οἱ ἀναβεβηκότες πρῶτον μὲν ἐτράποντο πρὸς τὰς πύλας, ταύτας δὲ ἀνοίξαντες τοὺς ἱκέτας ἐφόνευον· ἐπεὶ δέ σφι πάντες κατέστρωντο, τὸ ἱρὸν συλήσαντες ἐνέπρησαν πᾶσαν τὴν ἀκρόπολιν.",
      tr: "The Persians who had come up first turned to the gates, opened them, and murdered the suppliants. When they had levelled everything, they plundered the sacred precinct and set fire to the entire acropolis.",
      trFrom: "corpus", trBy: "A. D. Godley (1925)",
    },
  },
  timeline: [
    { when: "17th or 16th c. BC", what: "The eruption of Thera buries the town at Akrotiri.", certainty: "debated" },
    { when: "6th c. BC", what: "Peisistratus clears the graves within sight of Apollo's temple on Delos.", certainty: "well" },
    { when: "480 BC", what: "The Persians sack and burn the Acropolis of Athens.", certainty: "well" },
    { when: "426/5 BC", what: "The Athenians clear every grave from Delos and rebury the dead on Rheneia.", certainty: "well" },
    { when: "1880s", what: "Archaic statues are excavated from the terraces of the Acropolis.", certainty: "well" },
    { when: "1897", what: "Dimitrios Stavropoullos finds the purification pit on Rheneia.", certainty: "well" },
    { when: "late 1940s", what: "Willard Libby develops radiocarbon dating.", certainty: "well" },
    { when: "1973", what: "Edward Harris devises the Harris matrix for recording layers.", certainty: "well" },
    { when: "2006, 2018", what: "The buried olive tree, then a year-by-year tree-ring record, re-date the Thera eruption.", certainty: "debated" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "1.8.1", to: "1.8.4", label: "Thucydides 1.8", why: "The Carian graves of Delos, and Thucydides' picture of early Greece." },
    { work: "tlg0003.tlg001", ref: "3.104.1", to: "3.104.6", label: "Thucydides 3.104", why: "The purification of Delos, and the festival that followed." },
    { work: "tlg0016.tlg001", ref: "8.51.1", to: "8.55.1", label: "Herodotus 8.51–55", why: "The Persians on the Acropolis." },
  ],
  related: ["black-and-red-figure", "kerameikos", "mycenae", "painted-statues"],
  places: ["599588", "599973", "579885"],
  primary: [
    { work: "tlg0003.tlg001", ref: "1.8.1", label: "Thucydides 1.8.1" },
    { work: "tlg0003.tlg001", ref: "3.104.1", to: "3.104.2", label: "Thucydides 3.104.1–2" },
    { work: "tlg0016.tlg001", ref: "1.64.2", label: "Herodotus 1.64.2" },
    { work: "tlg0016.tlg001", ref: "8.53.1", to: "8.53.2", label: "Herodotus 8.53" },
  ],
  secondary: [
    { id: "renfrew-bahn", note: "The standard introduction to how archaeology works, dating included." },
    { id: "harris-stratigraphy", note: "Layers and how to record them (free from the author's website)." },
    { id: "stewart-2008", note: "The Acropolis deposits re-read." },
    { id: "friedrich-2006", note: "The olive tree buried by the Thera eruption." },
    { id: "pearson-2018", note: "The year-by-year radiocarbon record and Thera." },
  ],
  written: "2026-09-27",
};
export default entry;
