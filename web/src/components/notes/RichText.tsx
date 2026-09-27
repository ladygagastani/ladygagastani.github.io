/**
 * A note shown with its light formatting: **bold**, *italic*, lines starting "- " as a list,
 * a blank line between paragraphs. Built as React elements, never as raw HTML.
 */
import { Fragment, type ReactNode } from "react";

function inline(s: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(m[1] !== undefined ? <b key={`${key}b${i++}`}>{m[1]}</b> : <i key={`${key}i${i++}`}>{m[2]}</i>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

const lines = (ls: string[], key: string) => ls.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l, `${key}.${i}`)}</Fragment>);

export default function RichText({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  text.split(/\n{2,}/).forEach((para, pi) => {
    let buf: string[] = [], list: string[] = [];
    const flushP = () => { if (buf.some((b) => b.trim())) blocks.push(<p key={`p${pi}.${blocks.length}`}>{lines(buf, `${pi}.${blocks.length}`)}</p>); buf = []; };
    const flushL = () => { if (list.length) blocks.push(<ul key={`u${pi}.${blocks.length}`}>{list.map((l, i) => <li key={i}>{inline(l, `${pi}l${i}`)}</li>)}</ul>); list = []; };
    for (const l of para.split("\n")) {
      if (/^\s*[-•]\s+/.test(l)) { flushP(); list.push(l.replace(/^\s*[-•]\s+/, "")); }
      else { flushL(); buf.push(l); }
    }
    flushL(); flushP();
  });
  return <div className={className}>{blocks}</div>;
}
