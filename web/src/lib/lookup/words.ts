/**
 * In-context word analyses from GLAUx (built by pipeline/build_words.py).
 * For a word the reader clicks, find the same word at the same place in GLAUx and return its
 * dictionary form and grammar as analysed there, and whether a person checked it.
 */
import { fold } from "@/lib/catalog";
import { opfsRead } from "@/lib/texts/local";

export interface WordPack {
  work: string; glaux: string; sha: string; licence: string; treebank: string;
  attrs: string[]; lemmas: string[]; tags: string[];
  units: [string[], 0 | 1, string, number[], number[]][];
}
export interface Analysis {
  lemma: string; tag: string; manual: boolean;
  where: "here" | "passage" | "work";   // exact word here / same form in this passage / elsewhere in the work
  others: { lemma: string; tag: string; n: number }[];   // for "work": all analyses of this form, most frequent first
}

const PACK_DIR = "mathesis-words";
const packs = new Map<string, Promise<WordPack | null>>();

/** The word pack for a work: from browser storage if downloaded, else from the site. Null if none exists. */
export function loadWordPack(work: string): Promise<WordPack | null> {
  if (!packs.has(work)) {
    packs.set(work, (async () => {
      const local = await opfsRead(PACK_DIR, `${work}.json`).catch(() => null);
      if (local) return JSON.parse(local) as WordPack;
      const res = await fetch(`/data/words/${work}.json`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`word analyses unavailable (${res.status})`);
      return (await res.json()) as WordPack;
    })().catch((e) => { packs.delete(work); throw e; }));
  }
  return packs.get(work)!;
}
export const WORD_PACK_DIR = PACK_DIR;

export const norm = (s: string) => s.normalize("NFC").replace(/[’'᾽᾿]/g, "ʼ");

// ------------------------------------------------------------ matching GLAUx places to our references
interface Index { recipe: number[]; byKey: Map<string, number[]> }
const indexes = new WeakMap<WordPack, Map<string, Index>>();

/**
 * GLAUx marks places with its own attributes (line="1.1", div_perseus_section="17"…). Work out
 * which combination of them spells the references of the text on screen, by trying the likely
 * ones against the text's own references and keeping the best fit.
 */
function indexFor(pack: WordPack, keys: Set<string>, depth: number): Index {
  const cacheKey = `${depth}:${keys.size}`;
  let m = indexes.get(pack);
  if (!m) indexes.set(pack, (m = new Map()));
  const hit = m.get(cacheKey);
  if (hit) return hit;

  const n = pack.attrs.length;
  const recipes: number[][] = [];
  const grow = (r: number[]) => {
    if (r.length) recipes.push(r);
    if (r.length === depth) return;
    for (let i = 0; i < n; i++) if (!r.includes(i)) grow([...r, i]);
  };
  grow([]);
  const sample = pack.units.filter((_, i) => i % Math.max(1, Math.floor(pack.units.length / 400)) === 0);
  let best = recipes[0] ?? [], score = -1;
  for (const r of recipes) {
    let s = 0;
    for (const u of sample) if (keys.has(r.map((i) => u[0][i]).join("."))) s++;
    if (s > score) { score = s; best = r; }
  }
  const byKey = new Map<string, number[]>();
  pack.units.forEach((u, i) => {
    const k = best.map((j) => u[0][j]).join(".");
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(i);
  });
  const idx = { recipe: best, byKey };
  m.set(cacheKey, idx);
  return idx;
}

/**
 * @param unitKey  reference of the passage the word is in, as the reader shows it ("1.33")
 * @param occurrence  which occurrence of this form within that passage (0 = first)
 * @param keys  all references of the text on screen; depth = number of citation levels
 */
export function analyse(pack: WordPack, word: string, unitKey: string, occurrence: number, keys: Set<string>, depth: number): Analysis | null {
  const w = norm(word), wf = fold(w);
  const { byKey } = indexFor(pack, keys, depth);
  const tokens: { form: string; lemma: string; tag: string; manual: boolean }[] = [];
  for (const i of byKey.get(unitKey) ?? []) {
    const [, manual, forms, lem, tag] = pack.units[i];
    forms.split(" ").forEach((f, j) => tokens.push({ form: f, lemma: pack.lemmas[lem[j]], tag: pack.tags[tag[j]], manual: manual === 1 }));
  }
  const same = tokens.filter((t) => t.form === w);
  const similar = same.length ? same : tokens.filter((t) => fold(t.form) === wf);
  if (similar.length) {
    const t = similar[Math.min(occurrence, similar.length - 1)];
    return { lemma: t.lemma, tag: t.tag, manual: t.manual, where: similar.length > occurrence ? "here" : "passage", others: [] };
  }
  // not found at this place (a different edition, say): how is this form analysed elsewhere in the work?
  const counts = new Map<string, { lemma: string; tag: string; n: number; manual: boolean }>();
  for (const [, manual, forms, lem, tag] of pack.units) {
    const fs = forms.split(" ");
    for (let j = 0; j < fs.length; j++) {
      if (fs[j] !== w) continue;
      const key = `${lem[j]}|${tag[j]}`;
      const c = counts.get(key) ?? { lemma: pack.lemmas[lem[j]], tag: pack.tags[tag[j]], n: 0, manual: manual === 1 };
      c.n++;
      counts.set(key, c);
    }
  }
  const others = [...counts.values()].sort((a, b) => b.n - a.n);
  if (!others.length) return null;
  return { lemma: others[0].lemma, tag: others[0].tag, manual: false, where: "work", others: others.map(({ lemma, tag, n }) => ({ lemma, tag, n })) };
}

/** How often each dictionary word occurs in the given passages (punctuation left out). */
export function lemmaCounts(pack: WordPack, pageKeys: Iterable<string>, keys: Set<string>, depth: number): Map<string, number> {
  const { byKey } = indexFor(pack, keys, depth);
  const counts = new Map<string, number>();
  for (const k of pageKeys) for (const i of byKey.get(k) ?? []) {
    const [, , , lem, tags] = pack.units[i];
    lem.forEach((l, j) => {
      if (pack.tags[tags[j]].startsWith("u")) return;
      const lemma = pack.lemmas[l];
      counts.set(lemma, (counts.get(lemma) ?? 0) + 1);
    });
  }
  return counts;
}
