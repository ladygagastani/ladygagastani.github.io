import type { Metadata } from "next";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import WikiEditions from "@/components/stoa/WikiEditions";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Editions & translations · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.editions };

export default function EditionsPage() {
  return (
    <Page>
      <RefHead title="Editions & translations" greek="Ἐκδόσεις">The printed edition behind every Greek text in the library, and the translation beside it: who edited or translated it, and who published it.</RefHead>
      <WikiEditions />
    </Page>
  );
}
