import { describe, expect, it } from "vitest";
import { PASSAGE, LEXICON, referenceLinks } from "./iliad-sample";

describe("passage of the day sample", () => {
  const words = new Set(PASSAGE.lines.flatMap(([, t]) => t.split(/[\s,.;·]+/).filter(Boolean)));

  it("only has look-up entries for words that are actually in the passage", () => {
    for (const form of Object.keys(LEXICON)) expect(words.has(form), form).toBe(true);
  });

  it("numbers the lines 1 to 7 in order", () => {
    expect(PASSAGE.lines.map(([n]) => n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("builds reference links from the headword and the form", () => {
    const links = referenceLinks("μῆνις", "μῆνιν");
    expect(links.map((l) => l.name)).toEqual(["Logeion", "Perseus", "Wiktionary"]);
    expect(decodeURIComponent(links[0].href)).toBe("https://logeion.uchicago.edu/μῆνις");
    expect(decodeURIComponent(links[1].href)).toContain("l=μῆνιν&la=greek");
  });
});
