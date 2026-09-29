import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AuthorProfile from "@/components/library/AuthorProfile";
import { AREAS } from "@/config/areas";
import { siteData } from "@/lib/build-data";
import { entriesForAuthor, type RelatedEntry } from "@/wiki/related";

// the app's own author page: every author opens here by ?a=..., so none of those addresses is indexed;
// each author's page for search engines is /author/<id>
export const metadata: Metadata = { title: `An author · ${AREAS.library.name}`, robots: { index: false, follow: true } };

// The Painted Stoa entries that cite each author's works (read at build time)
const related: Record<string, RelatedEntry[]> = {};
for (const a of siteData().idx.catalog.authors) { const e = entriesForAuthor(a.id); if (e.length) related[a.id] = e; }

export default function AuthorPage() {
  return (
    <Page>
      <Suspense fallback={null}><AuthorProfile related={related} /></Suspense>
    </Page>
  );
}
