"use client";
/**
 * One thread of the Town Hall: the question (with a quoted passage if it came from the reader),
 * the replies as a conversation tree, upvotes, "marked as answered", editing and deleting your
 * own words, reporting, and the moderator's tools. A bug report or suggestion shows its status, which
 * the moderator sets here. What people you have hidden wrote folds away. URL: /town-hall/thread?id=<id>
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReloadable } from "@/lib/use-load";
import { isModerator, problem, useAccount } from "@/lib/community/client";
import {
  categories, deletePost, deleteThread, editPost, editThread, lockThread, markAnswered, moderate, myVotes, posts, reply, setThreadStatus, STATUS, thread, tree, vote,
  type Node, type Post, type Thread, type ThreadStatus,
} from "@/lib/community/data";
import { AuthorLine, canWrite, Composer, DeleteButton, Folded, HideButton, PostText, QuoteBlock, ReportButton, SignInPrompt, StatusTag, VoteButton } from "./parts";
import PullToRefresh from "@/components/PullToRefresh";
import styles from "./Community.module.css";

export default function ThreadView() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const account = useAccount();
  useEffect(() => { account.start(); }, [account]);
  const uid = account.session?.user.id ?? null;
  const got = useReloadable(`thread|${id}|${uid}`, async () => {
    const [t, ps, cats] = await Promise.all([thread(id), posts(id), categories()]);
    const votes = uid && t ? await myVotes(uid, [t.id], ps.map((p) => p.id)) : { threads: new Set<number>(), posts: new Set<number>() };
    return { t, ps, votes, cats };
  }, !!id);
  const data = got.data;
  const votes = data?.votes ?? { threads: new Set<number>(), posts: new Set<number>() };
  const load = async () => got.reload();

  if (!id) return <p className={`wrap ${styles.status}`}>No thread was named. <Link href="/town-hall">Back to the Town Hall</Link></p>;
  if (got.error && !data) return <p className={`wrap ${styles.error}`}>{problem(got.error)}</p>;
  if (!data) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Opening the thread…</div>;
  if (!data.t) return <p className={`wrap ${styles.status}`}>This thread does not exist, or it has been removed. <Link href="/town-hall">Back to the Town Hall</Link></p>;

  const t = data.t;
  const mod = isModerator(account.profile);
  const mine = uid === t.author_id;
  const writer = canWrite(account);
  const answered = data.ps.find((p) => p.id === t.answered_post_id) ?? null;
  const toggle = (kind: "thread" | "post", pid: number) => async () => {
    const on = !(kind === "thread" ? votes.threads : votes.posts).has(pid);
    await vote(kind, pid, on);
    await load();
  };

  return (
    <article className={`wrap ${styles.threadPage}`}>
      <PullToRefresh onPull={got.reload} busy={got.busy} />
      <p className={styles.crumbs}><Link href="/town-hall">The Town Hall</Link> / <Link href={`/town-hall?c=${t.category_id}`}>{data.cats.find((c) => c.id === t.category_id)?.title ?? t.category_id.replace(/-/g, " ")}</Link></p>
      <ThreadHead t={t} mine={mine} mod={mod} writer={writer} votes={votes} toggle={toggle} reload={load} />

      {answered && (
        <p className={styles.answerNote}>✓ Answered — <a href={`#p${answered.id}`}>see the reply by {answered.author?.display_name ?? "a former member"}</a></p>
      )}

      <section aria-labelledby="replies-h" className={styles.replies}>
        <h2 id="replies-h">{data.ps.length === 0 ? "No replies yet" : `${data.ps.length} ${data.ps.length === 1 ? "reply" : "replies"}`}</h2>
        <ReplyTree nodes={tree(data.ps)} t={t} uid={uid} mod={mod} writer={writer} votes={votes} toggle={toggle} reload={load} />
      </section>

      {t.locked ? <p className={styles.note}>🔒︎ This thread is closed to new replies.</p> : writer ? (
        <section className={styles.replyBox} aria-label="Reply">
          <h2>Your reply</h2>
          <Composer label="Your reply" submitLabel="Reply" draftKey={`thread:${t.id}`} onSubmit={async (body) => { await reply({ thread_id: t.id, parent_id: null, body, quote: null }); await load(); }} />
        </section>
      ) : <SignInPrompt what="reply" />}
    </article>
  );
}

type Toggle = (kind: "thread" | "post", id: number) => () => Promise<void>;

function ThreadHead({ t, mine, mod, writer, votes, toggle, reload }: {
  t: Thread; mine: boolean; mod: boolean; writer: boolean; votes: { threads: Set<number> }; toggle: Toggle; reload: () => Promise<void>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(t.title);
  return (
    <header className={styles.threadHead}>
      <div className={styles.headRow}>
        <VoteButton count={t.score} on={votes.threads.has(t.id)} onToggle={writer ? toggle("thread", t.id) : null} label="This is a good question" />
        <div>
          {editing ? (
            <input className={styles.titleInput} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" minLength={3} maxLength={160} />
          ) : <h1>{t.title}<StatusTag status={t.status} /></h1>}
          <AuthorLine author={t.author} at={t.created_at} edited={t.edited_at} />
          {t.tags.length > 0 && <p className={styles.tagRow}>{t.tags.map((g) => <Link key={g} className={styles.tag} href={`/town-hall?tag=${encodeURIComponent(g)}`}>{g}</Link>)}</p>}
        </div>
      </div>
      {t.hidden && <p className={styles.error}>Hidden by the moderator{t.hidden_reason ? `: ${t.hidden_reason}` : ""}. Only you and the moderator can see it.</p>}
      <Folded author={mine ? null : t.author} what="A thread">
        {t.quote && <QuoteBlock quote={t.quote} />}
        {editing ? (
          <Composer label="Edit your question" submitLabel="Save" initial={t.body} autoFocus onCancel={() => setEditing(false)}
            onSubmit={async (body) => { await editThread(t.id, { body, title: title.trim() }); setEditing(false); await reload(); }} />
        ) : <PostText text={t.body} />}
      </Folded>
      <div className={styles.actions}>
        {mine && !editing && !t.locked && <button type="button" className={styles.linkBtn} onClick={() => setEditing(true)}>Edit</button>}
        {(mine || mod) && <DeleteButton what="this thread and all its replies" onDelete={async () => { await deleteThread(t.id); router.push("/town-hall"); }} />}
        {!mine && <ReportButton kind="thread" id={t.id} />}
        {mod && <>
          <button type="button" className={styles.modBtn} onClick={async () => { await lockThread(t.id, !t.locked); await reload(); }}>{t.locked ? "Reopen" : "Close to replies"}</button>
          <HideButton hidden={t.hidden} onChange={async (hide, reason) => { await moderate("thread", t.id, hide, reason); await reload(); }} />
          {t.status && <StatusControl t={t} reload={reload} />}
        </>}
      </div>
    </header>
  );
}

/** The moderator's status for a bug report or a suggestion (only the statuses its board uses). */
function StatusControl({ t, reload }: { t: Thread; reload: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const choices = (Object.keys(STATUS) as ThreadStatus[]).filter((k) => STATUS[k].boards.includes(t.category_id));
  return (
    <span className={styles.statusRow}>
      <label>
        <span className="visually-hidden">Status</span>
        <select aria-label="Status" value={t.status ?? "open"} disabled={busy} onChange={async (e) => {
          setBusy(true); setError(null);
          try { await setThreadStatus(t.id, e.target.value as ThreadStatus); await reload(); } catch (err) { setError(problem(err)); }
          setBusy(false);
        }}>
          {choices.map((k) => <option key={k} value={k}>{STATUS[k].label}</option>)}
        </select>
      </label>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </span>
  );
}

function ReplyTree({ nodes, depth = 0, ...rest }: {
  nodes: Node<Post>[]; depth?: number; t: Thread; uid: string | null; mod: boolean; writer: boolean;
  votes: { posts: Set<number> }; toggle: Toggle; reload: () => Promise<void>;
}) {
  if (!nodes.length) return null;
  return (
    <ol className={depth ? styles.subReplies : styles.replyList}>
      {nodes.map((n) => (
        <li key={n.item.id}>
          <Reply p={n.item} depth={depth} {...rest} />
          <ReplyTree nodes={n.children} depth={depth + 1} {...rest} />
        </li>
      ))}
    </ol>
  );
}

function Reply({ p, depth, t, uid, mod, writer, votes, toggle, reload }: {
  p: Post; depth: number; t: Thread; uid: string | null; mod: boolean; writer: boolean;
  votes: { posts: Set<number> }; toggle: Toggle; reload: () => Promise<void>;
}) {
  const [mode, setMode] = useState<"read" | "edit" | "reply">("read");
  const mine = uid === p.author_id;
  const isAnswer = t.answered_post_id === p.id;
  const asker = uid === t.author_id;
  return (
    <div id={`p${p.id}`} className={`${styles.reply} ${isAnswer ? styles.isAnswer : ""}`}>
      <div className={styles.headRow}>
        <VoteButton count={p.score} on={votes.posts.has(p.id)} onToggle={writer ? toggle("post", p.id) : null} label="This reply helped" />
        <div className={styles.replyBody}>
          <AuthorLine author={p.author} at={p.created_at} edited={p.edited_at} extra={isAnswer ? <span className={styles.answerTag}>✓ the answer</span> : null} />
          {p.hidden && <p className={styles.error}>Hidden by the moderator{p.hidden_reason ? `: ${p.hidden_reason}` : ""}.</p>}
          <Folded author={mine ? null : p.author} what="A reply">
            {p.quote && <QuoteBlock quote={p.quote} />}
            {mode === "edit"
              ? <Composer label="Edit your reply" submitLabel="Save" initial={p.body} autoFocus onCancel={() => setMode("read")}
                  onSubmit={async (body) => { await editPost(p.id, body); setMode("read"); await reload(); }} />
              : <PostText text={p.body} />}
          </Folded>
          <div className={styles.actions}>
            {writer && !t.locked && depth < 6 && <button type="button" className={styles.linkBtn} onClick={() => setMode(mode === "reply" ? "read" : "reply")}>Reply</button>}
            {(asker || mod) && <button type="button" className={styles.linkBtn} onClick={async () => { await markAnswered(t.id, isAnswer ? null : p.id); await reload(); }}>
              {isAnswer ? "Not the answer" : "Mark as the answer"}</button>}
            {mine && mode === "read" && <button type="button" className={styles.linkBtn} onClick={() => setMode("edit")}>Edit</button>}
            {(mine || mod) && <DeleteButton what="this reply" onDelete={async () => { await deletePost(p.id); await reload(); }} />}
            {!mine && <ReportButton kind="post" id={p.id} />}
            {mod && <HideButton hidden={p.hidden} onChange={async (hide, reason) => { await moderate("post", p.id, hide, reason); await reload(); }} />}
          </div>
          {mode === "reply" && (
            <Composer label={`Reply to ${p.author?.display_name ?? "this"}`} submitLabel="Reply" rows={3} autoFocus draftKey={`post:${p.id}`} onCancel={() => setMode("read")}
              onSubmit={async (body) => { await reply({ thread_id: t.id, parent_id: p.id, body, quote: null }); setMode("read"); await reload(); }} />
          )}
        </div>
      </div>
    </div>
  );
}
