import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Search from "@/components/search/Search";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.search.name} · ${AREAS.search.english}` };

export default function SearchPage() {
  return (
    <Page>
      <AreaHeader id="search" />
      <Suspense fallback={null}>
        <Search />
      </Suspense>
    </Page>
  );
}
