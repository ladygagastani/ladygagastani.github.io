/**
 * An author's written article on the author page (data: wiki/author-articles.ts). Sections, in order:
 * Life and work (with a key to the labels), the road of the text (a timeline), how the text survived
 * and where editors disagree, editions to read, and the numbered sources. Every claim is checked
 * against one of those sources before an article is added; a draft (development only) says plainly
 * that it has not been.
 */
import { blocks, inline } from "@/wiki/markup";
import { CERTAINTY, type Certainty } from "@/wiki/types";
import type { AuthorArticle } from "@/wiki/author-articles";
import Link from "next/link";
import { CertTag, Inline, readHref } from "../stoa/Markup";
import AuthorRoad from "./AuthorRoad";
import styles from "./AuthorArticle.module.css";

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Paragraphs, subheadings and lists of the wiki markup; a paragraph may open with a certainty label. */
function Prose({ src }: { src: string }) {
  return (
    <>
      {blocks(src).map((b, i) => {
        if ("p" in b) return <p key={i}>{b.cert && <><CertTag c={b.cert} />{" "}</>}<Inline xs={b.p} /></p>;
        if ("h3" in b) return <h4 key={i}>{b.h3}</h4>;
        if ("list" in b) return <ul key={i}>{b.list.map((li, j) => <li key={j}><Inline xs={li} /></li>)}</ul>;
        return null;
      })}
    </>
  );
}

function PanelIcon({ kind }: { kind: "scroll" | "fork" }) {
  const p = { width: 34, height: 34, viewBox: "0 0 34 34", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
  return kind === "scroll"
    ? <svg {...p}><path d="M9 6h16a2 2 0 012 2v18a2 2 0 01-2 2H9" /><path d="M9 6a3.5 3.5 0 000 7h2M9 28a3.5 3.5 0 010-7h2" /><path d="M15 12h8M15 17h8M15 22h5" /></svg>
    : <svg {...p}><path d="M17 29V16M17 16L8 6M17 16l9-10" /><path d="M8 6v4M8 6h4M26 6v4M26 6h-4" /></svg>;
}

export default function AuthorArticleView({ name, article: a, draft = false }: { name: string; article: AuthorArticle; draft?: boolean }) {
  const used = new Set<Certainty>(
    [a.summary, a.transmission, a.variants].flatMap((s) => [...s.matchAll(/\{(well|debated|legend)\}/g)].map((m) => m[1] as Certainty)),
  );
  a.timeline.forEach((t) => t.certainty && used.add(t.certainty));
  return (
    <>
      <section className={styles.sec} aria-labelledby="life-title" data-article={a.id}>
        {draft && (
          <p className={styles.draft} role="note">
            <b>Design preview.</b> This text comes from the old site and has <b>not</b> been checked against any source. It appears only while the site is being built on this computer, and the published site does not contain it.
          </p>
        )}
        <div className={styles.head}>
          <h2 id="life-title">Life and work</h2>
          {!draft && a.checked && <span className={styles.stamp} title="Every claim on this page was compared with the sources listed at the bottom">Checked against sources · {longDate(a.checked)}</span>}
        </div>
        <div className={styles.lifeGrid}>
          <div className={styles.lead}><Prose src={a.summary} /></div>
          <aside className={styles.key} aria-label="How to read this article">
            <h3 className="label">Before you read</h3>
            <p>Little numbers like <sup className={styles.fakeMark}>1</sup> are footnotes. Tap one and it jumps to the source at the bottom of the page, so you can check us.</p>
            {used.size > 0 && (
              <ul>
                {[...used].map((c) => (
                  <li key={c}><CertTag c={c} /><span>{CERTAINTY[c].about}</span></li>
                ))}
              </ul>
            )}
            <p className="muted">No label? Then the sources simply state it as fact.</p>
          </aside>
        </div>
      </section>

      {a.timeline.length > 0 && (
        <section className={styles.sec} aria-labelledby="road-title">
          <h2 id="road-title">The road of the text</h2>
          <p className="muted">Follow the text from {name}&apos;s own day to the book in your hands. The gaps are the long silences between one mark and the next.</p>
          <AuthorRoad items={a.timeline} />
        </section>
      )}

      <section className={styles.sec} aria-labelledby="survive-title">
        <h2 id="survive-title">How the words reached us</h2>
        <div className={styles.panels}>
          <article className={`${styles.panel} rv`}>
            <PanelIcon kind="scroll" />
            <span className="label">Manuscripts &amp; transmission</span>
            <h3>Passed from hand to hand</h3>
            <Prose src={a.transmission} />
          </article>
          <article className={`${styles.panel} rv`}>
            <PanelIcon kind="fork" />
            <span className="label">Textual variants</span>
            <h3>Where the copies disagree</h3>
            <Prose src={a.variants} />
          </article>
        </div>
      </section>

      {a.editions.length > 0 && (
        <section className={styles.sec} aria-labelledby="eds-title">
          <h2 id="eds-title">Books to read it in</h2>
          <ul className={styles.eds}>
            {a.editions.map((e, i) => (
              <li key={i}>
                <span><Inline xs={inline(e.text)} /></span>
                {e.note && <span className="muted"> <Inline xs={inline(e.note)} /></span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.sec} aria-labelledby="sources-title">
        <h2 id="sources-title">Where this comes from</h2>
        {a.sources.length > 0 ? (
          <ol className={styles.sources}>
            {a.sources.map((s, i) => (
              <li key={i} id={`src-${i + 1}`}>
                {s.cite
                  ? <Link href={readHref(s.cite)} transitionTypes={["page-turn"]} title="Read this passage in the Scroll">{s.label}</Link>
                  : <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>}
                {s.note && <span className="muted"> {s.note}</span>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">No sources are listed for this draft yet, which is why it is not published.</p>
        )}
        <p className={styles.checked}>
          {draft || !a.checked
            ? "Not yet compared with its sources."
            : <>We checked every statement above against these sources on {longDate(a.checked)}. Where they disagree, we say so. What we could not confirm, we left out.</>}
        </p>
      </section>
    </>
  );
}
