import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import NewThread from "@/components/community/NewThread";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "A new thread · The Town Hall", ...NOINDEX };

export default function NewPage() {
  return (
    <Page>
      {/* the page's name for screen readers; each state of the page shows its own title */}
      <h1 className="visually-hidden">A new thread</h1>
      <Suspense>
        <NewThread />
      </Suspense>
    </Page>
  );
}
