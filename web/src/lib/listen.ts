/**
 * Listening to a translation (components/reader/Listen.tsx): the words of a passage as the screen shows them,
 * with where each letter sits in the page, so the word being spoken can be marked; and that text cut into
 * sentence-sized pieces (some browsers stop a voice that talks for longer than about fifteen seconds).
 * Only the English translation is ever read aloud: the owner's decision (2026-10-02), since no voice speaks
 * Ancient Greek as it sounded.
 */

/** One letter of the spoken text: the text node and offset it comes from, or null for a pause we added. */
export type At = { node: Text; offset: number } | null;

export interface Speakable { text: string; at: At[] }

/** Not read: anything hidden from screen readers, buttons, and marks the page tags as silent (line numbers, notes). */
const SILENT = "[aria-hidden='true'], [data-silent], button, sup, script, style";

/** The words of an element, spaces collapsed, with each letter's place. A pause (", ") follows a speaker's name. */
export function speakable(el: Element): Speakable {
  let text = "";
  const at: At[] = [];
  const push = (ch: string, a: At) => {
    if (/\s/.test(ch)) {
      if (!text || text.endsWith(" ")) return;
      ch = " ";
    }
    text += ch;
    at.push(a);
  };
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n as Text;
      for (let i = 0; i < t.data.length; i++) push(t.data[i], { node: t, offset: i });
      return;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return;
    const e = n as Element;
    if (e.matches(SILENT)) return;
    const block = /^(P|DIV|LI|H\d)$/.test(e.tagName);
    for (const c of e.childNodes) walk(c);
    if (e.matches("[data-speaker]") && !/[.,:;!?]\s*$/.test(text)) { push(",", null); }
    if (block || e.matches("[data-speaker]")) push(" ", null);
  };
  walk(el);
  while (text.endsWith(" ")) { text = text.slice(0, -1); at.pop(); }
  return { text, at };
}

/**
 * Cut text into pieces of at most about `max` letters, at the end of a sentence where possible, else at a
 * comma or semicolon, else at a space. Returns [start, end) offsets; together they cover every word.
 */
export function pieces(text: string, max = 220): [number, number][] {
  const out: [number, number][] = [];
  let start = 0;
  while (start < text.length) {
    while (start < text.length && text[start] === " ") start++;
    if (start >= text.length) break;
    if (text.length - start <= max) { out.push([start, text.length]); break; }
    const slice = text.slice(start, start + max + 1);
    const cut = lastBreak(slice, /[.!?;:]["”’)]?\s/g) ?? lastBreak(slice, /[,—–]\s/g) ?? lastBreak(slice, /\s/g) ?? max;
    out.push([start, start + cut]);
    start += cut;
  }
  return out;
}

/** The end of the last match of `re` in `s` that leaves a piece of at least a third of `s`, or null. */
function lastBreak(s: string, re: RegExp): number | null {
  let best: number | null = null;
  for (const m of s.matchAll(re)) {
    const end = m.index! + m[0].length;
    if (end >= s.length / 3) best = end;
  }
  return best;
}

/** The word around a letter: [start, end) offsets in the text. */
export function wordAt(text: string, i: number): [number, number] {
  let a = i, b = i;
  while (a > 0 && /[\p{L}\p{N}'’-]/u.test(text[a - 1])) a--;
  while (b < text.length && /[\p{L}\p{N}'’-]/u.test(text[b])) b++;
  return [a, Math.max(b, a + 1)];
}

/** English voices, the most natural-sounding first (the system's own neural voices where there are any). */
export function englishVoices(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced/i.test(v.name) ? 4 : 0) + (/^en-GB/i.test(v.lang) ? 2 : /^en-US/i.test(v.lang) ? 1 : 0) + (v.localService ? 0.5 : 0);
  return all.filter((v) => /^en(-|_|$)/i.test(v.lang)).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
}
