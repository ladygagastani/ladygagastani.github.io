/** Getting books ready for Echoes: the text as a word stream, with GLAUx's dictionary words where they exist. */
import { greekEditions, versionOf, type CatalogIndex } from "@/lib/catalog";
import { loadWordPack } from "@/lib/lookup/words";
import { loadDoc } from "@/lib/search/context";
import type { TeiDoc } from "@/lib/tei/types";
import { attachLemmas, buildStream, Lexicon, type Stream } from "./stream";

export interface Book { stream: Stream; doc: TeiDoc; title: string; pack: boolean }

/** One set of ids for every book compared in this visit, so books can be compared with each other. */
export const lexicon = new Lexicon();
const books = new Map<string, Promise<Book>>();

const idle = () => new Promise((r) => setTimeout(r, 0));

async function make(doc: TeiDoc, work: string, urn: string, title: string): Promise<Book> {
  const stream = buildStream(doc, work, urn, lexicon);
  await idle();
  const pack = await loadWordPack(work).catch(() => null);
  if (pack) attachLemmas(stream, pack, lexicon);
  return { stream, doc, title, pack: !!pack };
}

/** A book already open in the reader. */
export function bookFromDoc(doc: TeiDoc, work: string, urn: string, title: string): Promise<Book> {
  const key = `${urn}`;
  const had = books.get(key);
  if (had) return had;
  const p = make(doc, work, urn, title).catch((e) => { books.delete(key); throw e; });
  books.set(key, p);
  return p;
}

/** Any book, fetched and read the way the reader does. */
export function bookFromUrn(work: string, urn: string, title: string): Promise<Book> {
  const had = books.get(urn);
  if (had) return had;
  if (books.size > 60) books.delete(books.keys().next().value!);
  const p = loadDoc(urn).then((doc) => make(doc, work, urn, title)).catch((e) => { books.delete(urn); throw e; });
  books.set(urn, p);
  return p;
}

/** Comparing word by word across all of an author's books is done in the browser only up to this size. */
export const AUTHOR_MAX_WORKS = 40;
export const AUTHOR_MAX_BYTES = 14_000_000;

export interface AuthorPlan {
  author: { id: string; name: string };
  works: { work: string; urn: string; title: string }[];   // the book being read first
  bytes: number;
  local: boolean;          // small enough to compare word by word here
}

/** The author's works, each in the edition the reader opens by default (the one being read for the current work). */
export function authorPlan(idx: CatalogIndex, work: string, urn: string): AuthorPlan | null {
  const a = idx.authorOf.get(work);
  if (!a) return null;
  const works: AuthorPlan["works"] = [];
  let bytes = 0;
  for (const w of a.works) {
    const eds = greekEditions(w);
    const ed = w.id === work ? eds.find((t) => t.urn === urn) ?? eds[0] : eds.find((t) => t.col === "perseus") ?? eds[0];
    if (!ed) continue;
    const item = { work: w.id, urn: ed.urn, title: w.title };
    if (w.id === work) works.unshift(item); else works.push(item);
    bytes += ed.size;
  }
  return { author: { id: a.id, name: a.name }, works, bytes, local: works.length <= AUTHOR_MAX_WORKS && bytes <= AUTHOR_MAX_BYTES };
}

export const editionOf = (b: Book) => versionOf(b.stream.urn);
