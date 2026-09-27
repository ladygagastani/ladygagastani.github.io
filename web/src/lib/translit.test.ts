import { describe, expect, it } from "vitest";
import { transliterate } from "./translit";

describe("transliteration", () => {
  it("Iliad 1.1", () => {
    expect(transliterate("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος")).toBe("mēnin aeide thea Pēlēiadeō Achilēos");
  });
  it("rough breathings, diphthongs and double gamma", () => {
    expect(transliterate("ἡρώων")).toBe("hērōōn");
    expect(transliterate("οὐλομένην")).toBe("oulomenēn");
    expect(transliterate("αὐτοὺς")).toBe("autous");
    expect(transliterate("ἄγγελος")).toBe("angelos");
    expect(transliterate("ῥήτωρ")).toBe("rhētōr");
    expect(transliterate("Ἑλλάς")).toBe("Hellas");
    expect(transliterate("οἱ")).toBe("hoi");
    expect(transliterate("υἱός")).toBe("hyios");
  });
  it("iota subscript, and the Greek question mark and high dot", () => {
    expect(transliterate("τῷ λόγῳ")).toBe("tōi logōi");
    expect(transliterate("τί ἐστι;")).toBe("ti esti?");
    expect(transliterate("λέγει· καὶ")).toBe("legei; kai");
  });
});
