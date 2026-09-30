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
  timeline: { year: number; what: string; kind: PinKind; certainty?: Certainty; src?: number[] }[];
  /** how the text was handed down: papyri, manuscripts, the printed text (block markup) */
  transmission: string;
  /** where editors disagree about the wording (block markup) */
  variants: string;
  /** editions and translations worth reading, each as a citation line (inline markup) */
  editions: { text: string; note?: string }[];
  /** numbered 1, 2, 3… in this order; the markers in the prose point here */
  sources: { label: string; url: string; note?: string }[];
  /** YYYY-MM-DD: when every claim was last compared with its source; empty for a preview draft */
  checked: string;
}

/** Only source-checked articles. Empty until the first batch has been checked. */
export const ARTICLES: Record<string, AuthorArticle> = {};

/**
 * The unchecked drafts used to look at the design, read only by `npm run dev`. The test is a build-time
 * constant, so the production build drops the drafts altogether (checked in PROGRESS.md).
 */
const PREVIEW: Record<string, AuthorArticle> =
  process.env.NODE_ENV === "development"
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- a dev-only file the production build must not contain
    ? (require("./drafts/preview.json") as Record<string, AuthorArticle>)
    : {};

/** The article for an author: the checked one, or (development only) a draft marked as unchecked. */
export function articleFor(id: string): { article: AuthorArticle; draft: boolean } | null {
  if (ARTICLES[id]) return { article: ARTICLES[id], draft: false };
  if (PREVIEW[id]) return { article: PREVIEW[id], draft: true };
  return null;
}
