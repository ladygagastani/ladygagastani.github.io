"use client";
/**
 * "Continue where you left off": the tracker (in the root layout) remembers every page visited and
 * how far down it was scrolled; the card (on the home page) offers the last place, the books in
 * progress and the other recent pages. Following the card back to a page restores its scroll.
 */
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { recordVisit, saveScroll, savedScroll, trail, clearTrail, pageKey, type Visit } from "@/lib/resume";
import { recentPositions, getPosition } from "@/lib/position";
import { LESSONS } from "@/data/lessons";
import { AREAS } from "@/config/areas";

const RESTORE = "mathesis:restore-scroll";

export function ResumeTracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  const href = `${pathname}${params.size ? `?${params}` : ""}`;

  useEffect(() => {
    // record the visit once the page has settled (a quick redirect is not a visit)
    const t = setTimeout(() => recordVisit(href, document.title.replace(/ · Mathesis Stoicheion$/, "")), 800);
    // remember how far down the page is, as it scrolls
    let pending = 0;
    const onScroll = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(() => saveScroll(href, scrollY)); };
    addEventListener("scroll", onScroll, { passive: true });
    // arriving from "Continue where you left off": go back down to where the page was left
    let restore: ReturnType<typeof setInterval> | undefined;
    try {
      if (sessionStorage.getItem(RESTORE) === pageKey(href)) {
        sessionStorage.removeItem(RESTORE);
        const y = savedScroll(href);
        let tries = 0;
        // the page may still be growing (texts and lists load after it opens): try for a few seconds
        if (y) restore = setInterval(() => { if (document.documentElement.scrollHeight >= y + innerHeight || ++tries > 20) { scrollTo({ top: y }); clearInterval(restore); } }, 150);
      }
    } catch { /* storage unavailable */ }
    return () => { clearTimeout(t); removeEventListener("scroll", onScroll); cancelAnimationFrame(pending); clearInterval(restore); };
  }, [href]);
  return null;
}

/** A plain description of a remembered page. */
function describe(v: Visit, idx: CatalogIndex | null): { what: string; where?: string } {
  const u = new URL(v.href, "http://x");
  const q = u.searchParams;
  if (u.pathname === "/read") {
    const name = (w: string | null) => { if (!w) return null; const a = idx?.authorOf.get(w), wk = idx?.work.get(w); return wk ? `${a ? `${a.name}, ` : ""}${wk.title}` : w; };
    const at = getPosition(q.get("w") ?? "")?.at ?? q.get("at");
    return { what: name(q.get("w")) ?? "The reader", where: [at ? `at ${at}` : null, q.get("w2") ? `with ${name(q.get("w2"))} beside it` : null].filter(Boolean).join(", ") || undefined };
  }
  const lesson = /^\/academy\/lesson\/(.+)$/.exec(u.pathname);
  if (lesson) { const i = LESSONS.findIndex((l) => l.id === lesson[1]); return { what: i >= 0 ? `Lesson ${i + 1}: ${LESSONS[i].title}` : "A lesson" }; }
  if (u.pathname === "/search" && q.get("q")) return { what: `${AREAS.search.name}: “${q.get("q")}”`, where: "your search, with its filters" };
  if (u.pathname === "/treasury/word" && q.get("l")) return { what: `Word Study: ${q.get("l")}` };
  if (u.pathname === "/library" && q.get("a")) return { what: idx?.author.get(q.get("a")!)?.name ?? "The Mouseion", where: AREAS.library.name };
  return { what: v.title || u.pathname };
}

/** Where to send the reader back to: the reader resumes at its own remembered passage. */
function resumeHref(v: Visit): string {
  const u = new URL(v.href, "http://x");
  if (u.pathname === "/read") {
    const at = getPosition(u.searchParams.get("w") ?? "")?.at;
    if (at) u.searchParams.set("at", at);
    for (const k of ["hl", "find", "tu"]) u.searchParams.delete(k);
  }
  return u.pathname + u.search;
}

const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 2) return "just now";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
};

export function ContinueCard({ className, styles }: { className?: string; styles: Record<string, string> }) {
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [books, setBooks] = useState<[string, { at: string; t: number }][]>([]);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  useEffect(() => {
    // read after the first paint: storage is only available in the browser
    const t = setTimeout(() => {
      setVisits(trail().filter((v) => v.href !== "/"));
      setBooks(recentPositions(4));
    }, 0);
    loadCatalog().then(setIdx, () => undefined);
    return () => clearTimeout(t);
  }, []);
  if (!visits || (!visits.length && !books.length)) return null;
  const [last, ...more] = visits;
  const go = (v: Visit) => { try { sessionStorage.setItem(RESTORE, pageKey(v.href)); } catch { /* ignore */ } };
  const lastD = last ? describe(last, idx) : null;
  const shownBooks = books.filter(([w]) => !last || new URL(last.href, "http://x").searchParams.get("w") !== w).slice(0, 3);
  return (
    <section className={`${styles.resume} ${className ?? ""}`} aria-labelledby="resume-title">
      <div className="wrap">
        <div className={styles.resumeIn}>
          <div className={styles.resumeMain}>
            <span className="label">Continue where you left off</span>
            {last && lastD && (
              <Link href={resumeHref(last)} onClick={() => go(last)} className={styles.resumeLast} transitionTypes={["page-turn"]}>
                <b id="resume-title">{lastD.what}</b>
                {lastD.where && <span>{lastD.where}</span>}
                <small>{ago(last.t)} <span className={styles.arr} aria-hidden="true">→</span></small>
              </Link>
            )}
          </div>
          {(shownBooks.length > 0 || more.length > 0) && (
            <div className={styles.resumeMore}>
              {shownBooks.length > 0 && (
                <>
                  <span className="label">Books in progress</span>
                  <ul>
                    {shownBooks.map(([w, p]) => {
                      const wk = idx?.work.get(w), a = idx?.authorOf.get(w);
                      return <li key={w}><Link href={`/read?w=${w}&at=${encodeURIComponent(p.at)}`} transitionTypes={["page-turn"]}>{a ? `${a.name}, ` : ""}<i>{wk?.title ?? w}</i></Link> <small>at {p.at}</small></li>;
                    })}
                  </ul>
                </>
              )}
              {more.filter((v) => !v.href.startsWith("/read")).length > 0 && (
                <>
                  <span className="label">Also recently</span>
                  <ul>
                    {more.filter((v) => !v.href.startsWith("/read")).slice(0, 3).map((v) => {
                      const d = describe(v, idx);
                      return <li key={v.href}><Link href={resumeHref(v)} onClick={() => go(v)} transitionTypes={["page-turn"]}>{d.what}</Link> <small>{ago(v.t)}</small></li>;
                    })}
                  </ul>
                </>
              )}
              <button type="button" className={styles.resumeClear} onClick={() => { clearTrail(); setVisits([]); }}>Forget these pages</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
