"use client";
/** The Treasury's sections for marks on passages: recent, notes, bookmarks, highlights, cross-references. */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { fold } from "@/lib/catalog";
import { useMarks, type Colour, type Mark } from "@/lib/annotations";
import { rangeText } from "@/lib/treasury-io";
import NoteEditor from "@/components/reader/NoteEditor";
import RichText from "@/components/notes/RichText";
import notesCss from "@/components/notes/Notes.module.css";
import { ago, byWorkSorted, plural, readHref, wordHref, workName, type TreasuryState } from "./data";
import { stoaLabel, useStoaTitles } from "@/wiki/useTitles";
import styles from "./Treasury.module.css";

function WorkHead({ t, work, n }: { t: TreasuryState; work: string; n?: number }) {
  const w = workName(t.idx, work);
  return (
    <h3 className={styles.workHead}>
      <Link href={`/read?w=${work}`} transitionTypes={["page-turn"]}>
        {w.author && <span className={styles.byline}>{w.author}</span>} <span className={styles.workTitle}>{w.title}</span>
      </Link>
      {n !== undefined && <span className={styles.n}>{n}</span>}
    </h3>
  );
}

const Quote = ({ m, long = 140 }: { m: Mark; long?: number }) =>
  m.quote ? <p className={styles.quote} lang="grc">{m.quote.length > long ? `${m.quote.slice(0, long)}…` : m.quote}</p> : null;

function RefLink({ m }: { m: Mark }) {
  return <Link className={styles.ref} href={readHref(m)} transitionTypes={["page-turn"]} title="Open this passage in the reader">{rangeText(m)}</Link>;
}

