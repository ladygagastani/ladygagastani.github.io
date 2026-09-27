import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { century, familyOf, periodOf, FAMILIES } from "./works-meta";

describe("work metadata", () => {
  it("names centuries", () => {
    expect(century(-800)).toBe("8th c. BC");
    expect(century(-500)).toBe("5th c. BC");
    expect(century(1)).toBe("1st c. AD");
    expect(century(101)).toBe("2nd c. AD");
    expect(century(201)).toBe("3rd c. AD");
  });
  it("groups centuries into periods", () => {
    expect(periodOf(-700)).toMatch(/^Archaic/);
    expect(periodOf(-400)).toMatch(/^Classical/);
    expect(periodOf(-200)).toMatch(/^Hellenistic/);
    expect(periodOf(101)).toMatch(/^Roman/);
    expect(periodOf(301)).toMatch(/^Late Antique/);
  });
  it("puts every genre in the data into a family", () => {
    const works = JSON.parse(readFileSync("public/data/works-meta.json", "utf8")).works as Record<string, { genre: string | null }>;
    const missing = [...new Set(Object.values(works).map((w) => w.genre).filter((g) => g && !familyOf(g)))];
    expect(missing).toEqual([]);
    expect(FAMILIES.length).toBeGreaterThan(8);
  });
});
