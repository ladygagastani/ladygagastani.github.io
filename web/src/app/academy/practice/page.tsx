import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import PracticeClient from "@/components/academy/PracticeClient";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Practice · ${AREAS.study.name}` };

export default function PracticePage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Practice</nav>
        <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>Practice <span lang="grc" style={{ color: "var(--accent)" }}>ἄσκησις</span></h1>
        <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>Short drills. Endings come from the checked tables; the sentences are real, and their answers come from hand-checked analyses.</p>
        <PracticeClient />
      </div>
    </Page>
  );
}
