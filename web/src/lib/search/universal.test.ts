import { describe, expect, it } from "vitest";
import { matchActions, rank, score } from "./universal";

describe("universal search matching", () => {
  it("scores a whole match over a start over a word start over anything inside", () => {
    expect(score("Sparta", "sparta")).toBe(4);
    expect(score("Spartan upbringing", "spart")).toBe(3);
    expect(score("The Spartan upbringing", "upbr")).toBe(2);
    expect(score("Hellespont", "spont")).toBe(1);
    expect(score("Athens", "sparta")).toBe(0);
  });

  it("ignores accents, breathings and case, and needs every word", () => {
    expect(score("Ἀχιλλεύς", "αχιλλευς")).toBe(4);
    expect(score("How a dictionary lists a word", "dictionary word")).toBe(2);
    expect(score("How a dictionary lists a word", "dictionary sparta")).toBe(0);
  });

  it("ranks titles above descriptions and keeps the order of ties", () => {
    const items = [
      { t: "Third declension", d: "nouns like πόλις" },
      { t: "Which Greek?", d: "Homer and the dialects" },
      { t: "Homer's rhythm", d: "the hexameter" },
    ];
    const r = rank(items, "homer", (x) => ({ main: [x.t], more: [x.d] }), 5);
    expect(r.map((x) => x.t)).toEqual(["Homer's rhythm", "Which Greek?"]);
    expect(rank(items, "zzz", (x) => ({ main: [x.t] }), 5)).toEqual([]);
  });

  it("offers actions for what people type to change the page", () => {
    expect(matchActions("dark")[0].id).toBe("theme-dark");
    expect(matchActions("dark mode")[0].id).toBe("theme-dark");
    expect(matchActions("bigger")[0].id).toBe("bigger");
    expect(matchActions("gentium").map((a) => a.id)).toEqual(["face-gentium"]);
    expect(matchActions("font").length).toBeGreaterThan(1);
    expect(matchActions("d")).toEqual([]);
    expect(matchActions("λογος")).toEqual([]);
  });
});
