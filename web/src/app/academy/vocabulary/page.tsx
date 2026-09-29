import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Vocabulary from "@/components/academy/Vocabulary";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Vocabulary · ${AREAS.study.name}` };

export default function VocabularyPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Vocabulary</nav>
        <h1 className="page-title">Vocabulary by frequency <span lang="grc">λέξεις</span></h1>
        <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>A few hundred words make up most of any Greek text. Learn the commonest first, and watch how much of a real text you can already recognise.</p>
        <Vocabulary />
      </div>
    </Page>
  );
}
