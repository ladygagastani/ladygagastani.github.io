import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.map.name} · ${AREAS.map.english}` };

const ITEMS = [
  "An interactive map of the ancient Greek world, built on the Pleiades gazetteer",
  "What happened at each place, and which texts mention it"
];

export default function StoaPeriplusPage() {
  return (
    <Page>
      <AreaHeader id="map" />
      <ComingSoon id="map" items={ITEMS} />
    </Page>
  );
}
