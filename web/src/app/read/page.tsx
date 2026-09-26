import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Reader from "@/components/reader/Reader";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.reader.name} · ${AREAS.reader.english}` };

// One static page serves every work (chosen by ?w=…), so it also works offline once cached.
export default function ReadPage() {
  return (
    <Page>
      <Suspense fallback={null}>
        <Reader />
      </Suspense>
    </Page>
  );
}
