/**
 * Lines up a translation beside the Greek, passage by passage.
 *
 * Every piece of translation gets an "anchor": the Greek reference it starts at.
 * - Same citation scheme (Plato's sections, a play's lines): the anchor is the piece's own reference.
 * - Coarser scheme (Murray's Iliad is cited by book and "card", but marks line numbers inside):
 *   pieces are cut at those inner line markers, and each piece is anchored at its line.
 * A row then holds the Greek from one anchor up to the next, with the translation that starts there.
 * The translation's words are never changed; only where it is cut into pieces.
 */
import type { Block, Inline, TeiDoc, Unit } from "./types";

export interface Row {
  key: string;            // anchor reference, e.g. "1.33"
  greek: Unit[];
  trans: Block[];         // empty when the translation has nothing for this stretch
}

interface Piece { key: string | null; blocks: Block[] }

const keyOf = (ref: string[]) => ref.join(".");

/** Cut a translation unit at markers naming the Greek's finest level (e.g. unit="line"). */
function splitAtMarkers(u: Unit, marker: string, prefix: string[]): Piece[] {
  const pieces: Piece[] = [{ key: null, blocks: [] }];
  for (const b of u.blocks) {
    let cur: Block = { ...b, c: [] } as Block;
    pieces[pieces.length - 1].blocks.push(cur);
    for (const x of b.c) {
      if (typeof x !== "string" && "m" in x && x.m === marker && x.n) {
        const piece: Piece = { key: keyOf([...prefix, x.n]), blocks: [] };
        pieces.push(piece);
        // the block continues in the new piece: same kind of block, no repeated speaker label
        cur = { ...b, c: [], ...("speaker" in b ? { speaker: undefined } : {}) } as Block;
        piece.blocks.push(cur);
        continue;
      }
      cur.c.push(x as Inline);
    }
  }
  for (const p of pieces) p.blocks = p.blocks.filter((b) => b.c.some((x) => typeof x !== "string" || x.trim()));
  return pieces.filter((p) => p.blocks.length);
}

/** Break the whole translation into anchored pieces, in reading order. */
export function translationPieces(grc: TeiDoc, tr: TeiDoc): Piece[] {
  const gl = grc.levels, tl = tr.levels;
  let common = 0;
  while (common < Math.min(gl.length, tl.length) && gl[common] === tl[common]) common++;
  if (common === 0 && gl.length === tl.length) common = gl.length;   // differently named, same shape
  const sameScheme = common === gl.length && tl.length === gl.length;
  const leaf = gl[gl.length - 1];

  const finer = common === gl.length && tl.length > gl.length;   // e.g. English book.section.subsection, Greek book.section
  const pieces: Piece[] = [];
  for (const u of tr.units) {
    if (sameScheme) { pieces.push({ key: keyOf(u.ref), blocks: u.blocks }); continue; }
    // a finer translation sits beside the Greek passage that contains it
    if (finer) { pieces.push({ key: keyOf(u.ref.slice(0, gl.length)), blocks: u.blocks }); continue; }
    const prefix = u.ref.slice(0, Math.min(common, gl.length - 1));
    const parts = splitAtMarkers(u, leaf, prefix);
    // A coarser translation with no inner markers (English "chapter 5" against Greek 5.1, 5.2…)
    // starts at the first Greek passage of the division with the same number.
    if (tl.length < gl.length && parts.length === 1 && parts[0].key === null) {
      pieces.push({ key: keyOf([...u.ref, "?"]), blocks: parts[0].blocks });
      continue;
    }
    // text before the first marker continues the previous piece, unless the unit starts a new division
    for (const p of parts) {
      if (p.key === null) {
        const prev = pieces[pieces.length - 1];
        if (prev && prev.key?.startsWith(keyOf(prefix) + ".")) prev.blocks.push(...p.blocks);
        else pieces.push({ key: prefix.length ? keyOf([...prefix, "?"]) : null, blocks: p.blocks });
      } else pieces.push(p);
    }
  }
  return pieces;
}

export interface Placed { at: number; blocks: Block[] }

/**
 * Decide which Greek unit each translation piece starts at, for the whole text at once.
 * A piece whose reference the Greek doesn't have (a line numbered differently, say) follows the
 * piece before it, so no translation is ever dropped.
 */
export function placePieces(grc: TeiDoc, pieces: Piece[]): Placed[] {
  const index = new Map<string, number>();
  grc.units.forEach((u, i) => { const k = keyOf(u.ref); if (!index.has(k)) index.set(k, i); });
  const placed: Placed[] = [];
  let prev = 0;
  for (const p of pieces) {
    let at = p.key != null ? index.get(p.key) : undefined;
    if (at === undefined && p.key?.endsWith(".?")) {
      const pre = p.key.slice(0, -1);
      const j = grc.units.findIndex((u) => keyOf(u.ref).startsWith(pre));
      if (j >= 0) at = j;
    }
    if (at === undefined) at = prev;
    // never let a piece jump backwards past the one before it
    if (at < prev && placed.length) at = prev;
    placed.push({ at, blocks: p.blocks });
    prev = at;
  }
  return placed;
}

/** Rows for one chunk (page) of the Greek. */
export function alignChunk(grc: TeiDoc, chunk: { first: number; last: number }, placed: Placed[] | null): Row[] {
  const starts = new Map<number, Block[]>();
  for (const p of placed ?? []) {
    if (p.at < chunk.first || p.at > chunk.last) continue;
    if (!starts.has(p.at)) starts.set(p.at, []);
    starts.get(p.at)!.push(...p.blocks);
  }
  const rows: Row[] = [];
  for (let i = chunk.first; i <= chunk.last; i++) {
    const u = grc.units[i];
    if (i === chunk.first || starts.has(i)) rows.push({ key: keyOf(u.ref), greek: [u], trans: starts.get(i) ?? [] });
    else rows[rows.length - 1].greek.push(u);
  }
  return rows;
}

/** Share of Greek rows in this chunk that have translation beside them (0–1). */
export const coverage = (rows: Row[]) => rows.length ? rows.filter((r) => r.trans.length).length / rows.length : 0;
