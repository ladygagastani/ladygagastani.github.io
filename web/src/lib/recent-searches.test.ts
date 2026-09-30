import { beforeEach, describe, expect, it } from "vitest";
import { addRecentSearch, clearRecentSearches, MAX_RECENT, recentSearches, removeRecentSearch } from "./recent-searches";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
});

describe("recent searches", () => {
  it("keeps the newest first, without repeats, and at most a few", () => {
    addRecentSearch("λόγος");
    addRecentSearch("  Il. 1.1 ");
    addRecentSearch("λόγος");
    expect(recentSearches()).toEqual(["λόγος", "Il. 1.1"]);
    for (let i = 0; i < 20; i++) addRecentSearch(`q${i}`);
    expect(recentSearches()).toHaveLength(MAX_RECENT);
    expect(recentSearches()[0]).toBe("q19");
  });

  it("treats a different case as the same search, and ignores empty ones", () => {
    addRecentSearch("Sparta");
    addRecentSearch("sparta");
    addRecentSearch("   ");
    expect(recentSearches()).toEqual(["sparta"]);
  });

  it("removes one, or all", () => {
    addRecentSearch("a"); addRecentSearch("b");
    expect(removeRecentSearch("a")).toEqual(["b"]);
    expect(clearRecentSearches()).toEqual([]);
    expect(recentSearches()).toEqual([]);
  });

  it("survives broken or missing storage", () => {
    store.set("mathesis:searches", "{not json");
    expect(recentSearches()).toEqual([]);
    (globalThis as { localStorage?: unknown }).localStorage = undefined;
    expect(recentSearches()).toEqual([]);
    expect(addRecentSearch("x")).toEqual(["x"]);
  });
});
