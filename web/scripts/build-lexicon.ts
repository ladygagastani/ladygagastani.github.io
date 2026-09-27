/**
 * The Word Study index: for every dictionary word (lemma) in GLAUx, every form it takes with its
 * grammar and how often, and how often it occurs in each work. Built from the GLAUx word packs
 * (public/data/words, from pipeline/build_words.py), so the counts are GLAUx's own.
 *
 *   npx tsx scripts/build-lexicon.ts
 *
 * Output: public/data/lexicon/
 *   _meta.json   { works: [workId, words][], tags: string[], lemmas, forms }
 *   <shard>.json { [lemma]: { n, f: [form, tag, count][], w: [work, count][] } }
 * The shard is the first two letters of the lemma's accent-free key, as in the search index.
 * Forms: capital letters at the start of a sentence are lowered and a grave accent is written as
 * an acute (it only shows the word's place in the sentence), so each form is counted once.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { WordPack } from "../src/lib/lookup/words";
import { greekKey, shardOf } from "../src/lib/search/codec";
import { canonLemma, displayForm } from "../src/lib/lexicon";

const PACKS = "public/data/words";
const OUT = "public/data/lexicon";

interface Entry { n: number; forms: Map<string, number>; works: Map<number, number> }
const lemmas = new Map<string, Entry>();
const tagIds = new Map<string, number>();
const works: [string, number][] = [];

const files = readdirSync(PACKS).filter((f) => f.endsWith(".json") && !f.startsWith("_")).sort();
for (const f of files) {
  const pack = JSON.parse(readFileSync(join(PACKS, f), "utf8")) as WordPack;
  const wi = works.length;
  let words = 0;
  for (const [, , forms, lem, tags] of pack.units) {
    const fs = forms.split(" ");
    for (let j = 0; j < fs.length; j++) {
      const tag = pack.tags[tags[j]];
      if (tag.startsWith("u")) continue;                      // punctuation
      const lemma = canonLemma(pack.lemmas[lem[j]]);
      if (!greekKey(lemma)) continue;
      words++;
      let e = lemmas.get(lemma);
      if (!e) lemmas.set(lemma, (e = { n: 0, forms: new Map(), works: new Map() }));
      e.n++;
      let t = tagIds.get(tag);
      if (t === undefined) { t = tagIds.size; tagIds.set(tag, t); }
      const fk = `${displayForm(fs[j], lemma)}\t${t}`;
      e.forms.set(fk, (e.forms.get(fk) ?? 0) + 1);
      e.works.set(wi, (e.works.get(wi) ?? 0) + 1);
    }
  }
  works.push([pack.work, words]);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const shards = new Map<string, Record<string, unknown>>();
let formCount = 0;
for (const [lemma, e] of lemmas) {
  const s = shardOf(greekKey(lemma));
  if (!shards.has(s)) shards.set(s, {});
  const f = [...e.forms].map(([k, n]) => { const [form, t] = k.split("\t"); return [form, +t, n]; }).sort((a, b) => (b[2] as number) - (a[2] as number));
  formCount += f.length;
  shards.get(s)![lemma] = { n: e.n, f, w: [...e.works].sort((a, b) => b[1] - a[1]) };
}
let bytes = 0;
for (const [s, data] of shards) {
  const body = JSON.stringify(data);
  bytes += body.length;
  writeFileSync(join(OUT, `${s}.json`), body);
}
writeFileSync(join(OUT, "_meta.json"), JSON.stringify({ works, tags: [...tagIds.keys()], lemmas: lemmas.size, forms: formCount }));
console.log(`${lemmas.size.toLocaleString()} dictionary words, ${formCount.toLocaleString()} forms, ${works.length} works, ${shards.size} shards, ${(bytes / 1e6).toFixed(1)} MB`);
