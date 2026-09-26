import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.study.name} · ${AREAS.study.english}` };

const ITEMS = [
  "The alphabet, with shapes, names, sounds and the order each letter is written in",
  "Accents and breathings, explained simply",
  "Short graded lessons, each ending with a real sentence from the library",
  "Flashcards with spaced repetition, parsing drills and paradigm tables",
  "Vocabulary by frequency, with a count of how much of a text you can already read"
];

export default function AcademyPage() {
  return (
    <Page>
      <AreaHeader id="study" />
      <ComingSoon id="study" items={ITEMS} />
    </Page>
  );
}
