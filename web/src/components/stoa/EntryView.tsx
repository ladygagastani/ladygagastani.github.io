/**
 * One entry of the Painted Stoa: title and lead picture, the hook, the body with its quotations and
 * boxes, "Read it yourself", related entries and sources.
 */
import Link from "next/link";
import { blocks, inline } from "@/wiki/markup";
import { CERTAINTY, type Entry } from "@/wiki/types";
import { BIB } from "@/wiki/bibliography";
import { entryBySlug, categoryOf } from "@/wiki/index";
import { Blocks, Figure, Inline, CertTag, readHref, greekAware } from "./Markup";
import Contents from "./Contents";
import { EntryMarkers, SectionNote } from "./EntryNotes";
import styles from "./Stoa.module.css";

export default function EntryView({ e }: { e: Entry }) {
  const body = blocks(e.body);
  const heads = body.flatMap((b) => ("h2" in b ? [{ id: b.id, text: b.h2 }] : []));
  const cat = categoryOf(e.category);
  const certs = new Set([...e.body.matchAll(/\{(well|debated|legend)\}/g)].map((m) => m[1] as keyof typeof CERTAINTY));
  const related = e.related.map((s) => entryBySlug.get(s)!).filter(Boolean);
  return (
    <article className={styles.entry} data-entry={e.slug}>
      <EntryMarkers slug={e.slug} heads={heads} />
      <header className={`wrap ${styles.entryHead}`}>
        <p className={styles.crumbs}><Link href="/stoa" transitionTypes={["page-turn"]}>The Painted Stoa</Link> › <Link href={cat.href ?? `/stoa#${cat.id}`} transitionTypes={["page-turn"]}>{cat.title}</Link></p>
        <h1 className={styles.title}>{e.title}{e.greek && <span className={styles.titleGr} lang="grc">{e.greek}</span>}</h1>
        <p className={styles.kicker}>{e.kicker}</p>
      </header>
      {e.image ? <div className="wrap"><Figure id={e.image} lead /></div> : <div className="wrap"><div className={`${styles.band} rays draw`} aria-hidden="true" /></div>}

      <div className={`wrap ${styles.entryGrid}`}>
        <div className={styles.entryMain}>
          <p className={styles.hook} data-key="top"><Inline xs={inline(e.hook)} /></p>
          <SectionNote slug={e.slug} section="top" title={e.title} />
          <Blocks bs={body} entry={e} />

          <section className={`${styles.readIt} rv`} aria-labelledby="read-it">
            <h2 id="read-it" className={styles.h2}>Read it yourself</h2>
            <ul>
              {e.readIt.map((r) => (
                <li key={`${r.work}${r.ref}`}>
                  <Link href={readHref(r)} transitionTypes={["page-turn"]}>
                    <b>{r.label}</b>
                    <span>{greekAware(r.why, "w")}</span>
                    <small>Open in the Scroll →</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className={`${styles.related} rv`} aria-labelledby="related">
              <h2 id="related" className={styles.h2}>Related entries</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}><Link href={`/stoa/${r.slug}`} transitionTypes={["page-turn"]}><span className="label">{categoryOf(r.category).title}</span><b>{r.title}</b><span>{r.kicker}</span></Link></li>
                ))}
              </ul>
            </section>
          )}

          <section className={`${styles.sources} rv`} aria-labelledby="sources">
            <h2 id="sources" className={styles.h2}>Sources</h2>
            <div className={styles.sourceCols}>
              <div>
                <h3 className="label">Ancient sources, in the library</h3>
                <ul>{e.primary.map((c) => <li key={`${c.work}${c.ref}`}><Link href={readHref(c)} transitionTypes={["page-turn"]}>{c.label}</Link></li>)}</ul>
              </div>
              <div>
                <h3 className="label">Modern scholarship</h3>
                <ul>
                  {e.secondary.map(({ id, note }) => {
                    const b = BIB[id];
                    return <li key={id}>{b.author}, <i>{b.title}</i> ({b.publisher}, {b.year}).{note && <span className={styles.note}> {note}</span>}</li>;
                  })}
                </ul>
              </div>
            </div>
            <p className={styles.checked}>Every Greek quotation here is checked word for word against the edition it cites, and every translation against the translation named. Written {new Date(e.written).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
          </section>
        </div>

        <aside className={styles.entryAside}>
          {heads.length > 1 && <Contents heads={heads} />}
          {certs.size > 0 && (
            <div className={styles.certKey}>
              <p className="label">How sure is this?</p>
              {[...certs].map((c) => <p key={c}><CertTag c={c} /> <span>{CERTAINTY[c].about}</span></p>)}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
