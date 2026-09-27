/**
 * Export and restore everything the reader has made on this device: marks and notes, notes on
 * authors and words, the review deck and lesson progress, and where they stopped in each book.
 *
 * The export is one HTML file: it reads as a tidy document in any browser, and it carries the same
 * data as JSON inside it, so the Treasury can restore from it. Restoring merges, never deletes:
 * a record already here is replaced only by a newer copy of itself.
 */
import type { Mark, PageNote } from "./annotations";
import type { DeckCard } from "./academy";
import type { Position } from "./position";
import type { CatalogIndex } from "./catalog";

export const EXPORT_APP = "Mathesis Stoicheion";
export const EXPORT_FORMAT = 1;

export interface TreasuryData {
  app: typeof EXPORT_APP;
  format: number;
  exported: string;
  marks: Mark[];
  notes: PageNote[];
  academy: { completed: Record<string, number>; days: string[]; deck: Record<string, DeckCard> };
  positions: Record<string, Position>;
}

// ------------------------------------------------------------ merging
export interface MergeReport { added: number; updated: number; unchanged: number }
const report = (): MergeReport => ({ added: 0, updated: 0, unchanged: 0 });

/** Records (by id) to write: those that are new here, or newer than the copy here. */
export function mergeById<T extends { id: string; updated: number }>(mine: T[], theirs: T[]): { write: T[]; report: MergeReport } {
  const have = new Map(mine.map((x) => [x.id, x]));
  const r = report(), write: T[] = [];
  for (const t of theirs) {
    const m = have.get(t.id);
    if (!m) { r.added++; write.push(t); }
    else if (t.updated > m.updated) { r.updated++; write.push(t); }
    else r.unchanged++;
  }
  return { write, report: r };
}

const reps = (c: DeckCard) => Number((c.card as unknown as { reps?: number }).reps ?? 0);
const lastReview = (c: DeckCard) => {
  const v = (c.card as unknown as { last_review?: string | Date }).last_review;
  return v ? new Date(v).getTime() : 0;
};

/** The review deck: a card from the file wins only if it has been reviewed more (or more recently). */
export function mergeDeck(mine: Record<string, DeckCard>, theirs: Record<string, DeckCard>): { deck: Record<string, DeckCard>; report: MergeReport } {
  const deck = { ...mine }, r = report();
  for (const [id, t] of Object.entries(theirs)) {
    const m = mine[id];
    if (!m) { deck[id] = t; r.added++; }
    else if (reps(t) > reps(m) || (reps(t) === reps(m) && lastReview(t) > lastReview(m))) { deck[id] = t; r.updated++; }
    else r.unchanged++;
  }
  return { deck, report: r };
}

export function mergeAcademy(mine: TreasuryData["academy"], theirs: TreasuryData["academy"]) {
  const completed = { ...mine.completed };
  for (const [id, t] of Object.entries(theirs.completed ?? {})) completed[id] = Math.min(completed[id] ?? t, t);
  const days = [...new Set([...mine.days, ...(theirs.days ?? [])])].sort().slice(-400);
  const { deck, report } = mergeDeck(mine.deck, theirs.deck ?? {});
  return { academy: { completed, days, deck }, report };
}

/** Where you stopped: the more recent position wins, book by book. */
export function mergePositions(mine: Record<string, Position>, theirs: Record<string, Position>) {
  const out = { ...mine };
  let changed = 0;
  for (const [w, p] of Object.entries(theirs ?? {})) if (!out[w] || p.t > out[w].t) { out[w] = p; changed++; }
  return { positions: out, changed };
}

// ------------------------------------------------------------ reading a file
export class ImportProblem extends Error {}

