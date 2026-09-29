import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import WikiAuthors from "@/components/stoa/WikiAuthors";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Authors · ${AREAS.wiki.name}` };

export default function AuthorsPage() {
  return (
    <Page>
      <RefHead title="Authors" greek="Συγγραφεῖς">Every author in the library, by period and by kind of writing. Each one opens their page: their works, and where to begin.</RefHead>
      <Suspense fallback={null}><WikiAuthors /></Suspense>
    </Page>
  );
}
