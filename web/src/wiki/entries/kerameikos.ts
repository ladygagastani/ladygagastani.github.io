import type { Entry } from "../types";

const entry: Entry = {
  slug: "kerameikos",
  title: "The Kerameikos",
  greek: "Κεραμεικός",
  category: "archaeology",
  kicker: "The potters' quarter and cemetery of Athens, dug for over 150 years",
  hook: `Just outside the city wall of Athens, where the Sacred Way left for Eleusis and the road ran out to Plato's Academy, lay the Kerameikos: the quarter of the potters, and for more than a thousand years the city's great cemetery. The Athenians buried their war dead here, heard Pericles' funeral speech here, and threw their used ostracism ballots into its ditches. Its excavation, still going on, has turned up some of the most famous vases and gravestones of Greece.`,
  body: `## Potters and a hero

The name comes from *keramos*, potter's clay, and the district was home to potters' workshops. Pausanias, the travel writer of the second century AD, preferred a hero: he says the place was named after [Keramos, a son of Dionysus and Ariadne](cts:tlg0525.tlg001:1.3.1).

{legend} Pausanias' hero Keramos is one of the many heroes Greek tradition invented to explain place names. The potters are what the excavations actually found.

## A cemetery for a thousand years

{well} People were buried here from the end of the Bronze Age onwards, and the graves of the eighth century BC were marked by enormous painted vases, some as tall as a person, decorated with funeral processions and mourners in the Geometric style. These "Dipylon vases", named after the gate beside which many were found, are among the earliest Greek pictures of people.

In the Classical period the road to the Academy was lined with monuments to the war dead. Thucydides describes the custom: the Athenians laid their dead in a public tomb [in the most beautiful suburb of the city](cts:tlg0003.tlg001:2.34.5), and it was over such a burial, in the first winter of the war with Sparta, that Pericles gave his funeral speech.

## Gravestones in the wall

In 479/8 BC, after the Persians had burned Athens, the Athenians rebuilt their city wall in a hurry, to have it finished before Sparta could object. Thucydides says the haste still showed in his day.

{{quote:wall}}

{well} The excavators of the Kerameikos found exactly that: sections of the wall of Themistocles packed with broken grave monuments of the sixth century BC, including carved stelae and statue bases. The haste of 479 preserved some of the finest Archaic sculpture in Athens.

## Two gates and a festival

The city wall had two gates here. The Dipylon, the "double gate", was the largest in Athens; beside it the Sacred Gate let the Sacred Way and the river Eridanos out of the city. Between them stood the Pompeion, the building where the great procession of the Panathenaia was marshalled. It was in the Kerameikos, Thucydides says, that the tyrant Hippias was [organising the procession](cts:tlg0003.tlg001:6.57.1) on the day in 514 BC when Harmodius and Aristogeiton struck.

!! In the spring of 1863 a workman digging in the area found a marble relief of a young horseman spearing an enemy. It was the grave monument of Dexileos, killed in 394 BC; its inscription records the years of his birth and death. The find showed that this was the ancient Kerameikos, and systematic excavation followed.

## A site still being dug

Greek excavations began in 1870 and the German Archaeological Institute has excavated here continuously since 1913. Among its finds are more than nine thousand ostraka from the votes of [ostracism](wiki:ostracism), and, in work for the Athens metro in the 1990s, a mass burial pit that has been linked to the [plague of 430 BC](wiki:plague-of-athens).

{{timeline}}`,
  quotes: {
    wall: {
      work: "tlg0003.tlg001", ref: "1.93.2", label: "Thucydides 1.93",
      grc: "οἱ γὰρ θεμέλιοι παντοίων λίθων ὑπόκεινται καὶ οὐ ξυνειργασμένων ἔστιν ᾗ, ἀλλ’ ὡς ἕκαστόν ποτε προσέφερον, πολλαί τε στῆλαι ἀπὸ σημάτων καὶ λίθοι εἰργασμένοι ἐγκατελέγησαν.",
      tr: "For the lower courses consist of all sorts of stones, in some cases not even hewn to fit but just as they were when the several workers brought them, and many columns from grave monuments and stones wrought for other purposes were built in.",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
  },
  timeline: [
    { when: "c. 1100 BC", what: "Burials begin in the Kerameikos.", certainty: "well" },
    { when: "8th c. BC", what: "Great painted Geometric vases mark the graves.", certainty: "well" },
    { when: "514 BC", what: "Hippias marshals the Panathenaic procession here; Hipparchus is murdered.", certainty: "well" },
    { when: "479/8 BC", what: "The wall of Themistocles is built in haste, with gravestones in its foundations.", certainty: "well" },
    { when: "431/0 BC", what: "Pericles' funeral speech over the first dead of the war.", certainty: "well" },
    { when: "1863", what: "The grave relief of Dexileos is found; the site is identified.", certainty: "well" },
    { when: "1913", what: "The German Archaeological Institute begins its excavations, still continuing.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "2.34.1", to: "2.34.8", label: "Thucydides 2.34", why: "The Athenian public funeral, in the most beautiful suburb." },
    { work: "tlg0003.tlg001", ref: "1.93.1", to: "1.93.2", label: "Thucydides 1.93", why: "The wall built of gravestones." },
    { work: "tlg0525.tlg001", ref: "1.29.2", to: "1.29.16", label: "Pausanias 1.29", why: "A walk along the road of tombs to the Academy." },
  ],
  related: ["ostracism", "plague-of-athens"],
  primary: [
    { work: "tlg0525.tlg001", ref: "1.3.1", label: "Pausanias 1.3.1" },
    { work: "tlg0525.tlg001", ref: "1.29.2", to: "1.29.16", label: "Pausanias 1.29" },
    { work: "tlg0003.tlg001", ref: "1.93.1", to: "1.93.2", label: "Thucydides 1.93" },
    { work: "tlg0003.tlg001", ref: "2.34.1", to: "2.34.8", label: "Thucydides 2.34" },
    { work: "tlg0003.tlg001", ref: "6.57.1", label: "Thucydides 6.57" },
  ],
  secondary: [
    { id: "knigge-kerameikos", note: "The site, monument by monument, by one of its excavators." },
    { id: "camp-archaeology-athens", note: "The Kerameikos in the archaeology of the whole city." },
    { id: "brenne-kerameikos" },
  ],
  written: "2026-09-27",
};
export default entry;
