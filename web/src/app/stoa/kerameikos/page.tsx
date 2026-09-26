import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.archaeology.name} · ${AREAS.archaeology.english}` };

const ITEMS = [
  "How archaeology works: excavation, stratigraphy and dating",
  "Great sites and great finds, from Knossos to Vergina",
  "The problems too: destructive early digs, looting, and the debates over returning objects",
  "Black-figure and red-figure pottery explained visually"
];

export default function StoaKerameikosPage() {
  return (
    <Page>
      <AreaHeader id="archaeology" />
      <ComingSoon id="archaeology" items={ITEMS} />
    </Page>
  );
}
