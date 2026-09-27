import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Census from "@/components/census/Census";
import type { EntryLink, Links } from "@/components/census/shared";
import { AREAS } from "@/config/areas";
import { NAME_ENTRIES } from "@/lib/census";
import { ENTRIES, entryBySlug } from "@/wiki/index";

export const metadata: Metadata = { title: `${AREAS.census.name} · ${AREAS.census.english}` };

// the Painted Stoa's entries about each name and each place (read at build time)
const link = (slug: string): EntryLink => ({ slug, title: entryBySlug.get(slug)!.title });
const links: Links = {
  byName: Object.fromEntries(Object.entries(NAME_ENTRIES).map(([k, slugs]) => [k, slugs.map(link)])),
  byPlace: {},
};
for (const e of ENTRIES) for (const p of e.places ?? []) (links.byPlace[p] ??= []).push({ slug: e.slug, title: e.title });

export default function StoaCensusPage() {
  return (
    <Page>
      <AreaHeader id="census" />
      <Suspense>
        <Census links={links} />
      </Suspense>
    </Page>
  );
}
