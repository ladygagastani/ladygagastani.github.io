/**
 * Scanning a line: fit its syllables to the patterns a metre allows, preferring the reading that
 * needs the fewest and commonest licences. A line counts as scanned ("sure") only when every
 * best reading gives the same long and short syllables; otherwise it is left unscanned and marked
 * as uncertain, never guessed.
 */
import { options, shape, synizesisCandidates, type Licence, type LineShape, type Q } from "./prosody";

export type MetreId = "hexameter" | "pentameter" | "trimeter" | "comic";
/** A line's metre as shown: one the scanner knows, or "lyric" (lengths from a published scansion, no feet). */
export type LineMetre = MetreId | "lyric";

export const METRE_NAMES: Record<MetreId, string> = {
  hexameter: "dactylic hexameter",
  pentameter: "elegiac pentameter",
  trimeter: "iambic trimeter",
  comic: "iambic trimeter (comedy)",
};

/** One place in a metrical pattern: what length it needs, what using it costs, and which foot it is in. */
interface Slot { q: Q | "X"; cost: number; foot: number; pos: number; name?: string }

/** How much each licence costs in each kind of verse (lower = commoner). */
const LICENCE_COST: Record<"epic" | "drama", Record<Licence, number>> = {
  epic: { mcl: 1, correption: 0.3, "inner-correption": 1, synizesis: 1.5, lengthening: 2.5 },
  drama: { mcl: 0.2, correption: 3, "inner-correption": 1.5, synizesis: 1.5, lengthening: 5 },
};
const FAMILY: Record<MetreId, "epic" | "drama"> = { hexameter: "epic", pentameter: "epic", trimeter: "drama", comic: "drama" };

// ------------------------------------------------------------ the patterns of each metre
const D = (foot: number): Slot[] => [{ q: "L", cost: 0, foot, pos: 0 }, { q: "S", cost: 0, foot, pos: 1 }, { q: "S", cost: 0, foot, pos: 2 }];
const Sp = (foot: number, cost = 0): Slot[] => [{ q: "L", cost: 0, foot, pos: 0 }, { q: "L", cost, foot, pos: 1 }];

function hexameters(): Slot[][] {
  const out: Slot[][] = [];
  for (let m = 0; m < 32; m++) {
    const p: Slot[] = [];
    // a spondee in the fifth foot is rare (a "spondeiazon")
    for (let f = 0; f < 5; f++) p.push(...(m & (1 << f) ? D(f) : Sp(f, f === 4 ? 1.2 : 0)));
    p.push({ q: "L", cost: 0, foot: 5, pos: 0 }, { q: "X", cost: 0, foot: 5, pos: 1 });
    out.push(p);
  }
  return out;
}

function pentameters(): Slot[][] {
  const out: Slot[][] = [];
  for (let m = 0; m < 4; m++) {
    const p: Slot[] = [];
    for (let f = 0; f < 2; f++) p.push(...(m & (1 << f) ? D(f) : Sp(f)));
    p.push({ q: "L", cost: 0, foot: 2, pos: 0 });
    p.push(...D(3), ...D(4), { q: "X", cost: 0, foot: 5, pos: 0 });
    out.push(p);
  }
  return out;
}

/**
 * Iambic trimeter: three metra of × – ⏑ –. A long may be "resolved" into two shorts; so may an
 * anceps (×), most often in the first foot. The last place may be long or short.
 */
function trimeters(comic = false): Slot[][] {
  const kinds: ("X" | "L" | "S")[] = ["X", "L", "S", "L", "X", "L", "S", "L", "X", "L", "S", "X"];
  let out: Slot[][] = [[]];
  kinds.forEach((k, i) => {
    const foot = Math.floor(i / 4), pos = i;
    const ways: Slot[][] =
      i === 11 ? [[{ q: "X", cost: 0, foot, pos }]]
      // comedy also allows an anapaest (⏑⏑–) for an iamb in the first five feet: a short place split in two
      : k === "S" ? (comic && i < 10 ? [[{ q: "S", cost: 0, foot, pos }], [{ q: "S", cost: 1.2, foot, pos }, { q: "S", cost: 0, foot, pos }]] : [[{ q: "S", cost: 0, foot, pos }]])
      : k === "L" ? [[{ q: "L", cost: 0, foot, pos }], [{ q: "S", cost: i === 9 ? 2 : 1, foot, pos }, { q: "S", cost: 0, foot, pos }]]
      : [[{ q: "X", cost: 0, foot, pos }], [{ q: "S", cost: comic ? 1 : i === 0 ? 1.5 : 2.5, foot, pos }, { q: "S", cost: 0, foot, pos }]];
    const next: Slot[][] = [];
    for (const p of out) for (const w of ways) next.push([...p, ...w]);
    out = next;
  });
  return out;
}

