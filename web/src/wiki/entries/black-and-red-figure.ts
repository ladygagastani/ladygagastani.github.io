import type { Entry } from "../types";

const entry: Entry = {
  slug: "black-and-red-figure",
  title: "Black-figure and red-figure",
  category: "archaeology",
  kicker: "How Athenian potters made pictures that have lasted 2,500 years",
  hook: `The painted pots of Athens are the largest body of Greek pictures to survive: gods and heroes, athletes and drinkers, weddings, funerals and battles, on thousands of vessels that were made to be used. They were made in two main styles, black figures on the red clay and, from about 530 BC, red figures on a black ground. Both depended on the same trick of the kiln, and both tell archaeologists how old a layer of earth is.`,
  body: `## The same clay, two colours

Athenian clay fires to a warm orange-red. The black is not a paint in the usual sense but a very fine slip of the same clay. In a kiln fired in three stages, first with plenty of air, then starved of air, then with air again, the whole pot turns black in the middle stage, and in the last stage the coarser clay turns red again while the dense slip stays black.

{well} This three-stage firing is how Athenian black was made. It was worked out by modern experiment in the twentieth century; no ancient writer describes it.

## Black-figure

In black-figure, the painter drew the figures in slip as dark silhouettes, then scratched details through them with a sharp point, so that the red clay showed in fine lines: muscles, folds of cloth, the feathers of a helmet crest. Touches of added red and white marked blood, beards and women's skin. The technique came from Corinth, and Athenian workshops took it up in the late seventh century BC.

The greatest black-figure painter, most would say, was Exekias, who signed pots both as potter and as painter in the third quarter of the sixth century BC. His amphora in the Vatican shows Achilles and Ajax bent over a board game during a lull in the fighting at Troy, a scene in no surviving text.

## Red-figure

Around 530 BC an Athenian workshop reversed the method. The painter now left the figures in the red of the clay and painted the background black. Details were drawn with a brush instead of scratched, so lines could swell and taper, and painters began to show bodies turning in space, foreshortened feet, and faces in three-quarter view. Within a generation red-figure had replaced black-figure for most fine pottery.

{debated} Who invented red-figure is argued; the earliest pieces come from the circle of the potter Andokides, and some vases of this time are painted in black-figure on one side and red-figure on the other.

## The oil that came in painted jars

One kind of pot stayed black-figure for centuries after red-figure had taken over: the prize amphorae of the Panathenaic Games in Athens, filled with [oil from Athena's sacred olive trees](cts:tlg0086.tlg003:60.2), with Athena on one side and the contest on the other. The conservatism was deliberate: the old style marked them as prizes. Pindar describes the prize that came home to Argos.

{{quote:oil}}

## Who painted them?

Most painters never signed their work. In the early twentieth century the Oxford scholar John Beazley began attributing unsigned vases to individual painters by the way they drew small details: ankles, ears, the folds at an elbow. He gave the anonymous artists names, many after a museum or a subject. One of his earliest studies, in 1911, gathered the work of the "Master of the Berlin Amphora", now called the Berlin Painter.

{debated} Beazley eventually attributed tens of thousands of vases. His method is still the basis of the subject, but scholars debate how far it recovers real individuals, and how far it fits workshops where several hands worked on one pot.

!! Many vases carry the word *kalos*, "beautiful", after a name: "Leagros kalos", "Leagros is beautiful". These praises of young Athenian men help to date the vases, because some of the men named are known from history.

## Why archaeologists love them

Because painting styles changed quickly and are well studied, a single sherd of fine painted pottery can often date the layer it was found in to within a generation. That makes Athenian pottery one of the most important dating tools in Mediterranean archaeology, far beyond Athens: it was exported everywhere, above all to Etruscan Italy, where most of the finest vases were found in tombs.

{{timeline}}`,
  quotes: {
    oil: {
      work: "tlg0033.tlg003", ref: "10.35", label: "Pindar, Nemean 10.35–36",
      grc: "γαίᾳ δὲ καυθείσᾳ πυρὶ καρπὸς ἐλαίας\nἔμολεν Ἥρας τὸν εὐάνορα λαὸν ἐν ἀγγέων ἕρκεσιν παμποικίλοις.",
      tr: "and in earth baked by fire olive oil came to the fine men of Hera’s city in jars with richly painted sides.",
      trFrom: "corpus", trBy: "Diane Arnson Svarlien (1990)",
    },
  },
  timeline: [
    { when: "7th c. BC", what: "Black-figure develops at Corinth.", certainty: "well" },
    { when: "Late 7th c. BC", what: "Athenian workshops take up black-figure.", certainty: "well" },
    { when: "c. 550–525 BC", what: "Exekias at work.", certainty: "well" },
    { when: "c. 530 BC", what: "Red-figure is invented in Athens.", certainty: "well" },
    { when: "c. 500–460 BC", what: "The Berlin Painter at work.", certainty: "well" },
    { when: "1911", what: "Beazley publishes his study of the Berlin Painter, one of his first attributions.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0033.tlg003", ref: "10.1", to: "10.54", label: "Pindar, Nemean 10", why: "An ode for a wrestler of Argos who won the painted jars of oil at Athens." },
  ],
  related: ["kerameikos"],
  primary: [
    { work: "tlg0033.tlg003", ref: "10.33", to: "10.36", label: "Pindar, Nemean 10.33–36" },
    { work: "tlg0086.tlg003", ref: "60.1", to: "60.3", label: "Constitution of the Athenians 60" },
  ],
  secondary: [
    { id: "boardman-abfv", note: "The standard handbook to black-figure." },
    { id: "boardman-arfv", note: "Its sequel for early red-figure." },
    { id: "noble-techniques", note: "How the pots were shaped, painted and fired." },
    { id: "beazley-1911", note: "Beazley's study of the Berlin Painter." },
  ],
  written: "2026-09-27",
};
export default entry;
