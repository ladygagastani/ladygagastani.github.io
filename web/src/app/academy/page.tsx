import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import AcademyProgress from "@/components/academy/AcademyProgress";
import { AREAS } from "@/config/areas";
import { LESSONS } from "@/data/lessons";
import styles from "@/components/academy/Academy.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.study.name} · ${AREAS.study.english}`, description: PAGE_DESCRIPTIONS.academy };

const TOOLS = [
  { href: "/academy/today", title: "Today's session", gr: "ἡμέρα", text: "A few minutes a day: your flashcards, one ending, one real sentence." },
  { href: "/academy/alphabet", title: "The alphabet", gr: "τὰ γράμματα", text: "Every letter: how to write it, its name, and how it sounded." },
  { href: "/academy/review", title: "Daily review", gr: "ἀνάμνησις", text: "Flashcards that come back just before you would forget them." },
  { href: "/academy/practice", title: "Practice", gr: "ἄσκησις", text: "Quick drills on endings, and parsing real words in real sentences." },
  { href: "/academy/tables", title: "Tables of forms", gr: "παραδείγματα", text: "Every standard declension and conjugation, searchable and checked against real texts." },
  { href: "/academy/vocabulary", title: "Vocabulary by frequency", gr: "λέξεις", text: "The commonest words first, and how much of a text you can already read." },
];

export default function AcademyPage() {
  return (
    <Page>
      <AreaHeader id="study" />
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 40, paddingBlock: "var(--after-head) 40px" }}>
        <AcademyProgress />

        <section style={{ display: "grid", gap: 18 }} aria-labelledby="lessons-title">
          <div>
            <span className="label">A path from nothing to Homer</span>
            <h2 id="lessons-title" style={{ marginTop: 8 }}>Lessons</h2>
          </div>
          <ol className={styles.path}>
            {LESSONS.map((l, i) => (
              <li key={l.id}>
                <Link href={`/academy/lesson/${l.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
                  <span className={styles.pathNo}>{i + 1}</span>
                  <span>
                    <b>{l.title}</b> <span lang="grc" className={styles.pathGr}>{l.greek}</span>
                    <span className={styles.pathAbout}>{l.summary}</span>
                  </span>
                  <span className={styles.pathMin}>{l.minutes} min</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section style={{ display: "grid", gap: 18 }} aria-labelledby="tools-title">
          <h2 id="tools-title">Practice and reference</h2>
          <div className={`${styles.hub} snap-row`}>
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} transitionTypes={["page-turn"]} className={styles.card}>
                <span className={styles.cardGr} lang="grc">{t.gr}</span>
                <h3>{t.title}</h3>
                <p className="muted">{t.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
