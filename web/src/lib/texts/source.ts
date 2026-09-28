/**
 * Get a text's XML from the best available place: local copies first, then the texts read lately,
 * then GitHub. Texts are asked for at a pinned commit, so a copy never goes out of date: the last
 * RECENT_KEEP texts read from GitHub are kept (Cache API, "texts-recent"; public/sw.js leaves it
 * alone), which makes a book open at once the next time, and offline too.
 */
import { rawUrl, type CatalogIndex, type CatText } from "@/lib/catalog";
import { readLocal, type Origin } from "./local";

export type From = Origin | "github";

export class TextUnavailable extends Error {}

const memory = new Map<string, { xml: string; from: From }>();

export async function getXml(idx: CatalogIndex, t: CatText): Promise<{ xml: string; from: From }> {
  const hit = memory.get(t.urn);
  if (hit) return hit;
  const local = await readLocal(idx, t).catch(() => null);
  if (local) return remember(t, local);
  const url = rawUrl(idx, t);
  const kept = await readRecent(url);
  if (kept) return remember(t, { xml: kept, from: "github" });
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new TextUnavailable("You are offline and this text is not in your downloaded library.");
  }
  let res: Response;
  try { res = await fetch(url); }
  catch { throw new TextUnavailable("GitHub could not be reached. Check your connection, or read from a downloaded copy."); }
  if (!res.ok) throw new TextUnavailable(`GitHub answered ${res.status} for this file.`);
  const xml = await res.text();
  keepRecent(url, xml);
  return remember(t, { xml, from: "github" });
}

export const RECENT_CACHE = "texts-recent";
const RECENT_KEEP = 30;

async function readRecent(url: string): Promise<string | null> {
  try {
    const hit = await (await caches.open(RECENT_CACHE)).match(url);
    return hit ? await hit.text() : null;
  } catch { return null; }   // no Cache API (an old browser, or a private window that refuses it)
}

async function keepRecent(url: string, xml: string) {
  try {
    const c = await caches.open(RECENT_CACHE);
    await c.put(url, new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } }));
    const keys = await c.keys();   // oldest first
    for (const k of keys.slice(0, Math.max(0, keys.length - RECENT_KEEP))) await c.delete(k);
  } catch { /* keeping a copy is only a convenience */ }
}

function remember(t: CatText, v: { xml: string; from: From }) {
  if (memory.size > 12) memory.delete(memory.keys().next().value!);
  memory.set(t.urn, v);
  return v;
}
