import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.wiki.name} · ${AREAS.wiki.english}` };

const ITEMS = [
  "People and power, democracy, education, daily life, religion",
  "The weird, the strange, the beautiful, and the dark side of ancient Greece",
  "Every entry sourced, with labels showing how certain each claim is",
  "\"Read it yourself\": the key ancient passages, linked into the library"
];

export default function StoaPage() {
  return (
    <Page>
      <AreaHeader id="wiki" />
      <ComingSoon id="wiki" items={ITEMS} />
    </Page>
  );
}
