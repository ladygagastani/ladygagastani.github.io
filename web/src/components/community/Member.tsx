"use client";
/**
 * A member's page: display name, what they wrote about themselves, their threads; for the
 * moderator, a pause (ban) with a reason and an end date. URL: /town-hall/member?id=<uuid>
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReloadable } from "@/lib/use-load";
import { isModerator, problem, useAccount } from "@/lib/community/client";
import { ago, ban, profile, threads, type Thread } from "@/lib/community/data";
import { PostText, ReportButton } from "./parts";
import styles from "./Community.module.css";

interface PublicProfile { id: string; display_name: string; bio: string; role: string; created_at: string; banned_until: string | null }

export default function Member() {
  const id = useSearchParams().get("id") ?? "";
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const got = useReloadable(`member|${id}`, async () => {
    const [pp, tt] = await Promise.all([profile(id), threads({ author: id, sort: "new" })]);
    return { p: pp as PublicProfile | null, ts: tt.rows as Thread[] };
  }, !!id);
  const load = async () => got.reload();
  const p = got.data?.p;
  const ts = got.data?.ts ?? [];

  if (got.error && !got.data) return <p className={`wrap ${styles.error}`}>{problem(got.error)}</p>;
  if (p === undefined) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> One moment…</div>;
  if (!p) return <p className={`wrap ${styles.status}`}>No such member. <Link href="/town-hall">Back to the Town Hall</Link></p>;
  const mod = isModerator(account.profile);
  const me = account.session?.user.id === p.id;
  return (
    <div className={`wrap ${styles.narrow}`}>
      <p className={styles.crumbs}><Link href="/town-hall">The Town Hall</Link> / Member</p>
      <section className={styles.card}>
        <p className="label">{p.role === "moderator" ? "Moderator of the Town Hall" : "Member of the Town Hall"}</p>
        <h2>{p.display_name}</h2>
        <p className={styles.small}>Member since {new Date(p.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
        {p.bio ? <PostText text={p.bio} /> : <p className="muted">{me ? "You have not written about yourself yet." : "Nothing written here yet."}</p>}
        <p className={styles.actions}>
          {me && <Link href="/account">Edit your profile</Link>}
          {!me && <ReportButton kind="profile" id={p.id} />}
        </p>
        {mod && !me && <BanControls p={p} onDone={load} />}
      </section>
      <section className={styles.motions}>
        <h2>Threads started</h2>
        {ts.length === 0 ? <p className={styles.empty}>None yet.</p> : (
          <ul>{ts.map((t) => <li key={t.id}><Link href={`/town-hall/thread?id=${t.id}`}><b>{t.title}</b></Link> <span className="muted">{ago(t.created_at)} · {t.reply_count} replies</span></li>)}</ul>
        )}
      </section>
    </div>
  );
}

function BanControls({ p, onDone }: { p: PublicProfile; onDone: () => Promise<void> }) {
  const [days, setDays] = useState(7);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const paused = !!p.banned_until && new Date(p.banned_until) > new Date();
  return (
    <div className={styles.modPanel}>
      <p className="label">Moderator</p>
      {paused ? (
        <>
          <p>Writing paused until {new Date(p.banned_until!).toLocaleString("en-GB")}.</p>
          <button type="button" className={styles.modBtn} onClick={async () => { try { await ban(p.id, null, null); await onDone(); } catch (e) { setError(problem(e)); } }}>Lift the pause</button>
        </>
      ) : (
        <form onSubmit={async (e) => {
          e.preventDefault();
          try { await ban(p.id, new Date(Date.now() + days * 86400000).toISOString(), reason.trim() || null); await onDone(); } catch (err) { setError(problem(err)); }
        }}>
          <label>Pause writing for <input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(+e.target.value)} /> days</label>
          <label>Reason (shown to them) <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} /></label>
          <button type="submit" className={styles.modBtn}>Pause</button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
