/**
 * TEI XML → citable passages.
 *
 * The file's own citation scheme (the CTS `cRefPattern` in its header) decides what a passage
 * is: a line of verse, a section of prose, a verse of the New Testament… When a file has no
 * pattern, nested numbered `div`s (and numbered lines inside them) are used instead.
 *
 * Nothing in the text is changed: every character of running text is kept, only whitespace
 * runs are collapsed, as any XML renderer does.
 */
import { SaxesParser } from "saxes";
import type { Block, Inline, TeiDoc, Unit } from "./types";

interface El { name: string; attrs: Record<string, string>; kids: (El | string)[] }
interface Step { name: string; desc: boolean; preds: [string, string][]; group: boolean }

const local = (n: string) => n.slice(n.indexOf(":") + 1);

// ------------------------------------------------------------------ 1. XML → small tree
function buildTree(xml: string): { body: El | null; patterns: { n: string; rp: string }[]; refStates: string[] } {
  const parser = new SaxesParser({ xmlns: false, position: false });
  const root: El = { name: "#root", attrs: {}, kids: [] };
  const stack: El[] = [root];
  const patterns: { n: string; rp: string }[] = [];
  const refStates: string[] = [];
  let skip = 0;          // depth inside <teiHeader>, which we don't keep
  let body: El | null = null;

  parser.on("error", () => { /* keep going: unknown entities etc. must not lose the text */ });
  parser.on("opentag", (t) => {
    const name = local(t.name);
    const attrs: Record<string, string> = {};
    for (const [k, v] of Object.entries(t.attributes)) attrs[k] = String(v);
    if (skip) {
      skip++;
      if (name === "cRefPattern" && attrs.replacementPattern) patterns.push({ n: attrs.n ?? "", rp: attrs.replacementPattern });
      if (name === "refState" && attrs.unit) refStates.push(attrs.unit.toLowerCase());
      return;
    }
    if (name === "teiHeader") { skip = 1; return; }
    const el: El = { name, attrs, kids: [] };
    stack[stack.length - 1].kids.push(el);
    stack.push(el);
    if (name === "body" && !body) body = el;
  });
  parser.on("closetag", () => { if (skip) { skip--; return; } stack.pop(); });
  parser.on("text", (s) => { if (!skip && stack.length > 1) stack[stack.length - 1].kids.push(s); });
  parser.on("cdata", (s) => { if (!skip && stack.length > 1) stack[stack.length - 1].kids.push(s); });
  parser.write(xml).close();
  return { body, patterns, refStates };
}

// ------------------------------------------------------------------ 2. citation scheme
function parsePattern(rp: string): Step[] | null {
  const m = /#xpath\((.*)\)\s*$/.exec(rp.trim());
  if (!m) return null;
  const steps: Step[] = [];
  for (const [, axis, raw] of m[1].matchAll(/(\/\/?)([^/[\]]+(?:\[[^\]]*\])*)/g)) {
    const name = local(raw.replace(/\[.*$/, ""));
    const preds: [string, string][] = [];
    let group = false;
    for (const [, attr, val] of raw.matchAll(/@([\w:]+)\s*=\s*['"]([^'"]*)['"]/g)) {
      if (/^\$\d+$/.test(val)) group = true; else preds.push([attr, val]);
    }
    steps.push({ name, desc: axis === "//", preds, group });
  }
  // drop /TEI/text/body; keep from the edition div down
  const i = steps.findIndex((s) => s.name === "body");
  return i >= 0 ? steps.slice(i + 1) : steps;
}

const isEl = (k: El | string): k is El => typeof k !== "string";
const textOf = (el: El): string => el.kids.map((k) => (isEl(k) ? textOf(k) : k)).join("");

/** Fallback when the header has no pattern: nested numbered textpart divs, then numbered lines. */
function inferSteps(edition: El): { steps: Step[]; levels: string[] } {
  const steps: Step[] = [{ name: "div", desc: false, preds: [], group: false }];
  const levels: string[] = [];
  let cur = edition;
  for (;;) {
    const next = cur.kids.find((k): k is El => isEl(k) && k.name === "div" && "n" in k.attrs);
    if (!next) break;
    steps.push({ name: "div", desc: false, preds: [], group: true });
    levels.push((next.attrs.subtype || "part").toLowerCase());
    cur = next;
  }
  const hasLines = (e: El): boolean => e.kids.some((k) => isEl(k) && ((k.name === "l" && "n" in k.attrs) || hasLines(k)));
  if (hasLines(cur)) { steps.push({ name: "l", desc: true, preds: [], group: true }); levels.push("line"); }
  return { steps, levels };
}

function matches(el: El, s: Step): boolean {
  if (el.name !== s.name) return false;
  if (s.group && !("n" in el.attrs)) return false;
  return s.preds.every(([a, v]) => el.attrs[a] === v);
}