/** The data inside an exported file (the HTML export, or plain JSON). */
export function parseExport(text: string): TreasuryData {
  let json = text.trim();
  if (!json.startsWith("{")) {
    const m = /<script[^>]*id="mathesis-data"[^>]*>([\s\S]*?)<\/script>/.exec(text);
    if (!m) throw new ImportProblem("This file is not a Treasury export: it has no Mathesis Stoicheion data in it.");
    json = m[1];
  }
  let d: TreasuryData;
  try { d = JSON.parse(json); } catch { throw new ImportProblem("The data in this file is damaged and could not be read."); }
  if (d?.app !== EXPORT_APP) throw new ImportProblem("This file was not made by Mathesis Stoicheion.");
  if (typeof d.format !== "number" || d.format > EXPORT_FORMAT) throw new ImportProblem("This file was made by a newer version of the site. Reload the page and try again.");
  return {
    app: EXPORT_APP, format: d.format, exported: String(d.exported ?? ""),
    marks: Array.isArray(d.marks) ? d.marks.filter(isMark) : [],
    notes: Array.isArray(d.notes) ? d.notes.filter(isPageNote) : [],
    academy: {
      completed: d.academy?.completed && typeof d.academy.completed === "object" ? d.academy.completed : {},
      days: Array.isArray(d.academy?.days) ? d.academy.days.filter((x) => typeof x === "string") : [],
      deck: d.academy?.deck && typeof d.academy.deck === "object" ? d.academy.deck : {},
    },
    positions: d.positions && typeof d.positions === "object" ? d.positions : {},
  };
}
const isMark = (m: Mark) => !!m && typeof m.id === "string" && typeof m.work === "string" && typeof m.kind === "string" && !!m.start && typeof m.updated === "number";
const isPageNote = (n: PageNote) => !!n && typeof n.id === "string" && (n.kind === "author" || n.kind === "word" || n.kind === "stoa") && typeof n.updated === "number";

// ------------------------------------------------------------ writing the readable file
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const when = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export const rangeText = (m: Pick<Mark, "start" | "end">) => (m.start.u === m.end.u ? m.start.u : `${m.start.u}–${m.end.u}`);

/** Note text with the site's light formatting (**bold**, *italic*, "- " lists) as HTML. */
export function noteHtml(text: string): string {
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; };
  for (const para of text.split(/\n{2,}/)) {
    const lines = para.split("\n");
    let buf: string[] = [];
    for (const l of lines) {
      if (/^\s*[-•]\s+/.test(l)) { if (buf.length) { out.push(`<p>${buf.map(inline).join("<br>")}</p>`); buf = []; } list.push(l.replace(/^\s*[-•]\s+/, "")); }
      else { flush(); buf.push(l); }
    }
    flush();
    if (buf.some((b) => b.trim())) out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
  }
  return out.join("");
}

