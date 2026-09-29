import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PATHS } from "./paths";
import { indexCatalog, greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

describe("reading paths", () => {
  it("have distinct ids and steps that are works in the catalogue with a Greek edition and a translation", () => {
    expect(new Set(PATHS.map((p) => p.id)).size).toBe(PATHS.length);
    for (const p of PATHS) for (const [w] of p.steps) {
      const work = idx.work.get(w);
      expect(work, `${p.id}: ${w}`).toBeTruthy();
      expect(greekEditions(work!).length, w).toBeGreaterThan(0);
      expect(hasTranslation(work!), `${w} has no translation`).toBe(true);
    }
  });
});
