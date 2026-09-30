import { describe, expect, it } from "vitest";
import { stageWord, unitLines } from "./scripts";
import type { Unit } from "./tei/types";

describe("a word taken back towards the way it was first written", () => {
  it("leaves today's print as it is", () => {
    expect(stageWord("μῆνιν", 0)).toBe("μῆνιν");
  });

  it("takes off accents and breathings, but keeps the iota under its vowel for now", () => {
    expect(stageWord("ἄειδε", 1)).toBe("αειδε");
    expect(stageWord("Ἀχιλῆος", 1)).toBe("Αχιληος");
    expect(stageWord("τῷ", 1)).toBe("τῳ");
    expect(stageWord("θεά,", 1)).toBe("θεα,");
  });

  it("writes capitals, with the lunate sigma and the iota beside its vowel", () => {
    expect(stageWord("Πηληϊάδεω", 2)).toBe("ΠΗΛΗΙΑΔΕΩ");
    expect(stageWord("ἀνδρῶν·", 2)).toBe("ΑΝΔΡΩΝ·");
    expect(stageWord("πολλὰς", 2)).toBe("ΠΟΛΛΑϹ");
    expect(stageWord("σοφός", 2)).toBe("ϹΟΦΟϹ");
    expect(stageWord("τῷ", 2)).toBe("ΤΩΙ");
    expect(stageWord("ᾠδή", 2)).toBe("ΩΙΔΗ");
  });

  it("then drops punctuation and elision marks", () => {
    expect(stageWord("ἀνδρῶν·", 3)).toBe("ΑΝΔΡΩΝ");
    expect(stageWord("δʼ", 3)).toBe("Δ");
    expect(stageWord("«θεά»,", 3)).toBe("ΘΕΑ");
  });
});

describe("a passage's lines", () => {
  it("keeps verse lines apart, joins inline pieces and leaves out headings and markers", () => {
    const u: Unit = { ref: ["1", "1"], blocks: [
      { t: "head", c: ["Α"] },
      { t: "l", n: "1", c: ["μῆνιν ἄειδε ", { m: "page", n: "1" }, "θεὰ"] },
      { t: "l", n: "2", c: ["οὐλομένην,   ἣ"] },
    ] };
    expect(unitLines(u)).toEqual(["μῆνιν ἄειδε θεὰ", "οὐλομένην, ἣ"]);
  });
});
