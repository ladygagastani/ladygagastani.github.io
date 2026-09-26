import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.library.name} · ${AREAS.library.english}` };

const ITEMS = [
  "Every author and work in the Perseus and First1KGreek collections",
  "Browse by author, work, genre, period and dialect",
  "Author pages with dates, places, a \"start here\" suggestion and links to the wiki",
  "Difficulty ratings, so you know where to begin"
];

export default function LibraryPage() {
  return (
    <Page>
      <AreaHeader id="library" />
      <ComingSoon id="library" items={ITEMS} />
    </Page>
  );
}
