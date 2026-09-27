import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Treasury from "@/components/treasury/Treasury";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.treasury.name} · ${AREAS.treasury.english}` };

export default function TreasuryPage() {
  return (
    <Page>
      <AreaHeader id="treasury" />
      <Suspense fallback={null}>
        <Treasury />
      </Suspense>
    </Page>
  );
}
