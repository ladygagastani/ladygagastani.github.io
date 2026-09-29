"use client";
/**
 * The Town Hall: the forum's categories, the threads (newest activity first, or new, or most
 * valued, or still unanswered), a search, and the rules. Anyone may read; members write.
 * URL: ?c=<category>&tag=&q=&sort=
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "@/lib/community/client";
import { ago, categories, debates, threads, type Category, type Debate, type Thread, type ThreadQuery } from "@/lib/community/data";
import { useLoad, useReloadable, type Load } from "@/lib/use-load";
import { SignInPrompt } from "./parts";
import PullToRefresh from "@/components/PullToRefresh";
import styles from "./Community.module.css";

const SORTS: [NonNullable<ThreadQuery["sort"]>, string][] = [["active", "Latest activity"], ["new", "Newest"], ["top", "Most valued"], ["unanswered", "Unanswered"]];

export default function TownHall() {
  const start = useAccount((s) => s.start);
  useEffect(() => { start(); }, [start]);
  const params = useSearchParams();
  const router = useRouter();
  const c = params.get("c");
  const tag = params.get("tag");
  const q = params.get("q") ?? "";
  const sort = (SORTS.find(([s]) => s === params.get("sort"))?.[0] ?? "active") as NonNullable<ThreadQuery["sort"]>;
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState(q);
  const go = (changes: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) { if (v) sp.set(k, v); else sp.delete(k); }
    setPage(0);
    router.replace(`?${sp}`, { scroll: false });
  };

  const cats = useLoad("forum-categories", categories);
  // reloadable: a pull to refresh keeps the list on screen until the new one arrives
  const listR = useReloadable(`threads|${c}|${tag}|${q}|${sort}|${page}`, () => threads({ category: c, tag, q, sort, page }));
  const list: Load<Awaited<ReturnType<typeof threads>>> = listR.data !== undefined ? { state: "done", value: listR.data }
    : listR.error ? { state: "error", message: (listR.error as Error).message ?? String(listR.error) } : { state: "loading" };
  const featured = useLoad("featured-debate", async () => (await debates()).find((d) => d.featured && d.status === "open") ?? null);
  const signedIn = !!useAccount((s) => s.session);
  const catById = new Map((cats.state === "done" ? cats.value : []).map((x) => [x.id, x]));
  const current = c ? catById.get(c) : null;
  const offline = cats.state === "error" || list.state === "error";

  return (
    <div className={`wrap ${styles.hall}`}>
      <PullToRefresh onPull={listR.reload} busy={listR.busy} />
      {/* the search comes first */}
      <form role="search" onSubmit={(e) => { e.preventDefault(); go({ q: typed.trim() || null }); }} className={styles.search}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input enterKeyHint="search" type="search" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Search the Town Hall" aria-label="Search the Town Hall" />
        <button type="submit" className="btn small">Search</button>
      </form>
      {featured.state === "done" && featured.value && <FeaturedDebate d={featured.value} />}

      <nav className={styles.cats} aria-label="Categories">
        <button type="button" className={styles.cat} aria-pressed={!c} onClick={() => go({ c: null })}>
          <b>Everything</b><span>All the conversations</span>
        </button>
        {cats.state === "done" && cats.value.map((x: Category, i) => (
          <button key={x.id} type="button" className={styles.cat} aria-pressed={c === x.id} onClick={() => go({ c: x.id })} style={{ "--i": i } as React.CSSProperties}>
            <b>{x.title}</b><span>{x.blurb}</span>
          </button>
        ))}
      </nav>

      <div className={styles.toolbar}>
        <div className={styles.sorts} role="group" aria-label="Order">
          {SORTS.map(([s, label]) => <button key={s} type="button" className="chip" aria-pressed={sort === s} onClick={() => go({ sort: s === "active" ? null : s })}>{label}</button>)}
        </div>
        {signedIn
          ? <Link className="btn small" href={`/town-hall/new${c ? `?c=${c}` : ""}`}>Start a thread <span className="arr">→</span></Link>
          : null}
      </div>
      <SignInPrompt what="start a thread or reply" />

      <section aria-labelledby="threads-h">
        <h2 id="threads-h" className={styles.listHead}>
          {current ? current.title : "All conversations"}
          {tag && <> · tagged <span className={styles.tag}>{tag}</span> <button type="button" className={styles.linkBtn} onClick={() => go({ tag: null })}>clear</button></>}
          {q && <> · “{q}” <button type="button" className={styles.linkBtn} onClick={() => { setTyped(""); go({ q: null }); }}>clear</button></>}
        </h2>
        {offline && <p className={styles.error}>The Town Hall could not be reached. It needs a connection; check the connection light at the top of the page.</p>}
        {list.state === "loading" && <p className="muted"><span className={styles.spinner} aria-hidden="true" /> Gathering the conversations…</p>}
        {list.state === "done" && list.value.rows.length === 0 && (
          <p className={styles.empty}>{q || tag ? "Nothing matches." : "No conversations here yet. The first one could be yours."}</p>
        )}
        {list.state === "done" && list.value.rows.length > 0 && (
          <ol className={styles.threads}>
            {list.value.rows.map((t: Thread, i) => (
              <li key={t.id} style={{ "--i": i } as React.CSSProperties}>
                <div className={styles.threadScore} aria-label={`${t.score} votes`}><b>{t.score}</b><small>votes</small></div>
                <div className={styles.threadMain}>
                  <Link href={`/town-hall/thread?id=${t.id}`} className={styles.threadTitle}>
                    {t.answered_post_id && <span className={styles.answered} title="Answered">✓</span>}
                    {t.locked && <span title="Closed to new replies">🔒︎ </span>}
                    {t.title}
                  </Link>
                  <p className={styles.threadMeta}>
                    {!c && catById.get(t.category_id) && <button type="button" className={styles.catTag} onClick={() => go({ c: t.category_id })}>{catById.get(t.category_id)!.title}</button>}
                    {t.tags.map((g) => <button key={g} type="button" className={styles.tag} onClick={() => go({ tag: g })}>{g}</button>)}
                    <span>{t.author?.display_name ?? "a former member"} · {ago(t.created_at)}</span>
                    {t.quote && <span className={styles.quoteMark} title={`Quotes ${t.quote.cite}`}>❝ {t.quote.cite}</span>}
                  </p>
                </div>
                <div className={styles.threadReplies}><b>{t.reply_count}</b><small>{t.reply_count === 1 ? "reply" : "replies"}</small><small>{ago(t.last_activity_at)}</small></div>
              </li>
            ))}
          </ol>
        )}
        {list.state === "done" && (page > 0 || list.value.more) && (
          <div className={styles.row}>
            {page > 0 && <button type="button" className="chip" onClick={() => setPage(page - 1)}>← Newer</button>}
            {list.value.more && <button type="button" className="chip" onClick={() => setPage(page + 1)}>Older →</button>}
          </div>
        )}
      </section>

      <Rules />
    </div>
  );
}

