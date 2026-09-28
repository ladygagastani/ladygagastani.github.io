import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Moderation from "@/components/community/Moderation";

export const metadata: Metadata = { title: "The moderator's desk · The Town Hall" };

export default function ModerationPage() {
  return (
    <Page>
      {/* the page's name for screen readers; each state of the page shows its own title */}
      <h1 className="visually-hidden">The moderator&apos;s desk</h1>
      <Suspense>
        <Moderation />
      </Suspense>
    </Page>
  );
}
