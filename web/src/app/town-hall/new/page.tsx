import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import NewThread from "@/components/community/NewThread";

export const metadata: Metadata = { title: "A new thread · The Town Hall" };

export default function NewPage() {
  return (
    <Page>
      <Suspense>
        <NewThread />
      </Suspense>
    </Page>
  );
}