// ------------------------------------------------------------------ 3. content → blocks
class Emitter {
  units: Unit[] = [];
  private pending: Block[] = [];         // content met before the first passage
  private unit: Unit | null = null;
  private block: Block | null = null;
  private speaker: string | undefined;
  private carry: Inline[] = [];          // markers from a block that had no text of its own

  private get blocks(): Block[] { return this.unit ? this.unit.blocks : this.pending; }

  startUnit(ref: string[]) {
    this.endBlock();
    this.unit = { ref, blocks: this.pending.length ? this.pending : [] };
    this.pending = [];
    this.units.push(this.unit);
  }
  /** Element passages end with their element; milestone passages run on until the next one. */
  endUnit() { this.endBlock(); this.unit = null; }

  setSpeaker(s: string) { this.endBlock(); this.speaker = s.replace(/\s+/g, " ").trim(); }

  startBlock(t: "p" | "l" | "head", n?: string) {
    this.endBlock();
    const b: Block = t === "l" ? { t, n, c: [] } : t === "p" ? { t, c: [] } : { t, c: [] };
    if (this.speaker && t !== "head") { (b as { speaker?: string }).speaker = this.speaker; this.speaker = undefined; }
    if (this.carry.length) { b.c.push(...this.carry); this.carry = []; }
    this.block = b;
    this.blocks.push(b);
  }
  endBlock() {
    const b = this.block;
    if (b) {
      // trim the edges of the block, keep inner spacing
      const c = b.c;
      while (typeof c[0] === "string" && !(c[0] as string).trim()) c.shift();
      while (typeof c[c.length - 1] === "string" && !(c[c.length - 1] as string).trim()) c.pop();
      // trim the first and last runs of text, even when markers come before or after them
      const fi = c.findIndex((x) => typeof x === "string");
      if (fi >= 0) c[fi] = (c[fi] as string).replace(/^\s+/, "");
      const li = c.findLastIndex((x) => typeof x === "string");
      if (li >= 0) c[li] = (c[li] as string).replace(/\s+$/, "");
      if (b.t === "l" && c.length && typeof c[0] !== "string" && "m" in c[0] && c[0].m === "para") b.para = true;
      const hasText = c.some((x) => (typeof x === "string" && x.trim()) || (typeof x !== "string" && !("m" in x)));
      if (!hasText) {
        this.blocks.splice(this.blocks.indexOf(b), 1);
        this.carry.push(...c.filter((x) => typeof x !== "string"));
      }
    }
    this.block = null;
  }
  inline(x: Inline) {
    if (!this.block) {
      if (typeof x === "string" && !x.trim()) return;
      this.startBlock("p");
    }
    const c = this.block!.c;
    if (typeof x === "string") {
      const s = x.replace(/\s+/g, " ");
      if (typeof c[c.length - 1] === "string") c[c.length - 1] = (c[c.length - 1] as string) + s; else c.push(s);
    } else c.push(x);
  }
  finish() {
    this.endBlock();
    if (this.carry.length && this.units.length) {
      const last = this.units[this.units.length - 1].blocks;
      if (last.length) last[last.length - 1].c.push(...this.carry);
    }
    if (this.pending.length && this.units.length) this.units[this.units.length - 1].blocks.push(...this.pending);
  }
}

function emitContent(el: El, out: Emitter) {
  for (const k of el.kids) {
    if (!isEl(k)) { out.inline(k); continue; }
    emitElement(k, out, () => emitContent(k, out));
  }
}

/** Handles one element; `inner` emits its children in the current context. */
function emitElement(k: El, out: Emitter, inner: () => void) {
  switch (k.name) {
    case "p": case "ab": out.startBlock("p"); inner(); out.endBlock(); break;
    case "l": out.startBlock("l", k.attrs.n); inner(); out.endBlock(); break;
    case "head": out.startBlock("head"); inner(); out.endBlock(); break;
    case "speaker": out.setSpeaker(textOf(k)); break;
    case "note": { const t = textOf(k).replace(/\s+/g, " ").trim(); if (t) out.inline({ note: t }); break; }
    case "milestone": if (k.attrs.unit) out.inline({ m: k.attrs.unit.toLowerCase(), n: k.attrs.n }); break;
    case "pb": if (k.attrs.n) out.inline({ m: "page", n: k.attrs.n }); break;
    case "gap": out.inline({ gap: true }); break;
    case "lb": out.inline(" "); break;
    default: inner();
  }
}

