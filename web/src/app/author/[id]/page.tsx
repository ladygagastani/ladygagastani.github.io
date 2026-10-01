import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import JsonLd from "@/components/JsonLd";
import { AuthorView } from "@/components/library/AuthorProfile";
import { siteData } from "@/lib/build-data";
import { hasTranslation } from "@/lib/catalog";
import { lifeSpan } from "@/lib/authors-meta";
import { SHARE_IMAGE, absolute, authorDescription } from "@/lib/seo";
import { entriesForAuthor } from "@/wiki/related";
import { articleFor } from "@/wiki/author-articles-all";
import type { WorkMeta } from "@/lib/works-meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return siteData().idx.catalog.authors.map((a) => ({ id: a.id }));
}

function facts(id: string) {
  const { idx, who } = siteData();
  const author = idx.author.get(id);
  if (!author) return null;
  const wd = who[id];
  return { author, wd, description: authorDescription({ name: author.name, desc: wd?.desc, lived: lifeSpan(wd), works: author.works.length, english: author.works.filter(hasTranslation).length }) };
}

export async function generateMetadata({ params }: PageProps<"/author/[id]">): Promise<Metadata> {
  const f = facts((await params).id);
  if (!f) return {};
  const url = `/author/${f.author.id}`;
  return {
    title: `${f.author.name}: works in Greek and English`,
    description: f.description,
    alternates: { canonical: url },
    openGraph: { type: "profile", url, title: `${f.author.name} · Mathesis Stoicheion`, description: f.description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: `${f.author.name} · Mathesis Stoicheion`, description: f.description, images: [SHARE_IMAGE.url] },
  };
}

export default async function AuthorLanding({ params }: PageProps<"/author/[id]">) {
  const { id } = await params;
  const f = facts(id);
  if (!f) notFound();
  const { works, diff } = siteData();
  // only this author's rows go into the page
  const meta: Record<string, WorkMeta> = {};
  const common: Record<string, [number, number]> = {};
  for (const w of f.author.works) { if (works[w.id]) meta[w.id] = works[w.id]; if (diff[w.id]) common[w.id] = diff[w.id]; }
  return (
    <Page>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Person", name: f.author.name, url: absolute(`/author/${id}`),
        ...(f.wd?.desc ? { description: f.wd.desc } : {}),
        ...(f.wd?.place ? { birthPlace: f.wd.place } : {}),
        sameAs: [...(f.wd ? [`https://www.wikidata.org/wiki/${f.wd.q}`] : []), ...(f.wd?.wp ? [f.wd.wp] : [])],
      }} />
      <AuthorView author={f.author} meta={meta} diff={common} who={f.wd} related={entriesForAuthor(id)} article={articleFor(id)} landing />
    </Page>
  );
}
