import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.debates.name} · ${AREAS.debates.english}` };

const ITEMS = [
  "A motion, two columns for and against, and threaded replies",
  "Arguments that cite passages and wiki entries as evidence",
  "A vote when the debate closes, with a \"changed my mind\" option"
];

export default function TownHallPnyxPage() {
  return (
    <Page>
      <AreaHeader id="debates" />
      <ComingSoon id="debates" items={ITEMS} />
    </Page>
  );
}
