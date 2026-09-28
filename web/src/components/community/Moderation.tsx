"use client";
/**
 * The moderator's desk: open reports (what, why, by whom, with a link to it) to resolve, and the
 * motions waiting to be opened on the Pnyx. Only the moderator can see reports (the database
 * refuses everyone else). URL: /town-hall/moderation
 */
import Link from "next/link";
import { useEffect } from "react";
import { useLoad, useReloadable } from "@/lib/use-load";
import { isModerator, problem, supabase, useAccount } from "@/lib/community/client";
import { ago, debates, reports, resolveReport, type Debate, type Report } from "@/lib/community/data";
import { OpenControls } from "./Pnyx";
import styles from "./Community.module.css";

/** Where the reported thing is: a reply is shown in its thread, an argument in its debate. */
async function whereIs(r: Report): Promise<string | null> {
  const id = r.target_id;
  if (r.kind === "thread") return `/town-hall/thread?id=${id}`;
  if (r.kind === "profile") return `/town-hall/member?id=${id}`;
  if (r.kind === "debate") return `/town-hall/pnyx/debate?id=${id}`;
  if (r.kind === "post") {
    const { data } = await supabase().from("posts").select("thread_id").eq("id", Number(id)).maybeSingle();
    return data ? `/town-hall/thread?id=${data.thread_id}#p${id}` : null;
  }
  const { data } = await supabase().from("arguments").select("debate_id").eq("id", Number(id)).maybeSingle();
  return data ? `/town-hall/pnyx/debate?id=${data.debate_id}` : null;
}
function Where({ r }: { r: Report }) {
  const href = useLoad(`where|${r.id}`, () => whereIs(r));
  if (href.state !== "done") return null;
  return href.value ? <Link href={href.value}>open it →</Link> : <span className="muted">(already deleted)</span>;
}

export default function Moderation() {
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const mod = isModerator(account.profile);
  const got = useReloadable("moderation", async () => {
    const [rs, ds] = await Promise.all([reports(true), debates()]);
    return { open: rs, waiting: ds.filter((d: Debate) => d.status === "proposed") };
  }, mod);
  const load = async () => got.reload();
  const open = got.data?.open ?? null;
  const waiting = got.data?.waiting ?? [];
  const error = got.error ? problem(got.error) : null;

  if (!account.ready || (account.session && !account.profile)) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> One moment…</div>;
  if (!mod) return <p className={`wrap ${styles.status}`}>This desk is for the moderator. <Link href="/town-hall">Back to the Town Hall</Link></p>;
  return (
    <div className={`wrap ${styles.narrow}`}>
      <p className={styles.crumbs}><Link href="/town-hall">The Town Hall</Link> / The moderator&apos;s desk</p>
      {error && <p className={styles.error}>{error}</p>}
      <section className={styles.motions}>
        <h2>Reports {open && <small>({open.length})</small>}</h2>
        {open?.length === 0 && <p className={styles.empty}>Nothing waiting. The Town Hall is calm.</p>}
        <ul>
          {open?.map((r) => (
            <li key={r.id}>
              <p><b>{r.kind}</b> #{r.target_id} <Where r={r} /></p>
              <p>“{r.reason}”</p>
              <p className={styles.small}>Reported by {r.reporter?.display_name ?? "a former member"} {ago(r.created_at)}</p>
              <p className={styles.actions}>
                {["Hidden", "Member paused", "Nothing wrong"].map((o) => (
                  <button key={o} type="button" className={styles.modBtn} onClick={async () => { await resolveReport(r.id, o); await load(); }}>{o}</button>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.motions}>
        <h2>Motions waiting for the Pnyx</h2>
        {waiting.length === 0 ? <p className={styles.empty}>None.</p> : (
          <ul>{waiting.map((d) => <li key={d.id}><b>{d.motion}</b> <span className="muted">by {d.author?.display_name} {ago(d.created_at)}</span><OpenControls d={d} onDone={load} /></li>)}</ul>
        )}
      </section>
      <p className={styles.fine}>Hide, close and delete from the thread or debate itself; pause a member from their page.</p>
    </div>
  );
}
