"use client";
/**
 * The Pnyx: debates on a motion, For and Against. The featured motion of the week first, then the
 * open debates, then the closed ones with their results. Members propose motions (also straight
 * from a Painted Stoa entry, ?from=<slug>); the moderator opens, closes, features or declines them.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReloadable } from "@/lib/use-load";
import { isModerator, problem, useAccount } from "@/lib/community/client";
import { ago, debates, proposeDebate, setDebate, tally, type Debate, type Tally } from "@/lib/community/data";
import { canWrite, SignInPrompt } from "./parts";
import styles from "./Community.module.css";

export default function Pnyx({ entryTitles }: { entryTitles: Record<string, string> }) {
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const got = useReloadable(`debates|${account.session?.user.id ?? ""}`, debates);
  const list = got.data ?? null;
  const error = got.error && !got.data ? problem(got.error) : null;
  const load = async () => got.reload();
  const mod = isModerator(account.profile);

  const featured = list?.find((d) => d.featured && d.status === "open") ?? null;
  const open = list?.filter((d) => d.status === "open" && d !== featured) ?? [];
  const closed = list?.filter((d) => d.status === "closed") ?? [];
  const proposed = list?.filter((d) => d.status === "proposed") ?? [];

  return (
    <div className={`wrap ${styles.pnyx}`}>
      <p className={styles.lead}>
        On the real Pnyx the citizens of Athens met in Assembly, heard the speakers for and against a motion, and voted by a show of hands.
        Here each motion has two sides: argue for or against it, reply to the arguments, cite your sources, and cast a pebble for your side.
        The count is shown when the debate closes, with how many changed their minds.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {!list && !error && <p className="muted"><span className={styles.spinner} aria-hidden="true" /> Climbing the hill…</p>}

      {featured && (
        <Link href={`/town-hall/pnyx/debate?id=${featured.id}`} className={styles.motionHero}>
          <span className="label">The motion of the week</span>
          <b>{featured.motion}</b>
          <span>{featured.closes_at ? `Open until ${new Date(featured.closes_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : "Open"} · argue and vote →</span>
        </Link>
      )}

      {open.length > 0 && <MotionList title="Open motions" items={open} />}
      {closed.length > 0 && <MotionList title="Decided" items={closed} results />}
      {list && !featured && open.length === 0 && closed.length === 0 && <p className={styles.empty}>No motions are before the Assembly yet.</p>}

      {proposed.length > 0 && (
        <section aria-labelledby="proposed-h" className={styles.proposed}>
          <h2 id="proposed-h">{mod ? "Proposed motions, waiting for you" : "Your proposed motions"}</h2>
          <ul>
            {proposed.map((d) => (
              <li key={d.id}>
                <b>{d.motion}</b> <span className="muted">· proposed by {d.author?.display_name ?? "a former member"} {ago(d.created_at)}</span>
                {d.from_entry && <> · from <Link href={`/stoa/${d.from_entry}`}>{entryTitles[d.from_entry] ?? d.from_entry}</Link></>}
                {d.blurb && <p className={styles.small}>{d.blurb}</p>}
                {mod ? <OpenControls d={d} onDone={load} /> : <p className={styles.small}>Waiting for the moderator to open it.</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Propose entryTitles={entryTitles} onDone={load} writer={canWrite(account)} />
    </div>
  );
}

function MotionList({ title, items, results }: { title: string; items: Debate[]; results?: boolean }) {
  return (
    <section className={styles.motions} aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {items.map((d) => (
          <li key={d.id}>
            <Link href={`/town-hall/pnyx/debate?id=${d.id}`}><b>{d.motion}</b></Link>
            <span className="muted">{results ? `closed ${d.closed_at ? ago(d.closed_at) : ""}` : d.closes_at ? `open until ${new Date(d.closes_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : "open"}</span>
            {results && <Result id={d.id} />}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Result({ id }: { id: number }) {
  const [t, setT] = useState<Tally | null | undefined>(undefined);
  useEffect(() => { tally(id).then(setT, () => setT(null)); }, [id]);
  if (!t) return null;
  return <ResultBar t={t} small />;
}

export function ResultBar({ t, small }: { t: Tally; small?: boolean }) {
  const total = t.votes_for + t.votes_against;
  const pc = total ? Math.round((t.votes_for / total) * 100) : 50;
  return (
    <div className={`${styles.result} ${small ? styles.resultSmall : ""}`} role="img"
      aria-label={`${t.votes_for} for, ${t.votes_against} against${t.changed_mind ? `; ${t.changed_mind} changed their mind` : ""}`}>
      <div className={styles.resultBar}><span style={{ width: `${pc}%` }} /></div>
      <p><b>{t.votes_for}</b> for · <b>{t.votes_against}</b> against{total === 0 && " (no votes)"}{t.changed_mind > 0 && ` · ${t.changed_mind} changed their mind`}
        {total > 0 && <> · <b>{t.votes_for === t.votes_against ? "tied" : t.votes_for > t.votes_against ? "carried" : "rejected"}</b></>}</p>
    </div>
  );
}

export function OpenControls({ d, onDone }: { d: Debate; onDone: () => Promise<void> }) {
  const [days, setDays] = useState(14);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const act = async (status: Debate["status"]) => {
    setError(null);
    try {
      const closes = status === "open" ? new Date(Date.now() + days * 86400000).toISOString() : null;
      await setDebate(d.id, status, closes, status === "open" && featured);
      await onDone();
    } catch (e) { setError(problem(e)); }
  };
  return (
    <div className={styles.modPanel}>
      <label>Open for <input type="number" min={1} max={90} value={days} onChange={(e) => setDays(+e.target.value)} /> days</label>
      <label className={styles.check}><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> <span>Make it the motion of the week</span></label>
      <button type="button" className={styles.modBtn} onClick={() => act("open")}>Open the debate</button>
      <button type="button" className={styles.modBtn} onClick={() => act("declined")}>Decline</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function Propose({ entryTitles, onDone, writer }: { entryTitles: Record<string, string>; onDone: () => Promise<void>; writer: boolean }) {
  const params = useSearchParams();
  const from = params.get("from");
  const fromTitle = from ? entryTitles[from] : null;
  const [motion, setMotion] = useState("");
  const [blurb, setBlurb] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(!!fromTitle);
  return (
    <section className={styles.proposeBox} aria-labelledby="propose-h" id="propose">
      <h2 id="propose-h">Propose a motion</h2>
      <p className={styles.small}>A motion is a statement that can be argued both ways (“Athens was more oppressive than Sparta”). The moderator opens proposed motions for debate.</p>
      {!writer ? <SignInPrompt what="propose a motion" /> : !open ? (
        <button type="button" className="chip" onClick={() => setOpen(true)}>Write a motion</button>
      ) : (
        <form className={styles.form} onSubmit={async (e) => {
          e.preventDefault(); setError(null); setMsg(null);
          try {
            await proposeDebate({ motion: motion.trim(), blurb: blurb.trim(), from_entry: fromTitle ? from : null });
            setMotion(""); setBlurb(""); setMsg("Proposed. The moderator will look at it."); await onDone();
          } catch (err) { setError(problem(err)); }
        }}>
          {fromTitle && <p className={styles.note}>From the Painted Stoa: <Link href={`/stoa/${from}`}>{fromTitle}</Link></p>}
          <label><span>The motion <small>10–200 characters</small></span>
            <input value={motion} onChange={(e) => setMotion(e.target.value)} required minLength={10} maxLength={200} /></label>
          <label><span>Background <small>optional: what the question is and where to read about it</small></span>
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} maxLength={4000} rows={4} /></label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {msg && <p className={styles.ok} role="status">{msg}</p>}
          <button type="submit" className="btn">Propose</button>
        </form>
      )}
    </section>
  );
}
