import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ScrollCase from "@/components/offline/ScrollCase";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.downloads.name} · ${AREAS.downloads.english}` };

export default function DownloadsPage() {
  return (
    <Page>
      <AreaHeader id="downloads" />
      <ScrollCase />
    </Page>
  );
}
