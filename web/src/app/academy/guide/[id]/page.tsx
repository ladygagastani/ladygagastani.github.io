import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import GuideView from "@/components/academy/GuideView";
import { GUIDES, guideById } from "@/data/guides";
import { AREAS } from "@/config/areas";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/guide/[id]">): Promise<Metadata> {
  const { id } = await params;
  const g = guideById(id);
  return { title: `${g?.title ?? "Guide"} · ${AREAS.study.name}`, description: g?.summary };
}

export default async function GuidePage({ params }: PageProps<"/academy/guide/[id]">) {
  const { id } = await params;
  const guide = guideById(id);
  if (!guide) notFound();
  const n = GUIDES.indexOf(guide) + 1;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Guide {n} of {GUIDES.length}</nav>
        <h1 className="page-title">{guide.title} <span lang="grc" style={{ display: "block", fontSize: "0.5em", marginTop: 8 }}>{guide.greek}</span></h1>
        <p className="muted" style={{ fontSize: "1.1rem" }}>{guide.summary} · about {guide.minutes} minutes</p>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <GuideView guide={guide} />
      </div>
    </Page>
  );
}
