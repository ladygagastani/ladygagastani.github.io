"use client";
/**
 * Reading and writing the Town Hall and the Pnyx. Everything here goes through the database's
 * row-level security rules (supabase/migrations): what a member may not do is refused there, not
 * just hidden here.
 */
import { supabase } from "./client";

/** A passage quoted from the reader, with a live link back to it. */
export interface Quote { work: string; ref: string; grc: string; eng?: string; cite: string; href: string }
export interface Author { id: string; display_name: string; role: "member" | "moderator" }

export interface Category { id: string; title: string; blurb: string; sort: number }
export interface Thread {
  id: number; category_id: string; author_id: string; title: string; body: string; tags: string[]; quote: Quote | null;
  created_at: string; edited_at: string | null; last_activity_at: string; reply_count: number; score: number;
  answered_post_id: number | null; locked: boolean; hidden: boolean; hidden_reason: string | null; author: Author | null;
}
export interface Post {
  id: number; thread_id: number; parent_id: number | null; author_id: string; body: string; quote: Quote | null;
  created_at: string; edited_at: string | null; score: number; hidden: boolean; hidden_reason: string | null; author: Author | null;
}
export interface Debate {
  id: number; motion: string; blurb: string; created_by: string; status: "proposed" | "open" | "closed" | "declined";
  from_entry: string | null; featured: boolean; opened_at: string | null; closes_at: string | null; closed_at: string | null;
  created_at: string; author: Author | null;
}
export interface Argument {
  id: number; debate_id: number; side: "for" | "against"; parent_id: number | null; author_id: string; body: string;
  quote: Quote | null; cites_source: boolean; created_at: string; edited_at: string | null; score: number;
  hidden: boolean; hidden_reason: string | null; author: Author | null;
}
export interface Tally { votes_for: number; votes_against: number; changed_mind: number }
export interface Report {
  id: number; reporter_id: string; kind: string; target_id: string; reason: string; created_at: string;
  resolved_at: string | null; outcome: string | null; reporter: Author | null;
}

// named links: a thread or reply is also linked to profiles through its upvotes, so "the author" must be said
const THREAD_AUTHOR = "author:profiles!threads_author_id_fkey(id, display_name, role)";
const POST_AUTHOR = "author:profiles!posts_author_id_fkey(id, display_name, role)";
const ARGUMENT_AUTHOR = "author:profiles!arguments_author_id_fkey(id, display_name, role)";
const DEBATE_AUTHOR = "author:profiles!debates_created_by_fkey(id, display_name, role)";
export const PAGE = 30;

function must<T>(r: { data: T | null; error: unknown }): T {
  if (r.error) throw r.error;
  return r.data as T;
}

// ------------------------------------------------------------ the Town Hall
export async function categories(): Promise<Category[]> {
  return must(await supabase().from("forum_categories").select("*").order("sort"));
}

export interface ThreadQuery { category?: string | null; tag?: string | null; q?: string | null; author?: string | null; sort?: "active" | "new" | "top" | "unanswered"; page?: number }
export async function threads(o: ThreadQuery = {}): Promise<{ rows: Thread[]; more: boolean }> {
  let q = supabase().from("threads").select(`*, ${THREAD_AUTHOR}`);
  if (o.category) q = q.eq("category_id", o.category);
  if (o.tag) q = q.contains("tags", [o.tag]);
  if (o.author) q = q.eq("author_id", o.author);
  if (o.sort === "unanswered") q = q.is("answered_post_id", null).eq("reply_count", 0);
  if (o.q?.trim()) {
    const term = o.q.trim().replace(/[%_,()]/g, " ");
    q = q.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
  }
  q = o.sort === "new" ? q.order("created_at", { ascending: false })
    : o.sort === "top" ? q.order("score", { ascending: false }).order("created_at", { ascending: false })
    : q.order("last_activity_at", { ascending: false });
  const from = (o.page ?? 0) * PAGE;
  const rows = must(await q.range(from, from + PAGE)) as Thread[];
  return { rows: rows.slice(0, PAGE), more: rows.length > PAGE };
}

export async function thread(id: number): Promise<Thread | null> {
  return must(await supabase().from("threads").select(`*, ${THREAD_AUTHOR}`).eq("id", id).maybeSingle()) as Thread | null;
}
export async function posts(threadId: number): Promise<Post[]> {
  return must(await supabase().from("posts").select(`*, ${POST_AUTHOR}`).eq("thread_id", threadId).order("created_at")) as Post[];
}
export async function startThread(t: { category_id: string; title: string; body: string; tags: string[]; quote: Quote | null }): Promise<number> {
  const row = must(await supabase().from("threads").insert(t).select("id").single()) as { id: number };
  return row.id;
}
export async function editThread(id: number, t: Partial<Pick<Thread, "title" | "body" | "tags" | "category_id">>) {
  must(await supabase().from("threads").update(t).eq("id", id));
}
export async function deleteThread(id: number) { must(await supabase().from("threads").delete().eq("id", id)); }
export async function reply(p: { thread_id: number; parent_id: number | null; body: string; quote: Quote | null }): Promise<void> {
  must(await supabase().from("posts").insert(p));
}
export async function editPost(id: number, body: string) { must(await supabase().from("posts").update({ body }).eq("id", id)); }
export async function deletePost(id: number) { must(await supabase().from("posts").delete().eq("id", id)); }
export async function markAnswered(threadId: number, postId: number | null) {
  must(await supabase().rpc("mark_answered", { p_thread: threadId, p_post: postId }));
}

