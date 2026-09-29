/**
 * The site's data files, read while the site is built (never in the browser): the static author and
 * work pages, the sitemap and the link previews are made from them. Read once, then kept.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { indexCatalog, type Catalog, type CatalogIndex } from "./catalog";
import type { WorkMeta } from "./works-meta";
import type { AuthorMeta } from "./authors-meta";

const read = <T>(file: string): T => JSON.parse(readFileSync(join(process.cwd(), "public/data", file), "utf8")) as T;

let cached: { idx: CatalogIndex; works: Record<string, WorkMeta>; who: Record<string, AuthorMeta>; diff: Record<string, [number, number]> } | null = null;

export function siteData() {
  cached ??= {
    idx: indexCatalog(read<Catalog>("catalog.json")),
    works: read<{ works: Record<string, WorkMeta> }>("works-meta.json").works,
    who: read<{ authors: Record<string, AuthorMeta> }>("authors-meta.json").authors,
    diff: read<{ works: Record<string, [number, number]> }>("difficulty.json").works,
  };
  return cached;
}
