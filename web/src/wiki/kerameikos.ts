/**
 * The Kerameikos (the Painted Stoa's archaeology section): its front page reads like a trench,
 * from the topsoil down. Each layer gathers entries, from the archaeology category and from others
 * whose story is told by excavation. An entry named here must exist (entries.test.ts checks).
 */
export interface Layer {
  id: string;
  title: string;
  /** the excavator's word for this kind of deposit, shown in the section drawing */
  deposit: string;
  blurb: string;
  slugs: string[];
}

export const LAYERS: Layer[] = [
  {
    id: "trouble", title: "The trouble with digging", deposit: "topsoil, cut by a pit",
    blurb: "Excavation destroys what it records. Early diggers hunted treasure and heroes, looters still dig for the market, and who should keep what was found is argued to this day.",
    slugs: [],
  },
  {
    id: "how", title: "How we know", deposit: "sherds in a clay layer",
    blurb: "Layers, broken pots, traces of paint, and the methods that turn them into dates and stories.",
    slugs: ["black-and-red-figure", "painted-statues"],
  },
  {
    id: "sites", title: "Great sites", deposit: "wall foundations",
    blurb: "The places where digging has changed what we know: cemeteries, sanctuaries, mines and cities.",
    slugs: ["mycenae", "kerameikos", "delphi", "laurion"],
  },
  {
    id: "finds", title: "Great finds", deposit: "a grave and its offerings",
    blurb: "Single objects that rewrote a chapter: a bronze computer from a shipwreck, clay tablets baked in a palace fire, a machine for choosing jurors, votes scratched on broken pots.",
    slugs: ["antikythera-mechanism", "linear-b", "kleroterion", "ostracism"],
  },
];

/** Excavated sites to find on the Periplus (Pleiades ids present in data/map/places.json). */
export const DIG_SITES: { id: string; grc: string; en: string }[] = [
  { id: "589872", grc: "Κνωσσός", en: "Knossos" },
  { id: "570491", grc: "Μυκήνη", en: "Mycenae" },
  { id: "570740", grc: "Τίρυνς", en: "Tiryns" },
  { id: "570640", grc: "Πύλος", en: "Pylos" },
  { id: "550595", grc: "Τροία", en: "Troy" },
  { id: "599973", grc: "Θήρα", en: "Thera" },
  { id: "579885", grc: "Ἀθῆναι", en: "Athens" },
  { id: "540726", grc: "Δελφοί", en: "Delphi" },
  { id: "570531", grc: "Ὀλυμπία", en: "Olympia" },
  { id: "570228", grc: "Ἐπίδαυρος", en: "Epidauros" },
  { id: "599588", grc: "Δῆλος", en: "Delos" },
  { id: "570182", grc: "Κόρινθος", en: "Corinth" },
];
