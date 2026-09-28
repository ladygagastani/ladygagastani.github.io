import type { Metadata } from "next";
import { Suspense } from "react";
import { preload } from "react-dom";
import Page from "@/components/Page";
import Reader from "@/components/reader/Reader";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.reader.name} · ${AREAS.reader.english}` };

// One static page serves every work (chosen by ?w=…), so it also works offline once cached.
export default function ReadPage() {
  // the reader needs the catalogue before it can ask GitHub for the text: fetch it alongside the page's code
  preload("/data/catalog.json", { as: "fetch", crossOrigin: "anonymous" });
  return (
    <Page>
      <Suspense fallback={null}>
        <Reader />
      </Suspense>
    </Page>
  );
}
