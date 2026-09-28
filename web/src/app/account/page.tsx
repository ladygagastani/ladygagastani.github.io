import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Account from "@/components/community/Account";

export const metadata: Metadata = { title: "Your account" };

export default function AccountPage() {
  return (
    <Page>
      <Suspense>
        <Account />
      </Suspense>
    </Page>
  );
}
