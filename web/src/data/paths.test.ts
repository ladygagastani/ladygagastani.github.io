import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PATHS } from "./paths";
import { STARTS } from "./starts";
import { BEST_KNOWN } from "./best-known";
import { indexCatalog, greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);

/** A work the reader can open with its English beside the Greek. */
function expectReadable(id: string, where: string) {
  const work = idx.work.get(id);
  expect(work, `${where}: ${id}`).toBeTruthy();
  expect(greekEditions(work!).length, `${id} has no Greek edition`).toBeGreaterThan(0);
  expect(hasTranslation(work!), `${id} has no translation`).toBe(true);
}

describe("reading paths", () => {
  it("have distinct ids and steps that are works with a Greek edition and a translation", () => {
    expect(new Set(PATHS.map((p) => p.id)).size).toBe(PATHS.length);
    for (const p of PATHS) for (const [w] of p.steps) expectReadable(w, p.id);
  });
});

describe("suggested starting points", () => {
  it("are distinct works with a Greek edition and a translation", () => {
    expect(new Set(STARTS).size).toBe(STARTS.length);
    for (const w of STARTS) expectReadable(w, "starts");
  });
});

describe("best-known works", () => {
  it("belong to their author and can be read with a translation", () => {
    for (const [author, w] of Object.entries(BEST_KNOWN)) {
      expect(w.startsWith(author + "."), w).toBe(true);
      expectReadable(w, "best-known");
    }
  });
});
