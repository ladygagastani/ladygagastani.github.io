/**
 * Where the reader was: the pages visited (newest first), and how far down each page they had
 * scrolled. Kept on this device (localStorage), for "Continue where you left off" on the home page,
 * and so the floating reader knows which page to return to. Books keep their own place
 * (lib/position.ts): the reader resumes at the right line by itself.
 */
export interface Visit { href: string; title: string; t: number }
interface Saved { trail: Visit[]; scroll: Record<string, number> }

const KEY = "mathesis:resume";
const MAX_TRAIL = 12, MAX_SCROLL = 80;

function load(): Saved {
  try { const d = JSON.parse(localStorage.getItem(KEY) || "{}"); return { trail: d.trail ?? [], scroll: d.scroll ?? {} }; } catch { return { trail: [], scroll: {} }; }
}
function save(d: Saved) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } }

/** Pages not worth returning to on their own. */
const SKIP = /^\/(academy\/studio)(\/|$)/;

/** One entry per page; the reader counts as one page per set of books open. */
export function pageKey(href: string): string {
  const u = new URL(href, "http://x");
  if (u.pathname === "/read") {
    const q = new URLSearchParams();
    for (const k of ["w", "w2"]) { const v = u.searchParams.get(k); if (v) q.set(k, v); }
    return `/read?${q}`;
  }
  return u.pathname + u.search;
}

export function recordVisit(href: string, title: string, now = Date.now()) {
  if (SKIP.test(new URL(href, "http://x").pathname)) return;
  const d = load();
  const key = pageKey(href);
  d.trail = [{ href, title, t: now }, ...d.trail.filter((v) => pageKey(v.href) !== key)].slice(0, MAX_TRAIL);
  save(d);
}

export const trail = (): Visit[] => load().trail;

/** The most recent page that is not the reader: where to go when the reader floats away. */
export function lastOtherPage(): string | null {
  return load().trail.find((v) => !v.href.startsWith("/read"))?.href ?? null;
}

export function saveScroll(href: string, y: number) {
  const d = load();
  const key = pageKey(href);
  delete d.scroll[key];
  d.scroll[key] = Math.round(y);
  const keys = Object.keys(d.scroll);
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_SCROLL))) delete d.scroll[k];
  save(d);
}
export const savedScroll = (href: string): number | null => load().scroll[pageKey(href)] ?? null;

export function clearTrail() { save({ trail: [], scroll: load().scroll }); }