function RemoveButton({ m, what, also }: { m: Mark; what: string; also?: Mark }) {
  const [sure, setSure] = useState(false);
  const remove = () => { useMarks.getState().remove(m.id); if (also) useMarks.getState().remove(also.id); };
  return sure
    ? <span className={styles.confirm}><button type="button" className="chip" onClick={remove}>Remove {what}</button><button type="button" className="chip" onClick={() => setSure(false)}>Keep</button></span>
    : <button type="button" className={styles.x} onClick={() => setSure(true)} aria-label={`Remove this ${what}`} title={`Remove this ${what}`}>×</button>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

// ------------------------------------------------------------ where you left off + latest
export function ContinueReading({ t, limit }: { t: TreasuryState; limit?: number }) {
  const list = Object.entries(t.positions).sort((a, b) => b[1].t - a[1].t).slice(0, limit);
  if (!list.length) return null;
  return (
    <div className={styles.continue}>
      <h2>Continue reading</h2>
      <ol className={styles.shelf}>
        {list.map(([work, p], i) => {
          const w = workName(t.idx, work);
          return (
            <li key={work} style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/read?w=${work}&ed=${p.ed}${p.tr ? `&tr=${p.tr}` : "&tr=none"}&at=${encodeURIComponent(p.at)}`} transitionTypes={["page-turn"]} className={styles.spine}>
                <span className={styles.byline}>{w.author}</span>
                <b>{w.title}</b>
                <span className={styles.at}>at {p.at} · {ago(p.t)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const KIND_LABEL: Record<Mark["kind"], string> = { note: "Note", favourite: "In your anthology", bookmark: "Bookmark", highlight: "Highlight", xref: "Cross-reference" };

export function RecentSection({ t }: { t: TreasuryState }) {
  const stoa = useStoaTitles(Object.values(t.pageNotes).some((n) => n.kind === "stoa"));
  const latest = useMemo(() => {
    const items: { t: number; key: string; node: React.ReactNode }[] = [];
    for (const m of t.marks) {
      const w = workName(t.idx, m.work);
      items.push({
        t: m.updated, key: m.id, node: (
          <>
            <span className="label">{KIND_LABEL[m.kind]} · {ago(m.updated)}</span>
            <p><Link href={readHref(m)} transitionTypes={["page-turn"]}>{w.author ? `${w.author}, ` : ""}{w.title} {rangeText(m)}</Link></p>
            {m.kind === "note" && m.text ? <RichText text={m.text.length > 220 ? m.text.slice(0, 220) + "…" : m.text} className={notesCss.rich} /> : <Quote m={m} long={110} />}
          </>
        ),
      });
    }
    for (const c of Object.values(t.deck)) if (c.source === "saved") items.push({
      t: c.added, key: `w:${c.id}`, node: (
        <>
          <span className="label">Saved word · {ago(c.added)}</span>
          <p><Link href={wordHref(c.lemma)} className={styles.lemma} lang="grc" transitionTypes={["page-turn"]}>{c.lemma}</Link> <span className="muted">{c.gloss}</span></p>
        </>
      ),
    });
    for (const n of Object.values(t.pageNotes)) items.push({
      t: n.updated, key: n.id, node: (
        <>
          <span className="label">{n.kind === "author" ? "Note on an author" : n.kind === "stoa" ? "Note in the Painted Stoa" : "Note on a word"} · {ago(n.updated)}</span>
          <p>{n.kind === "author"
            ? <Link href={`/treasury?s=authors&a=${n.target}`}>{t.idx?.author.get(n.target)?.name ?? n.target}</Link>
            : n.kind === "stoa"
            ? <Link href={`/stoa/${n.target.replace("#top", "")}`} transitionTypes={["page-turn"]}>{stoaLabel(stoa, n.target)}</Link>
            : <Link href={wordHref(n.target)} lang="grc" className={styles.lemma} transitionTypes={["page-turn"]}>{n.target}</Link>}</p>
          <RichText text={n.text.length > 220 ? n.text.slice(0, 220) + "…" : n.text} className={notesCss.rich} />
        </>
      ),
    });
    return items.sort((a, b) => b.t - a.t).slice(0, 9);
  }, [t.marks, t.deck, t.pageNotes, t.idx, stoa]);

  return (
    <>
      <ContinueReading t={t} limit={6} />
      {latest.length > 0 && (
        <div>
          <h2>Latest</h2>
          <ol className={styles.cards}>
            {latest.map((x, i) => <li key={x.key} className={styles.card} style={{ "--i": i } as React.CSSProperties}>{x.node}</li>)}
          </ol>
        </div>
      )}
    </>
  );
}

// ------------------------------------------------------------ notes
export function NotesSection({ t }: { t: TreasuryState }) {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"work" | "new">("work");
  const tag = params.get("tag");
  const notes = useMemo(() => t.marks.filter((m) => m.kind === "note"), [t.marks]);
  const tags = useMemo(() => {
    const c = new Map<string, number>();
    for (const m of notes) for (const x of m.tags ?? []) c.set(x, (c.get(x) ?? 0) + 1);
    return [...c].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [notes]);
  const n = fold(q).trim();
  const shown = notes.filter((m) => (!tag || m.tags?.includes(tag)) && (!n || [m.text, m.quote, workName(t.idx, m.work).title, workName(t.idx, m.work).author, ...(m.tags ?? [])].some((s) => s && fold(s).includes(n))));
  const setTag = (x: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (x) p.set("tag", x); else p.delete("tag");
    router.replace(`/treasury?${p}`, { scroll: false });
  };
  const card = (m: Mark) => (
    <li key={m.id} className={styles.noteCard}>
      <NoteEditor mark={m} startOpen={false} onClose={() => {}} head={
        <span className={styles.noteHead}><RefLink m={m} /> <Quote m={m} long={90} /></span>
      } />
    </li>
  );

  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Notes on passages</h2>
        <p className="muted">{plural(notes.length, "note")}. Edit them here or beside the text; each opens in its passage.</p>
      </div>
      {notes.length > 0 && (
        <div className={styles.filters}>
          <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find in your notes (Greek or English)" aria-label="Find in your notes" />
          <span className={styles.seg} role="group" aria-label="Order">
            <button type="button" aria-pressed={order === "work"} onClick={() => setOrder("work")}>By work</button>
            <button type="button" aria-pressed={order === "new"} onClick={() => setOrder("new")}>Newest</button>
          </span>
          {tags.length > 0 && (
            <div className={styles.tagRow} role="group" aria-label="Tags">
              <button type="button" className="chip" aria-pressed={!tag} onClick={() => setTag(null)}>All tags</button>
              {tags.map(([x, c]) => <button key={x} type="button" className="chip" aria-pressed={tag === x} onClick={() => setTag(tag === x ? null : x)}>#{x} <small>{c}</small></button>)}
            </div>
          )}
        </div>
      )}
      {!notes.length && <Empty>No notes yet. In the reader, select words or click a passage number and choose <b>Note</b>.</Empty>}
      {notes.length > 0 && !shown.length && <Empty>No note matches.</Empty>}
      {order === "new"
        ? <ol className={styles.noteList}>{[...shown].sort((a, b) => b.updated - a.updated).map((m) => (
            <li key={m.id} className={styles.noteGroupItem}><p className={styles.small}>{workName(t.idx, m.work).author}, {workName(t.idx, m.work).title}</p><ol className={styles.noteList}>{card(m)}</ol></li>
          ))}</ol>
        : byWorkSorted(t.idx, shown).map(([work, ms]) => (
          <div key={work} className={styles.group}>
            <WorkHead t={t} work={work} n={ms.length} />
            <ol className={styles.noteList}>{ms.map(card)}</ol>
          </div>
        ))}
    </>
  );
}

// ------------------------------------------------------------ bookmarks
export function BookmarksSection({ t }: { t: TreasuryState }) {
  const marks = t.marks.filter((m) => m.kind === "bookmark");
  return (
    <>
      <ContinueReading t={t} />
      <div className={styles.sectionHead}>
        <h2>Bookmarks</h2>
        <p className="muted">{plural(marks.length, "bookmark")}. The reader also remembers where you stopped in every book, above.</p>
      </div>
      {!marks.length && <Empty>No bookmarks yet. In the reader, click a passage number and choose <b>Bookmark</b>.</Empty>}
      {byWorkSorted(t.idx, marks).map(([work, ms]) => (
        <div key={work} className={styles.group}>
          <WorkHead t={t} work={work} n={ms.length} />
          <ol className={styles.rows}>
            {ms.map((m) => <li key={m.id}><RefLink m={m} /><Quote m={m} /><span className={styles.when}>{ago(m.created)}</span><RemoveButton m={m} what="bookmark" /></li>)}
          </ol>
        </div>
      ))}
    </>
  );
}

// ------------------------------------------------------------ highlights
const COLOURS: Colour[] = ["red", "ochre", "blue", "green"];
export function HighlightsSection({ t }: { t: TreasuryState }) {
  const [colour, setColour] = useState<Colour | null>(null);
  const all = t.marks.filter((m) => m.kind === "highlight");
  const marks = all.filter((m) => !colour || m.colour === colour);
  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Highlights</h2>
        <p className="muted">{plural(all.length, "highlight")}. Colours mean what you decide they mean.</p>
      </div>
      {all.length > 0 && (
        <div className={styles.tagRow} role="group" aria-label="Colour">
          <button type="button" className="chip" aria-pressed={!colour} onClick={() => setColour(null)}>Every colour</button>
          {COLOURS.map((c) => {
            const n = all.filter((m) => m.colour === c).length;
            return n ? <button key={c} type="button" className="chip" aria-pressed={colour === c} onClick={() => setColour(colour === c ? null : c)}><span className={styles.swatch} data-colour={c} /> {c} <small>{n}</small></button> : null;
          })}
        </div>
      )}
      {!all.length && <Empty>No highlights yet. In the reader, select some Greek and pick a colour.</Empty>}
      {byWorkSorted(t.idx, marks).map(([work, ms]) => (
        <div key={work} className={styles.group}>
          <WorkHead t={t} work={work} n={ms.length} />
          <ol className={styles.rows}>
            {ms.map((m) => <li key={m.id}><span className={styles.swatch} data-colour={m.colour} aria-label={m.colour} /><RefLink m={m} /><p className={styles.quote} lang="grc" data-hl={m.colour}>{m.quote}</p><RemoveButton m={m} what="highlight" /></li>)}
          </ol>
        </div>
      ))}
    </>
  );
}

// ------------------------------------------------------------ cross-references
export function XrefsSection({ t }: { t: TreasuryState }) {
  const marks = t.marks.filter((m) => m.kind === "xref" && m.link);
  // a cross-reference is stored on both passages, each pointing at the other; show each pair once
  const partner = (m: Mark) => marks.find((o) => o !== m && o.work === m.link!.work && o.start.u === m.link!.start.u && o.link!.work === m.work && o.link!.start.u === m.start.u);
  const pairs = marks.filter((m, i) => { const p = partner(m); return !p || marks.indexOf(p) > i; });
  const side = (work: string, ed: string, at: string, label: string, quote?: string) => {
    const w = workName(t.idx, work);
    return (
      <Link href={`/read?w=${work}&ed=${ed}&at=${encodeURIComponent(at)}`} transitionTypes={["page-turn"]} className={styles.xside}>
        <span className={styles.byline}>{w.author}</span> <b>{w.title} {label}</b>
        {quote && <span lang="grc" className={styles.quote}>{quote.length > 90 ? quote.slice(0, 90) + "…" : quote}</span>}
      </Link>
    );
  };
  return (
    <>
      <div className={styles.sectionHead}>
        <h2>Cross-references</h2>
        <p className="muted">{plural(pairs.length, "link")} between passages, made in side-by-side reading.</p>
      </div>
      {!pairs.length && <Empty>None yet. Open two texts side by side, choose <b>Cross-reference</b> on a passage in one, then on a passage in the other.</Empty>}
      <ol className={styles.xrefs}>
        {pairs.map((m) => {
          const p = partner(m);
          return (
            <li key={m.id}>
              {side(m.work, m.ed, m.start.u, rangeText(m), m.quote)}
              <span className={styles.link} aria-label="linked to">⟷</span>
              {p ? side(p.work, p.ed, p.start.u, rangeText(p), p.quote) : side(m.link!.work, m.link!.ed, m.link!.start.u, m.link!.label.split(" ").pop() ?? m.link!.start.u)}
              <RemoveButton m={m} also={p} what="cross-reference" />
            </li>
          );
        })}
      </ol>
    </>
  );
}
