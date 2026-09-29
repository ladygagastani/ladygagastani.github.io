import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { authorRows, eraOfYear, type AuthorMeta } from "./authors-meta";
import { centuryBars, eraStats } from "./eras";
import type { Catalog } from "./catalog";
import type { WorkMeta } from "./works-meta";

const cat = JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog;
const am = (JSON.parse(readFileSync("public/data/authors-meta.json", "utf8")) as { authors: Record<string, AuthorMeta> }).authors;
const wm = (JSON.parse(readFileSync("public/data/works-meta.json", "utf8")) as { works: Record<string, WorkMeta> }).works;
const rows = authorRows(cat.authors, am, wm);

describe("era statistics", () => {
  const stats = eraStats(rows);
  it("count every placed author once, and no work twice", () => {
    const placed = rows.filter((r) => r.era).length;
    expect(stats.reduce((n, s) => n + s.authors, 0)).toBe(placed);
    expect(stats.reduce((n, s) => n + s.works, 0)).toBe(rows.filter((r) => r.era).reduce((n, r) => n + r.works, 0));
    expect(placed).toBeGreaterThan(280);
  });
  it("put Homer in the Archaic period and Plato in the Classical", () => {
    expect(stats[0].biggest.map((b) => b.row.a.name)).toContain("Homer");
    expect(stats.find((s) => s.era.id === "classical")!.biggest.map((b) => b.row.a.name)).toContain("Plato");
  });
  it("never claim more dialect coverage than there are works", () => {
    for (const s of stats) { expect(s.covered).toBeLessThanOrEqual(s.works); expect(s.dialects.reduce((n, d) => n + d[1], 0)).toBe(s.covered); }
  });
});

describe("centuries chart", () => {
  const bars = centuryBars(rows, eraOfYear);
  it("is continuous from the earliest century to the latest, with no year zero", () => {
    for (let i = 1; i < bars.length; i++) {
      const gap = bars[i].key - bars[i - 1].key;
      expect(gap === 1 || (bars[i - 1].key === -1 && bars[i].key === 1), `${bars[i - 1].label} → ${bars[i].label}`).toBe(true);
    }
  });
  it("holds every placed author exactly once", () => {
    expect(bars.reduce((n, b) => n + b.authors, 0)).toBe(rows.filter((r) => r.year !== null).length);
  });
});
