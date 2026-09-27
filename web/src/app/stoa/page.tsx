import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import StoaIndex from "@/components/stoa/StoaIndex";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.wiki.name} · ${AREAS.wiki.english}` };

export default function StoaPage() {
  return (
    <Page>
      <AreaHeader id="wiki" />
      <StoaIndex />
    </Page>
  );
}
