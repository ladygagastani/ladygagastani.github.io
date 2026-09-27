/**
 * From a scansion to what the reader draws: for each word of a verse line, where its vowels are
 * and what length they bear, where the foot divisions fall, and after which word the caesura is.
 * Also joins lines that Perseus splits between two speakers (35, 35b) so they scan as one.
 */
import type { Block, Unit } from "@/lib/tei/types";
import { blockWords, scanLine, type LineScan, type TextKind } from "./text";
import type { Licence } from "./prosody";

/** One syllable as drawn: its vowels in word w (characters a–b), its length, its place in the line. */
export interface Mark { w: number; a: number; b: number; q: "L" | "S" | "X"; licence?: Licence; i: number; footStart: boolean }

export interface LineRender {
  state: "scanned" | "unsure" | "none";
  label: string;
  source: "published" | "scanner" | null;
  readings: number;
  marks: Mark[];                       // in line order
  bars: { w: number; at: number }[];   // foot divisions: before character `at` of word w (0 = before the word)
  caesura: number | null;              // after word w
  caesuraName: string | null;
  first?: boolean;                     // the first line of a stretch in this metre (labelled in mixed texts)
}

const EMPTY = (label: string, state: LineRender["state"], source: LineRender["source"], readings = 0): LineRender =>
  ({ state, label, source, readings, marks: [], bars: [], caesura: null, caesuraName: null });

export function render(ls: LineScan): LineRender {
  const s = ls.scan;
  if (!s) return EMPTY(ls.label, "none", null);
  if (!s.sure || !s.syllables.length) return EMPTY(ls.label, "unsure", ls.source, s.readings);
  const sh = s.shape;
  const marks: Mark[] = [];
  const bars: LineRender["bars"] = [];
  s.syllables.forEach((x, i) => {
    const first = sh.nuclei[x.nuclei[0]], last = sh.nuclei[x.nuclei[x.nuclei.length - 1]];
    const footStart = i > 0 && x.foot >= 0 && x.foot !== s.syllables[i - 1].foot;
    if (first.w === last.w) marks.push({ w: first.w, a: first.a, b: last.b, q: x.q, licence: x.licence, i, footStart });
    else {
      // run together across two words (ἢ οὐ): mark each vowel
      marks.push({ w: first.w, a: first.a, b: first.b, q: x.q, licence: x.licence, i, footStart });
      marks.push({ w: last.w, a: last.a, b: last.b, q: x.q, licence: x.licence, i, footStart: false });
    }
    if (footStart) bars.push(sh.onset[x.nuclei[0] - 1]);
  });
  const caesura = s.caesura ? sh.nuclei[s.syllables[s.caesura.after].nuclei.at(-1)!].w : null;
  return { state: "scanned", label: ls.label, source: ls.source, readings: 1, marks, bars, caesura, caesuraName: s.caesura?.name ?? null };
}

/** The verse lines of some passages, with lines split between speakers joined (35 + 35b). */
export interface VerseLine { parts: { unit: string; block: number; words: number }[]; words: string[]; part?: string }

export function verseLines(units: Unit[]): VerseLine[] {
  const out: VerseLine[] = [];
  let prev: VerseLine | null = null, prevBase: string | null = null;
  for (const u of units) {
    const key = u.ref.join(".");
    u.blocks.forEach((b: Block, bi) => {
      if (b.t !== "l") { prev = null; return; }
      const words = blockWords(b);
      const m = /^(\d+)([a-z])?$/.exec(b.n ?? u.ref[u.ref.length - 1] ?? "");
      const base = m?.[1] ?? null, letter = m?.[2];
      if (prev && letter && letter !== "a" && base === prevBase) {
        prev.parts.push({ unit: key, block: bi, words: words.length });
        prev.words.push(...words);
        return;
      }
      prev = { parts: [{ unit: key, block: bi, words: words.length }], words, part: b.part };
      prevBase = base;
      out.push(prev);
    });
  }
  return out;
}

/**
 * Scan the lines of the given passages. Returns, per passage, per block, what to draw
 * (null for blocks that are not verse lines), keyed by the passage's reference.
 */
export function renderPassages(units: Unit[], kind: TextKind, published: (hash: string) => string | undefined, hashOf: (words: string[]) => string):
  Map<string, (LineRender | null)[]> {
  const out = new Map<string, (LineRender | null)[]>();
  for (const u of units) out.set(u.ref.join("."), u.blocks.map(() => null));
  // in texts that change metre (plays, lyric), label the first line of each stretch
  const mixed = kind === "drama" || kind === "comedy" || kind === "lyric";
  let prevLabel = "";
  for (const vl of verseLines(units)) {
    const r = render(scanLine(vl.words, kind, vl.part, published(hashOf(vl.words))));
    if (mixed && r.label && r.label !== prevLabel) r.first = true;
    if (r.label) prevLabel = r.label;
    // hand each part of a joined line its own words
    let offset = 0;
    vl.parts.forEach((p, k) => {
      const mine: LineRender = {
        ...r,
        marks: r.marks.filter((m) => m.w >= offset && m.w < offset + p.words).map((m) => ({ ...m, w: m.w - offset })),
        bars: r.bars.filter((b) => b.w >= offset && b.w < offset + p.words).map((b) => ({ ...b, w: b.w - offset })),
        caesura: r.caesura !== null && r.caesura >= offset && r.caesura < offset + p.words ? r.caesura - offset : null,
        // the line's label and state belong to its first part; later parts only carry their marks
        label: k === 0 ? r.label : "",
      };
      out.get(p.unit)![p.block] = mine;
      offset += p.words;
    });
  }
  return out;
}
