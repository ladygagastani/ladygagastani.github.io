/**
 * Print a passage from the local corpus (pipeline/.cache/corpus), Greek and translation, exactly as
 * the reader shows them. For writing wiki entries: quotations are copied from here, never typed.
 *
 *   npx tsx scripts/passage.ts tlg0003.tlg001 5.89            the default edition and translation
 *   npx tsx scripts/passage.ts tlg0003.tlg001 5.89 5.90       a range
 *   npx tsx scripts/passage.ts find <author or title words>   work ids matching a name
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, translations, versionOf, type Catalog, type CatText } from "../src/lib/catalog";
import { parseTei } from "../src/lib/tei/parse";
import { findRef } from "../src/lib/tei/refs";
import { translationPieces, placePieces, alignChunk } from "../src/lib/tei/align";
import type { Block } from "../src/lib/tei/types";

const CORPUS = "../pipeline/.cache/corpus";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const text = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" / ").replace(/\s+/g, " ").trim();
const load = (t: CatText) => { const f = join(CORPUS, t.col, t.path); return existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null; };

const [a, b, c] = process.argv.slice(2);
if (a === "find") {
  const q = process.argv.slice(3).join(" ").toLowerCase();
  for (const au of idx.catalog.authors) for (const w of au.works) {
    if (`${au.name} ${w.title}`.toLowerCase().includes(q)) console.log(w.id, "|", au.name, "|", w.title, "|", w.texts.map((t) => versionOf(t.urn)).join(", "));
  }
} else {
  const w = idx.work.get(a);
  if (!w) throw new Error(`no work ${a}`);
  const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
  const tr = translations(w)[0];
  const g = load(ed);
  if (!g) throw new Error(`${ed.path} is not in the local corpus`);
  const i = findRef(g, b), j = findRef(g, c ?? b);
  if (i < 0) throw new Error(`no passage ${b} in ${versionOf(ed.urn)} (levels ${g.levels.join(".")}, first refs ${g.units.slice(0, 3).map((u) => u.ref.join(".")).join(" ")})`);
  let end = j;
  const toKey = g.units[j].ref.join(".");
  while (end + 1 < g.units.length && g.units[end + 1].ref.join(".").startsWith(toKey + ".")) end++;
  console.log(`# ${w.title} · ${versionOf(ed.urn)} (${g.levels.join(".")})${tr ? ` · translation ${versionOf(tr.urn)}: ${tr.desc ?? ""}` : ""}`);
  const t = tr ? load(tr) : null;
  const rows = alignChunk(g, { first: i, last: end }, t ? placePieces(g, translationPieces(g, t)) : null);
  for (const r of rows) {
    console.log(`\n[${r.key}]`);
    for (const u of r.greek) console.log(`  ${u.ref.join(".")}: ${text(u.blocks)}`);
    if (r.trans.length) console.log(`  EN: ${text(r.trans)}`);
  }
}
