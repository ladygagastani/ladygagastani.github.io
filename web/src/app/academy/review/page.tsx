import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Review from "@/components/academy/Review";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `Daily review · ${AREAS.study.name}`, ...NOINDEX };

export default function ReviewPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Daily review</nav>
        <h1 className="page-title">Daily review <span lang="grc">ἀνάμνησις</span></h1>
        <Review />
      </div>
    </Page>
  );
}