function FeaturedDebate({ d }: { d: Debate }) {
  return (
    <Link href={`/town-hall/pnyx/debate?id=${d.id}`} className={styles.featured}>
      <span className="label">This week on the Pnyx</span>
      <b>{d.motion}</b>
      <span>Argue for or against, and cast your pebble →</span>
    </Link>
  );
}

export function Rules() {
  return (
    <section id="rules" className={styles.rules} aria-labelledby="rules-h">
      <h2 id="rules-h">The rules of the Town Hall</h2>
      <ol>
        <li><b>Argue the idea, not the person.</b> Disagree as hard as you like with what someone says; never attack who they are.</li>
        <li><b>Beginners are welcome.</b> Every question is a good one. Answer the way you would have wanted to be answered.</li>
        <li><b>Show your sources.</b> Quote the passage, link the entry, name the book. The Pnyx marks arguments that cite a source.</li>
        <li><b>Keep it about the Greeks.</b> Their language, texts, history and world; the Off-topic room is for everything else, kindly.</li>
        <li><b>No spam, no advertising, no one else&apos;s words passed off as yours.</b></li>
      </ol>
      <p className={styles.fine}>
        The Town Hall is looked after by the site&apos;s owner, who may hide posts, close threads and pause members who break these rules.
        If something needs the moderator&apos;s eye, use “Report” beside it. Only the moderator sees reports.
      </p>
    </section>
  );
}