/** Which of these the member has upvoted. */
export async function myVotes(uid: string, threadIds: number[], postIds: number[]): Promise<{ threads: Set<number>; posts: Set<number> }> {
  const sb = supabase();
  const [t, p] = await Promise.all([
    threadIds.length ? sb.from("thread_votes").select("thread_id").eq("user_id", uid).in("thread_id", threadIds) : Promise.resolve({ data: [], error: null }),
    postIds.length ? sb.from("post_votes").select("post_id").eq("user_id", uid).in("post_id", postIds) : Promise.resolve({ data: [], error: null }),
  ]);
  return {
    threads: new Set((must(t) as { thread_id: number }[]).map((r) => r.thread_id)),
    posts: new Set((must(p) as { post_id: number }[]).map((r) => r.post_id)),
  };
}
export async function vote(kind: "thread" | "post", id: number, on: boolean) {
  const sb = supabase();
  if (kind === "thread") {
    if (on) must(await sb.from("thread_votes").insert({ thread_id: id }));
    else must(await sb.from("thread_votes").delete().eq("thread_id", id));
  } else {
    if (on) must(await sb.from("post_votes").insert({ post_id: id }));
    else must(await sb.from("post_votes").delete().eq("post_id", id));
  }
}

// ------------------------------------------------------------ the Pnyx
export async function debates(): Promise<Debate[]> {
  return must(await supabase().from("debates").select(`*, ${DEBATE_AUTHOR}`).order("created_at", { ascending: false })) as Debate[];
}
export async function debate(id: number): Promise<Debate | null> {
  return must(await supabase().from("debates").select(`*, ${DEBATE_AUTHOR}`).eq("id", id).maybeSingle()) as Debate | null;
}
export async function argumentsOf(debateId: number): Promise<Argument[]> {
  return must(await supabase().from("arguments").select(`*, ${ARGUMENT_AUTHOR}`).eq("debate_id", debateId).order("created_at")) as Argument[];
}
export async function argue(a: { debate_id: number; side: "for" | "against"; parent_id: number | null; body: string; quote: Quote | null }) {
  must(await supabase().from("arguments").insert(a));
}
export async function editArgument(id: number, body: string) { must(await supabase().from("arguments").update({ body }).eq("id", id)); }
export async function deleteArgument(id: number) { must(await supabase().from("arguments").delete().eq("id", id)); }
export async function proposeDebate(d: { motion: string; blurb: string; from_entry: string | null }): Promise<number> {
  return (must(await supabase().from("debates").insert(d).select("id").single()) as { id: number }).id;
}
export async function myPebble(debateId: number, uid: string): Promise<{ side: "for" | "against"; first_side: "for" | "against" } | null> {
  return must(await supabase().from("debate_votes").select("side, first_side").eq("debate_id", debateId).eq("user_id", uid).maybeSingle()) as never;
}
export async function castPebble(debateId: number, side: "for" | "against") {
  must(await supabase().rpc("cast_pebble", { p_debate: debateId, p_side: side }));
}
export async function tally(debateId: number): Promise<Tally | null> {
  const rows = must(await supabase().rpc("debate_tally", { p_debate: debateId })) as Tally[];
  return rows?.[0] ?? null;
}

// ------------------------------------------------------------ members and moderation
export async function profile(id: string) {
  return must(await supabase().from("profiles").select("id, display_name, bio, role, created_at, banned_until").eq("id", id).maybeSingle());
}
export async function updateProfile(id: string, p: { display_name?: string; bio?: string }) {
  must(await supabase().from("profiles").update(p).eq("id", id));
}
export async function report(kind: "thread" | "post" | "argument" | "debate" | "profile", targetId: string | number, reason: string) {
  must(await supabase().from("reports").insert({ kind, target_id: String(targetId), reason }));
}
export async function reports(open = true): Promise<Report[]> {
  let q = supabase().from("reports").select("*, reporter:profiles!reports_reporter_id_fkey(id, display_name, role)").order("created_at", { ascending: false });
  q = open ? q.is("resolved_at", null) : q.not("resolved_at", "is", null);
  return must(await q.limit(200)) as Report[];
}
export async function resolveReport(id: number, outcome: string) { must(await supabase().rpc("resolve_report", { p_report: id, p_outcome: outcome })); }
export async function moderate(kind: "thread" | "post" | "argument", id: number, hidden: boolean, reason: string | null) {
  must(await supabase().rpc("moderate", { p_kind: kind, p_id: id, p_hidden: hidden, p_reason: reason }));
}
export async function lockThread(id: number, locked: boolean) { must(await supabase().rpc("lock_thread", { p_thread: id, p_locked: locked })); }
export async function ban(user: string, until: string | null, reason: string | null) {
  must(await supabase().rpc("ban", { p_user: user, p_until: until, p_reason: reason }));
}
export async function setDebate(id: number, status: Debate["status"], closesAt: string | null, featured: boolean) {
  must(await supabase().rpc("set_debate", { p_debate: id, p_status: status, p_closes_at: closesAt, p_featured: featured }));
}

// ------------------------------------------------------------ small helpers
export { ago } from "./ago";

export interface Node<T> { item: T; children: Node<T>[] }
/** Replies arranged as a tree (a reply to a reply sits under it). */
export function tree<T extends { id: number; parent_id: number | null }>(items: T[]): Node<T>[] {
  const byParent = new Map<number | null, T[]>();
  const ids = new Set(items.map((i) => i.id));
  for (const i of items) {
    const p = i.parent_id !== null && ids.has(i.parent_id) ? i.parent_id : null;
    byParent.set(p, [...(byParent.get(p) ?? []), i]);
  }
  const build = (p: number | null): Node<T>[] =>
    (byParent.get(p) ?? []).map((item) => ({ item, children: build(item.id) }));
  return build(null);
}
