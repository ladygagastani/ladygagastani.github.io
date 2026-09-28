import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Moderation from "@/components/community/Moderation";

export const metadata: Metadata = { title: "The moderator's desk · The Town Hall" };

export default function ModerationPage() {
  return (
    <Page>
      <Suspense>
        <Moderation />
      </Suspense>
    </Page>
  );
}
