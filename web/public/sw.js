/*
 * The site's offline helper (a service worker). It keeps a copy of every page of the site, the code
 * and fonts they use, and the small data files (catalogue, core vocabulary…), so the site opens and
 * works without a connection. Texts, word analyses and the dictionary are saved separately, by the
 * reader's choice, in the Scroll Case (browser storage), and are read from there.
 *
 * Registered as /sw.js?build=<id>: every new build installs a fresh copy and removes the old one.
 *
 * - Pages: from the network when it answers within a few seconds, else the kept copy.
 * - /_next/static (code, styles, fonts): never change once built, so the kept copy is used first.
 * - /data and /audio: the network first, the kept copy when offline. The search index is only
 *   fetched, never kept here (it is far too big).
 * - Anything from another site (GitHub, Wiktionary) is left alone.
 */
const BUILD = new URL(self.location.href).searchParams.get("build") || "dev";
const PAGES = `pages-${BUILD}`;
const STATIC = "static";          // content-addressed files: kept across builds, pruned on activate
const DATA = `data-${BUILD}`;

const sameOrigin = (url) => url.origin === self.location.origin;

/** The /_next/static files a page's HTML refers to (scripts, styles, preloaded fonts). */
function assetsIn(html) {
  const out = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) out.add(m[1].replace(/&amp;/g, "&"));
  return out;
}
/** Fonts and images a stylesheet refers to. */
function assetsInCss(css) {
  const out = new Set();
  for (const m of css.matchAll(/url\((?:"|')?(\/_next\/static\/[^"')]+)/g)) out.add(m[1]);
  return out;
}

async function keepAll() {
  const list = await (await fetch("/offline.json", { cache: "no-store" })).json();
  const pages = await caches.open(PAGES), statics = await caches.open(STATIC), data = await caches.open(DATA);
  const assets = new Set();
  for (const p of list.pages) {
    try {
      const res = await fetch(p, { cache: "no-store" });
      if (!res.ok) continue;
      const html = await res.clone().text();
      await pages.put(p, res);
      for (const a of assetsIn(html)) assets.add(a);
    } catch { /* a page that fails now is kept the first time it is visited */ }
  }
  for (const a of assets) {
    if (await statics.match(a)) continue;
    try {
      const res = await fetch(a);
      if (!res.ok) continue;
      if (a.endsWith(".css")) for (const f of assetsInCss(await res.clone().text())) assets.add(f);
      await statics.put(a, res);
    } catch { /* ignore */ }
  }
  await Promise.all(list.data.map((d) => fetch(d).then((r) => (r.ok ? data.put(d, r) : null)).catch(() => null)));
}

self.addEventListener("install", (e) => {
  e.waitUntil(keepAll().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== PAGES && k !== STATIC && k !== DATA) await caches.delete(k);
    // static files no page of this build uses any more
    const used = new Set();
    const pages = await caches.open(PAGES);
    for (const req of await pages.keys()) { const r = await pages.match(req); if (r) for (const a of assetsIn(await r.text())) used.add(a); }
    const statics = await caches.open(STATIC);
    if (used.size) for (const req of await statics.keys()) {
      const p = new URL(req.url).pathname;
      if (!used.has(p) && !/\.(woff2?|ttf|otf)$/.test(p) && !p.includes("/media/")) await statics.delete(req);
    }
    await self.clients.claim();
  })());
});

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));

async function page(request) {
  const url = new URL(request.url);
  const cache = await caches.open(PAGES);
  try {
    const res = await Promise.race([fetch(request), timeout(4000)]);
    if (res.ok && res.headers.get("content-type")?.includes("text/html")) cache.put(url.pathname, res.clone());
    return res;
  } catch {
    // one kept copy per page serves every address of it (the reader's ?w=…, Word Study's ?l=…)
    return (await cache.match(url.pathname)) || (await cache.match("/")) || new Response("You are offline, and this page has not been kept yet.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
}

async function staticFile(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request, { ignoreSearch: false });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function dataFile(request) {
  const cache = await caches.open(DATA);
  try {
    const res = await fetch(request);
    const size = Number(res.headers.get("content-length") || 0);
    if (res.ok && size && size < 3e6) cache.put(request, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(request);
    if (hit) return hit;
    throw e;
  }
}

self.addEventListener("fetch", (e) => {
  const request = e.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!sameOrigin(url)) return;
  // the app's own in-page navigation data: never kept. When it fails offline, the app falls back
  // to loading the page itself, which is answered from the kept copy below.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;
  if (request.mode === "navigate") { e.respondWith(page(request)); return; }
  if (url.pathname.startsWith("/_next/static/")) { e.respondWith(staticFile(request)); return; }
  if (url.pathname.startsWith("/data/search/")) return;
  if (url.pathname.startsWith("/data/") || url.pathname.startsWith("/audio/")) { e.respondWith(dataFile(request)); return; }
});

self.addEventListener("message", (e) => {
  if (e.data === "keep-again") e.waitUntil(keepAll().then(() => e.source?.postMessage("kept")));
});
