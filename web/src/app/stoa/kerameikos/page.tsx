import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Kerameikos from "@/components/stoa/Kerameikos";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.archaeology.name} · ${AREAS.archaeology.english}` };

export default function StoaKerameikosPage() {
  return (
    <Page>
      <AreaHeader id="archaeology" />
      <Kerameikos />
    </Page>
  );
}
