import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import EntryView from "@/components/stoa/EntryView";
import BackToTop from "@/components/BackToTop";
import { ENTRIES, entryBySlug } from "@/wiki/index";
import { inline, plain } from "@/wiki/markup";

export const dynamicParams = false;
export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = entryBySlug.get((await params).slug);
  return e ? { title: `${e.title} · The Painted Stoa`, description: plain(inline(e.hook)).slice(0, 200) } : {};
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = entryBySlug.get((await params).slug);
  if (!e) notFound();
  return (
    <Page>
      <EntryView e={e} />
      <BackToTop />
    </Page>
  );
}
