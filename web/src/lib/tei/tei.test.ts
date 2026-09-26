import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parseTei } from "./parse";
import { translationPieces, placePieces, alignChunk } from "./align";
import type { Block, TeiDoc } from "./types";

const load = (f: string) => readFileSync(`test-fixtures/${f}.xml`, "utf8");
const doc = (f: string) => parseTei(load(f));

const blockText = (b: Block) =>
  (("speaker" in b && b.speaker) || "") + b.c.map((x) => (typeof x === "string" ? x : "note" in x ? x.note : "")).join("");
const docText = (d: TeiDoc) => d.units.flatMap((u) => u.blocks.map(blockText)).join("");
const plain = (b: Block[]) => b.map(blockText).join(" ");

/** Every letter in the file's <body>, in order (tags and whitespace removed). */
function bodyLetters(xml: string, re: RegExp) {
  const body = xml.slice(xml.indexOf("<body"), xml.lastIndexOf("</body>"));
  return (body.replace(/<[^>]+>/g, "").match(re) ?? []).join("");
}
const GREEK = /[Ͱ-Ͽἀ-῿]/gu;
const LATIN = /[A-Za-z]/g;

describe("TEI parsing keeps the text exactly", () => {
  for (const [f, re] of [
    ["tlg0012.tlg001.perseus-grc2", GREEK], ["tlg0059.tlg002.perseus-grc2", GREEK], ["tlg0011.tlg002.perseus-grc2", GREEK],
    ["tlg0031.tlg004.perseus-grc2", GREEK], ["tlg0555.tlg001.1st1K-grc1", GREEK],
    ["tlg0012.tlg001.perseus-eng3", LATIN], ["tlg0059.tlg002.perseus-eng2", LATIN], ["tlg0011.tlg002.perseus-eng2", LATIN],
  ] as const) {
    it(`loses and changes no letter: ${f}`, () => {
      const xml = load(f);
      const got = (docText(parseTei(xml)).match(re) ?? []).join("");
      expect(got).toBe(bodyLetters(xml, re));
    });
  }
});

describe("citation schemes", () => {
  it("Iliad: book and line, one page per book", () => {
    const d = doc("tlg0012.tlg001.perseus-grc2");
    expect(d.levels).toEqual(["book", "line"]);
    expect(d.chunks).toHaveLength(24);
    expect(d.chunks[0].label).toBe("Book 1");
    expect(d.units[0].ref).toEqual(["1", "1"]);
    expect(plain(d.units[0].blocks)).toBe("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
  });
  it("Gospel of John: chapter and verse", () => {
    const d = doc("tlg0031.tlg004.perseus-grc2");
    expect(d.levels).toEqual(["chapter", "verse"]);
    expect(plain(d.units[1].blocks)).toBe("Οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.");
  });
  it("Antigone: lines with speakers, pages by scene", () => {
    const d = doc("tlg0011.tlg002.perseus-grc2");
    expect(d.levels).toEqual(["line"]);
    const first = d.units[0].blocks[0];
    expect(first.t === "l" && first.speaker).toBe("Ἀντιγόνη");
    expect(d.chunks.length).toBeGreaterThan(5);
  });
  it("Apology: Stephanus sections", () => {
    const d = doc("tlg0059.tlg002.perseus-grc2");
    expect(d.levels).toEqual(["section"]);
    expect(d.units.map((u) => u.ref[0]).slice(0, 3)).toEqual(["17", "18", "19"]);
  });
});

describe("alignment with the translation", () => {
  const rowsFor = (g: string, t: string, chunk = 0) => {
    const grc = doc(g), tr = doc(t);
    const placed = placePieces(grc, translationPieces(grc, tr));
    return { rows: alignChunk(grc, grc.chunks[chunk], placed), placed, tr };
  };

  it("never drops or duplicates translation text", () => {
    for (const [g, t] of [["tlg0012.tlg001.perseus-grc2", "tlg0012.tlg001.perseus-eng3"], ["tlg0011.tlg002.perseus-grc2", "tlg0011.tlg002.perseus-eng2"], ["tlg0059.tlg002.perseus-grc2", "tlg0059.tlg002.perseus-eng2"]]) {
      const { placed, tr } = rowsFor(g, t);
      const placedText = (placed.flatMap((p) => p.blocks).map(blockText).join("").match(LATIN) ?? []).join("");
      expect(placedText, t).toBe((docText(tr).match(LATIN) ?? []).join(""));
    }
  });

  it("Iliad: Murray's line markers anchor the English to Greek lines", () => {
    const { rows } = rowsFor("tlg0012.tlg001.perseus-grc2", "tlg0012.tlg001.perseus-eng3");
    expect(rows[0].key).toBe("1.1");
    expect(plain(rows[0].trans)).toMatch(/^The wrath sing, goddess/);
    expect(rows[0].greek.length).toBeLessThan(8);
    expect(rows.every((r) => r.greek.every((u) => u.ref[0] === "1"))).toBe(true);
  });

  it("Antigone: English line blocks sit beside the matching Greek lines", () => {
    const { rows } = rowsFor("tlg0011.tlg002.perseus-grc2", "tlg0011.tlg002.perseus-eng2");
    expect(rows[0].greek.map((u) => u.ref[0])).toEqual(["1", "2", "3", "4"]);
    expect(plain(rows[0].trans)).toMatch(/Ismene, my sister/);
  });

  it("Apology: section by section", () => {
    const { rows } = rowsFor("tlg0059.tlg002.perseus-grc2", "tlg0059.tlg002.perseus-eng2");
    expect(rows[0].key).toBe("17");
    expect(plain(rows[0].trans)).toMatch(/How you, men of Athens/);
  });
});

import { findRef } from "./refs";
describe("going to a reference", () => {
  it("finds exact references, prefixes and Stephanus sections", () => {
    const il = doc("tlg0012.tlg001.perseus-grc2");
    expect(il.units[findRef(il, "1.33")].ref).toEqual(["1", "33"]);
    expect(il.units[findRef(il, "2")].ref).toEqual(["2", "1"]);
    expect(il.units[findRef(il, "3 15")].ref).toEqual(["3", "15"]);
    const ap = doc("tlg0059.tlg002.perseus-grc2");
    expect(ap.units[findRef(ap, "19a")].ref).toEqual(["19"]);
    expect(findRef(il, "99.1")).toBe(-1);
  });
});
