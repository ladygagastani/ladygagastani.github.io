import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import { AREAS, SITE, type AreaId } from "@/config/areas";
import styles from "../prose.module.css";

export const metadata: Metadata = { title: "About the names" };

const ORDER: AreaId[] = ["home", "library", "reader", "search", "study", "wiki", "archaeology", "census", "map", "forum", "debates", "treasury", "downloads"];

export default function AboutPage() {
  return (
    <Page>
      <article className={`wrap ${styles.prose}`}>
        <span className="label">About</span>
        <h1>{SITE.latin} <span lang="grc" className={styles.gr}>{SITE.greek}</span></h1>
        <p className={styles.lead}>
          <i>Mathēsis</i> means learning; <i>stoicheia</i> are the letters of the alphabet, and also the basic elements
          of anything, as in the title of Euclid&apos;s <i>Elements</i>. Together, <i>learning the letters</i>: where every
          reader of Greek begins.
        </p>
        <div className="meander" aria-hidden="true" />
        <h2>Why each area has a Greek name</h2>
        <p>Every part of the site is named after a place or thing from the Greek world, always with a plain English subtitle.</p>
        <dl className={styles.names}>
          {ORDER.map((id) => {
            const a = AREAS[id];
            return (
              <div key={id}>
                <dt>
                  <Link href={a.href} transitionTypes={["page-turn"]}>{a.name}</Link>
                  {a.greek && <span lang="grc"> {a.greek}</span>}
                  <small>{a.english}</small>
                </dt>
                <dd>{a.origin} {a.fit}</dd>
              </div>
            );
          })}
        </dl>
      </article>
    </Page>
  );
}
