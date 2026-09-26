import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.forum.name} · ${AREAS.forum.english}` };

const ITEMS = [
  "Beginners' questions, grammar and translation help, texts, history and archaeology",
  "Quote a passage straight from the reader, with a link back to it",
  "Greek typing with an on-screen keyboard"
];

export default function TownHallPage() {
  return (
    <Page>
      <AreaHeader id="forum" />
      <ComingSoon id="forum" items={ITEMS} />
    </Page>
  );
}