const PATTERNS: Record<MetreId, Slot[][]> = { hexameter: hexameters(), pentameter: pentameters(), trimeter: trimeters(), comic: trimeters(true) };
const BY_LENGTH = new Map<MetreId, Map<number, Slot[][]>>();
function patternsOf(m: MetreId, n: number) {
  let byLen = BY_LENGTH.get(m);
  if (!byLen) {
    byLen = new Map();
    for (const p of PATTERNS[m]) { const l = byLen.get(p.length) ?? []; l.push(p); byLen.set(p.length, l); }
    BY_LENGTH.set(m, byLen);
  }
  return byLen.get(n) ?? [];
}

// ------------------------------------------------------------ scanning
/**
 * A syllable as scanned: the vowels at its core (indexes into the line's nuclei), its length, and
 * any licence it needs. "X": a place the metre leaves free (anceps) holding a vowel whose length
 * the spelling does not show; it is not guessed.
 */
export interface Syllable { nuclei: number[]; q: Q | "X"; licence?: Licence; foot: number; pos: number }

export interface Scansion {
  metre: LineMetre;
  sure: boolean;
  /** How many different readings are equally good (0: the line does not fit this metre). */
  readings: number;
  cost: number;
  shape: LineShape;
  syllables: Syllable[];            // the best reading (empty when the line does not fit)
  /** syllable index after which the main caesura (or the pentameter's mid-line break) falls */
  caesura: { after: number; name: string } | null;
  bucolic: number | null;           // hexameter: word end after the fourth foot (a dactyl)
}

interface Variant { groups: number[][] }

/** The ways of grouping vowels into syllables: each run-together pair (synizesis) is optional. */
function variants(sh: LineShape): Variant[] {
  const cands = synizesisCandidates(sh).slice(0, 4);
  const out: Variant[] = [];
  for (let m = 0; m < 1 << cands.length; m++) {
    const merge = new Set(cands.filter((_, k) => m & (1 << k)));
    // overlapping merges (three vowels in a row) are not allowed
    if ([...merge].some((i) => merge.has(i + 1))) continue;
    const groups: number[][] = [];
    for (let i = 0; i < sh.nuclei.length; i++) {
      if (merge.has(i)) { groups.push([i, i + 1]); i++; } else groups.push([i]);
    }
    out.push({ groups });
  }
  return out;
}

/**
 * @param only  a published scansion (L/S per syllable): keep only readings with exactly these lengths
 */
export function scanWords(words: string[], metre: MetreId, only?: string): Scansion {
  const sh = shape(words, !only);
  const costs = LICENCE_COST[FAMILY[metre]];
  type Best = { cost: number; syl: Syllable[] };
  const found: Best[] = [];
  let min = Infinity;

  for (const v of variants(sh)) {
    const opts = v.groups.map((g) => {
      if (g.length === 2) return [{ q: "L" as Q, licence: "synizesis" as Licence }];
      return options(sh, g[0], FAMILY[metre] === "drama");
    });
    const n = v.groups.length;
    if (only && only.length !== n) continue;
    for (const p of patternsOf(metre, n)) {
      let cost = 0;
      const syl: Syllable[] = [];
      let ok = true;
      for (let i = 0; i < n && ok; i++) {
        const slot = p[i];
        let best: { q: Q | "X"; licence?: Licence; c: number } | null = null;
        for (const o of opts[i]) {
          if (slot.q !== "X" && o.q !== slot.q) continue;
          if (only && i < n - 1 && o.q !== only[i]) continue;
          const c = o.licence ? costs[o.licence] : 0;
          if (!best || c < best.c) best = { q: o.q, licence: o.licence, c };
          // a free place, and a vowel that may be long or short at no cost: its length is not known
          else if (slot.q === "X" && c === best.c && o.q !== best.q) best = { q: "X", c };
        }
        if (!best) { ok = false; break; }
        cost += best.c + slot.cost;
        syl.push({ nuclei: v.groups[i], q: best.q, licence: best.licence, foot: slot.foot, pos: slot.pos });
      }
      if (!ok || cost > min + 1e-9) continue;
      if (only) syl[n - 1].q = only[n - 1] as Q;   // the published scansion knows the last syllable too
      if (cost < min - 1e-9) { min = cost; found.length = 0; }
      found.push({ cost, syl });
    }
  }

  if (!found.length) return { metre, sure: false, readings: 0, cost: Infinity, shape: sh, syllables: [], caesura: null, bucolic: null };
  // Readings agree when they divide the line into the same syllables and never give one syllable
  // different lengths (a free place of unknown length agrees with either; the last syllable is free).
  const groups = new Map<string, Best[]>();
  for (const b of found) {
    const g = b.syl.map((s) => s.nuclei.join("+")).join(" ");
    groups.set(g, [...(groups.get(g) ?? []), b]);
  }
  let readings = groups.size;
  const best: Best = { cost: found[0].cost, syl: found[0].syl.map((s) => ({ ...s })) };
  if (groups.size === 1) {
    best.syl.forEach((s, i) => {
      const qs = new Set(found.map((b) => b.syl[i].q).filter((q) => q !== "X"));
      if (i < best.syl.length - 1 && qs.size > 1) readings = Math.max(readings, qs.size);
      s.q = qs.size === 1 ? [...qs][0] : "X";
    });
  }
  return {
    metre, sure: readings === 1, readings, cost: min, shape: sh, syllables: best.syl,
    caesura: caesuraOf(sh, best.syl, metre), bucolic: metre === "hexameter" ? bucolicOf(sh, best.syl) : null,
  };
}

