/**
 * Build the search index from the original texts (pipeline/.cache/corpus, from fetch_corpus.py)
 * and the GLAUx word packs (public/data/words). Uses the site's own TEI reader, so every
 * reference and word position matches what the reader shows.
 *
 *   npx tsx scripts/build-search.ts grc    Greek word forms (accent-insensitive), all Greek editions
 *   npx tsx scripts/build-search.ts eng    English words, all English translations
 *   npx tsx scripts/build-search.ts lem    dictionary forms + grammar (GLAUx), and the grammar index
 *
 * Output: public/data/search/{texts.json, tags.json, grc/, eng/, lem/, tag/}
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, type Catalog, type CatText } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import type { WordPack } from "../src/lib/lookup/words";
import { greekKey, englishKey, shardOf, unitWords, englishWords, packShard, writeVarint } from "../src/lib/search/codec";
import { alignStream } from "../src/lib/search/place";
import type { TeiDoc } from "../src/lib/tei/types";

const CORPUS = "../pipeline/.cache/corpus";
const OUT = "public/data/search";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

// ------------------------------------------------------------ the texts, with stable ids
interface TextEntry { id: number; urn: string; work: string; lang: string; kind: string }
const texts: (TextEntry & { t: CatText })[] = [];
for (const a of idx.catalog.authors) for (const w of a.works) for (const t of w.texts) {
  if ((t.kind === "edition" && t.lang === "grc") || (t.kind === "translation" && t.lang === "eng")) {
    texts.push({ id: texts.length, urn: t.urn, work: w.id, lang: t.lang!, kind: t.kind, t });
  }
}
const load = (t: CatText): TeiDoc | null => {
  const f = join(CORPUS, t.col, t.path);
  return existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null;
};

// ------------------------------------------------------------ growing, already-sorted posting lists
class KeyWriter {
  bytes = new Uint8Array(16); len = 0; count = 0; pt = 0; pu = 0;
  private push(v: number) {
    const tmp: number[] = [];
    writeVarint(tmp, v);
    if (this.len + tmp.length > this.bytes.length) { const b = new Uint8Array(this.bytes.length * 2 + tmp.length); b.set(this.bytes); this.bytes = b; }
    this.bytes.set(tmp, this.len); this.len += tmp.length;
  }
  add(text: number, unit: number, word: number, extra: number[] = []) {
    const dt = text - this.pt;
    this.push(dt); this.push(dt > 0 ? unit : unit - this.pu); this.push(word);
    for (const e of extra) this.push(e);
    this.pt = text; this.pu = unit; this.count++;
  }
}

function writeShards(dir: string, keys: Map<string, KeyWriter>, shardFor: (k: string) => string) {
  rmSync(join(OUT, dir), { recursive: true, force: true });
  mkdirSync(join(OUT, dir), { recursive: true });
  const byShard = new Map<string, string[]>();
  for (const k of keys.keys()) { const s = shardFor(k); if (!byShard.has(s)) byShard.set(s, []); byShard.get(s)!.push(k); }
  let bytes = 0;
  const index: Record<string, [number, number]> = {};
  for (const [s, ks] of byShard) {
    ks.sort();
    const header = { k: [] as string[], o: [] as number[], n: [] as number[] };
    const parts: Uint8Array[] = [];
    let off = 0;
    for (const k of ks) {
      const w = keys.get(k)!;
      header.k.push(k); header.o.push(off); header.n.push(w.count);
      parts.push(w.bytes.subarray(0, w.len)); off += w.len;
    }
    const body = new Uint8Array(off);
    let p = 0;
    for (const part of parts) { body.set(part, p); p += part.length; }
    const buf = packShard(header, [] as number[]);
    const file = new Uint8Array(buf.length + body.length);
    file.set(buf); file.set(body, buf.length);
    writeFileSync(join(OUT, dir, `${s}.bin`), file);
    bytes += file.length;
    index[s] = [file.length, ks.length];
  }
  writeFileSync(join(OUT, dir, "_index.json"), JSON.stringify(index));
  console.log(`${dir}: ${keys.size.toLocaleString()} keys in ${byShard.size} shards, ${(bytes / 1e6).toFixed(0)} MB`);
}

// ------------------------------------------------------------ passes
function passGreek() {
  const keys = new Map<string, KeyWriter>();
  let words = 0;
  for (const e of texts) {
    if (e.lang !== "grc") continue;
    const d = load(e.t);
    if (!d) continue;
    d.units.forEach((u, ui) => unitWords(u).forEach((w, wi) => {
      const k = greekKey(w);
      if (!k) return;
      let kw = keys.get(k);
      if (!kw) keys.set(k, (kw = new KeyWriter()));
      kw.add(e.id, ui, wi); words++;
    }));
  }
  console.log(`Greek: ${words.toLocaleString()} words`);
  writeShards("grc", keys, shardOf);
}

function passEnglish() {
  const keys = new Map<string, KeyWriter>();
  let words = 0;
  for (const e of texts) {
    if (e.lang !== "eng") continue;
    const d = load(e.t);
    if (!d) continue;
    d.units.forEach((u, ui) => englishWords(u).forEach((w, wi) => {
      const k = englishKey(w);
      if (k.length < 2) return;
      let kw = keys.get(k);
      if (!kw) keys.set(k, (kw = new KeyWriter()));
      kw.add(e.id, ui, wi); words++;
    }));
  }
  console.log(`English: ${words.toLocaleString()} words`);
  writeShards("eng", keys, shardOf);
}

/** GLAUx analyses, placed on the exact word of the reader's text. */
function passLemmas() {
  const lemmas = new Map<string, KeyWriter>();
  const tagIds = new Map<string, number>();
  const tagKeys = new Map<string, KeyWriter>();
  let placed = 0, missed = 0;
  const perWork: [string, number, number][] = [];
  const packs = new Set(readdirSync("public/data/words").filter((f) => !f.startsWith("_")).map((f) => f.replace(/\.json$/, "")));
  // one Greek edition per work: the one the reader opens by default
  for (const e of texts) {
    if (e.lang !== "grc" || !packs.has(e.work)) continue;
    const w = idx.work.get(e.work)!;
    const def = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
    if (def.urn !== e.urn) continue;
    const d = load(e.t);
    if (!d) continue;
    const pack = JSON.parse(readFileSync(`public/data/words/${e.work}.json`, "utf8")) as WordPack;
    // the reader's words, in reading order, and where each one is
    const tei: string[] = [], posUnit: number[] = [], posWord: number[] = [];
    d.units.forEach((u, ui) => unitWords(u).forEach((w, wi) => { tei.push(greekKey(w)); posUnit.push(ui); posWord.push(wi); }));
    // GLAUx's words in its own order (punctuation left out: the reader does not make it clickable)
    const toks: { f: string; lemma: string; tag: string }[] = [];
    for (const [, , forms, lem, tags] of pack.units) forms.split(" ").forEach((f, j) => {
      const k = greekKey(f);
      if (k) toks.push({ f: k, lemma: pack.lemmas[lem[j]], tag: pack.tags[tags[j]] });
    });
    const at = alignStream(toks.map((t) => t.f), tei);
    const order = toks.map((_, i) => i).filter((i) => at[i] >= 0).sort((x, y) => at[x] - at[y]);   // postings go in text order
    const wp = order.length, wm = toks.length - wp;
    order.forEach((i) => {
      const t = toks[i], hit = at[i];
      const ui = posUnit[hit], wi = posWord[hit];
      let tagId = tagIds.get(t.tag);
      if (tagId === undefined) { tagId = tagIds.size; tagIds.set(t.tag, tagId); }
      // keyed by the dictionary form itself, accents and all: εἰμί "be" and εἶμι "go" stay apart
      const lk = t.lemma.normalize("NFC");
      if (!greekKey(lk)) return;
      let lw = lemmas.get(lk);
      if (!lw) lemmas.set(lk, (lw = new KeyWriter()));
      lw.add(e.id, ui, wi, [tagId]);
      let tw = tagKeys.get(t.tag);
      if (!tw) tagKeys.set(t.tag, (tw = new KeyWriter()));
      tw.add(e.id, ui, wi);
    });
    placed += wp; missed += wm;
    perWork.push([e.work, wp, wm]);
  }
  writeFileSync(join(OUT, "lem-report.json"), JSON.stringify(perWork.sort((x, y) => y[2] - x[2])));
  console.log(`Lemmas: ${placed.toLocaleString()} analysed words placed on the text, ${missed.toLocaleString()} not matched (${((100 * missed) / (placed + missed)).toFixed(1)}%)`);
  writeShards("lem", lemmas, (k) => shardOf(greekKey(k)));   // found by accent-free key, then told apart
  const tags = [...tagIds.keys()];
  writeFileSync(join(OUT, "tags.json"), JSON.stringify(tags));
  const tagByKey = new Map([...tagKeys].map(([t, w]) => [String(tagIds.get(t)), w]));
  writeShards("tag", tagByKey, (k) => k);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "texts.json"), JSON.stringify(texts.map(({ id, urn, work, lang, kind }) => ({ id, urn, work, lang, kind }))));
const pass = process.argv[2];
if (pass === "grc") passGreek();
else if (pass === "eng") passEnglish();
else if (pass === "lem") passLemmas();
else console.log("Usage: npx tsx scripts/build-search.ts grc|eng|lem");
