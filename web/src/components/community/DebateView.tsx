"use client";
/**
 * One debate on the Pnyx: the motion, the arguments For and Against in two columns (each with
 * its replies, and a mark on those that cite a source), and the vote: a pebble dropped into one of
 * two urns. Your vote is private; the count appears when the debate closes, with how many changed
 * their minds. URL: /town-hall/pnyx/debate?id=<id>
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReloadable } from "@/lib/use-load";
import { isModerator, problem, useAccount } from "@/lib/community/client";
import {
  argue, argumentsOf, castPebble, debate, deleteArgument, editArgument, moderate, myPebble, setDebate, tally, tree,
  type Argument, type Debate, type Node, type Tally,
} from "@/lib/community/data";
import { AuthorLine, canWrite, Composer, DeleteButton, Folded, HideButton, PostText, QuoteBlock, ReportButton, SignInPrompt } from "./parts";
import { OpenControls, ResultBar } from "./Pnyx";
import styles from "./Community.module.css";

type Side = "for" | "against";

export default function DebateView() {
  const id = Number(useSearchParams().get("id"));
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const uid = account.session?.user.id ?? null;
  const got = useReloadable(`debate|${id}|${uid}`, async () => {
    const [dd, aa] = await Promise.all([debate(id), argumentsOf(id)]);
    const pebble = dd && uid ? await myPebble(id, uid) : null;
    const count = dd ? await tally(id) : null;
    return { d: dd, args: aa, pebble, count };
  }, !!id);
  const load = async () => got.reload();
  const d: Debate | null | undefined = got.data?.d;
  const args: Argument[] = got.data?.args ?? [];
  const pebble = got.data?.pebble ?? null;
  const count: Tally | null = got.data?.count ?? null;

  if (!id) return <p className={`wrap ${styles.status}`}>No debate was named. <Link href="/town-hall/pnyx">Back to the Pnyx</Link></p>;
  if (got.error && !got.data) return <p className={`wrap ${styles.error}`}>{problem(got.error)}</p>;
  if (d === undefined) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Climbing the hill…</div>;
  if (!d) return <p className={`wrap ${styles.status}`}>This debate does not exist, or it is not open yet. <Link href="/town-hall/pnyx">Back to the Pnyx</Link></p>;

  const mod = isModerator(account.profile);
  const writer = canWrite(account);
  const expired = !!d.closes_at && new Date(d.closes_at) <= new Date();
  const open = d.status === "open" && !expired;
  const bySide = (s: Side) => tree(args.filter((a) => a.side === s));

  return (
    <article className={`wrap ${styles.debate}`}>
      <p className={styles.crumbs}><Link href="/town-hall">The Town Hall</Link> / <Link href="/town-hall/pnyx">The Pnyx</Link></p>
      <header className={styles.motionHead}>
        <p className="label">{d.status === "proposed" ? "Proposed motion" : open ? "Before the Assembly" : "Decided"}</p>
        <h1>{d.motion}</h1>
        <p className={styles.small}>
          Proposed by {d.author?.display_name ?? "a former member"}
          {d.opened_at && ` · opened ${new Date(d.opened_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
          {open && d.closes_at && ` · voting until ${new Date(d.closes_at).toLocaleString("en-GB", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}`}
          {!open && d.closed_at && ` · closed ${new Date(d.closed_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        </p>
        {d.blurb && <PostText text={d.blurb} />}
        {mod && d.status === "proposed" && <OpenControls d={d} onDone={load} />}
        {mod && d.status === "open" && (
          <p className={styles.actions}>
            <button type="button" className={styles.modBtn} onClick={async () => { await setDebate(d.id, "closed", d.closes_at, false); await load(); }}>Close the debate now</button>
            {!d.featured && <button type="button" className={styles.modBtn} onClick={async () => { await setDebate(d.id, "open", d.closes_at, true); await load(); }}>Make it the motion of the week</button>}
          </p>
        )}
      </header>

      <Urns open={open} pebble={pebble} count={count} writer={writer}
        onCast={async (side) => { await castPebble(d.id, side); await load(); }} />

      <div className={styles.sides}>
        {(["for", "against"] as Side[]).map((side) => (
          <section key={side} className={`${styles.side} ${side === "for" ? styles.sideFor : styles.sideAgainst}`} aria-labelledby={`${side}-h`}>
            <h2 id={`${side}-h`}>{side === "for" ? "For" : "Against"} <small>{args.filter((a) => a.side === side).length}</small></h2>
            <ArgTree nodes={bySide(side)} uid={uid} mod={mod} writer={writer && open} reload={load} />
            {open && writer && (
              <Composer label={`An argument ${side} the motion`} submitLabel={side === "for" ? "Argue for" : "Argue against"} rows={4} draftKey={`debate:${d.id}:${side}`}
                onSubmit={async (body) => { await argue({ debate_id: d.id, side, parent_id: null, body, quote: null }); await load(); }} />
            )}
          </section>
        ))}
      </div>
      {open && <SignInPrompt what="argue and vote" />}
      <p className={styles.fine}>Arguments marked ❦ cite a source: a quoted passage, or a link to a passage, a Painted Stoa entry or another source.</p>
    </article>
  );
}

function Urns({ open, pebble, count, writer, onCast }: {
  open: boolean; pebble: { side: Side; first_side: Side } | null; count: Tally | null; writer: boolean; onCast: (s: Side) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [dropping, setDropping] = useState<Side | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cast = async (side: Side) => {
    setBusy(true); setError(null); setDropping(side);
    try { await onCast(side); } catch (e) { setError(problem(e)); } finally { setBusy(false); setTimeout(() => setDropping(null), 900); }
  };
  return (
    <section className={styles.urns} aria-label="The vote">
      <p className={styles.small}>
        Athenian juries voted with pebbles (psephoi) dropped into urns; here every member has one pebble and may move it until the vote closes.
        Your vote is private. The count is shown when the debate closes.
      </p>
      <div className={styles.urnRow}>
        {(["for", "against"] as Side[]).map((side) => (
          <div key={side} className={styles.urnCol}>
            <svg viewBox="0 0 80 96" className={`${styles.urn} ${pebble?.side === side ? styles.urnMine : ""}`} aria-hidden="true">
              <path d="M22 10h36l-3 8c14 8 19 22 17 38-2 18-14 30-32 30S10 74 8 56C6 40 11 26 25 18z" />
              <path className={styles.urnMouth} d="M22 10h36" />
              {dropping === side && <circle className={styles.pebble} cx="40" cy="4" r="4.5" />}
              {pebble?.side === side && dropping !== side && <circle className={styles.pebbleIn} cx="40" cy="70" r="4.5" />}
            </svg>
            <b>{side === "for" ? "For" : "Against"}</b>
            {count && <span className={styles.urnCount}>{side === "for" ? count.votes_for : count.votes_against}</span>}
            {open && writer && (
              <button type="button" className="chip" disabled={busy || pebble?.side === side} onClick={() => cast(side)}>
                {pebble?.side === side ? "Your pebble is here" : pebble ? "Move your pebble here" : "Cast your pebble"}
              </button>
            )}
          </div>
        ))}
      </div>
      {pebble && pebble.side !== pebble.first_side && <p className={styles.small}>You changed your mind: your first pebble went {pebble.first_side}.</p>}
      {error && <p className={styles.error}>{error}</p>}
      {count && <ResultBar t={count} running={open} />}
      {count && open && <p className={styles.small}>Only you, as the moderator, see the count while the vote is open.</p>}
    </section>
  );
}

function ArgTree({ nodes, depth = 0, ...rest }: { nodes: Node<Argument>[]; depth?: number; uid: string | null; mod: boolean; writer: boolean; reload: () => Promise<void> }) {
  if (!nodes.length) return depth ? null : <p className={styles.empty}>No arguments yet.</p>;
  return (
    <ol className={depth ? styles.subReplies : styles.argList}>
      {nodes.map((n) => (
        <li key={n.item.id}>
          <ArgCard a={n.item} depth={depth} {...rest} />
          <ArgTree nodes={n.children} depth={depth + 1} {...rest} />
        </li>
      ))}
    </ol>
  );
}

function ArgCard({ a, depth, uid, mod, writer, reload }: { a: Argument; depth: number; uid: string | null; mod: boolean; writer: boolean; reload: () => Promise<void> }) {
  const [mode, setMode] = useState<"read" | "edit" | "reply">("read");
  const mine = uid === a.author_id;
  return (
    <div className={styles.arg}>
      <AuthorLine author={a.author} at={a.created_at} edited={a.edited_at}
        extra={a.cites_source ? <span className={styles.cites} title="Cites a source">❦ cites a source</span> : null} />
      {a.hidden && <p className={styles.error}>Hidden by the moderator{a.hidden_reason ? `: ${a.hidden_reason}` : ""}.</p>}
      <Folded author={mine ? null : a.author} what="An argument">
        {a.quote && <QuoteBlock quote={a.quote} />}
        {mode === "edit"
          ? <Composer label="Edit your argument" submitLabel="Save" initial={a.body} autoFocus onCancel={() => setMode("read")}
              onSubmit={async (body) => { await editArgument(a.id, body); setMode("read"); await reload(); }} />
          : <PostText text={a.body} />}
      </Folded>
      <div className={styles.actions}>
        {writer && depth < 5 && <button type="button" className={styles.linkBtn} onClick={() => setMode(mode === "reply" ? "read" : "reply")}>Reply</button>}
        {mine && mode === "read" && <button type="button" className={styles.linkBtn} onClick={() => setMode("edit")}>Edit</button>}
        {(mine || mod) && <DeleteButton what="this argument" onDelete={async () => { await deleteArgument(a.id); await reload(); }} />}
        {!mine && <ReportButton kind="argument" id={a.id} />}
        {mod && <HideButton hidden={a.hidden} onChange={async (hide, reason) => { await moderate("argument", a.id, hide, reason); await reload(); }} />}
      </div>
      {mode === "reply" && (
        <Composer label={`Reply to ${a.author?.display_name ?? "this"}`} submitLabel="Reply" rows={3} autoFocus draftKey={`argument:${a.id}`} onCancel={() => setMode("read")}
          onSubmit={async (body) => { await argue({ debate_id: a.debate_id, side: a.side, parent_id: a.id, body, quote: null }); setMode("read"); await reload(); }} />
      )}
    </div>
  );
}
