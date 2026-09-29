import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Account from "@/components/community/Account";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "Your account", ...NOINDEX };

export default function AccountPage() {
  return (
    <Page>
      {/* the page's name for screen readers; each state of the page shows its own title */}
      <h1 className="visually-hidden">Your account</h1>
      <Suspense>
        <Account />
      </Suspense>
    </Page>
  );
}
