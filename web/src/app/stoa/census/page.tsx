import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.census.name} · ${AREAS.census.english}` };

const ITEMS = [
  "The most mentioned words, people, gods, places and peoples in the texts",
  "Filters by author, work, genre and period, and side-by-side comparisons",
  "Charts, and a plain statement of how the counting was done"
];

export default function StoaCensusPage() {
  return (
    <Page>
      <AreaHeader id="census" />
      <ComingSoon id="census" items={ITEMS} />
    </Page>
  );
}
