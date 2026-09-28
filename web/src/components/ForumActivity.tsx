"use client";
/**
 * The home page's "recent forum activity" (the brief): the latest threads in the Town Hall and the
 * motion of the week in the Pnyx.
 *
 * Privacy and speed: this is a plain read-only request to the database's public interface, made
 * only after the page has shown; the Supabase library is not loaded for it (see
 * lib/community/account.ts). It sends nothing about the visitor except what any request carries
 * (their address). The Credits & Privacy page says so. If the request fails, or the forum is empty,
 * the section is an invitation, never an error.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/config/supabase";
import { AREAS } from "@/config/areas";
import { ago } from "@/lib/community/ago";

interface ThreadRow {
  id: number; title: string; reply_count: number; last_activity_at: string;
  category: { title: string } | null; author: { display_name: string } | null;
}
interface MotionRow { id: number; motion: string; closes_at: string | null }
type State = { kind: "loading" } | { kind: "ready"; threads: ThreadRow[]; motion: MotionRow | null } | { kind: "unavailable" };

async function rest<T>(path: string, signal: AbortSignal): Promise<T> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { signal, headers: { apikey: SUPABASE_PUBLISHABLE_KEY } });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as T;
}

export default function ForumActivity({ styles }: { styles: Record<string, string> }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const ctl = new AbortController();
    const go = () => {
      Promise.all([
        rest<ThreadRow[]>(
          "threads?select=id,title,reply_count,last_activity_at,category:forum_categories(title),author:profiles!threads_author_id_fkey(display_name)"
          + "&hidden=eq.false&order=last_activity_at.desc&limit=4", ctl.signal),
        rest<MotionRow[]>("debates?select=id,motion,closes_at&status=eq.open&order=featured.desc,opened_at.desc&limit=1", ctl.signal),
      ]).then(([threads, motions]) => setState({ kind: "ready", threads, motion: motions[0] ?? null }))
        .catch(() => { if (!ctl.signal.aborted) setState({ kind: "unavailable" }); });
    };
    // after the page has shown, so first content never waits on it
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(go, { timeout: 2500 }) : window.setTimeout(go, 800);
    return () => { ctl.abort(); if (idle) (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(handle); else clearTimeout(handle); };
  }, []);

  const threads = state.kind === "ready" ? state.threads : [];
  const motion = state.kind === "ready" ? state.motion : null;
  const empty = state.kind === "unavailable" || (state.kind === "ready" && threads.length === 0 && !motion);

  return (
    <div className={styles.forum} aria-live="polite" aria-busy={state.kind === "loading"}>
      <div className={styles.forumList}>
        <h3 className={styles.forumH}>Latest threads</h3>
        {state.kind === "loading" && (
          <ul className={styles.forumRows} aria-hidden="true">{[0, 1, 2, 3].map((i) => <li key={i} className={styles.forumSkel} />)}</ul>
        )}
        {threads.length > 0 && (
          <ul className={styles.forumRows}>
            {threads.map((t) => (
              <li key={t.id}>
                <Link href={`/town-hall/thread?id=${t.id}`} transitionTypes={["page-turn"]}>
                  <span className="label">{t.category?.title ?? "Town Hall"}</span>
                  <b>{t.title}</b>
                  <small>{t.author?.display_name ?? "A member"} · {t.reply_count === 1 ? "1 reply" : `${t.reply_count} replies`} · {ago(t.last_activity_at)}</small>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {(empty || (state.kind === "ready" && threads.length === 0)) && (
          <p className={styles.forumEmpty}>
            {state.kind === "unavailable"
              ? "The forum cannot be reached just now. It will be here when you are back online."
              : "No one has spoken yet. Ask the first question: no question about the letters, the accents or where to begin is too small."}
          </p>
        )}
        <Link className="btn ghost" href={AREAS.forum.href} transitionTypes={["page-turn"]}>Enter {AREAS.forum.name} <span className="arr" aria-hidden="true">→</span></Link>
      </div>

      <Link href={motion ? `/town-hall/pnyx/debate?id=${motion.id}` : AREAS.debates.href} className={styles.forumMotion} transitionTypes={["page-turn"]}>
        <span className="label">{AREAS.debates.name} · {AREAS.debates.english}</span>
        <span className={styles.forumMotionK}>{motion ? "The motion before the Assembly" : "The Assembly is in recess"}</span>
        <b lang="en">{motion ? motion.motion : "Propose a motion, and argue for or against it with the ancient sources."}</b>
        <small>
          {motion?.closes_at ? `Open until ${new Date(motion.closes_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} · ` : ""}
          {motion ? "argue and cast your pebble →" : "Visit the Pnyx →"}
        </small>
      </Link>
    </div>
  );
}
