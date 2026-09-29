import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Alphabet from "@/components/academy/Alphabet";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `The alphabet · ${AREAS.study.name}` };

export default function AlphabetPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › The alphabet</nav>
        <h1 className="page-title">The alphabet <span lang="grc">τὰ γράμματα</span></h1>
        <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>
          Twenty-four letters, seven of them vowels. Choose a letter to see how it is written, what it is called, and how it sounded.
        </p>
        <Alphabet />
      </div>
    </Page>
  );
}
