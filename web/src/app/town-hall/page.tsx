import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import TownHall from "@/components/community/TownHall";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.forum.name} · ${AREAS.forum.english}` };

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
