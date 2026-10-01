/**
 * Author articles: a written account of one author on the author's page. Summary, a timeline of the
 * author and of how the text reached us, how it was handed down, where editors disagree, editions,
 * and the numbered sources that every claim rests on.
 *
 * RULE (owner's decision, 2026-09-30): an article is added to ARTICLES only when every claim in it has
 * been checked against a real source, and the source is listed. The old site's 85 drafts are in
 * pipeline/drafts/old-site-author-articles.json and are NOT used until each is checked. Nothing is
 * written from memory. Prose uses the wiki's markup (markup.ts); `[^2]` points at source 2.
 */
import type { Certainty } from "./types";

/** What a timeline mark stands for: the author's own time, a copy of the text, a printing or
 *  modern edition, or later reception. Shown as a shape and a word, never by colour alone. */
export type PinKind = "writing" | "copy" | "print" | "reception";

export const PIN_KINDS: Record<PinKind, { label: string; about: string }> = {
  writing: { label: "The author", about: "The author's own life and writing." },
  copy: { label: "Copies", about: "Papyri and manuscripts: the text copied by hand." },
  print: { label: "Print and editions", about: "Printed texts, translations and modern editions." },
  reception: { label: "Readers", about: "What later readers said and did." },
};

export interface AuthorArticle {
  /** the author's id in the catalogue, e.g. "tlg0012" */
  id: string;
  /** block markup; the first paragraph opens the article */
  summary: string;
  /** negative years are BC */
  /** `approx`: the year is a round figure (a century, a rough date); gaps to and from it are said to be "about" */
  timeline: { year: number; approx?: boolean; what: string; kind: PinKind; certainty?: Certainty; src?: number[] }[];
  /** how the text was handed down: papyri, manuscripts, the printed text (block markup) */
  transmission: string;
  /** where editors disagree about the wording (block markup) */
  variants: string;
  /** editions and translations worth reading, each as a citation line (inline markup, `[^n]` allowed) */
  editions: { text: string; note?: string }[];
  /** numbered 1, 2, 3… in this order; the markers in the prose point here. Each is a web page (`url`) or a
   *  passage of the texts in the reader (`cite`), which is how ancient sources are cited. */
  sources: ({ label: string; note?: string } & ({ url: string; cite?: undefined } | { cite: { work: string; ref: string; to?: string }; url?: undefined }))[];
  /** Quotations (or parts of one) that are not in the library's own texts: our own translation of a Greek
   *  or Latin line, or words from a web source. Every quotation in the prose must be found in a cited text
   *  (CORPUS=1 test) or be listed here, so none can be misquoted unnoticed. */
  outsideQuotes?: string[];
  /** YYYY-MM-DD: when every claim was last compared with its source; empty for a preview draft */
  checked: string;
}

/**
 * Only source-checked articles: each lives in authors/<id>.ts and is loaded only when its author's page is
 * opened, so no page carries every article. (All of them at once, for the build and the tests: author-articles-all.ts.)
 * A new article is added here AND in author-articles-all.ts (a test checks the two agree).
 */
export const ARTICLE_LOADERS: Record<string, () => Promise<AuthorArticle>> = {
  tlg0016: () => import("./authors/tlg0016").then((m) => m.herodotus),
  tlg0012: () => import("./authors/tlg0012").then((m) => m.homer),
  tlg0003: () => import("./authors/tlg0003").then((m) => m.thucydides),
  tlg0059: () => import("./authors/tlg0059").then((m) => m.plato),
  tlg0011: () => import("./authors/tlg0011").then((m) => m.sophocles),
  tlg0086: () => import("./authors/tlg0086").then((m) => m.aristotle),
  tlg0006: () => import("./authors/tlg0006").then((m) => m.euripides),
  tlg0085: () => import("./authors/tlg0085").then((m) => m.aeschylus),
  tlg0014: () => import("./authors/tlg0014").then((m) => m.demosthenes),
};

/**
 * The unchecked drafts used to look at the design, read only by `npm run dev`. The test is a build-time
 * constant, so the production build drops the drafts altogether (checked in PROGRESS.md).
 */
const PREVIEW: Record<string, AuthorArticle> =
  process.env.NODE_ENV === "development"
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- a dev-only file the production build must not contain
    ? (require("./drafts/preview.json") as Record<string, AuthorArticle>)
    : {};

/** An unchecked draft, for the design preview in development only. */
export const draftFor = (id: string): { article: AuthorArticle; draft: boolean } | null => (PREVIEW[id] ? { article: PREVIEW[id], draft: true } : null);

/** The article for an author, fetched when needed: the checked one, or (development only) a draft marked as unchecked. */
export async function loadArticle(id: string): Promise<{ article: AuthorArticle; draft: boolean } | null> {
  const load = ARTICLE_LOADERS[id];
  return load ? { article: await load(), draft: false } : draftFor(id);
}
