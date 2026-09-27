import { describe, expect, it, beforeEach } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { STATIC_PAGES, DEV_PAGES, offlinePages } from "@/config/pages";
import { LESSONS } from "@/data/lessons";
import { snapRect, clampRect, snapFor, expandHref } from "./float";
import { pageKey, recordVisit, trail, lastOtherPage, saveScroll, savedScroll } from "./resume";

describe("the offline copy", () => {
  it("keeps every page of the site (except the development-only studio)", () => {
    const pages: string[] = [];
    const walk = (dir: string, route: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p, `${route}/${f}`);
        else if (f === "page.tsx") pages.push(route || "/");
      }
    };
    walk(join(__dirname, "../app"), "");
    const kept = new Set(offlinePages());
    for (const p of pages) {
      if (DEV_PAGES.includes(p)) continue;
      if (p === "/academy/lesson/[id]") { for (const l of LESSONS) expect(kept.has(`/academy/lesson/${l.id}`), l.id).toBe(true); continue; }
      expect(STATIC_PAGES, p).toContain(p);
    }
  });
});

describe("the floating window", () => {
  const vw = 1400, vh = 900;
  it("snaps to corners and docks to edges", () => {
    const r = { x: 300, y: 300, w: 480, h: 580 };
    expect(snapRect("br", r, vw, vh)).toEqual({ x: 1400 - 480 - 12, y: 900 - 580 - 12, w: 480, h: 580 });
    expect(snapRect("left", r, vw, vh)).toEqual({ x: 12, y: 76, w: 480, h: 900 - 76 - 12 });
    expect(snapFor(5, 500, vw, vh)).toBe("left");
    expect(snapFor(1395, 895, vw, vh)).toBe("br");
    expect(snapFor(10, 80, vw, vh)).toBe("tl");
    expect(snapFor(700, 500, vw, vh)).toBe("free");
  });
  it("never leaves the window off screen or too small", () => {
    expect(clampRect({ x: -500, y: -40, w: 100, h: 5000 }, vw, vh)).toEqual({ x: 12, y: 76, w: 300, h: 900 - 76 - 12 });
  });
  it("expands to the full reader at the passage in view, without a search's marks", () => {
    expect(expandHref("w=tlg0012.tlg001&ed=perseus-grc2&at=1.1&hl=0", "1.477")).toBe("/read?w=tlg0012.tlg001&ed=perseus-grc2&at=1.477");
  });
});

describe("where you left off", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k), clear: () => store.clear(), key: () => null, length: 0,
    };
  });
  it("counts the reader as one page per set of books, whatever the passage", () => {
    expect(pageKey("/read?w=a&at=1.1&ed=x")).toBe(pageKey("/read?w=a&at=2.5"));
    expect(pageKey("/read?w=a&w2=b")).not.toBe(pageKey("/read?w=a"));
    expect(pageKey("/search?q=x&m=forms")).toBe("/search?q=x&m=forms");
  });
  it("keeps the newest visit first, once per page, and knows the last page that was not the reader", () => {
    recordVisit("/library", "Library", 1);
    recordVisit("/read?w=a&at=1.1", "Reader", 2);
    recordVisit("/treasury", "Treasury", 3);
    recordVisit("/read?w=a&at=4.4", "Reader", 4);
    expect(trail().map((v) => v.href)).toEqual(["/read?w=a&at=4.4", "/treasury", "/library"]);
    expect(lastOtherPage()).toBe("/treasury");
  });
  it("never remembers the recording studio", () => {
    recordVisit("/academy/studio", "Studio", 1);
    expect(trail()).toEqual([]);
  });
  it("remembers how far down each page was", () => {
    saveScroll("/academy/lesson/case", 1234.4);
    expect(savedScroll("/academy/lesson/case")).toBe(1234);
    expect(savedScroll("/about")).toBeNull();
  });
});
