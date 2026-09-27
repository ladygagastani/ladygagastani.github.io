/**
 * The Census (Most Mentioned): ranked lists of names, objects, words and phrases, counted in GLAUx
 * by pipeline/build_census.py into public/data/census/:
 *   _meta.json       totals, the groups of works and their sizes, the authors and their works,
 *                    the object groups, what was checked by hand and what was left out (and why)
 *   core.json        { group: { list: Row[] } } for the whole library, each kind of writing, each
 *                    period, and each kind of writing in each period
 *   a/<author>.json  the same for one author (group "a:<author>") and each of its works ("w:<work>")
 *   glosses.json     { dictionary word: short English meaning } for listed words and objects
 *   ph/<shard>.json  { phrase: [work, [passage (unit) of each occurrence]][] }
 * A Row is [the word as GLAUx spells it, count] or [spelling, count, 0] when a name or object was
 * sorted automatically rather than checked by hand. canonLemma(spelling) is the Word Study key.
 */
import { canonLemma } from "@/lib/lexicon";
import { greekKey, shardOf } from "@/lib/search/codec";

export type Row = [string, number] | [string, number, 0];
export type Lists = Record<string, Row[]>;
export interface CensusMeta {
  source: string;
  words: number;
  works: number;
  groups: Record<string, [string, number]>;                   // id -> [label, words]
  authors: [string, string, number, [string, string, number][]][];   // [id, name, words, [work, title, words][]]
  objects: [string, string][];                                 // [group id, label]
  sizes: Record<string, number>;
  checked: { names: number; objects: number };
  leftOut: [string, string, number][];                         // [name, why, count]
}

const BASE = "/data/census";
const cache = new Map<string, Promise<unknown>>();
function json<T>(path: string): Promise<T | null> {
  if (!cache.has(path)) {
    cache.set(path, fetch(`${BASE}/${path}`).then((r) => {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`the Census data could not be reached (${r.status})`);
      return r.json();
    }).catch((e) => { cache.delete(path); throw e; }));
  }
  return cache.get(path) as Promise<T | null>;
}

export const loadCensusMeta = () => json<CensusMeta>("_meta.json");
export const loadGlosses = () => json<Record<string, string>>("glosses.json");

/** The lists of one group of works: "all", "f2", "p1", "f2p1", "a:tlg0012" or "w:tlg0012.tlg001". */
export async function loadGroup(group: string): Promise<Lists | null> {
  const file = group.startsWith("a:") || group.startsWith("w:") ? `a/${group.slice(2).split(".")[0]}.json` : "core.json";
  const data = await json<Record<string, Lists>>(file);
  return data?.[group] ?? null;
}

/** Where a phrase occurs: [work, [passage number in that work's word pack, one per occurrence]][] */
export async function phraseOccurrences(phrase: string): Promise<[string, number[]][] | null> {
  const data = await json<Record<string, [string, number[]][]>>(`ph/${encodeURIComponent(shardOf(greekKey(phrase)))}.json`);
  return data?.[phrase] ?? null;
}

// ------------------------------------------------------------ what can be counted
export interface Category { id: string; label: string; one: string; shelf: Shelf; blurb: string }
export type Shelf = "names" | "things" | "words" | "phrases";
export const SHELVES: { id: Shelf; label: string; blurb: string }[] = [
  { id: "names", label: "Names", blurb: "People, gods and heroes, places and peoples" },
  { id: "things", label: "Things", blurb: "Ships, weapons, animals, food and more" },
  { id: "words", label: "Words", blurb: "Every dictionary word, or nouns, verbs and adjectives" },
  { id: "phrases", label: "Phrases", blurb: "Runs of words that repeat, such as Homer's formulas" },
];

const NAMED: Category[] = [
  { id: "person", label: "People", one: "person", shelf: "names", blurb: "Historical people, and the people of the Bible and the novels, by name." },
  { id: "god", label: "Gods and heroes", one: "god or hero", shelf: "names", blurb: "Gods, heroes and the other figures of myth and legend." },
  { id: "place", label: "Places", one: "place", shelf: "names", blurb: "Cities, lands, islands, rivers, seas and mountains." },
  { id: "people", label: "Peoples", one: "people", shelf: "names", blurb: "Peoples and tribes, by the name for one of them (Ἀθηναῖος, “an Athenian”)." },
];
const WORDS: Category[] = [
  { id: "words", label: "All words", one: "word", shelf: "words", blurb: "Every dictionary word, the little ones too: the article, “and”, “but”." },
  { id: "noun", label: "Nouns", one: "noun", shelf: "words", blurb: "Nouns, not counting names." },
  { id: "verb", label: "Verbs", one: "verb", shelf: "words", blurb: "Verbs, every form counted under the dictionary form." },
  { id: "adj", label: "Adjectives", one: "adjective", shelf: "words", blurb: "Adjectives, not counting names of peoples." },
];
export const PHRASES: Category = { id: "phrase", label: "Phrases", one: "phrase", shelf: "phrases", blurb: "Two to six words that recur in exactly this form." };

