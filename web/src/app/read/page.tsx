import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.reader.name} · ${AREAS.reader.english}` };

const ITEMS = [
  "The Greek text beside its translation, exactly as the source files give it",
  "Click any word for its dictionary form, grammar and meaning, with live links to Logeion, Perseus and Wiktionary",
  "Bookmarks, favourites, notes and highlights on any passage",
  "Two books side by side, and sharing a passage as a link, text or image",
  "Reading from GitHub online, or from your downloaded copy offline"
];

export default function ReadPage() {
  return (
    <Page>
      <AreaHeader id="reader" />
      <ComingSoon id="reader" items={ITEMS} />
    </Page>
  );
}
