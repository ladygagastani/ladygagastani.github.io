/**
 * Every page of the site that the offline copy keeps (the service worker, public/sw.js, fetches
 * this list from /offline.json). A test checks it against the pages in src/app.
 */
import { LESSONS } from "@/data/lessons";
import { ENTRIES } from "@/wiki/index";

export const STATIC_PAGES = [
  "/", "/library", "/library/author", "/read", "/search", "/downloads", "/treasury", "/treasury/word",
  "/academy", "/academy/today", "/academy/alphabet", "/academy/review", "/academy/tables", "/academy/vocabulary", "/academy/practice",
  "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/editions", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus",
  "/town-hall", "/town-hall/pnyx", "/town-hall/thread", "/town-hall/new", "/town-hall/member", "/town-hall/moderation",
  "/town-hall/pnyx/debate", "/account",
  "/about", "/credits",
];

/** Pages that exist only while developing (the recording studio): never kept offline. */
export const DEV_PAGES = ["/academy/studio"];

export const offlinePages = () => [...STATIC_PAGES, ...LESSONS.map((l) => `/academy/lesson/${l.id}`), ...ENTRIES.map((e) => `/stoa/${e.slug}`)];

/** Small data files every page may need, kept offline with the pages. */
export const OFFLINE_DATA = [
  "/data/catalog.json", "/data/core.json", "/data/abbrev.json", "/data/works-meta.json", "/data/authors-meta.json", "/data/difficulty.json",
  "/data/metre/_index.json", "/data/metre/_lengths.json", "/audio/index.json",
];
