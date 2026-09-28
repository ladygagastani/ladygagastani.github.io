import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AuthorProfile, { type RelatedEntry } from "@/components/library/AuthorProfile";
import { AREAS } from "@/config/areas";
import { ENTRIES } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";

export const metadata: Metadata = { title: `An author · ${AREAS.library.name}` };

// The Painted Stoa entries that cite each author's works (read at build time: an entry counts when
// any passage in it, a quotation, a link or a "read it yourself" reference, points into that author's texts).
const related: Record<string, RelatedEntry[]> = {};
for (const e of ENTRIES) {
  const authors = new Set([...JSON.stringify(e).matchAll(/tlg\d{4}(?=\.tlg\d{3})/g)].map((m) => m[0]));
  const hook = plain(inline(e.hook));
  const first = hook.split(/(?<=[.!?])\s+/)[0] ?? hook;
  for (const a of authors) (related[a] ??= []).push({ slug: e.slug, title: e.title, kicker: e.kicker, hook: first });
}

export default function AuthorPage() {
  return (
    <Page>
      <Suspense fallback={null}><AuthorProfile related={related} /></Suspense>
    </Page>
  );
}