const OBJECT_ONE: Record<string, string> = {
  ships: "ship or boat", vehicles: "chariot or wagon", weapons: "weapon", animals: "animal", money: "word for money",
  music: "instrument", food: "food or drink", plants: "plant", clothing: "garment or jewel", containers: "vessel",
  tools: "tool", buildings: "building", materials: "material", body: "part of the body", sky: "heavenly body",
};

export function categories(meta: CensusMeta): Category[] {
  const things = meta.objects.map(([id, label]): Category => ({
    id: `obj:${id}`, label, one: OBJECT_ONE[id] ?? "thing", shelf: "things",
    blurb: `Words whose meaning in GLAUx falls under WordNet's “${label.toLowerCase()}”.`,
  }));
  return [...NAMED, ...things, ...WORDS, PHRASES];
}
export const isName = (cat: string) => NAMED.some((c) => c.id === cat);
export const isLemma = (cat: string) => cat !== "phrase";

// ------------------------------------------------------------ groups of works
export interface Scope { a: string | null; w: string | null; f: number | null; p: number | null }
export const EMPTY_SCOPE: Scope = { a: null, w: null, f: null, p: null };

export function groupOf(s: Scope): string {
  if (s.w) return `w:${s.w}`;
  if (s.a) return `a:${s.a}`;
  if (s.f !== null && s.p !== null) return `f${s.f}p${s.p}`;
  if (s.f !== null) return `f${s.f}`;
  if (s.p !== null) return `p${s.p}`;
  return "all";
}

/** The label and size (words) of a group. */
export function groupInfo(meta: CensusMeta, group: string): { label: string; words: number } {
  if (group.startsWith("a:")) {
    const a = meta.authors.find((x) => x[0] === group.slice(2));
    return { label: a?.[1] ?? group.slice(2), words: a?.[2] ?? 0 };
  }
  if (group.startsWith("w:")) {
    const id = group.slice(2);
    const a = meta.authors.find((x) => id.startsWith(`${x[0]}.`));
    const w = a?.[3].find(([wid]) => wid === id);
    return { label: w ? `${a![1]}, ${w[1]}` : id, words: w?.[2] ?? 0 };
  }
  const g = meta.groups[group];
  return { label: g?.[0] ?? group, words: g?.[1] ?? 0 };
}

/** Scope <-> URL: a=tlg0012, w=tlg0012.tlg001, f=2, p=1 (and b… for the second, compared scope). */
export function scopeFrom(get: (k: string) => string | null, prefix = ""): Scope {
  const num = (v: string | null) => (v !== null && /^\d+$/.test(v) ? +v : null);
  const w = get(`${prefix}w`);
  const a = get(`${prefix}a`) ?? (w ? w.split(".")[0] : null);
  return { a, w, f: a ? null : num(get(`${prefix}f`)), p: a ? null : num(get(`${prefix}p`)) };
}
export function scopeParams(s: Scope, prefix = ""): [string, string | null][] {
  return [[`${prefix}a`, s.a], [`${prefix}w`, s.w], [`${prefix}f`, s.f === null ? null : String(s.f)], [`${prefix}p`, s.p === null ? null : String(s.p)]];
}

/** The Oracle's filters for the same scope, for "every mention". */
export function oracleScope(meta: CensusMeta, s: Scope): string {
  const q = new URLSearchParams();
  if (s.w) q.set("w", s.w);
  else if (s.a) q.set("a", s.a);
  else {
    if (s.f !== null) q.set("g", meta.groups[`f${s.f}`]?.[0] ?? "");
    if (s.p !== null) q.set("p", meta.groups[`p${s.p}`]?.[0] ?? "");
  }
  const t = q.toString();
  return t ? `&${t}` : "";
}

export const rate = (n: number, words: number) => (words ? (n * 10000) / words : 0);
export const fmtRate = (r: number) => (r >= 10 ? r.toFixed(0) : r >= 1 ? r.toFixed(1) : r.toFixed(2));

// ------------------------------------------------------------ links into the rest of the site
/**
 * Painted Stoa entries about a name, by dictionary word (canonLemma). Places are also linked through
 * the map: an entry whose `places` holds the place's Pleiades id is shown for it.
 */
export const NAME_ENTRIES: Record<string, string[]> = {
  "περικλῆς": ["pericles"],
  "ἱππαρχία": ["hipparchia"],
  "διογένης": ["diogenes"],
  "πυθαγόρας": ["pythagoras"],
  "σωκράτης": ["trial-of-socrates"],
  "ἀσκληπιός": ["asclepius"],
  "εἵλως": ["helots"],
  "μήλιος": ["melos"],
  "μυτιληναῖος": ["mytilene-debate"],
  "ὅμηρος": ["homeric-similes"],
  "κλέων": ["mytilene-debate"],
};
export const lemmaKey = (spelling: string) => canonLemma(spelling);
