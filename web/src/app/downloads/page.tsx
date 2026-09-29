import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ScrollCase from "@/components/offline/ScrollCase";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.downloads.name} · ${AREAS.downloads.english}`, description: PAGE_DESCRIPTIONS.downloads };

export default function DownloadsPage() {
  return (
    <Page>
      <AreaHeader id="downloads" />
      <ScrollCase />
    </Page>
  );
}
