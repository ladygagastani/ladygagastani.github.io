/**
 * Which Painted Stoa entries cite an author or a work: an entry counts when any passage in it (a
 * quotation, a link, a "read it yourself" reference) points into that author's or work's texts.
 * Read at build time for the author and work pages.
 */
import { ENTRIES } from "./index";
import { inline, plain } from "./markup";

export interface RelatedEntry { slug: string; title: string; kicker: string; hook: string }

const byAuthor = new Map<string, RelatedEntry[]>();
const byWork = new Map<string, RelatedEntry[]>();
for (const e of ENTRIES) {
  const text = JSON.stringify(e);
  const hook = plain(inline(e.hook));
  const card: RelatedEntry = { slug: e.slug, title: e.title, kicker: e.kicker, hook: hook.split(/(?<=[.!?])\s+/)[0] ?? hook };
  for (const a of new Set([...text.matchAll(/tlg\d{4}(?=\.tlg\d{3})/g)].map((m) => m[0]))) byAuthor.set(a, [...(byAuthor.get(a) ?? []), card]);
  for (const w of new Set([...text.matchAll(/tlg\d{4}\.tlg\d{3}[a-z]?/g)].map((m) => m[0]))) byWork.set(w, [...(byWork.get(w) ?? []), card]);
}

export const entriesForAuthor = (id: string): RelatedEntry[] => byAuthor.get(id) ?? [];
export const entriesForWork = (id: string): RelatedEntry[] => byWork.get(id) ?? [];
