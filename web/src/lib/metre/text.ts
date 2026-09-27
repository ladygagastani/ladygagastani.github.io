/**
 * Metre for a whole text: which metre its lines are in, and the scansion of each line — the
 * published one (David Chamberlain, hypotactic.com, CC BY 4.0) where it matches this edition's
 * words, otherwise the site's own scanner. Shared by the reader and scripts/build-metre.ts.
 */
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import { greekKey } from "@/lib/search/codec";
import type { Block } from "@/lib/tei/types";
import { fitLengths, METRE_NAMES, scanWords, type Scansion } from "./scan";

/** The whole file public/data/metre/_index.json. */
export interface MetreIndex { texts: Record<string, TextMetre>; about: MetreAbout }
/** How far the scanner agrees with the published scansion, over the whole library (for the page to state). */
export interface MetreAbout { accuracy: { lines: number; hexameter: string; pentameter: string; trimeter: string } }

/** How a text's lines are scanned. */
export type TextKind = "hexameter" | "elegiac" | "drama" | "comedy" | "lyric";

export const KIND_LABEL: Record<TextKind, string> = {
  hexameter: "Dactylic hexameter",
  elegiac: "Elegiac couplets (hexameter and pentameter)",
  drama: "Iambic trimeter in the spoken parts",
  comedy: "Iambic trimeter (comedy) in the spoken parts",
  lyric: "Lyric metres",
};

/** What the reader needs to know about a text's metre (public/data/metre/_index.json). */
export interface TextMetre {
  kind: TextKind;
  lines: number;          // verse lines
  scanned: number;        // lines with a scansion (published or the scanner's, when sure)
  published: number;      // lines with the published scansion
  pack: boolean;          // a file of published scansions exists for this edition
  /** the scanner checked against the published scansion on this edition's lines */
  check?: { lines: number; agree: number };
}

/** Divisions of a play that are sung or chanted, not spoken in iambic trimeter (Perseus's subtypes). */
export const SUNG_PARTS = new Set(["strophe", "antistrophe", "epode", "choral", "lyric", "lyric-scene", "anapests", "anapaests", "trochees", "pnigos", "prelude", "parabasis", "epirrhema", "antepirrhema", "ode", "song", "kommos", "monody", "hymn", "astrophic", "ephymnion", "mesode", "proode", "parodos", "stasimon",
  // comedy: recited or sung in other metres
  "epirrheme", "antepirrheme", "epirrhema", "antepirrhema", "katakeleusmos", "antikatakeleusmos", "katakeleusmenos", "antikatakeleusmenos", "antipnigos", "dactyls", "elegiacs", "hexameters"]);

/** Hypotactic's metre tags, in words. */
const HYPOTACTIC_METRES: Record<string, string> = {
  an4: "anapaestic tetrameter", an4cat: "anapaestic tetrameter catalectic", an2: "anapaestic dimeter", anapaestic: "anapaests",
  tr7: "trochaic tetrameter catalectic", ia4: "iambic tetrameter", ia4cat: "iambic tetrameter catalectic", ia6cat: "iambic trimeter catalectic",
  ia2: "iambic dimeter", doch: "dochmiac", doch2: "dochmiac dimeter", lec: "lecythion", pher: "pherecratean", ith: "ithyphallic",
  hen: "hendecasyllable", hendecasyllables: "hendecasyllables", anacr: "anacreontic", scazon: "choliambic (scazon)", sapphic14: "Sapphic",
  asc5: "asclepiad", io2: "ionic dimeter", ar: "aristophanean", D: "dactylo-epitrite", "D-": "dactylo-epitrite",
  "Dactylo-Epitrite": "dactylo-epitrite", Aeolic: "aeolic", "Aeolic/Dimeters": "aeolic", "Aeolic-Dactylic": "aeolic-dactylic", mixed: "mixed lyric",
};
export const hypotacticMetre = (tag: string) =>
  tag === "hexameter" ? "hexameter" : tag === "pentameter" ? "pentameter" : /^ia6g?$/.test(tag) ? "trimeter" : null;
export const metreWords = (tag: string) => HYPOTACTIC_METRES[tag] ?? (tag ? tag.replace(/_/g, " + ") : "lyric");

/** The Greek words of a verse line, as the reader shows them. */
export function blockWords(b: Block): string[] {
  const out: string[] = [];
  for (const x of b.c) if (typeof x === "string") for (const p of x.split(GREEK_WORD)) if (p && isGreekWord(p)) out.push(p);
  return out;
}

/** A line, identified by its words (accents ignored), for matching published scansions to this edition. */
export function lineHash(words: string[]): string {
  const s = words.map(greekKey).join(" ");
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}

export interface LineScan {
  scan: Scansion | null;
  /** the metre in words, e.g. "dactylic hexameter", "anapaests (sung; not scanned)" */
  label: string;
  source: "published" | "scanner" | null;
}

/**
 * The scansion of one verse line.
 * @param published  "tag|LSSL…" from the published scansion, if this line has one
 */
export function scanLine(words: string[], kind: TextKind, part: string | undefined, published: string | undefined): LineScan {
  if (words.length < 2) return { scan: null, label: "", source: null };
  if (published) {
    const [tag, q] = published.split("|");
    const m = hypotacticMetre(tag);
    const s = m ? scanWords(words, m, q) : fitLengths(words, q, kind === "drama" || kind === "comedy");
    if (s.readings > 0) return { scan: s, label: m ? METRE_NAMES[m] : metreWords(tag), source: "published" };
  }
  if (kind === "hexameter") return mine(scanWords(words, "hexameter"));
  if (kind === "elegiac") {
    const h = scanWords(words, "hexameter"), p = scanWords(words, "pentameter");
    const pick = h.sure && p.sure ? (h.cost <= p.cost ? h : p) : h.sure ? h : p.sure ? p : h.readings ? h : p;
    return mine(pick);
  }
  if (kind === "drama" || kind === "comedy") {
    if (part && SUNG_PARTS.has(part)) return { scan: null, label: `${partWords(part)} (sung or chanted; not scanned)`, source: null };
    return mine(scanWords(words, kind === "drama" ? "trimeter" : "comic"));
  }
  return { scan: null, label: "lyric (no published scansion for this line)", source: null };
}

const mine = (s: Scansion): LineScan => ({ scan: s, label: METRE_NAMES[s.metre as keyof typeof METRE_NAMES], source: "scanner" });
const partWords = (p: string) => ({
  anapests: "anapaests", anapaests: "anapaests", trochees: "trochaic verse", choral: "choral song", "lyric-scene": "lyric scene",
  epirrheme: "epirrhema (recited, usually trochaic)", antepirrheme: "antepirrhema (recited, usually trochaic)", dactyls: "dactyls", elegiacs: "elegiacs", hexameters: "hexameters",
}[p] ?? p);
