import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PASSAGES } from "./passages";
import { indexCatalog, greekEditions, rawUrl, type Catalog } from "@/lib/catalog";
import { parseTei } from "@/lib/tei/parse";
import { findRef } from "@/lib/tei/refs";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

describe("passages of the day", () => {
  it("are all works in the catalogue with a Greek edition", () => {
    for (const p of PASSAGES) expect(greekEditions(idx.work.get(p.work)!).length, p.label).toBeGreaterThan(0);
  });

  // Fetches the real files from GitHub; run with NETWORK=1.
  it.skipIf(!process.env.NETWORK)("point at references that exist, in order", async () => {
    for (const p of PASSAGES) {
      const ed = greekEditions(idx.work.get(p.work)!).find((t) => t.col === "perseus") ?? greekEditions(idx.work.get(p.work)!)[0];
      const doc = parseTei(await (await fetch(rawUrl(idx, ed))).text());
      const a = findRef(doc, p.from), b = findRef(doc, p.to);
      expect(a, `${p.label}: ${p.from}`).toBeGreaterThanOrEqual(0);
      expect(b, `${p.label}: ${p.to}`).toBeGreaterThanOrEqual(a);
      expect(doc.units[a].ref.join("."), p.label).toBe(p.from);
    }
  }, 120_000);
});
