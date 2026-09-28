"use client";
/**
 * Pieces shared by the Town Hall and the Pnyx: a post's text (light formatting and links to
 * passages, wiki entries and the web), a quoted passage, the author line, upvotes, reporting,
 * the writing box, and the invitation to sign in.
 */
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useState, type ReactNode } from "react";
import NoteField from "@/components/notes/NoteField";
import { isBanned, problem, useAccount } from "@/lib/community/client";
import { ago, report, type Author, type Quote } from "@/lib/community/data";
import styles from "./Community.module.css";

// ------------------------------------------------------------ text
/** [text](cts:tlg0012.tlg001:1.1) → the reader; (wiki:slug) → the Painted Stoa; http(s) → the web. */
function linkFor(target: string): { href: string; external: boolean } | null {
  const cts = /^cts:([a-z0-9]+\.[a-z0-9]+):([^\s)]+)$/.exec(target);
  if (cts) return { href: `/read?w=${cts[1]}&at=${encodeURIComponent(cts[2].split("-")[0])}`, external: false };
  const wiki = /^wiki:([a-z0-9-]+)$/.exec(target);
  if (wiki) return { href: `/stoa/${wiki[1]}`, external: false };
  if (/^https?:\/\/\S+$/.test(target)) return { href: target, external: true };
  return null;
}

function inline(s: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) {
      const l = linkFor(m[2]);
      out.push(!l ? m[0] : l.external
        ? <a key={`${key}a${i++}`} href={l.href} rel="noopener nofollow ugc" target="_blank">{m[1]}</a>
        : <Link key={`${key}a${i++}`} href={l.href}>{m[1]}</Link>);
    } else if (m[3] !== undefined) out.push(<b key={`${key}b${i++}`}>{m[3]}</b>);
    else out.push(<i key={`${key}i${i++}`}>{m[4]}</i>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** A post as written: **bold**, *italic*, "- " lists, blank lines between paragraphs, links. Never raw HTML. */
export function PostText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  text.split(/\n{2,}/).forEach((para, pi) => {
    let buf: string[] = [], list: string[] = [];
    const flushP = () => {
      if (buf.some((b) => b.trim())) blocks.push(<p key={`p${pi}.${blocks.length}`}>{buf.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l, `${pi}.${i}`)}</Fragment>)}</p>);
      buf = [];
    };
    const flushL = () => { if (list.length) blocks.push(<ul key={`u${pi}.${blocks.length}`}>{list.map((l, i) => <li key={i}>{inline(l, `${pi}l${i}`)}</li>)}</ul>); list = []; };
    for (const l of para.split("\n")) {
      if (/^\s*[-•]\s+/.test(l)) { flushP(); list.push(l.replace(/^\s*[-•]\s+/, "")); }
      else { flushL(); buf.push(l); }
    }
    flushL(); flushP();
  });
  return <div className={styles.text}>{blocks}</div>;
}

/** A passage quoted from the reader, with its citation linking back to it. */
export function QuoteBlock({ quote }: { quote: Quote }) {
  return (
    <figure className={styles.quote}>
      <blockquote lang="grc">{quote.grc}</blockquote>
      {quote.eng && <blockquote className={styles.quoteEng}>{quote.eng}</blockquote>}
      <figcaption><Link href={quote.href}>{quote.cite}</Link></figcaption>
    </figure>
  );
}

export function AuthorLine({ author, at, edited, extra }: { author: Author | null; at: string; edited?: string | null; extra?: ReactNode }) {
  return (
    <p className={styles.byline}>
      {author ? <Link href={`/town-hall/member?id=${author.id}`} className={styles.author}>{author.display_name}</Link> : <span className="muted">a former member</span>}
      {author?.role === "moderator" && <span className={styles.modTag} title="The moderator of the Town Hall">moderator</span>}
      <time dateTime={at} title={new Date(at).toLocaleString("en-GB")}>{ago(at)}</time>
      {edited && <span className="muted" title={`Edited ${new Date(edited).toLocaleString("en-GB")}`}>· edited</span>}
      {extra}
    </p>
  );
}

// ------------------------------------------------------------ actions
export function VoteButton({ count, on, onToggle, label }: { count: number; on: boolean; onToggle: (() => Promise<void>) | null; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button type="button" className={styles.vote} aria-pressed={on} disabled={!onToggle || busy} title={onToggle ? label : "Sign in to vote"}
      onClick={async () => { if (!onToggle) return; setBusy(true); try { await onToggle(); } finally { setBusy(false); } }}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 14 11H2Z" /></svg>
      <span>{count}</span><span className="visually-hidden">{label}</span>
    </button>
  );
}

