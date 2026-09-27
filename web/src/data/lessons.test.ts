import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { LESSONS } from "./lessons";
import { PARADIGMS } from "./paradigms";
import { indexCatalog, greekEditions, rawUrl, fold, type Catalog } from "@/lib/catalog";
import { parseTei } from "@/lib/tei/parse";
import { findRef } from "@/lib/tei/refs";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const plain = (s: string) => fold(s).replace(/[^\p{L}\s]/gu, "").replace(/\s+/g, " ").trim();

describe("lessons", () => {
  it("have unique ids and only use tables that exist", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    for (const l of LESSONS) for (const s of l.sections) if (s.kind === "table") expect(PARADIGMS.some((p) => p.id === s.paradigm), `${l.id}: ${s.paradigm}`).toBe(true);
  });

  it("give the right answer index for every check question", () => {
    for (const l of LESSONS) for (const s of l.sections) if (s.kind === "check") for (const q of s.items) expect(q.answer, q.q).toBeLessThan(q.options.length);
  });

  // Fetches the real files from GitHub; run with NETWORK=1.
  it.skipIf(!process.env.NETWORK)("quote real passages that are really there", async () => {
    for (const l of LESSONS) for (const s of l.sections) {
      if (s.kind !== "real") continue;
      for (const r of s.items) {
        const w = idx.work.get(r.work)!;
        const ed = greekEditions(w).find((t) => t.col === "perseus") ?? greekEditions(w)[0];
        const doc = parseTei(await (await fetch(rawUrl(idx, ed))).text());
        const i = findRef(doc, r.ref);
        expect(i, `${l.id}: ${r.label}`).toBeGreaterThanOrEqual(0);
        const text = doc.units[i].blocks.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ");
        expect(plain(text), `${l.id}: ${r.label}`).toContain(plain(r.quote));
      }
    }
  }, 180_000);
});
