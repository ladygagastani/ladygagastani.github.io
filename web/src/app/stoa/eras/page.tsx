import type { Metadata } from "next";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import WikiEras from "@/components/stoa/WikiEras";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Eras of Greek · ${AREAS.wiki.name}` };

export default function ErasPage() {
  return (
    <Page>
      <RefHead title="Eras of Greek" greek="Χρόνοι">Two thousand years of Greek writing, from Homer to the Byzantine Empire: what the library holds from each period, counted, not described.</RefHead>
      <WikiEras />
    </Page>
  );
}
