/**
 * The Painted Stoa's markup: a small, strict cousin of Markdown, so entries read naturally as text
 * and every link can be checked.
 *
 * Blocks (separated by a blank line):
 *   ## Heading            ### Subheading
 *   - item                a list (one item per line)
 *   !! text               a "Did you know?" box (every line of the block starts with !!)
 *   {{quote:id}}          a quotation from entry.quotes
 *   {{figure:imageId}}    a picture from data/images.json
 *   {{timeline}}          the entry's timeline
 *   {debated} text        a paragraph that states a claim with its certainty (well / debated / legend)
 *   anything else         a paragraph
 * Inline:
 *   *italic*  **bold**  {well} {debated} {legend}
 *   [Thuc. 5.89](cts:tlg0003.tlg001:5.89)       a citation into the library (a range: 5.84-5.116)
 *   [Ostracism](wiki:ostracism)                  another entry
 *   [text](https://…)                            an outside page
 *   [^2]  [^1,3]                                 a numbered source (author articles: the list under the article)
 */
import type { Certainty } from "./types";

export type Inl =
  | string
  | { b: Inl[] }
  | { i: Inl[] }
  | { cite: { work: string; ref: string; to?: string }; text: string }
  | { wiki: string; text: string }
  | { ext: string; text: string }
  | { cert: Certainty }
  | { src: number[] };

export type Blk =
  | { h2: string; id: string }
  | { h3: string }
  | { p: Inl[]; cert?: Certainty }
  | { list: Inl[][] }
  | { dyk: Inl[][] }
  | { quote: string }
  | { figure: string }
  | { timeline: true };

const CERTS = new Set(["well", "debated", "legend"]);

export const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parseCts(target: string): { work: string; ref: string; to?: string } | null {
  const m = /^cts:([a-z0-9]+\.[a-z0-9]+):([^\s-]+)(?:-([^\s]+))?$/.exec(target);
  return m ? { work: m[1], ref: m[2], ...(m[3] ? { to: m[3] } : {}) } : null;
}

/** Inline markup to a list of pieces. Unknown link kinds are an error, so a typo cannot slip through. */
export function inline(src: string): Inl[] {
  const out: Inl[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\{(well|debated|legend)\}|\[\^(\d+(?:,\d+)*)\]|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[1] !== undefined) out.push({ b: inline(m[1]) });
    else if (m[2] !== undefined) out.push({ i: inline(m[2]) });
    else if (m[3] !== undefined) out.push({ cert: m[3] as Certainty });
    else if (m[4] !== undefined) out.push({ src: m[4].split(",").map(Number) });
    else {
      const text = m[5], target = m[6];
      if (target.startsWith("cts:")) {
        const c = parseCts(target);
        if (!c) throw new Error(`Bad citation link: ${target}`);
        out.push({ cite: c, text });
      } else if (target.startsWith("wiki:")) out.push({ wiki: target.slice(5), text });
      else if (/^https:\/\//.test(target)) out.push({ ext: target, text });
      else throw new Error(`Unknown link: ${target}`);
    }
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

export function blocks(src: string): Blk[] {
  const out: Blk[] = [];
  for (const raw of src.trim().split(/\n\s*\n/)) {
    const b = raw.trim();
    if (!b) continue;
    const lines = b.split("\n").map((l) => l.trim());
    let m: RegExpExecArray | null;
    if ((m = /^##\s+(.+)$/.exec(b)) && lines.length === 1) out.push({ h2: m[1], id: slugify(m[1]) });
    else if ((m = /^###\s+(.+)$/.exec(b)) && lines.length === 1) out.push({ h3: m[1] });
    else if ((m = /^\{\{quote:([\w-]+)\}\}$/.exec(b))) out.push({ quote: m[1] });
    else if ((m = /^\{\{figure:([\w.-]+)\}\}$/.exec(b))) out.push({ figure: m[1] });
    else if (b === "{{timeline}}") out.push({ timeline: true });
    else if (lines.every((l) => l.startsWith("!!"))) out.push({ dyk: lines.map((l) => inline(l.replace(/^!!\s*/, ""))) });
    else if (lines.every((l) => l.startsWith("- "))) out.push({ list: lines.map((l) => inline(l.slice(2))) });
    else if ((m = /^\{(well|debated|legend)\}\s+([\s\S]+)$/.exec(b)) && CERTS.has(m[1])) out.push({ p: inline(m[2].replace(/\s*\n\s*/g, " ")), cert: m[1] as Certainty });
    else if (b.startsWith("{{") || b.startsWith("#")) throw new Error(`Unknown block: ${b.slice(0, 40)}`);
    else out.push({ p: inline(b.replace(/\s*\n\s*/g, " ")) });
  }
  return out;
}

/** Every citation and wiki link in a piece of markup (for checking). */
export function linksIn(bs: Blk[]): { cites: { work: string; ref: string; to?: string }[]; wikis: string[] } {
  const cites: { work: string; ref: string; to?: string }[] = [], wikis: string[] = [];
  const walk = (xs: Inl[]) => {
    for (const x of xs) {
      if (typeof x === "string") continue;
      if ("cite" in x) cites.push(x.cite);
      else if ("wiki" in x) wikis.push(x.wiki);
      else if ("b" in x) walk(x.b);
      else if ("i" in x) walk(x.i);
    }
  };
  for (const b of bs) {
    if ("p" in b) walk(b.p);
    else if ("list" in b) b.list.forEach(walk);
    else if ("dyk" in b) b.dyk.forEach(walk);
  }
  return { cites, wikis };
}

/** Plain text of inline pieces (for search and page descriptions). */
export function plain(xs: Inl[]): string {
  return xs.map((x) => (typeof x === "string" ? x : "b" in x ? plain(x.b) : "i" in x ? plain(x.i) : "text" in x ? x.text : "")).join("");
}
