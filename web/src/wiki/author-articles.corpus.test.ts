/**
 * Checks every published author article against the texts themselves (needs pipeline/.cache/corpus):
 * every passage it cites opens, every Greek quotation «…» is found in a text it cites, and every English
 * quotation “…” is found word for word in a translation it cites, unless the article lists it as an
 * `outsideQuote` (our own translation, or words from a web source).
 *
 *   CORPUS=1 npx vitest run src/wiki/author-articles.corpus.test.ts
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, translations, type Catalog, type CatText } from "@/lib/catalog";
import { parseTei } from "@/lib/tei/parse";
import { findRef } from "@/lib/tei/refs";
import type { Block, TeiDoc } from "@/lib/tei/types";
import { ARTICLES as PUBLISHED, type AuthorArticle } from "./author-articles";
import { blocks, linksIn } from "./markup";

const CORPUS = "../pipeline/.cache/corpus";
/** ARTICLE=tlg0014 checks that one article file instead (one being written, not yet in ARTICLES). */
const one = process.env.ARTICLE;
const ARTICLES: Record<string, AuthorArticle> = one
  ? Object.fromEntries(Object.values((await import(`./authors/${one}.ts`)) as Record<string, AuthorArticle>).map((a) => [a.id, a]))
  : PUBLISHED;
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const docs = new Map<string, TeiDoc | null>();
function load(t: CatText | undefined) {
  if (!t) return null;
  if (!docs.has(t.urn)) { const f = join(CORPUS, t.col, t.path); docs.set(t.urn, existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null); }
  return docs.get(t.urn)!;
}
const textOf = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ");
const plainOf = (d: TeiDoc) => d.units.map((u) => textOf(u.blocks)).join(" ");
/** Words only: NFC, lower case, quotes and dashes unified, punctuation dropped. */
const norm = (s: string) => s.normalize("NFD").replace(/̀/g, "́").normalize("NFC").toLowerCase().replace(/[’'ʼ᾽‘]/g, "").replace(/[“”"«»]/g, "").replace(/[—–-]/g, " ").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

describe.skipIf(!process.env.CORPUS).each(Object.values(ARTICLES).map((a) => [a.id, a] as const))("author article %s against the texts", (id, a) => {
  const prose = [a.summary, a.transmission, a.variants, ...a.timeline.map((t) => t.what), ...a.editions.map((e) => e.text + " " + (e.note ?? ""))].join("\n\n");
  const cited = new Set<string>();
  for (const s of a.sources) if (s.cite) cited.add(s.cite.work);
  for (const c of linksIn(blocks(a.summary).concat(blocks(a.transmission), blocks(a.variants))).cites) cited.add(c.work);

  it("cites passages that exist", () => {
    const all = [...a.sources.flatMap((s) => (s.cite ? [s.cite] : [])), ...linksIn(blocks(a.summary).concat(blocks(a.transmission), blocks(a.variants))).cites];
    for (const c of all) {
      const w = idx.work.get(c.work);
      expect(w, `${id}: ${c.work} is not in the catalogue`).toBeTruthy();
      const g = greekEditions(w!); const d = load(g.find((t) => t.col === "perseus") ?? g[0]);
      expect(d, `${id}: ${c.work} is not in the local corpus`).toBeTruthy();
      for (const r of [c.ref, ...(c.to ? [c.to] : [])]) expect(findRef(d!, r), `${id}: ${c.work} ${r}`).toBeGreaterThanOrEqual(0);
    }
  });

  it("quotes the Greek word for word", () => {
    const greek = [...cited].map((w) => { const g = greekEditions(idx.work.get(w)!); return norm(plainOf(load(g.find((t) => t.col === "perseus") ?? g[0])!)); });
    for (const m of prose.matchAll(/«([^»]+)»/g)) expect(greek.some((t) => t.includes(norm(m[1]))), `${id}: Greek not found: ${m[1]}`).toBe(true);
  });

  it("quotes the English word for word, or says where it is from", () => {
    const eng = [...cited].flatMap((w) => translations(idx.work.get(w)!).map((t) => load(t))).filter(Boolean).map((d) => norm(plainOf(d!)));
    const outside = (a.outsideQuotes ?? []).map(norm);
    for (const m of prose.matchAll(/“([^”]{10,})”/g)) {
      for (const part of m[1].split("…").map((p) => p.replace(/[,;.]+$/, "")).filter((p) => norm(p).split(" ").length >= 3)) {
        const n = norm(part);
        const ok = eng.some((t) => t.includes(n)) || outside.some((o) => o.includes(n) || n.includes(o));
        expect(ok, `${id}: not found in the cited translations and not in outsideQuotes: “${part}”`).toBe(true);
      }
    }
    // everything listed as outside must really be used
    for (const o of a.outsideQuotes ?? []) expect(norm(prose).includes(norm(o)), `${id}: outsideQuote unused: ${o}`).toBe(true);
  });
});
