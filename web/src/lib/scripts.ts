/**
 * A passage taken back, step by step, from today's printed Greek towards the way it was first written:
 * accents and breathings taken off, then capitals (with the "lunate" sigma Ϲ and the iota written beside
 * its vowel rather than under it), then the spaces and punctuation taken out. Pure string work on the
 * edition's own words; the text itself is never changed, only shown another way.
 */
import type { Inline, Unit } from "./tei/types";

/** 0 today's print · 1 without accents and breathings · 2 in capitals · 3 without spaces or punctuation */
export type Stage = 0 | 1 | 2 | 3;

const MARKS = /[̀-̈́͆-ͯ]/g;        // every combining mark except the iota subscript
const SUBSCRIPT = /ͅ/g;                              // ypogegrammeni, the iota written under a vowel
const NOT_LETTER = /[^Α-ΩϹϜ]/g;       // after capitals: anything but a Greek capital

/** One word (with any punctuation stuck to it) at a stage. */
export function stageWord(word: string, stage: Stage): string {
  if (stage === 0) return word;
  let w = word.normalize("NFD").replace(MARKS, "");
  if (stage >= 2) w = w.replace(SUBSCRIPT, "ι").toUpperCase().replace(/Σ/g, "Ϲ");
  if (stage >= 3) w = w.replace(NOT_LETTER, "");
  return w.normalize("NFC");
}

const text = (c: Inline[]) => c.filter((x): x is string => typeof x === "string").join("");

/** A passage's lines: each verse line, or each paragraph of prose (headings are left out). */
export function unitLines(u: Unit): string[] {
  return u.blocks.filter((b) => b.t !== "head").map((b) => text(b.c).replace(/\s+/g, " ").trim()).filter(Boolean);
}
