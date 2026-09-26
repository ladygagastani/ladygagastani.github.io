import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.search.name} · ${AREAS.search.english}` };

const ITEMS = [
  "Search Greek with or without accents, or type in Latin letters or Beta Code",
  "Find every form of a dictionary word, or search by grammar",
  "Search translations, the wiki, the forum and your own notes",
  "Jump straight to a reference such as \"Il. 1.1\""
];

export default function SearchPage() {
  return (
    <Page>
      <AreaHeader id="search" />
      <ComingSoon id="search" items={ITEMS} />
    </Page>
  );
}
