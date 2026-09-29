/**
 * A work's own page (/work/<id with a dash>), for search engines, link previews and anyone who arrives by a link:
 * what the work is, what the library holds of it (each edition and translation, as the collections
 * describe it), and where to read it. Only facts from the catalogue, GLAUx and Wikidata; no blurbs.
 * Drawn while the site is built; it needs no scripts.
 */
import Link from "next/link";
import { greekEditions, translations, versionOf, type CatAuthor, type CatText, type CatWork } from "@/lib/catalog";
import { centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { commonShare } from "@/lib/difficulty";
import { AREAS } from "@/config/areas";
import { workPath } from "@/lib/seo";
import type { RelatedEntry } from "@/wiki/related";
import styles from "./AuthorProfile.module.css";
import lib from "./Library.module.css";

const num = (n: number) => n.toLocaleString("en-GB");
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const MORE = 12;

function TextRow({ w, t }: { w: CatWork; t: CatText }) {
  const href = `/read?w=${w.id}&${t.kind === "translation" ? "tr" : "ed"}=${encodeURIComponent(versionOf(t.urn))}`;
  return (
    <li className={lib.work}>
      <Link href={href} transitionTypes={["page-turn"]} className={lib.workLink}>
        <span className={lib.workTitle}>{t.kind === "translation" ? "English translation" : t.kind === "commentary" ? "Commentary" : "Greek text"}</span>
        <span className={lib.workGr}>{t.desc ?? t.label ?? versionOf(t.urn)}</span>
      </Link>
      <span className={lib.meta}><span className={lib.size}>{kb(t.size)}</span></span>
    </li>
  );
}

export default function WorkLanding({ work, author, meta, diff, related, siblings }: {
  work: CatWork; author: CatAuthor; meta: WorkMeta | undefined; diff: [number, number] | undefined; related: RelatedEntry[]; siblings: CatWork[];
}) {
  const greek = greekEditions(work);
  const english = translations(work);
  const others = work.texts.filter((t) => !greek.includes(t) && !english.includes(t));
  const label = greek[0]?.label;
  const pct = commonShare(diff);
  const when = meta && meta.from !== null && meta.to !== null ? centuries(meta.from, meta.to) : null;
  return (
    <div className={`wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href={AREAS.library.href} transitionTypes={["page-turn"]}>{AREAS.library.name}</Link> › <Link href={`/author/${author.id}`} transitionTypes={["page-turn"]}>{author.name}</Link>
      </p>
      <header className={styles.head}>
        <div className="area-kicker"><span className="tongues draw" aria-hidden="true" /><span className="label">Work</span></div>
        <h1 className={`page-title ${styles.name}`}>{work.title}</h1>
        {label && label !== work.title && <p lang="grc" className={styles.note} style={{ fontFamily: "var(--f-greek)", fontSize: "1.4rem" }}>{label}</p>}
        <p className={styles.note}>By <Link href={`/author/${author.id}`} transitionTypes={["page-turn"]}>{author.name}</Link>.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link className="btn" href={`/read?w=${work.id}`} transitionTypes={["page-turn"]}>
            {english.length ? "Read it with the English beside the Greek" : "Read the Greek"} <span className="arr" aria-hidden="true">→</span>
          </Link>
          <Link className="btn ghost" href={`/author/${author.id}`} transitionTypes={["page-turn"]}>More by {author.name}</Link>
        </div>
        <dl className={styles.facts}>
          {meta?.genre && <div><dt>Kind of writing</dt><dd>{meta.genre}</dd></div>}
          {meta?.dialect && <div><dt>Dialect</dt><dd>{meta.dialect}</dd></div>}
          {when && <div><dt>Written</dt><dd title={DATE_NOTE}>{when}</dd></div>}
          {meta?.tokens ? <div><dt>Length</dt><dd>{num(meta.tokens)} words analysed</dd></div> : null}
          {pct !== null && <div><dt>Vocabulary</dt><dd title="The share of this text's running words that are among the 516 commonest Greek words">{pct}% common words</dd></div>}
          <div><dt>In the library</dt><dd>{greek.length} Greek {greek.length === 1 ? "text" : "texts"}, {english.length} English {english.length === 1 ? "translation" : "translations"}</dd></div>
        </dl>
        {!meta && <p className={styles.note}>GLAUx, the source of the date, kind of writing and dialect, does not analyse this text, so none are shown. Nothing is guessed.</p>}
      </header>
      <div><div className="meander draw" aria-hidden="true" /></div>

      <section className={styles.sec} aria-labelledby="texts-title">
        <h2 id="texts-title">The texts</h2>
        <p className="muted">Each is the collection&apos;s own file, read unchanged from the Perseus Digital Library or Open Greek and Latin. The description is theirs too.</p>
        <ul className={lib.works}>
          {[...greek, ...english, ...others].map((t) => <TextRow key={t.urn} w={work} t={t} />)}
        </ul>
      </section>

      {related.length > 0 && (
        <section className={styles.sec} aria-labelledby="stoa-title">
          <h2 id="stoa-title">In {AREAS.wiki.name}</h2>
          <p className="muted">Entries that quote or point to this work&apos;s Greek.</p>
          <div className={styles.cards}>
            {related.map((e) => (
              <Link key={e.slug} href={`/stoa/${e.slug}`} className={styles.card} transitionTypes={["page-turn"]}>
                <span className="label">{e.kicker}</span>
                <b>{e.title}</b>
                <span>{e.hook}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className={styles.sec} aria-labelledby="more-title">
          <h2 id="more-title">Also by {author.name}</h2>
          <ul className={styles.links}>
            {siblings.slice(0, MORE).map((s) => <li key={s.id}><Link href={workPath(s.id)} transitionTypes={["page-turn"]}>{s.title}</Link></li>)}
          </ul>
          {siblings.length > MORE && <p><Link href={`/author/${author.id}`} transitionTypes={["page-turn"]}>All {num(siblings.length + 1)} works of {author.name} →</Link></p>}
        </section>
      )}
    </div>
  );
}
