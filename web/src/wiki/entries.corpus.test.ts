/**
 * Checks every Painted Stoa entry against the texts themselves (needs pipeline/.cache/corpus):
 * every citation opens a real passage, every Greek quotation is found word for word in the passage
 * it cites, and every translation taken from the library is found word for word in that translation.
 *
 *   CORPUS=1 npx vitest run src/wiki/entries.corpus.test.ts
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, greekEditions, translations, type Catalog, type CatText } from "@/lib/catalog";
import { parseTei } from "@/lib/tei/parse";
import { findRef } from "@/lib/tei/refs";
import type { Block, TeiDoc } from "@/lib/tei/types";
import { ENTRIES } from "./index";
import { blocks, inline, linksIn } from "./markup";

const CORPUS = "../pipeline/.cache/corpus";
const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const docs = new Map<string, TeiDoc | null>();
function load(t: CatText | undefined) {
  if (!t) return null;
  if (!docs.has(t.urn)) { const f = join(CORPUS, t.col, t.path); docs.set(t.urn, existsSync(f) ? parseTei(readFileSync(f, "utf8")) : null); }
  return docs.get(t.urn)!;
}
const greekOf = (work: string) => { const w = idx.work.get(work)!; return load(greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0]); };
const trOf = (work: string) => load(translations(idx.work.get(work)!)[0]);
/** Letters and spaces only, NFC, apostrophes unified: quotations are compared on their words. */
const norm = (s: string) => s.normalize("NFC").replace(/[’'ʼ᾽]/g, "’").replace(/[“”"«»]/g, "").replace(/\s+/g, " ").trim();
const textOf = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ");

describe.skipIf(!process.env.CORPUS).each(ENTRIES.map((e) => [e.slug, e] as const))("entry %s against the texts", (slug, e) => {
  const body = blocks(e.body);
  const { cites } = linksIn([...body, { p: inline(e.hook) }]);
  const all = [...cites, ...e.readIt, ...e.primary, ...Object.values(e.quotes ?? {})];

  it("cites passages that exist", () => {
    for (const c of all) {
      const d = greekOf(c.work);
      expect(d, `${slug}: ${c.work} is not in the local corpus`).toBeTruthy();
      for (const r of [c.ref, ...("to" in c && c.to ? [c.to] : [])]) {
        const i = findRef(d!, r);
        expect(i, `${slug}: ${c.work} ${r}`).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("quotes the Greek word for word, and the library's translation word for word", () => {
    for (const [id, q] of Object.entries(e.quotes ?? {})) {
      const d = greekOf(q.work)!;
      const i = findRef(d, q.ref);
      // the cited unit, the one before, and up to six after (verse quotations run over several lines)
      const near = norm(d.units.slice(Math.max(0, i - 1), i + 7).map((u) => textOf(u.blocks)).join(" "));
      expect(near.includes(norm(q.grc)), `${slug}/${id}: Greek not found at ${q.ref}`).toBe(true);
      if (q.trFrom === "corpus") {
        const t = trOf(q.work);
        expect(t, `${slug}/${id}: no translation in the corpus`).toBeTruthy();
        const whole = norm(t!.units.map((u) => textOf(u.blocks)).join(" "));
        expect(whole.includes(norm(q.tr)), `${slug}/${id}: translation not found`).toBe(true);
      }
    }
  });
});
