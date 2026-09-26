import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.treasury.name} · ${AREAS.treasury.english}` };

const ITEMS = [
  "Notes on passages, saved words with Word Study pages, favourite passages",
  "Bookmarks, cross-references, places and your own notes on authors",
  "Export everything to a readable file"
];

export default function TreasuryPage() {
  return (
    <Page>
      <AreaHeader id="treasury" />
      <ComingSoon id="treasury" items={ITEMS} />
    </Page>
  );
}
