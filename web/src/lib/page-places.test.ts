import { describe, expect, it } from "vitest";
import { placeAnalyses } from "./lookup/placed";
import type { WordPack } from "./lookup/words";
import type { TeiDoc } from "./tei/types";
import type { Place } from "./map";
import { placeMarks, placesOnPage } from "./page-places";

const doc = {
  lang: "grc", levels: ["section"], chunks: [{ label: "1", first: 0, last: 2 }],
  units: [
    { ref: ["1"], blocks: [{ t: "p", c: ["ἦλθον εἰς Ἀθήνας ἐκ Σπάρτης."] }] },
    { ref: ["2"], blocks: [{ t: "p", c: ["καὶ πάλιν Ἀθήναζε."] }] },
    { ref: ["3"], blocks: [{ t: "p", c: ["Ἀθῆναι μεγάλαι."] }] },
  ],
} as unknown as TeiDoc;
const pack: WordPack = {
  work: "x", glaux: "", sha: "", licence: "", treebank: "", attrs: ["s"],
  lemmas: ["ἔρχομαι", "εἰς", "Ἀθῆναι", "ἐκ", "Σπάρτη", "καί", "πάλιν", "Ἀθήναζε", "μέγας", "."],
  tags: ["v--------", "r--------", "n-p---fa-", "u--------"],
  units: [
    [["1"], 0, "ἦλθον εἰς Ἀθήνας ἐκ Σπάρτης .", [0, 1, 2, 3, 4, 9], [0, 1, 2, 1, 2, 3]],
    [["2"], 0, "καὶ πάλιν Ἀθήναζε .", [5, 6, 7, 9], [1, 1, 1, 3]],
    [["3"], 0, "Ἀθῆναι μεγάλαι .", [2, 8, 9], [2, 0, 3]],
  ],
};
const place = (id: string, grc: string, en: string, also?: string[]): Place =>
  ({ id, grc, en, lat: 38, lon: 23, type: "settlement", n: 1, works: 1, w: [], alt: 0, also });
const athens = place("579885", "Ἀθῆναι", "Athenae", ["Ἀθήναζε"]);
const sparta = place("570685", "Σπάρτη", "Sparta");
const byName = new Map([["Ἀθῆναι", athens], ["Ἀθήναζε", athens], ["Σπάρτη", sparta]]);

describe("places named on a page", () => {
  const placed = placeAnalyses(pack, doc);

  it("finds each place once, in the order it first comes up, with its passages and count", () => {
    const list = placesOnPage(pack, placed, ["1", "2", "3"], byName);
    expect(list.map((p) => p.place.en)).toEqual(["Athenae", "Sparta"]);
    expect(list[0].n).toBe(3);
    expect(list[0].refs).toEqual(["1", "2", "3"]);
    expect(list[1].refs).toEqual(["1"]);
  });

  it("only looks at the passages it is given", () => {
    expect(placesOnPage(pack, placed, ["3"], byName).map((p) => p.place.en)).toEqual(["Athenae"]);
    expect(placesOnPage(pack, placed, ["9"], byName)).toEqual([]);
  });

  it("gives the words to mark, for every place or for one", () => {
    const list = placesOnPage(pack, placed, ["1", "2", "3"], byName);
    const all = placeMarks(list);
    expect([...all.get("1")!].sort()).toEqual(["αθηνασ", "σπαρτησ"]);
    expect([...all.get("2")!]).toEqual(["αθηναζε"]);
    expect([...placeMarks(list, sparta.id).keys()]).toEqual(["1"]);
  });
});
