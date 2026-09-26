import { describe, expect, it } from "vitest";
import { readTag } from "./postag";

describe("reading grammar tags", () => {
  it("verbs", () => {
    expect(readTag("v2spma---")).toEqual({ pos: "verb", detail: "present active imperative · 2nd person singular" });
    expect(readTag("v3saia---")).toEqual({ pos: "verb", detail: "aorist active indicative · 3rd person singular" });
    expect(readTag("v3siie---")).toEqual({ pos: "verb", detail: "imperfect middle or passive indicative · 3rd person singular" });
  });
  it("participles and infinitives", () => {
    expect(readTag("v-sapmfa-")).toEqual({ pos: "participle", detail: "aorist middle · accusative singular feminine" });
    expect(readTag("v--pna---")).toEqual({ pos: "infinitive", detail: "present active" });
  });
  it("nouns, adjectives and little words", () => {
    expect(readTag("n-s---fa-")).toEqual({ pos: "noun", detail: "accusative singular feminine" });
    expect(readTag("a-p---na-")).toEqual({ pos: "adjective", detail: "accusative plural neuter" });
    expect(readTag("b--------")).toEqual({ pos: "coordinating conjunction", detail: "" });
    expect(readTag("a-s---mnc")).toEqual({ pos: "adjective", detail: "nominative singular masculine comparative" });
  });
});
