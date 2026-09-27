import { describe, expect, it } from "vitest";
import { useAcademy, dueCards, streak, previewIntervals, knownLemmas, Rating } from "./academy";

describe("academy progress", () => {
  it("adds a word once and makes it due straight away", () => {
    const s = useAcademy.getState();
    expect(s.addCard("λόγος", "word", "core")).toBe(true);
    expect(useAcademy.getState().addCard("λόγος", "word", "core")).toBe(false);
    expect(dueCards(useAcademy.getState().deck).map((c) => c.lemma)).toContain("λόγος");
  });

  it("schedules a card later after a good answer, and shows the intervals", () => {
    const c = useAcademy.getState().deck["λόγος"];
    const iv = previewIntervals(c);
    expect(Object.keys(iv)).toEqual(["again", "hard", "good", "easy"]);
    useAcademy.getState().review("λόγος", Rating.Easy);
    expect(dueCards(useAcademy.getState().deck).map((x) => x.lemma)).not.toContain("λόγος");
    expect(knownLemmas(useAcademy.getState().deck).has("λόγος")).toBe(true);
  });

  it("counts a streak of days ending today", () => {
    const d = new Date();
    const fmt = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    const days = [0, 1, 2].map((k) => { const x = new Date(d); x.setDate(d.getDate() - k); return fmt(x); });
    expect(streak(days)).toBe(3);
    expect(streak([])).toBe(0);
  });
});