/** Is there a word end after syllable i? */
function wordEndAfter(sh: LineShape, syl: Syllable[], i: number) {
  if (i + 1 >= syl.length) return false;
  const a = sh.nuclei[syl[i].nuclei[syl[i].nuclei.length - 1]].w, b = sh.nuclei[syl[i + 1].nuclei[0]].w;
  return a !== b;
}

function caesuraOf(sh: LineShape, syl: Syllable[], metre: MetreId): Scansion["caesura"] {
  const at = (foot: number, pos: number) => syl.findIndex((s) => s.foot === foot && s.pos === pos);
  if (metre === "hexameter") {
    const third = at(2, 0), trochaic = at(2, 1), fourth = at(3, 0);
    if (third >= 0 && wordEndAfter(sh, syl, third)) return { after: third, name: "masculine caesura (after the first long of the third foot)" };
    if (trochaic >= 0 && syl[trochaic].q === "S" && at(2, 2) >= 0 && wordEndAfter(sh, syl, trochaic)) return { after: trochaic, name: "feminine caesura (after the first short of the third foot)" };
    if (fourth >= 0 && wordEndAfter(sh, syl, fourth)) return { after: fourth, name: "hephthemimeral caesura (after the first long of the fourth foot)" };
    return null;
  }
  if (metre === "pentameter") {
    const mid = at(2, 0);
    return mid >= 0 && wordEndAfter(sh, syl, mid) ? { after: mid, name: "the break in the middle of the pentameter" } : null;
  }
  // trimeter (tragic or comic): word end after the fifth place, or else after the seventh
  const lastOf = (pos: number) => syl.findLastIndex((s) => s.pos === pos);
  const five = lastOf(4), seven = lastOf(6);
  if (five >= 0 && wordEndAfter(sh, syl, five)) return { after: five, name: "penthemimeral caesura (after the fifth place)" };
  if (seven >= 0 && wordEndAfter(sh, syl, seven)) return { after: seven, name: "hephthemimeral caesura (after the seventh place)" };
  return null;
}

function bucolicOf(sh: LineShape, syl: Syllable[]) {
  const end4 = syl.findLastIndex((s) => s.foot === 3);
  return end4 >= 0 && syl[end4].pos === 2 && wordEndAfter(sh, syl, end4) ? end4 : null;
}

/** The long/short pattern as marks: — long, ⏑ short, with | between feet. */
export function patternText(s: Scansion): string {
  let out = "";
  s.syllables.forEach((x, i) => {
    if (i > 0 && x.foot !== s.syllables[i - 1].foot) out += " | ";
    out += x.q === "L" ? "–" : x.q === "S" ? "⏑" : "×";
  });
  return out;
}

/**
 * A line in a metre the scanner does not analyse (lyric), given its published lengths: divide it
 * into syllables that can bear them. No feet or caesura are marked.
 */
export function fitLengths(words: string[], q: string, attic: boolean): Scansion {
  const sh = shape(words, false);
  const costs = LICENCE_COST[attic ? "drama" : "epic"];
  let best: { cost: number; syl: Syllable[] } | null = null;
  for (const v of variants(sh)) {
    if (v.groups.length !== q.length) continue;
    let cost = 0;
    const syl: Syllable[] = [];
    for (let i = 0; i < q.length; i++) {
      const g = v.groups[i];
      const opts = g.length === 2 ? [{ q: "L" as Q, licence: "synizesis" as Licence }] : options(sh, g[0], attic);
      const want = q[i] as Q;
      const o = i === q.length - 1 ? opts[0] : opts.filter((x) => x.q === want).sort((a, b) => (a.licence ? costs[a.licence] : 0) - (b.licence ? costs[b.licence] : 0))[0];
      if (!o) { cost = Infinity; break; }
      cost += o.licence ? costs[o.licence] : 0;
      syl.push({ nuclei: g, q: want, licence: o.licence, foot: -1, pos: i });
    }
    if (cost < (best?.cost ?? Infinity)) best = { cost, syl };
  }
  if (!best) return { metre: "lyric", sure: false, readings: 0, cost: Infinity, shape: sh, syllables: [], caesura: null, bucolic: null };
  return { metre: "lyric", sure: true, readings: 1, cost: best.cost, shape: sh, syllables: best.syl, caesura: null, bucolic: null };
}