// ------------------------------------------------------------------ 4. walk the text by the scheme
export function parseTei(xml: string): TeiDoc {
  const { body, patterns, refStates } = buildTree(xml);
  if (!body) return { lang: null, levels: [], units: [], chunks: [] };
  const edition = body.kids.find((k): k is El => isEl(k) && k.name === "div") ?? body;
  const lang = edition.attrs["xml:lang"] ?? null;

  let steps: Step[] | null = null;
  let levels: string[] = [];
  if (patterns.length) {
    // CTS lists the deepest pattern first; take the one with the most $n groups
    const parsed = patterns.map((p) => ({ n: p.n, steps: parsePattern(p.rp) }))
      .filter((p): p is { n: string; steps: Step[] } => !!p.steps);
    parsed.sort((a, b) => b.steps.filter((s) => s.group).length - a.steps.filter((s) => s.group).length);
    if (parsed.length) {
      steps = parsed[0].steps;
      const depth = steps.filter((s) => s.group).length;
      // names: from the patterns, else from <refState>, else from the matched divs' subtypes (filled in below)
      levels = Array.from({ length: depth }, (_, i) =>
        (parsed.find((p) => p.steps.filter((s) => s.group).length === i + 1)?.n || (refStates.length === depth ? refStates[i] : "")).toLowerCase());
    }
  }
  if (!steps || !steps.length) ({ steps, levels } = inferSteps(edition));

  const out = new Emitter();
  const leafIsMilestone = steps[steps.length - 1].name === "milestone";
  const containers: number[] = [];      // for one-level texts: which structural div each passage sits in
  let containerId = 0;

  const visit = (node: El, k: number, matchedHere: boolean, ref: string[]) => {
    for (const c of node.kids) {
      if (!isEl(c)) { out.inline(c); continue; }
      const s = steps![k];
      if (s && (s.desc || matchedHere) && matches(c, s)) {
        const r = s.group ? [...ref, c.attrs.n] : ref;
        if (s.group && !levels[r.length - 1]) levels[r.length - 1] = (c.attrs.subtype || c.name === "l" && "line" || "part").toLowerCase();
        if (k === steps!.length - 1) {
          out.startUnit(r);
          containers.push(containerId);
          if (leafIsMilestone) continue;                 // runs on until the next milestone
          emitElement(c, out, () => emitContent(c, out));
          out.endUnit();
        } else {
          visit(c, k + 1, true, r);
        }
        continue;
      }
      if (node === edition && c.name === "div") containerId++;
      emitElement(c, out, () => visit(c, k, false, ref));
    }
  };
  // the edition div itself is steps[0]
  const start = matches(edition, steps[0]) ? 1 : 0;
  visit(edition, start, true, []);
  out.finish();

  levels = levels.map((l) => l || "part");
  const units = out.units;
  return { lang, levels, units, chunks: makeChunks(units, levels, containers) };
}

// ------------------------------------------------------------------ 5. pages for the reader
function makeChunks(units: Unit[], levels: string[], containers: number[]): TeiDoc["chunks"] {
  const chunks: TeiDoc["chunks"] = [];
  if (!units.length) return chunks;
  const range = (a: number, b: number) => {
    const x = units[a].ref.join("."), y = units[b].ref.join(".");
    return x === y ? x : `${x}–${y}`;
  };
  if (levels.length >= 2) {
    let first = 0;
    for (let i = 1; i <= units.length; i++) {
      if (i === units.length || units[i].ref[0] !== units[first].ref[0]) {
        chunks.push({ label: `${cap(levels[0])} ${units[first].ref[0]}`, first, last: i - 1 });
        first = i;
      }
    }
    return chunks;
  }
  // One-level texts: follow the top-level divisions (a play's scenes) when they give sensible
  // pages; otherwise cut pages of roughly PAGE characters, and keep short works on one page.
  const PAGE = 12000;
  const len = units.map((u) => u.blocks.reduce((n, b) => n + b.c.reduce((m, x) => m + (typeof x === "string" ? x.length : 0), 0), 0));
  const total = len.reduce((a, b) => a + b, 0);
  const byContainer: TeiDoc["chunks"] = [];
  let first = 0;
  for (let i = 1; i <= units.length; i++) {
    if (i === units.length || containers[i] !== containers[first]) { byContainer.push({ label: "", first, last: i - 1 }); first = i; }
  }
  const sizeOf = (c: { first: number; last: number }) => len.slice(c.first, c.last + 1).reduce((a, b) => a + b, 0);
  let base: TeiDoc["chunks"];
  if (total <= PAGE * 2) base = [{ label: "", first: 0, last: units.length - 1 }];
  else if (byContainer.length > 1 && byContainer.every((c) => sizeOf(c) <= PAGE * 4)) base = byContainer;
  else {
    base = [];
    let start = 0, acc = 0;
    for (let i = 0; i < units.length; i++) {
      acc += len[i];
      if (acc >= PAGE || i === units.length - 1) { base.push({ label: "", first: start, last: i }); start = i + 1; acc = 0; }
    }
  }
  return base.map((c) => ({ ...c, label: `${cap(levels[0] ?? "part")}${c.first === c.last ? "" : "s"} ${range(c.first, c.last)}` }));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
