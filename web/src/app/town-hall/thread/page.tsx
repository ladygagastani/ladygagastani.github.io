import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import ThreadView from "@/components/community/ThreadView";

export const metadata: Metadata = { title: "A thread · The Town Hall" };

export default function ThreadPage() {
  return (
    <Page>
      <Suspense>
        <ThreadView />
      </Suspense>
    </Page>
  );
}
