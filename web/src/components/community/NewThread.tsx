"use client";
/**
 * Start a thread. Opened from the reader's "Ask in the forum", it arrives with the passage quoted
 * (Greek, translation and a live link back), so the member only adds a question and a category.
 * URL: /town-hall/new?c=<category>&ask=1 (the passage waits in sessionStorage, see ASK_KEY)
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import TagInput from "@/components/notes/TagInput";
import { problem, useAccount } from "@/lib/community/client";
import { categories, startThread, type Quote } from "@/lib/community/data";
import { ASK_KEY } from "@/lib/community/ask";
import { useLoad } from "@/lib/use-load";
import { canWrite, Composer, QuoteBlock, SignInPrompt } from "./parts";
import styles from "./Community.module.css";


export default function NewThread() {
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const params = useSearchParams();
  const router = useRouter();
  const cats = useLoad("forum-categories", categories);
  // a passage left by the reader's "Ask in the forum" (read once; the form shows only in the browser)
  const [quote, setQuote] = useState<Quote | null>(() => {
    if (params.get("ask") !== "1" || typeof sessionStorage === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem(ASK_KEY) ?? "null") as Quote | null; } catch { return null; }
  });
  const [category, setCategory] = useState(params.get("c") ?? (quote ? "translation" : ""));
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fid = useId(); // the boxes are tied to their labels by id and named outright, so every screen reader announces them

  if (!account.ready) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> One moment…</div>;
  if (!canWrite(account)) return <div className={`wrap ${styles.narrow}`}>{quote && <QuoteBlock quote={quote} />}<SignInPrompt what="start a thread" /></div>;

  return (
    <div className={`wrap ${styles.narrow}`}>
      <p className={styles.crumbs}><Link href="/town-hall">The Town Hall</Link> / A new thread</p>
      <section className={styles.card}>
        <h2>{quote ? "Ask about this passage" : "Start a thread"}</h2>
        {quote && (
          <div className={styles.attached}>
            <QuoteBlock quote={quote} />
            <button type="button" className={styles.linkBtn} onClick={() => { setQuote(null); sessionStorage.removeItem(ASK_KEY); }}>Remove the passage</button>
          </div>
        )}
        <div className={styles.form}>
          <label htmlFor={`${fid}-cat`}><span>Category</span>
            <select id={`${fid}-cat`} aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Choose where it belongs</option>
              {cats.state === "done" && cats.value.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label htmlFor={`${fid}-title`}><span>Title <small id={`${fid}-titleh`}>a question or a topic, 3–160 characters</small></span>
            <input id={`${fid}-title`} aria-label="Title" aria-describedby={`${fid}-titleh`} value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} maxLength={160}
              placeholder={quote ? `What does ${quote.cite} mean?` : ""} /></label>
          <div className={styles.tagField}>
            <TagInput tags={tags} onChange={(t) => setTags(t.slice(0, 5))} />
            <small>Optional, up to 5: a word someone might look for (aorist, Homer, pronunciation).</small>
          </div>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Composer label="Your question" submitLabel="Post the thread" rows={7} draftKey="thread:new" onSubmit={async (body) => {
          setError(null);
          if (!category) { setError("Choose a category first."); throw new Error("Choose a category first."); }
          if (title.trim().length < 3) { setError("Give the thread a title."); throw new Error("Give the thread a title."); }
          try {
            const id = await startThread({ category_id: category, title: title.trim(), body, tags, quote });
            sessionStorage.removeItem(ASK_KEY);
            router.push(`/town-hall/thread?id=${id}`);
          } catch (e) { setError(problem(e)); throw e; }
        }} />
      </section>
    </div>
  );
}
