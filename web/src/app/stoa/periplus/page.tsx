import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Periplus, { type EntryLink } from "@/components/map/Periplus";
import { AREAS } from "@/config/areas";
import { ENTRIES } from "@/wiki/index";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.map.name} · ${AREAS.map.english}`, description: PAGE_DESCRIPTIONS.periplus };

// the Painted Stoa's entries about each place, by Pleiades id
const entriesByPlace: Record<string, EntryLink[]> = {};
for (const e of ENTRIES) for (const p of e.places ?? []) (entriesByPlace[p] ??= []).push({ slug: e.slug, title: e.title });

export default function StoaPeriplusPage() {
  return (
    <Page>
      <AreaHeader id="map" />
      <Suspense>
        <Periplus entriesByPlace={entriesByPlace} />
      </Suspense>
      <p className="wrap muted" style={{ fontSize: "0.88rem", paddingBottom: 40 }}>
        Sea and coastlines: Ancient World Mapping Center, geodata (ODbL 1.0), derived from the Barrington Atlas of the Greek and Roman World.
        Places: Pleiades (pleiades.stoa.org), CC BY 3.0. Counts of mentions: GLAUx, CC BY-SA 4.0. Everything is served from this site.
      </p>
    </Page>
  );
}
