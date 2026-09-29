import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import StoaIndex, { type RefCard } from "@/components/stoa/StoaIndex";
import type { Catalog } from "@/lib/catalog";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.wiki.name} · ${AREAS.wiki.english}`, description: PAGE_DESCRIPTIONS.stoa };

// Counts for the reference cards, taken from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const TEXTS = CATALOG.authors.flatMap((a) => a.works.flatMap((w) => w.texts)).length;
const n = (x: number) => x.toLocaleString("en-GB");
const REFERENCE: RefCard[] = [
  { href: "/stoa/authors", title: "Authors", greek: "Συγγραφεῖς", blurb: `${n(CATALOG.authors.length)} authors, by period and by kind of writing.` },
  { href: "/stoa/eras", title: "Eras of Greek", greek: "Χρόνοι", blurb: "Greek through the centuries: what the library holds from each period." },
  { href: "/stoa/editions", title: "Editions & translations", greek: "Ἐκδόσεις", blurb: `The printed source behind each of the ${n(TEXTS)} texts, grouped by publisher.` },
];

export default function StoaPage() {
  return (
    <Page>
      <AreaHeader id="wiki" />
      <StoaIndex reference={REFERENCE} />
    </Page>
  );
}
