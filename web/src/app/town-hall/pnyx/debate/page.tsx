import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import DebateView from "@/components/community/DebateView";

export const metadata: Metadata = { title: "A debate · The Pnyx" };

export default function DebatePage() {
  return (
    <Page>
      <Suspense>
        <DebateView />
      </Suspense>
    </Page>
  );
}