export function ReportButton({ kind, id }: { kind: "thread" | "post" | "argument" | "debate" | "profile"; id: number | string }) {
  const signedIn = !!useAccount((s) => s.session);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  if (!signedIn) return null;
  if (state === "done") return <span className={styles.small}>Reported. Thank you.</span>;
  return (
    <>
      <button type="button" className={styles.linkBtn} onClick={() => setOpen(!open)} aria-expanded={open}>Report</button>
      {open && (
        <form className={styles.reportForm} onSubmit={async (e) => {
          e.preventDefault(); setState("busy"); setError(null);
          try { await report(kind, id, reason.trim()); setState("done"); } catch (err) { setError(problem(err)); setState("idle"); }
        }}>
          <label><span>What is wrong? Only the moderator sees this.</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={1000} /></label>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="chip" disabled={state === "busy"}>Send to the moderator</button>
        </form>
      )}
    </>
  );
}

/** Delete, asked inline ("are you sure?") rather than in the browser's own pop-up box. */
export function DeleteButton({ what, onDelete }: { what: string; onDelete: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button type="button" className={styles.linkBtn} onClick={() => { setOpen(!open); setError(null); }} aria-expanded={open}>Delete</button>
      {open && (
        <span className={styles.reportForm} role="group" aria-label={`Delete ${what}`}>
          <span>Delete {what}? This cannot be undone.</span>
          <span className={styles.askRow}>
            <button type="button" className="chip" disabled={busy} autoFocus onClick={async () => {
              setBusy(true); setError(null);
              try { await onDelete(); } catch (e) { setError(problem(e)); setBusy(false); }
            }}>Yes, delete it</button>
            <button type="button" className={styles.linkBtn} onClick={() => setOpen(false)}>Keep it</button>
          </span>
          {error && <span className={styles.error} role="alert">{error}</span>}
        </span>
      )}
    </>
  );
}

/** The moderator's Hide (asking why, inline; the reason is shown to the author) and Show again. */
export function HideButton({ hidden, onChange }: { hidden: boolean; onChange: (hide: boolean, reason: string | null) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (hide: boolean, why: string | null) => {
    setBusy(true); setError(null);
    try { await onChange(hide, why); setOpen(false); setReason(""); } catch (e) { setError(problem(e)); }
    setBusy(false);
  };
  if (hidden) return <>
    <button type="button" className={styles.modBtn} disabled={busy} onClick={() => run(false, null)}>Show again</button>
    {error && <span className={styles.error} role="alert">{error}</span>}
  </>;
  return (
    <>
      <button type="button" className={styles.modBtn} onClick={() => setOpen(!open)} aria-expanded={open}>Hide</button>
      {open && (
        <form className={styles.reportForm} onSubmit={(e) => { e.preventDefault(); run(true, reason.trim() || null); }}>
          <label><span>Why is it hidden? Optional; shown to the author.</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} autoFocus /></label>
          <span className={styles.askRow}>
            <button type="submit" className="chip" disabled={busy}>Hide it</button>
            <button type="button" className={styles.linkBtn} onClick={() => setOpen(false)}>Cancel</button>
          </span>
          {error && <span className={styles.error} role="alert">{error}</span>}
        </form>
      )}
    </>
  );
}

/** Shown instead of a writing box: sign in, confirm, or wait out a pause. */
export function SignInPrompt({ what }: { what: string }) {
  const { session, profile } = useAccount();
  const path = usePathname();
  const params = useSearchParams();
  const here = `${path}${params.toString() ? `?${params}` : ""}`;
  if (session && isBanned(profile)) return <p className={styles.note}>The moderator has paused your writing until {new Date(profile!.banned_until!).toLocaleString("en-GB")}.</p>;
  if (session) return null;
  return <p className={styles.note}><Link href={`/account?next=${encodeURIComponent(here)}`}>Sign in or join</Link> to {what}. Reading needs no account.</p>;
}

export const canWrite = (s: ReturnType<typeof useAccount.getState>) => !!s.session && !!s.profile && !isBanned(s.profile);

// ------------------------------------------------------------ writing
export function Composer({ label, submitLabel, onSubmit, onCancel, initial = "", rows = 5, autoFocus }: {
  label: string; submitLabel: string; onSubmit: (body: string) => Promise<void>; onCancel?: () => void; initial?: string; rows?: number; autoFocus?: boolean;
}) {
  const [body, setBody] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form className={styles.composer} onSubmit={async (e) => {
      e.preventDefault();
      if (!body.trim()) return;
      setBusy(true); setError(null);
      try { await onSubmit(body.trim()); setBody(""); } catch (err) { setError(problem(err)); } finally { setBusy(false); }
    }}>
      <NoteField value={body} onChange={setBody} label={label} rows={rows} placeholder="Write here. **bold**, *italic*, “- ” for a list; [Il. 1.1](cts:tlg0012.tlg001:1.1) links a passage." onEscape={onCancel}
        ref={autoFocus ? (h) => { if (h) requestAnimationFrame(() => h.focus()); } : undefined} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.row}>
        <button type="submit" className="btn" disabled={busy || !body.trim()}>{busy ? "Sending…" : submitLabel}</button>
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
        <span className={styles.small}>Drag a passage from the reader into the box to quote it with its citation.</span>
      </div>
    </form>
  );
}
