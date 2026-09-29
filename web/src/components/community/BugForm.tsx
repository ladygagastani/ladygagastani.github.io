"use client";
/**
 * The Town Hall's bug report: a short title and three questions (what happened, the steps, what you
 * expected), with the page and a plain description of the browser filled in, both open to change.
 * It is posted as an ordinary thread in "Bug reports", where the moderator gives it a status.
 * An unsent report is kept in this browser as it is typed, like every other forum draft.
 */
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { problem } from "@/lib/community/client";
import { SITE_BOARDS, startThread } from "@/lib/community/data";
import { bugBody, describeBrowser, type BugFields } from "@/lib/community/bug";
import styles from "./Community.module.css";

const DRAFT = "mathesis:draft:bug";
type Draft = BugFields & { title: string };

export default function BugForm({ page, error: pageError }: { page: string; error: string }) {
  const router = useRouter();
  const fid = useId();
  const [f, setF] = useState<Draft>({ title: "", what: "", steps: "", expected: "", page, browser: "", error: pageError });
  const [restored, setRestored] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // the browser's description needs the browser; an unsent draft comes back (the page and message just given win)
  useEffect(() => {
    const browser = describeBrowser(navigator.userAgent, innerWidth, innerHeight);
    let draft: Partial<Draft> | null = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT) ?? "null"); } catch { /* none */ }
    const has = !!draft && !!(draft.title || draft.what || draft.steps || draft.expected);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from this browser after the first paint
    setF((cur) => ({ ...cur, ...(has ? draft : {}), browser: (has && draft!.browser) || browser, page: page || (has ? draft!.page ?? "" : ""), error: pageError || (has ? draft!.error ?? "" : "") }));
    if (has) setRestored(true);
  }, [page, pageError]);

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    try { localStorage.setItem(DRAFT, JSON.stringify(next)); } catch { /* storage blocked: no draft */ }
  };

  return (
    <form className={styles.form} onSubmit={async (e) => {
      e.preventDefault();
      if (f.title.trim().length < 3) { setError("Give the report a short title."); return; }
      if (!f.what.trim()) { setError("Say what happened."); return; }
      setBusy(true); setError(null);
      try {
        const id = await startThread({ category_id: SITE_BOARDS.bugs, title: f.title.trim(), body: bugBody(f, location.origin), tags: [], quote: null });
        try { localStorage.removeItem(DRAFT); } catch { /* ignore */ }
        router.push(`/town-hall/thread?id=${id}`);
      } catch (err) { setError(problem(err)); setBusy(false); }
    }}>
      <label htmlFor={`${fid}-t`}><span>Title <small id={`${fid}-th`}>in a few words, e.g. “Metre button does nothing in the Odyssey”</small></span>
        <input id={`${fid}-t`} aria-label="Title" aria-describedby={`${fid}-th`} value={f.title} onChange={set("title")} required minLength={3} maxLength={160} /></label>
      <label htmlFor={`${fid}-w`}><span>What happened?</span>
        <textarea id={`${fid}-w`} aria-label="What happened?" value={f.what} onChange={set("what")} required rows={4} maxLength={6000} /></label>
      <label htmlFor={`${fid}-s`}><span>Steps to see it <small>optional: what you clicked or typed, one step a line</small></span>
        <textarea id={`${fid}-s`} aria-label="Steps to see it" value={f.steps} onChange={set("steps")} rows={4} maxLength={6000} placeholder={"1. Open the Iliad, book 2\n2. Press Metre"} /></label>
      <label htmlFor={`${fid}-x`}><span>What did you expect? <small>optional</small></span>
        <textarea id={`${fid}-x`} aria-label="What did you expect?" value={f.expected} onChange={set("expected")} rows={2} maxLength={3000} /></label>
      {f.error && (
        <label htmlFor={`${fid}-e`}><span>The message the page showed <small>you can remove it</small></span>
          <textarea id={`${fid}-e`} aria-label="The message the page showed" value={f.error} onChange={set("error")} rows={2} maxLength={2000} /></label>
      )}
      <label htmlFor={`${fid}-p`}><span>Page <small>the address where it happened; you can change or remove it</small></span>
        <input id={`${fid}-p`} aria-label="Page" value={f.page} onChange={set("page")} maxLength={500} placeholder="/read?w=…" /></label>
      <label htmlFor={`${fid}-b`}><span>Browser <small>filled in for you; you can change or remove it</small></span>
        <input id={`${fid}-b`} aria-label="Browser" value={f.browser} onChange={set("browser")} maxLength={200} /></label>
      <p className={styles.small}>Everything above is posted publicly in the Town Hall, like any thread. Nothing else about your computer is sent.</p>
      {restored && <p className={styles.small} role="status">Your unsent report has come back.</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>{busy ? "Sending…" : "Send the report"}</button>
    </form>
  );
}
