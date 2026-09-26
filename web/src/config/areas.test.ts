import { describe, expect, it } from "vitest";
import { AREAS, NAV } from "./areas";

describe("area names config", () => {
  const areas = Object.values(AREAS);

  it("gives every area a name, an English subtitle and an explanation", () => {
    for (const a of areas) {
      expect(a.name, a.id).toMatch(/^The /);
      expect(a.english.length, a.id).toBeGreaterThan(0);
      expect(a.origin.length, a.id).toBeGreaterThan(5);
      expect(a.fit.length, a.id).toBeGreaterThan(5);
    }
  });

  it("uses a unique site path for every area", () => {
    const hrefs = areas.map((a) => a.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const h of hrefs) expect(h.startsWith("/")).toBe(true);
  });

  it("only puts real areas in the main navigation", () => {
    for (const id of NAV) expect(AREAS[id]).toBeDefined();
  });
});