export function exportHtml(d: TreasuryData, idx: CatalogIndex | null, origin: string): string {
  const title = (work: string) => {
    const w = idx?.work.get(work), a = idx?.authorOf.get(work);
    return w ? `${a ? `${a.name}, ` : ""}${w.title}` : work;
  };
  const link = (m: Pick<Mark, "work" | "ed" | "start">) => `${origin}/read?w=${encodeURIComponent(m.work)}&ed=${encodeURIComponent(m.ed)}&at=${encodeURIComponent(m.start.u)}`;
  const byWork = (ms: Mark[]) => {
    const g = new Map<string, Mark[]>();
    for (const m of ms) g.set(m.work, [...(g.get(m.work) ?? []), m]);
    return [...g].sort((a, b) => title(a[0]).localeCompare(title(b[0])));
  };
  const markItem = (m: Mark, body = "") => `<li><a href="${esc(link(m))}">${esc(rangeText(m))}</a> <span class="grc" lang="grc">${esc(m.quote)}</span>${body}</li>`;
  const tags = (t?: string[]) => (t?.length ? `<p class="tags">${t.map((x) => `<span>${esc(x)}</span>`).join(" ")}</p>` : "");
  const section = (h: string, items: string) => (items ? `<section><h2>${h}</h2>${items}</section>` : "");
  const kind = (k: Mark["kind"]) => d.marks.filter((m) => m.kind === k);

  const notes = byWork(kind("note")).map(([w, ms]) => `<h3>${esc(title(w))}</h3><ul>${ms.map((m) => markItem(m, `<div class="note">${noteHtml(m.text ?? "")}${tags(m.tags)}</div>`)).join("")}</ul>`).join("");
  const favs = kind("favourite");
  const cols = new Map<string, Mark[]>();
  for (const m of favs) for (const c of m.collections?.length ? m.collections : [""]) cols.set(c, [...(cols.get(c) ?? []), m]);
  const anthology = [...cols].sort((a, b) => (a[0] === "" ? 1 : b[0] === "" ? -1 : a[0].localeCompare(b[0])))
    .map(([c, ms]) => `<h3>${esc(c || "Not in a collection")}</h3><ul>${ms.map((m) => markItem(m, ` <span class="muted">${esc(title(m.work))}</span>`)).join("")}</ul>`).join("");
  const simple = (k: Mark["kind"], extra: (m: Mark) => string = () => "") =>
    byWork(kind(k)).map(([w, ms]) => `<h3>${esc(title(w))}</h3><ul>${ms.map((m) => markItem(m, extra(m))).join("")}</ul>`).join("");
  const xrefs = kind("xref").map((m) => `<li><a href="${esc(link(m))}">${esc(title(m.work))} ${esc(rangeText(m))}</a> ↔ ${m.link ? `<a href="${esc(link({ work: m.link.work, ed: m.link.ed, start: m.link.start }))}">${esc(title(m.link.work))} ${esc(m.link.label || m.link.start.u)}</a>` : "?"}</li>`).join("");
  const words = Object.values(d.academy.deck).sort((a, b) => a.lemma.localeCompare(b.lemma, "el"))
    .map((c) => `<li><a href="${esc(`${origin}/treasury/word?l=${encodeURIComponent(c.lemma)}`)}" class="grc" lang="grc">${esc(c.lemma)}</a> ${esc(c.gloss)} <span class="muted">${c.source === "saved" ? "saved from the reader" : c.source === "lesson" ? "from a lesson" : "core vocabulary"}</span></li>`).join("");
  const pageNotes = (k: PageNote["kind"]) => d.notes.filter((n) => n.kind === k).sort((a, b) => a.target.localeCompare(b.target, "el"))
    .map((n) => `<h3${k === "word" ? ' class="grc" lang="grc"' : ""}>${k === "stoa" ? `<a href="${esc(`${origin}/stoa/${n.target.replace("#top", "")}`)}">${esc(n.target.replace("#top", "").replace("#", " › ").replace(/-/g, " "))}</a>` : esc(k === "author" ? idx?.author.get(n.target)?.name ?? n.target : n.target)}</h3><div class="note">${noteHtml(n.text)}${tags(n.tags)}</div>`).join("");
  const positions = Object.entries(d.positions).sort((a, b) => b[1].t - a[1].t)
    .map(([w, p]) => `<li><a href="${esc(`${origin}/read?w=${encodeURIComponent(w)}&ed=${encodeURIComponent(p.ed)}&at=${encodeURIComponent(p.at)}`)}">${esc(title(w))}</a>, at ${esc(p.at)} <span class="muted">(${when(p.t)})</span></li>`).join("");

  const data = JSON.stringify(d).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>My Treasury · Mathesis Stoicheion · ${esc(when(Date.parse(d.exported) || Date.now()))}</title>
<style>
body{font:17px/1.6 Georgia,"Times New Roman",serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#1B1410;background:#F6EEDF}
h1{font-weight:normal;font-size:2.2rem;margin-bottom:0}h2{font-weight:normal;border-bottom:2px solid #A33A16;margin-top:2.5rem}
h3{font-size:1.05rem;margin:1.4rem 0 .4rem}.grc{font-family:"GFS Didot","Gentium Plus","Noto Serif",serif}
a{color:#A33A16}.muted{color:#5A3E2B}ul{padding-left:1.2rem}li{margin:.4rem 0}.note{margin:.2rem 0 .6rem;padding-left:.8rem;border-left:3px solid #A33A16}
.note p{margin:.3rem 0}.tags span{font-size:.85rem;border:1px solid #5A3E2B;border-radius:2px;padding:0 .4rem;margin-right:.3rem}
@media (prefers-color-scheme:dark){body{background:#16110E;color:#EDCBA0}a{color:#E0673A}.muted{color:#BE9876}h2,.note{border-color:#E0673A}}
</style></head><body>
<h1>My Treasury</h1>
<p class="muted">Everything saved on Mathesis Stoicheion in this browser, exported on ${esc(when(Date.parse(d.exported) || Date.now()))}. To restore it, open the Treasury and choose “Restore from a file”.</p>
${section("Notes on passages", notes)}
${section("Favourite passages", anthology)}
${section("Bookmarks", simple("bookmark"))}
${section("Highlights", simple("highlight", (m) => ` <span class="muted">(${esc(m.colour ?? "")})</span>`))}
${section("Cross-references", xrefs ? `<ul>${xrefs}</ul>` : "")}
${section("Saved words", words ? `<ul>${words}</ul>` : "")}
${section("Notes on words", pageNotes("word"))}
${section("Notes on authors", pageNotes("author"))}
${section("Notes on the Painted Stoa", pageNotes("stoa"))}
${section("Where you stopped reading", positions ? `<ul>${positions}</ul>` : "")}
<script type="application/json" id="mathesis-data">${data}</script>
</body></html>
`;
}
