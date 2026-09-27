/**
 * The search engine, in the browser. It reads the index built by scripts/build-search.ts from
 * /data/search: only the few small files ("shards") a query needs, kept in memory once read.
 *
 * Kinds of search:
 * - forms:  Greek words exactly as printed (accents ignored), one or several in a row;
 * - lemma:  every form of a dictionary word, as GLAUx analyses it, optionally by grammar;
 * - grammar: every word with a given grammar (e.g. all optatives), in the works chosen;
 * - english: words of the English translations.
 */
import { greekEditions, translations, type CatalogIndex } from "@/lib/catalog";
import { decodePostings, englishKey, unpackShard, type Posting } from "./codec";
import type { KeyPattern } from "./input";

export type Dir = "grc" | "eng" | "lem" | "tag";
const BASE = "/data/search";
const EXTRAS: Record<Dir, number> = { grc: 0, eng: 0, lem: 1, tag: 0 };

export interface TextInfo { id: number; urn: string; work: string; lang: string; kind: string }

let textsP: Promise<TextInfo[]> | null = null;
export const loadTexts = () => (textsP ??= json<TextInfo[]>(`${BASE}/texts.json`));
let tagsP: Promise<string[]> | null = null;
export const loadTags = () => (tagsP ??= json<string[]>(`${BASE}/tags.json`));
const indexes = new Map<Dir, Promise<Record<string, [number, number]>>>();
const shardIndex = (dir: Dir) => {
  if (!indexes.has(dir)) indexes.set(dir, json(`${BASE}/${dir}/_index.json`));
  return indexes.get(dir)!;
};

async function json<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new SearchUnavailable(r.status);
  return r.json() as Promise<T>;
}

export class SearchUnavailable extends Error {
  constructor(status?: number) {
    super(status === 404 ? "The search index is not on this server yet." : "The search index could not be reached.");
  }
}

// ------------------------------------------------------------ shards
interface Shard { keys: string[]; o: number[]; n: number[]; body: Uint8Array; at: Map<string, number> }
const shards = new Map<string, Promise<Shard>>();

function shard(dir: Dir, name: string): Promise<Shard> {
  const id = `${dir}/${name}`;
  if (!shards.has(id)) {
    shards.set(id, (async () => {
      const r = await fetch(`${BASE}/${dir}/${encodeURIComponent(name)}.bin`);
      if (!r.ok) throw new SearchUnavailable(r.status);
      const { header, body } = unpackShard(new Uint8Array(await r.arrayBuffer()));
      return { keys: header.k, o: header.o, n: header.n, body, at: new Map(header.k.map((k, i) => [k, i])) };
    })().catch((e) => { shards.delete(id); throw e; }));
  }
  return shards.get(id)!;
}

export interface Key { key: string; shard: string }

/** Keys in the index matching a pattern (keyOf turns a stored key into the searchable one). */
export async function matchKeys(dir: Dir, pat: KeyPattern, keyOf: (k: string) => string = (k) => k, limit = 400): Promise<{ keys: Key[]; more: boolean }> {
  const names = Object.keys(await shardIndex(dir));
  // a key is filed under its first two letters (a one-letter key under that letter)
  const wanted = names.filter((n) => pat.prefixes.some((p) => (pat.open ? n.startsWith(p) : n === p)));
  const out: Key[] = [];
  for (const n of wanted) {
    const s = await shard(dir, n);
    for (const k of s.keys) if (pat.regex.test(keyOf(k))) out.push({ key: k, shard: n });
  }
  out.sort((a, b) => a.key.localeCompare(b.key, "el"));
  return { keys: out.slice(0, limit), more: out.length > limit };
}

/** How many postings a key has, without decoding them. */
export async function countOf(dir: Dir, key: string, shardName: string): Promise<number> {
  const s = await shard(dir, shardName);
  const i = s.at.get(key);
  return i === undefined ? 0 : s.n[i];
}

/** All postings of the given keys, merged in text order; keep() drops texts outside the search. */
export async function postings(dir: Dir, keys: { key: string; shard: string }[], keep: (text: number) => boolean): Promise<Posting[]> {
  const lists: Posting[][] = [];
  for (const { key, shard: name } of keys) {
    const s = await shard(dir, name);
    const i = s.at.get(key);
    if (i === undefined) continue;
    lists.push(decodePostings(s.body, s.o[i], s.n[i], EXTRAS[dir]).filter((p) => keep(p.text)));
  }
  const all = lists.length === 1 ? lists[0] : lists.flat().sort(byPlace);
  return all;
}
const byPlace = (a: Posting, b: Posting) => a.text - b.text || a.unit - b.unit || a.word - b.word;

