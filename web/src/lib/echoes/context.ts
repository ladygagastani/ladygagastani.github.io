/** The words around an echo, from the text itself, with the matching words marked. */
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import type { TeiDoc } from "@/lib/tei/types";
import type { Echo } from "./match";
import type { Stream } from "./stream";

/** hit: a word that matches the query; odd: a word inside the match that differs from it. */
export interface Part { t: string; k?: "hit" | "odd" }

export function echoContext(doc: TeiDoc, s: Stream, e: Echo, around = 8): Part[] {
  const hits = new Set(e.hit);
  const parts: (Part & { p?: number })[] = [];
  const u0 = s.unit[e.from], u1 = s.unit[e.to];
  let first = true;
  for (let u = u0; u <= u1; u++) {
    let p = s.unitStart[u];
    for (const b of doc.units[u].blocks) {
      if (!b.c.some((x) => typeof x === "string" && x.trim())) continue;
      if (!first) parts.push({ t: b.t === "l" ? " / " : " " });
      first = false;
      for (const x of b.c) {
        if (typeof x !== "string") continue;
        for (const piece of x.split(GREEK_WORD)) {
          if (!piece) continue;
          if (isGreekWord(piece)) {
            parts.push({ t: piece, p, k: hits.has(p) ? "hit" : p >= e.from && p <= e.to ? "odd" : undefined });
            p++;
          } else parts.push({ t: piece.replace(/\s+/g, " ") });
        }
      }
    }
  }
  const lo = e.from - around, hi = e.to + around;
  let a = parts.findIndex((x) => x.p !== undefined && x.p >= lo);
  let b = parts.findLastIndex((x) => x.p !== undefined && x.p <= hi);
  if (a < 0) a = 0;
  if (b < 0) b = parts.length - 1;
  // keep punctuation that follows the last word shown
  else while (b + 1 < parts.length && parts[b + 1].p === undefined && parts[b + 1].t.trim() !== "" && !parts[b + 1].t.includes("/")) b++;
  const out: Part[] = parts.slice(a, b + 1).map(({ t, k }) => (k ? { t, k } : { t }));
  if (out.length && !out[0].k && out[0].t.trim() === "") out.shift();
  if (a > 0) out.unshift({ t: "… " });
  if (b < parts.length - 1) out.push({ t: " …" });
  return out;
}
