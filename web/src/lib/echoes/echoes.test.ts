import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { parseTei } from "@/lib/tei/parse";
import type { TeiDoc } from "@/lib/tei/types";
import type { WordPack } from "@/lib/lookup/words";
import { attachLemmas, buildStream, formKey, Lexicon, positionOf } from "./stream";
import { exactEchoes, phraseEchoes, wordEchoes } from "./match";

/** A small made-up text: one line of verse per passage. */
const doc = (lines: string[]): TeiDoc => ({
  lang: "grc", levels: ["line"], chunks: [{ label: "all", first: 0, last: lines.length - 1 }],
  units: lines.map((l, i) => ({ ref: [String(i + 1)], blocks: [{ t: "l", c: [l] }] })),
});
/** A word pack giving each listed form its dictionary word. */
const pack = (lines: string[], lemmaOf: Record<string, string>): WordPack => {
  const lemmas: string[] = [], lem = (l: string) => (lemmas.includes(l) ? lemmas.indexOf(l) : lemmas.push(l) - 1);
  return {
    work: "t", glaux: "", sha: "", licence: "", treebank: "", attrs: ["line"], lemmas, tags: ["n-s---mn-"],
    units: lines.map((l, i) => {
      const fs = l.split(" ");
      return [[String(i + 1)], 0, l, fs.map((f) => lem(lemmaOf[f] ?? f)), fs.map(() => 0)];
    }),
  };
};

describe("the form Echoes compares", () => {
  it("ignores what only neighbouring words decide: grave accent, enclitic accent, capitals, elision mark", () => {
    expect(formKey("Ἀχιλλεὺς")).toBe(formKey("Ἀχιλλεύς"));
    expect(formKey("ἄνθρωπός")).toBe(formKey("ἄνθρωπος"));
    expect(formKey("Μῆνιν")).toBe(formKey("μῆνιν"));
    expect(formKey("δʼ")).toBe(formKey("δ᾽"));
  });
  it("keeps accents and breathings that tell words apart", () => {
    expect(formKey("ἡ")).not.toBe(formKey("ἤ"));
    expect(formKey("οὐ")).not.toBe(formKey("οὗ"));
  });
});

describe("echoes in a book", () => {
  const lines = [
    "ἦμος δʼ ἠριγένεια φάνη ῥοδοδάκτυλος Ἠώς",
    "καὶ τότε δὴ βασιλῆες ἔβαν",
    "ἦμος δʼ ἠριγένεια",       // the formula runs on over a line break
    "φάνη ῥοδοδάκτυλος Ἠώς",
    "ὅτε ῥοδοδάκτυλον Ἠῶ ἴδον",
    "ἦμος δʼ ἠριγένεια φάνη χρυσόθρονος Ἠώς",
  ];
  const lex = new Lexicon();
  const s = buildStream(doc(lines), "t", "urn:t", lex);
  attachLemmas(s, pack(lines, { ῥοδοδάκτυλον: "ῥοδοδάκτυλος", Ἠῶ: "ἠώς", Ἠώς: "ἠώς", ἴδον: "ὁράω" }), lex);
  const q = (ref: string, i: number, n: number) => { const p = positionOf(s, ref, i); return { s: 0, from: p, to: p + n - 1 }; };

  it("every word is given its dictionary word", () => expect(s.lemmaCover).toBe(1));

  it("finds an exact phrase again, even across a line break", () => {
    const r = exactEchoes([s], q("1", 0, 6));
    expect(r.map((e) => [s.refs[s.unit[e.from]], e.self])).toEqual([["1", true], ["3", false]]);
  });

  it("tells exact wording from the same words in other forms", () => {
    const r = phraseEchoes([s], q("1", 4, 2), 1);
    expect(r.map((e) => [s.refs[s.unit[e.from]], e.kind])).toEqual([["1", "exact"], ["4", "exact"], ["5", "forms"]]);
  });

  it("finds a near repetition, marking which words match, and rates its likeness", () => {
    const r = phraseEchoes([s], q("1", 0, 6), 0.5);
    const near = r.find((e) => s.unit[e.from] === 5)!;
    expect(near.kind).toBe("near");
    expect(near.hit.map((p) => s.text[p])).toEqual(["ἦμος", "δʼ", "ἠριγένεια", "φάνη", "Ἠώς"]);
    expect(near.likeness).toBeGreaterThan(0.5);
    expect(near.likeness).toBeLessThan(1);
    // a stricter likeness drops it
    expect(phraseEchoes([s], q("1", 0, 6), 0.95).some((e) => s.unit[e.from] === 5)).toBe(false);
  });

  it("a word: by exact form, or every form of its dictionary word", () => {
    const at = q("1", 5, 1);
    expect(wordEchoes([s], at, "form").length).toBe(3);
    expect(wordEchoes([s], at, "lemma").map((e) => s.text[e.from])).toEqual(["Ἠώς", "Ἠώς", "Ἠῶ", "Ἠώς"]);
  });
});

// The real Iliad, when the corpus cache and the word pack are present (both generated, not committed).
const ILIAD = "../pipeline/.cache/corpus/perseus/data/tlg0012/tlg001/tlg0012.tlg001.perseus-grc2.xml";
const PACK = "public/data/words/tlg0012.tlg001.json";
describe.skipIf(!existsSync(ILIAD) || !existsSync(PACK))("echoes in the Iliad", () => {
  const lex = new Lexicon();
  const s = buildStream(parseTei(readFileSync(ILIAD, "utf8")), "tlg0012.tlg001", "urn", lex);
  attachLemmas(s, JSON.parse(readFileSync(PACK, "utf8")) as WordPack, lex);

  it("GLAUx's dictionary words are placed on nearly every word", () => expect(s.lemmaCover).toBeGreaterThan(0.98));

  it("the dawn formula of 1.477 recurs exactly at 24.788", () => {
    const p = positionOf(s, "1.477", 0);
    const r = exactEchoes([s], { s: 0, from: p, to: p + 5 });
    expect(r.map((e) => s.refs[s.unit[e.from]])).toEqual(["1.477", "24.788"]);
  });

  it("Achilles' speech formula (1.84) and its variants", () => {
    const p = positionOf(s, "1.84", 0);
    const r = phraseEchoes([s], { s: 0, from: p, to: p + 6 }, 0.5);
    const at = (ref: string) => r.find((e) => s.refs[s.unit[e.from]] === ref);
    expect(at("1.215")?.kind).toBe("forms");       // τὴν δʼ ἀπαμειβόμενος… (τήν for τόν)
    expect(at("1.364")?.kind).toBe("near");        // τὴν δὲ βαρὺ στενάχων προσέφη πόδας ὠκὺς Ἀχιλλεύς
  });
});
