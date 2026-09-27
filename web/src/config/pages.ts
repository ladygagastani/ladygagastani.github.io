/**
 * Every page of the site that the offline copy keeps (the service worker, public/sw.js, fetches
 * this list from /offline.json). A test checks it against the pages in src/app.
 */
import { LESSONS } from "@/data/lessons";

export const STATIC_PAGES = [
  "/", "/library", "/read", "/search", "/downloads", "/treasury", "/treasury/word",
  "/academy", "/academy/alphabet", "/academy/review", "/academy/tables", "/academy/vocabulary", "/academy/practice",
  "/stoa", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus", "/town-hall", "/town-hall/pnyx",
  "/about", "/credits",
];

/** Pages that exist only while developing (the recording studio): never kept offline. */
export const DEV_PAGES = ["/academy/studio"];

export const offlinePages = () => [...STATIC_PAGES, ...LESSONS.map((l) => `/academy/lesson/${l.id}`)];

/** Small data files every page may need, kept offline with the pages. */
export const OFFLINE_DATA = [
  "/data/catalog.json", "/data/core.json", "/data/abbrev.json", "/data/works-meta.json",
  "/data/metre/_index.json", "/data/metre/_lengths.json", "/audio/index.json",
];
