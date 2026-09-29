import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import JsonLd from "@/components/JsonLd";
import WorkLanding from "@/components/library/WorkLanding";
import { siteData } from "@/lib/build-data";
import { greekEditions, hasTranslation } from "@/lib/catalog";
import { centuries } from "@/lib/works-meta";
import { SHARE_IMAGE, absolute, workDescription, workIdOf, workPath, workTitle } from "@/lib/seo";
import { entriesForWork } from "@/wiki/related";

export const dynamicParams = false;
export function generateStaticParams() {
  return siteData().idx.catalog.authors.flatMap((a) => a.works.map((w) => ({ id: w.id.replace(".", "-") })));
}

function facts(id: string) {
  const { idx, works } = siteData();
  const work = idx.work.get(id);
  const author = idx.authorOf.get(id);
  if (!work || !author) return null;
  const meta = works[id];
  const grc = greekEditions(work)[0]?.label ?? null;
  const when = meta && meta.from !== null && meta.to !== null ? centuries(meta.from, meta.to) : null;
  const description = workDescription({ title: work.title, author: author.name, greekTitle: grc, hasTranslation: hasTranslation(work), genre: meta?.genre, dialect: meta?.dialect, when });
  return { work, author, meta, grc, description };
}

export async function generateMetadata({ params }: PageProps<"/work/[id]">): Promise<Metadata> {
  const f = facts(workIdOf((await params).id));
  if (!f) return {};
  const url = workPath(f.work.id);
  const title = `${workTitle({ title: f.work.title, author: f.author.name })}: read in Greek and English`;
  return {
    title,
    description: f.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${workTitle({ title: f.work.title, author: f.author.name })} · Mathesis Stoicheion`, description: f.description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: `${workTitle({ title: f.work.title, author: f.author.name })} · Mathesis Stoicheion`, description: f.description, images: [SHARE_IMAGE.url] },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[id]">) {
  const id = workIdOf((await params).id);
  const f = facts(id);
  if (!f) notFound();
  const { diff } = siteData();
  return (
    <Page>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "CreativeWork", name: f.work.title, url: absolute(workPath(id)), inLanguage: "grc",
        ...(f.grc && f.grc !== f.work.title ? { alternateName: f.grc } : {}),
        author: { "@type": "Person", name: f.author.name, url: absolute(`/author/${f.author.id}`) },
        ...(f.meta?.genre ? { genre: f.meta.genre } : {}),
      }} />
      <WorkLanding work={f.work} author={f.author} meta={f.meta} diff={diff[id]} related={entriesForWork(id)} siblings={f.author.works.filter((w) => w.id !== id)} />
    </Page>
  );
}