// ------------------------------------------------------------ results
export interface Hit { text: number; unit: number; words: number[]; tag?: number }

const place = (text: number, unit: number, word: number) => (text * 2 ** 20 + unit) * 2 ** 20 + word;

/** Words in a row: each list holds the postings of one word of the phrase. */
export function phrase(lists: Posting[][]): Hit[] {
  if (lists.length === 1) return lists[0].map((p) => ({ text: p.text, unit: p.unit, words: [p.word], tag: p.extra[0] }));
  const later = lists.slice(1).map((l) => new Set(l.map((p) => place(p.text, p.unit, p.word))));
  const hits: Hit[] = [];
  for (const p of lists[0]) {
    if (later.every((s, i) => s.has(place(p.text, p.unit, p.word + i + 1)))) {
      hits.push({ text: p.text, unit: p.unit, words: lists.map((_, i) => p.word + i) });
    }
  }
  return hits;
}

/** The texts searched by default: the edition and translation the reader opens first. */
export function defaultTexts(idx: CatalogIndex, texts: TextInfo[]): Set<number> {
  const byUrn = new Map(texts.map((t) => [t.urn, t.id]));
  const out = new Set<number>();
  for (const w of idx.work.values()) {
    const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
    const tr = translations(w)[0];
    for (const t of [ed, tr]) if (t && byUrn.has(t.urn)) out.add(byUrn.get(t.urn)!);
  }
  return out;
}

// ------------------------------------------------------------ grammar
/** The nine positions of a GLAUx (AGDT) tag, and what each letter means. */
export const TAG_FIELDS = [
  { id: "pos", label: "Part of speech", values: { n: "noun", v: "verb", a: "adjective", d: "adverb", l: "article", p: "pronoun", r: "preposition", c: "conjunction", b: "coordinator (καί, δέ…)", g: "particle", m: "numeral", i: "interjection" } },
  { id: "person", label: "Person", values: { 1: "1st", 2: "2nd", 3: "3rd" } },
  { id: "number", label: "Number", values: { s: "singular", p: "plural", d: "dual" } },
  { id: "tense", label: "Tense", values: { p: "present", i: "imperfect", a: "aorist", f: "future", r: "perfect", l: "pluperfect", t: "future perfect" } },
  { id: "mood", label: "Mood", values: { i: "indicative", s: "subjunctive", o: "optative", m: "imperative", n: "infinitive", p: "participle" } },
  { id: "voice", label: "Voice", values: { a: "active", m: "middle", p: "passive", e: "middle or passive" } },
  { id: "gender", label: "Gender", values: { m: "masculine", f: "feminine", n: "neuter" } },
  { id: "case", label: "Case", values: { n: "nominative", g: "genitive", d: "dative", a: "accusative", v: "vocative" } },
  { id: "degree", label: "Degree", values: { c: "comparative", s: "superlative" } },
] as const;
export type TagFilter = Partial<Record<(typeof TAG_FIELDS)[number]["id"], string>>;

export const tagMatches = (tag: string, f: TagFilter) => TAG_FIELDS.every((fd, i) => !f[fd.id] || tag[i] === f[fd.id]);
export const hasTagFilter = (f: TagFilter) => Object.values(f).some(Boolean);

// ------------------------------------------------------------ English
export const englishPattern = (w: string): KeyPattern | { error: string } => {
  const k = w.toLowerCase().replace(/[^a-z*?]/g, "");
  if (!/[a-z]/.test(k)) return { error: "Type at least one letter." };
  if (/^[*?]/.test(k)) return { error: "Start with a letter: a wildcard can come anywhere but first." };
  const src = k.replace(/\*/g, "[a-z]*").replace(/\?/g, "[a-z]");
  const two = /^[a-z]{2}/.test(k);
  return { regex: new RegExp(`^${src}$`), prefixes: [two ? k.slice(0, 2) : k[0]], open: !two && k.length > 1, greek: englishKey(w) || w, loose: false };
};
