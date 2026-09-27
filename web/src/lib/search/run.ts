/** Running one search: from what was typed to hits grouped by work. */
import { fold, type CatalogIndex } from "@/lib/catalog";
import { greekKey, englishKey } from "./codec";
import { detectScript, queryWords, toPattern, type KeyPattern, type Script } from "./input";
import {
  countOf, defaultTexts, englishPattern, hasTagFilter, loadTags, loadTexts, matchKeys, phrase, postings, tagMatches,
  type Hit, type Key, type TagFilter, type TextInfo,
} from "./engine";

export type Mode = "forms" | "lemma" | "english";

export interface Query {
  mode: Mode;
  q: string;
  script: Script | "auto";
  lemma: string | null;           // one dictionary word chosen among several spelled alike
  tags: TagFilter;
  works: Set<string> | null;      // null = every work
  allEditions: boolean;
}

export interface Matched { key: string; label: string }
export interface WorkHits { work: string; texts: Map<number, Hit[]>; count: number }
export interface Outcome {
  hits: number;
  works: WorkHits[];
  /** Per word of the query: what it was read as, and the index keys it matched. */
  read: { typed: string; greek: string; matched: Matched[]; more: boolean }[];
  lemmas: { lemma: string; count: number }[];   // dictionary words found (lemma mode), to choose among
  notes: string[];
  texts: TextInfo[];
}

export class QueryProblem extends Error {}

const MAX_HITS = 1_000_000;

export async function runSearch(idx: CatalogIndex, query: Query): Promise<Outcome> {
  const texts = await loadTexts();
  const lang = query.mode === "english" ? "eng" : "grc";
  const defaults = query.allEditions ? null : defaultTexts(idx, texts);
  const keep = (t: number) => {
    const x = texts[t];
    return !!x && x.lang === lang && (!defaults || defaults.has(t)) && (!query.works || query.works.has(x.work));
  };
  const notes: string[] = [];
  const read: Outcome["read"] = [];
  const lemmas: Outcome["lemmas"] = [];
  let hits: Hit[] = [];
  const words = queryWords(query.q);

  if (query.mode === "english") {
    const lists = [];
    for (const w of words) {
      const pat = englishPattern(w);
      if ("error" in pat) throw new QueryProblem(pat.error);
      const { keys, more } = await matchKeys("eng", pat);
      read.push({ typed: w, greek: englishKey(w), matched: keys.map((k) => ({ key: k.key, label: k.key })), more });
      lists.push(await postings("eng", keys, keep));
    }
    hits = lists.length ? phrase(lists) : [];
  } else if (query.mode === "forms") {
    const lists = [];
    for (const w of words) {
      const pat = pattern(w, query.script, notes);
      const { keys, more } = await matchKeys("grc", pat);
      read.push({ typed: w, greek: pat.greek, matched: keys.map((k) => ({ key: k.key, label: k.key })), more });
      lists.push(await postings("grc", keys, keep));
    }
    hits = lists.length ? phrase(lists) : [];
  } else {
    // dictionary word (with grammar), or grammar alone
    const tags = await loadTags();
    const tagOk = hasTagFilter(query.tags) ? new Set(tags.map((t, i) => (tagMatches(t, query.tags) ? i : -1)).filter((i) => i >= 0)) : null;
    if (words.length > 1) throw new QueryProblem("Search for one dictionary word at a time.");
    if (words.length === 1) {
      const pat = pattern(words[0], query.script, notes);
      const { keys, more } = await matchKeys("lem", pat, greekKey);
      // GLAUx sometimes writes one dictionary word several ways (Εἰμί, ·εἰμί): these count as one
      const groups = new Map<string, Key[]>();
      for (const k of keys) { const c = canonLemma(k.key); groups.set(c, [...(groups.get(c) ?? []), k]); }
      for (const [c, ks] of groups) {
        let count = 0;
        for (const k of ks) count += await countOf("lem", k.key, k.shard);
        lemmas.push({ lemma: c, count });
      }
      lemmas.sort((a, b) => b.count - a.count);
      // several dictionary words spelled alike without accents (ὅς "who", ὡς "as"): search the one
      // chosen, or the one typed with exactly these accents, or all of them until one is chosen
      const typed = canonLemma(words[0]);
      const pick = query.lemma && groups.has(query.lemma) ? query.lemma : groups.has(typed) ? typed : null;
      const use = pick ? groups.get(pick)! : keys;
      read.push({ typed: words[0], greek: pat.greek, matched: (pick ? [pick] : [...groups.keys()]).map((k) => ({ key: k, label: k })), more });
      const note = LEMMA_NOTES[greekKey(pick ?? typed)];
      if (note) notes.push(note);
      hits = (await postings("lem", use, keep))
        .filter((p) => !tagOk || tagOk.has(p.extra[0]))
        .map((p) => ({ text: p.text, unit: p.unit, words: [p.word], tag: p.extra[0] }));
    } else {
      if (!tagOk) throw new QueryProblem("Type a dictionary word, or choose some grammar to search for.");
      if (!query.works) notes.push("Grammar searches over every work can take a moment.");
      const keys = [...tagOk].map((i) => ({ key: String(i), shard: String(i) }));
      hits = (await postings("tag", keys, keep)).map((p) => ({ text: p.text, unit: p.unit, words: [p.word] }));
    }
  }

  const truncated = hits.length > MAX_HITS;
  if (truncated) { notes.push(`Showing the first ${MAX_HITS.toLocaleString()} results. Narrow the search to see the rest.`); hits = hits.slice(0, MAX_HITS); }

  const byWork = new Map<string, WorkHits>();
  for (const h of hits) {
    const w = texts[h.text].work;
    let g = byWork.get(w);
    if (!g) byWork.set(w, (g = { work: w, texts: new Map(), count: 0 }));
    const l = g.texts.get(h.text);
    if (l) l.push(h); else g.texts.set(h.text, [h]);
    g.count++;
  }
  return { hits: hits.length, works: [...byWork.values()], read, lemmas, notes, texts };
}

/** A dictionary form as one word: lower case, marks that are not letters or accents removed. */
export const canonLemma = (l: string) => l.normalize("NFC").toLocaleLowerCase("el").replace(/[^\p{L}\p{M}]/gu, "");

/** How GLAUx files some words, which a reader would otherwise miss. Keyed by greekKey. */
const LEMMA_NOTES: Record<string, string> = {
  ειμι: "GLAUx files the forms of εἶμι “I shall go” (ἴθι, ἰών, ἴμεν…) under ἔρχομαι. Search ἔρχομαι to find them.",
  ερχομαι: "GLAUx files the forms of εἶμι “I shall go” (ἴθι, ἰών, ἴμεν…) under ἔρχομαι too, so they are included here.",
};

function pattern(w: string, script: Query["script"], notes: string[]): KeyPattern {
  const s = script === "auto" ? detectScript(w) : script;
  const pat = toPattern(w, s);
  if ("error" in pat) throw new QueryProblem(pat.error);
  if (pat.loose && !notes.some((n) => n.startsWith("Typed"))) notes.push("Typed e and o also find η and ω. Type ē and ō to mean only η and ω.");
  return pat;
}

/** Works matching a free-text filter on author or title. */
export function worksNamed(idx: CatalogIndex, text: string): Set<string> {
  const n = fold(text).trim();
  const out = new Set<string>();
  for (const a of idx.catalog.authors) {
    const an = fold(a.name);
    for (const w of a.works) if (an.includes(n) || fold(w.title).includes(n) || w.id === text || a.id === text) out.add(w.id);
  }
  return out;
}

