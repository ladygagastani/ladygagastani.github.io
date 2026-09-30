"use client";

import Link from "next/link";
import { useState } from "react";
import { GUIDES, type Guide } from "@/data/guides";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { SectionView } from "./LessonView";
import styles from "./Academy.module.css";

/** A practical guide: the lessons' sections, then where the facts come from, then the next guide. */
export default function GuideView({ guide }: { guide: Guide }) {
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  const i = GUIDES.findIndex((g) => g.id === guide.id);
  const next = GUIDES[i + 1];
  return (
    <article className={styles.lesson}>
      {guide.sections.map((s, k) => <SectionView key={k} s={s} onWord={(w, ctx) => setWord({ w, ctx })} />)}
      <section className={styles.guideSources} aria-labelledby="guide-sources">
        <h2 id="guide-sources" className="label">Where this comes from</h2>
        <ol>{guide.sources.map((s) => <li key={s.url + s.label}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ol>
      </section>
      {next && (
        <footer className={styles.lessonEnd}>
          <Link className="btn ghost" href={`/academy/guide/${next.id}`} transitionTypes={["page-turn"]}>Next guide: {next.title} →</Link>
        </footer>
      )}
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => setWord(null)} />
    </article>
  );
}
