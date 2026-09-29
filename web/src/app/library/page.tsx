import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Library from "@/components/library/Library";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.library.name} · ${AREAS.library.english}`, description: PAGE_DESCRIPTIONS.library };

export default function LibraryPage() {
  return (
    <Page>
      <AreaHeader id="library" />
      <Suspense fallback={null}><Library /></Suspense>
    </Page>
  );
}
