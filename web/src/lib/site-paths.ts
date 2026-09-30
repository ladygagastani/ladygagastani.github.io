import { STATIC_PAGES, PRIVATE_PAGES } from "@/config/pages";
import { LESSONS } from "@/data/lessons";
import { GUIDES } from "@/data/guides";
import { ENTRIES } from "@/wiki/index";
import { siteData } from "./build-data";
import { workPath } from "./seo";

/** Every page a search engine should know: the public pages, each lesson and wiki entry, and a page for every author and work. */
export function sitePaths(): string[] {
  const priv = new Set(PRIVATE_PAGES);
  const { idx } = siteData();
  return [...new Set([
    ...STATIC_PAGES.filter((p) => !priv.has(p)),
    ...LESSONS.map((l) => `/academy/lesson/${l.id}`),
    ...GUIDES.map((g) => `/academy/guide/${g.id}`),
    ...ENTRIES.map((e) => `/stoa/${e.slug}`),
    ...idx.catalog.authors.map((a) => `/author/${a.id}`),
    ...idx.catalog.authors.flatMap((a) => a.works.map((w) => workPath(w.id))),
  ])];
}
