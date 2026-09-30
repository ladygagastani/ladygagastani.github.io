import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { LESSONS } from "./lessons";
import { GUIDES } from "./guides";
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

  it("mark words that are really in their sentences", () => {
    for (const l of LESSONS) for (const s of l.sections) {
      if (s.kind === "timeline") for (const t of s.items) expect(t.grc.split(/\s+/), `${l.id}: ${t.ptc} / ${t.verb}`).toEqual(expect.arrayContaining([t.ptc, t.verb]));
      if (s.kind === "voice") for (const v of s.items) expect(v.grc, `${l.id}: ${v.verb}`).toContain(v.verb);
    }
  });

  it("give the right answer index for every check question", () => {
    for (const l of LESSONS) for (const s of l.sections) if (s.kind === "check") for (const q of s.items) expect(q.answer, q.q).toBeLessThan(q.options.length);
  });

  // Fetches the real files from GitHub; run with NETWORK=1.
  it.skipIf(!process.env.NETWORK)("quote real passages that are really there", async () => {
    for (const l of [...LESSONS, ...GUIDES]) for (const s of l.sections) {
      if (s.kind !== "real" && s.kind !== "timeline") continue;
      for (const r of s.items.map((x) => ({ ...x, quote: "quote" in x ? x.quote : x.grc }))) {
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
