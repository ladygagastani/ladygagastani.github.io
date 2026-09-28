import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Member from "@/components/community/Member";

export const metadata: Metadata = { title: "A member · The Town Hall" };

export default function MemberPage() {
  return (
    <Page>
      <Suspense>
        <Member />
      </Suspense>
    </Page>
  );
}
