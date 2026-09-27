import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import WordStudy from "@/components/treasury/WordStudy";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Word Study · ${AREAS.treasury.name}` };

// One static page serves every word (chosen by ?l=…), like the reader, so it can work offline once cached.
export default function WordStudyPage() {
  return (
    <Page>
      <Suspense fallback={null}>
        <WordStudy />
      </Suspense>
    </Page>
  );
}
