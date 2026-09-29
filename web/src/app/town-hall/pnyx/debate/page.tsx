import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import DebateView from "@/components/community/DebateView";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "A debate · The Pnyx", ...NOINDEX };

export default function DebatePage() {
  return (
    <Page>
      <Suspense>
        <DebateView />
      </Suspense>
    </Page>
  );
}
