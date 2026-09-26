/** The catalogue built by pipeline/build_catalog.py (web/public/data/catalog.json). */

export type TextKind = "edition" | "translation" | "commentary";
export type CollectionId = "perseus" | "first1k";

export interface CatText {
  urn: string; kind: TextKind; lang: string | null;
  label: string | null; desc: string | null;
  col: CollectionId; path: string; size: number; sha: string;
}
export interface CatWork { id: string; title: string; lang: string | null; texts: CatText[] }
export interface CatAuthor { id: string; name: string; works: CatWork[] }
export interface Catalog {
  built: string;
  collections: Record<CollectionId, { owner: string; repo: string; sha: string }>;
  authors: CatAuthor[];
}

export interface CatalogIndex {
  catalog: Catalog;
  work: Map<string, CatWork>;
  authorOf: Map<string, CatAuthor>;
  text: Map<string, CatText>;     // by URN
  author: Map<string, CatAuthor>;
}

let pending: Promise<CatalogIndex> | null = null;

export function loadCatalog(): Promise<CatalogIndex> {
  pending ??= fetch("/data/catalog.json")
    .then((r) => { if (!r.ok) throw new Error(`The catalogue could not be loaded (${r.status}).`); return r.json() as Promise<Catalog>; })
    .then(indexCatalog)
    .catch((e) => { pending = null; throw e; });
  return pending;
}

export function indexCatalog(catalog: Catalog): CatalogIndex {
  const idx: CatalogIndex = { catalog, work: new Map(), authorOf: new Map(), text: new Map(), author: new Map() };
  for (const a of catalog.authors) {
    idx.author.set(a.id, a);
    for (const w of a.works) {
      idx.work.set(w.id, w);
      idx.authorOf.set(w.id, a);
      for (const t of w.texts) idx.text.set(t.urn, t);
    }
  }
  return idx;
}

/** The short name a URN ends in, e.g. "perseus-grc2". */
export const versionOf = (urn: string) => urn.slice(urn.lastIndexOf(".") + 1);

export const greekEditions = (w: CatWork) => w.texts.filter((t) => t.kind === "edition" && t.lang === "grc");
export const translations = (w: CatWork, lang = "eng") => w.texts.filter((t) => t.kind === "translation" && t.lang === lang);
export const hasTranslation = (w: CatWork) => translations(w).length > 0;

/** Where GitHub serves the file, pinned to the catalogue's exact version of the collection. */
export function rawUrl(idx: CatalogIndex, t: CatText) {
  const c = idx.catalog.collections[t.col];
  return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.sha}/${t.path}`;
}

/** Describe an edition or translation for a picker: "Murray, 1924" style from the CTS description. */
export function describe(t: CatText): string {
  const d = t.desc ?? "";
  // "Butler, Samuel, 1835-1902, translator" → Butler; life dates are not the publication year
  const who = /([A-Z][\w'’-]+),\s*[A-Z][^,;]*?(?:,\s*[\d?]{4}\s*-\s*[\d?]{0,4})?,\s*(?:translator|editor)/.exec(d)?.[1];
  const year = /\b(1[5-9]\d\d|20\d\d)\b/.exec(d.replace(/[\d?]{4}\s*-\s*[\d?]{0,4},\s*(?:translator|editor)/g, ""))?.[1];
  const base = who ? `${who}${year ? `, ${year}` : ""}` : (t.label ?? versionOf(t.urn));
  return `${base} (${versionOf(t.urn)})`;
}

/** Plain-text normalisation for searching: no accents, breathings or case; final sigma folded. */
export function fold(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ̓̔͂ͅ]/g, "").toLowerCase().replace(/ς/g, "σ");
}
