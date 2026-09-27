import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { categories, groupOf, groupInfo, NAME_ENTRIES, scopeFrom, scopeParams, EMPTY_SCOPE, type CensusMeta, type Lists } from "./census";
import { canonLemma } from "./lexicon";
import { greekKey, shardOf } from "./search/codec";
import { FAMILIES, PERIODS } from "./works-meta";
import { entryBySlug } from "@/wiki/index";

const DIR = "public/data/census";
const read = <T,>(f: string): T => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) as T;
const meta = read<CensusMeta>("_meta.json");
const core = read<Record<string, Lists>>("core.json");

describe("the Census data", () => {
  it("uses the library's own kinds of writing and periods", () => {
    FAMILIES.forEach(([label], i) => expect(meta.groups[`f${i}`]?.[0]).toBe(label));
    PERIODS.forEach(([label], i) => expect(meta.groups[`p${i}`]?.[0]).toBe(label));
  });

  it("has every list for the whole library, ranked from most to fewest", () => {
    for (const c of categories(meta)) {
      const rows = core.all[c.id];
      expect(rows?.length, c.id).toBeGreaterThan(0);
      for (let i = 1; i < rows.length; i++) expect(rows[i][1]).toBeLessThanOrEqual(rows[i - 1][1]);
    }
    expect(core.all.god[0].slice(0, 2)).toEqual(["Ζεύς", 8397]);
  });

  it("adds up: a kind of writing never mentions something more often than the whole library", () => {
    const whole = new Map(core.all.words.map(([w, n]) => [w, n]));
    for (const [g, lists] of Object.entries(core)) {
      for (const [w, n] of lists.words ?? []) if (whole.has(w)) expect(n, `${g} ${w}`).toBeLessThanOrEqual(whole.get(w)!);
    }
  });

  it("finds every listed phrase's passages, and they add up to its count", () => {
    for (const [phrase, n] of core.all.phrase.slice(0, 20)) {
      const shard = read<Record<string, [string, number[]][]>>(`ph/${shardOf(greekKey(phrase))}.json`);
      const occ = shard[phrase];
      expect(occ, phrase).toBeDefined();
      expect(occ.reduce((s, [, us]) => s + us.length, 0)).toBe(n);
    }
  });

  it("keeps an author's file for every author it lists, with each work", () => {
    for (const [id, , , works] of meta.authors.slice(0, 20)) {
      const data = read<Record<string, Lists>>(`a/${id}.json`);
      expect(data[`a:${id}`]).toBeDefined();
      for (const [w] of works) expect(Object.keys(data)).toContain(`w:${w}`);
    }
  });

  it("agrees with the Word Study index, when it is built", () => {
    if (!existsSync("public/data/lexicon/_meta.json")) return;
    for (const [word, n] of [...core.all.person.slice(0, 5), ...core.all.noun.slice(0, 5)]) {
      const k = canonLemma(word);
      const shard = JSON.parse(readFileSync(`public/data/lexicon/${shardOf(greekKey(k))}.json`, "utf8"));
      expect(shard[k]?.n, word).toBe(n);
    }
  });
});

describe("Census scopes", () => {
  it("names groups of works", () => {
    expect(groupOf(EMPTY_SCOPE)).toBe("all");
    expect(groupOf({ ...EMPTY_SCOPE, f: 2 })).toBe("f2");
    expect(groupOf({ ...EMPTY_SCOPE, f: 2, p: 1 })).toBe("f2p1");
    expect(groupOf({ ...EMPTY_SCOPE, a: "tlg0012" })).toBe("a:tlg0012");
    expect(groupOf({ ...EMPTY_SCOPE, a: "tlg0012", w: "tlg0012.tlg001" })).toBe("w:tlg0012.tlg001");
    expect(groupInfo(meta, "a:tlg0012").label).toBe("Homer");
    expect(groupInfo(meta, "w:tlg0012.tlg001").label).toMatch(/^Homer, Ilia/);
  });
  it("round-trips through the address bar", () => {
    const s = { a: "tlg0016", w: "tlg0016.tlg001", f: null, p: null };
    const q = new URLSearchParams(scopeParams(s, "b").filter(([, v]) => v !== null) as [string, string][]);
    expect(scopeFrom((k) => q.get(k), "b")).toEqual(s);
  });
});

describe("Census links", () => {
  it("links names only to entries that exist", () => {
    for (const slugs of Object.values(NAME_ENTRIES)) for (const s of slugs) expect(entryBySlug.has(s), s).toBe(true);
  });
});
