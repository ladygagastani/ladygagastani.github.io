import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import ReportBugLink from "@/components/ReportBugLink";
import NotFoundSearch from "@/components/NotFoundSearch";
import { AREAS } from "@/config/areas";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

/**
 * An address that leads nowhere: a broken sherd that pieces itself together, 404 in Greek numerals, and the
 * ways on (search, the main areas, a report). Also served as 404.html on the static site.
 */
export default function NotFound() {
  return (
    <Page>
      <div className={`wrap ${styles.page}`}>
        <figure className={styles.sherd} aria-labelledby="nf-num">
          <svg viewBox="0 0 320 220" role="img" aria-label="A broken potsherd, pieced together, painted with υδʹ">
            <g className={styles.pieceA}><path d="M22 70 L118 22 L152 96 L96 150 L30 128 Z" /></g>
            <g className={styles.pieceB}><path d="M118 22 L236 18 L262 64 L200 104 L152 96 Z" /></g>
            <g className={styles.pieceC}><path d="M96 150 L152 96 L200 104 L262 64 L298 132 L250 196 L130 200 Z" /></g>
            <path className={styles.cracks} d="M118 22 L152 96 L96 150 M152 96 L200 104 L262 64" />
            <text className={styles.num} x="160" y="138" textAnchor="middle" lang="grc">υδʹ</text>
            <path className={styles.band} d="M126 186 C170 192 222 190 270 166" />
          </svg>
          <figcaption id="nf-num" className={styles.caption}>
            404 in <a href="https://en.wikipedia.org/wiki/Greek_numerals" rel="noopener">Greek numerals</a>: υ is 400, δ is 4.
          </figcaption>
        </figure>

        <div className={styles.text}>
          <p className="label">Not found</p>
          <h1 className="page-title">This page has not survived <span lang="grc">ἀπόλωλε</span></h1>
          <p className={styles.lead}>
            The address may be mistyped, or the page may have moved. You are in good company: Aeschylus wrote an estimated
            70 to 90 plays, and <Link href="/author/tlg0085" transitionTypes={["page-turn"]}>seven survive</Link>.
          </p>
          <NotFoundSearch />
          <nav className={styles.ways} aria-label="Ways on">
            {(["home", "library", "study", "wiki"] as const).map((id) => (
              <Link key={id} href={AREAS[id].href} transitionTypes={["page-turn"]}>
                <b>{AREAS[id].name}</b> <span className="muted">{AREAS[id].english}</span>
              </Link>
            ))}
          </nav>
          <p className="muted">
            Followed a link on this site that led here? <ReportBugLink>Tell us about the broken link</ReportBugLink>.
          </p>
        </div>
      </div>
    </Page>
  );
}
