import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Kerameikos from "@/components/stoa/Kerameikos";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.archaeology.name} · ${AREAS.archaeology.english}`, description: PAGE_DESCRIPTIONS.kerameikos };

export default function StoaKerameikosPage() {
  return (
    <Page>
      <AreaHeader id="archaeology" />
      <Kerameikos />
    </Page>
  );
}
