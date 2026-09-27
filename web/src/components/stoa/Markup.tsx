/**
 * Draws the Painted Stoa's markup (src/wiki/markup.ts) as React elements. Greek words in running
 * English are set in the Greek typeface; citations open the passage in the Scroll (the reader).
 */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Blk, Inl } from "@/wiki/markup";
import { CERTAINTY, type Certainty, type Entry } from "@/wiki/types";
import { IMAGES } from "@/wiki/images";
import { entryBySlug } from "@/wiki/index";
import styles from "./Stoa.module.css";

const GREEK_RUN = /((?:[Ͱ-Ͽἀ-῿][̀-ͯͰ-Ͽἀ-῿’ʼ]*[\s,·;.]*)+)/u;

/** Set runs of Greek in the Greek face (and mark them lang="grc" for screen readers and hyphenation). */
export function greekAware(s: string, key: string | number): ReactNode {
  const parts = s.split(GREEK_RUN);
  if (parts.length === 1) return s;
  return <Fragment key={key}>{parts.map((p, i) => (i % 2 ? <span key={i} lang="grc" className={styles.inGr}>{p}</span> : p))}</Fragment>;
}

export const readHref = (c: { work: string; ref: string }) => `/read?w=${c.work}&at=${encodeURIComponent(c.ref)}`;

export function CertTag({ c }: { c: Certainty }) {
  return <span className={`tag ${CERTAINTY[c].cls}`} title={CERTAINTY[c].about}>{CERTAINTY[c].label}</span>;
}

export function Inline({ xs }: { xs: Inl[] }) {
  return (
    <>
      {xs.map((x, i) => {
        if (typeof x === "string") return greekAware(x, i);
        if ("b" in x) return <b key={i}><Inline xs={x.b} /></b>;
        if ("i" in x) return <i key={i}><Inline xs={x.i} /></i>;
        if ("cert" in x) return <CertTag key={i} c={x.cert} />;
        if ("cite" in x) return <Link key={i} className={styles.cite} href={readHref(x.cite)} transitionTypes={["page-turn"]} title="Read this passage in the Scroll">{greekAware(x.text, "t")}</Link>;
        if ("wiki" in x) {
          const e = entryBySlug.get(x.wiki);
          return <Link key={i} className={styles.wikiLink} href={`/stoa/${x.wiki}`} transitionTypes={["page-turn"]} title={e?.kicker}>{greekAware(x.text, "t")}</Link>;
        }
        return <a key={i} href={x.ext} target="_blank" rel="noopener noreferrer">{x.text}</a>;
      })}
    </>
  );
}

export function Quote({ q }: { q: NonNullable<Entry["quotes"]>[string] }) {
  return (
    <figure className={`${styles.quote} rv`}>
      <blockquote lang="grc" className={styles.quoteGr}>{q.grc}</blockquote>
      <p className={styles.quoteTr}>“{q.tr}”</p>
      <figcaption>
        <Link href={readHref(q)} transitionTypes={["page-turn"]}>{q.label}</Link>
        <span> · translated by {q.trBy}</span>
      </figcaption>
    </figure>
  );
}

export function Figure({ id, lead = false }: { id: string; lead?: boolean }) {
  const im = IMAGES[id];
  if (!im) return null;
  return (
    <figure className={lead ? styles.lead : `${styles.figure} rv`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service */}
      <img src={`/images/${im.file}`} width={im.width} height={im.height} alt={im.alt} loading={lead ? "eager" : "lazy"} decoding="async" />
      <figcaption>
        <span className={styles.figTitle}>{im.title}</span>{im.date && <>, {im.date}</>}. {im.place}.
        <span className={styles.credit}> {im.creator !== "Unknown" ? `${im.creator}. ` : ""}<a href={im.source} target="_blank" rel="noopener noreferrer">{im.sourceName}</a>, <a href={im.licenceUrl} target="_blank" rel="noopener noreferrer">{im.licence}</a>.</span>
      </figcaption>
    </figure>
  );
}

export function Timeline({ items }: { items: NonNullable<Entry["timeline"]> }) {
  return (
    <ol className={`${styles.timeline} rv`} aria-label="Timeline">
      {items.map((t, i) => (
        <li key={i}>
          <span className={styles.when}>{t.when}</span>
          <span className={styles.what}>{greekAware(t.what, i)} {t.certainty && t.certainty !== "well" && <CertTag c={t.certainty} />}</span>
        </li>
      ))}
    </ol>
  );
}

export function Blocks({ bs, entry }: { bs: Blk[]; entry: Entry }) {
  return (
    <>
      {bs.map((b, i) => {
        if ("h2" in b) return <h2 key={i} id={b.id} className={`${styles.h2} rv`}>{greekAware(b.h2, "h")}</h2>;
        if ("h3" in b) return <h3 key={i} className={styles.h3}>{greekAware(b.h3, "h")}</h3>;
        if ("quote" in b) return <Quote key={i} q={entry.quotes![b.quote]} />;
        if ("figure" in b) return <Figure key={i} id={b.figure} />;
        if ("timeline" in b) return entry.timeline ? <Timeline key={i} items={entry.timeline} /> : null;
        if ("dyk" in b) return (
          <aside key={i} className={`${styles.dyk} rv`}>
            <span className="label">Did you know?</span>
            {b.dyk.map((p, j) => <p key={j}><Inline xs={p} /></p>)}
          </aside>
        );
        if ("list" in b) return <ul key={i} className={styles.list}>{b.list.map((it, j) => <li key={j}><Inline xs={it} /></li>)}</ul>;
        return (
          <p key={i} className={b.cert ? styles.claim : undefined} data-cert={b.cert}>
            {b.cert && <CertTag c={b.cert} />} <Inline xs={b.p} />
          </p>
        );
      })}
    </>
  );
}
