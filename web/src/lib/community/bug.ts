/**
 * A bug report as a Town Hall thread: the member's answers to three questions, plus the page and a
 * plain description of the browser (both shown in the form, where they can be changed or removed,
 * before anything is sent).
 */

/** "Edge 140 on Windows, window 1366 × 900": enough to reproduce a bug, nothing that identifies anyone. */
export function describeBrowser(ua: string, width?: number, height?: number): string {
  const v = (re: RegExp) => re.exec(ua)?.[1];
  const browser =
    v(/Edg(?:e|A|iOS)?\/(\d+)/) ? `Edge ${v(/Edg(?:e|A|iOS)?\/(\d+)/)}`
    : v(/OPR\/(\d+)/) ? `Opera ${v(/OPR\/(\d+)/)}`
    : v(/SamsungBrowser\/(\d+)/) ? `Samsung Internet ${v(/SamsungBrowser\/(\d+)/)}`
    : v(/Firefox\/(\d+)/) ? `Firefox ${v(/Firefox\/(\d+)/)}`
    : v(/FxiOS\/(\d+)/) ? `Firefox ${v(/FxiOS\/(\d+)/)}`
    : v(/CriOS\/(\d+)/) ? `Chrome ${v(/CriOS\/(\d+)/)}`
    : v(/Chrome\/(\d+)/) ? `Chrome ${v(/Chrome\/(\d+)/)}`
    : v(/Version\/(\d+(?:\.\d+)?).*Safari/) ? `Safari ${v(/Version\/(\d+(?:\.\d+)?).*Safari/)}`
    : "an unknown browser";
  const system =
    /iPhone/.test(ua) ? "an iPhone" : /iPad/.test(ua) ? "an iPad"
    : /Android/.test(ua) ? "Android"
    : /Windows/.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/.test(ua) ? "a Mac"
    : /CrOS/.test(ua) ? "ChromeOS"
    : /Linux/.test(ua) ? "Linux" : "";
  const size = width && height ? `, window ${width} × ${height}` : "";
  return `${browser}${system ? ` on ${system}` : ""}${size}`;
}

export interface BugFields { what: string; steps: string; expected: string; page: string; browser: string; error?: string }

/** The thread's text, in the forum's own light formatting (bold headings, blank lines between parts). */
export function bugBody(f: BugFields, origin: string): string {
  const parts = [`**What happened**\n${f.what.trim()}`];
  if (f.steps.trim()) parts.push(`**Steps to see it**\n${f.steps.trim()}`);
  if (f.expected.trim()) parts.push(`**What I expected**\n${f.expected.trim()}`);
  if (f.error?.trim()) parts.push(`**The message the page showed**\n${f.error.trim()}`);
  const facts: string[] = [];
  const page = f.page.trim();
  if (page) facts.push(`**Page:** ${page.startsWith("/") ? `[${page}](${origin}${page})` : /^https?:\/\/\S+$/.test(page) ? `[${page}](${page})` : page}`);
  if (f.browser.trim()) facts.push(`**Browser:** ${f.browser.trim()}`);
  if (facts.length) parts.push(facts.join("\n"));
  return parts.join("\n\n");
}

/** A page address worth reporting: one on this site, given as a path ("/read?w=…"), never the report form itself. */
export function pageFrom(param: string | null): string {
  if (!param || !param.startsWith("/") || param.startsWith("//") || param.startsWith("/town-hall/new")) return "";
  return param.slice(0, 500);
}
