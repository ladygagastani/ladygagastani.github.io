import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Pnyx from "@/components/community/Pnyx";
import { AREAS } from "@/config/areas";
import { ENTRIES } from "@/wiki/index";

export const metadata: Metadata = { title: `${AREAS.debates.name} · ${AREAS.debates.english}` };

// titles of the Painted Stoa's entries, for motions proposed from one (read at build time)
const entryTitles = Object.fromEntries(ENTRIES.map((e) => [e.slug, e.title]));

export default function TownHallPnyxPage() {
  return (
    <Page>
      <AreaHeader id="debates" />
      <Suspense>
        <Pnyx entryTitles={entryTitles} />
      </Suspense>
    </Page>
  );
}
