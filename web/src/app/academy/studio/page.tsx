import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Studio from "@/components/academy/Studio";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Recording studio · ${AREAS.study.name}`, robots: { index: false } };

// Only useful on the project computer (it saves files into the project); not linked from the site.
const LOCAL = process.env.NODE_ENV === "development";

export default function StudioPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Recording studio</nav>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>Recording studio</h1>
        {LOCAL ? <Studio /> : <p className="muted">The recording studio is used on the project computer, where the site&apos;s audio is recorded and saved.</p>}
      </div>
    </Page>
  );
}
