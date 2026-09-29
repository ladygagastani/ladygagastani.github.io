import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import TownHall from "@/components/community/TownHall";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.forum.name} · ${AREAS.forum.english}`, description: PAGE_DESCRIPTIONS.townHall };

export default function TownHallPage() {
  return (
    <Page>
      <AreaHeader id="forum" />
      <Suspense>
        <TownHall />
      </Suspense>
    </Page>
  );
}
