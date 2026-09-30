import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { GUIDES } from "./guides";
import { LESSONS } from "./lessons";

/** Is there a page at this address? (a folder with page.tsx in src/app, or a lesson or guide) */
function pageExists(href: string): boolean {
  const path = href.split("?")[0].replace(/\/$/, "");
  const lesson = path.match(/^\/academy\/lesson\/(.+)$/);
  if (lesson) return LESSONS.some((l) => l.id === lesson[1]);
  const guide = path.match(/^\/academy\/guide\/(.+)$/);
  if (guide) return GUIDES.some((g) => g.id === guide[1]);
  return existsSync(`src/app${path}/page.tsx`);
}

describe("the practical guides", () => {
  it("have unique ids and sources for what they say", () => {
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    for (const g of GUIDES) {
      expect(g.sources.length, g.id).toBeGreaterThan(0);
      for (const s of g.sources) expect(s.url, `${g.id}: ${s.label}`).toMatch(/^https?:\/\//);
    }
  });

  it("link only to pages that exist", () => {
    for (const g of GUIDES) for (const s of g.sections) if (s.kind === "links") for (const l of s.items) expect(pageExists(l.href), `${g.id}: ${l.href}`).toBe(true);
  });

  it("give the right answer index for every check question", () => {
    for (const g of GUIDES) for (const s of g.sections) if (s.kind === "check") for (const q of s.items) expect(q.answer, q.q).toBeLessThan(q.options.length);
  });
});
