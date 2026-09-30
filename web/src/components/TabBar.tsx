"use client";
/**
 * Phones only: the five places of the site along the bottom of the screen, in reach of the thumb.
 * It tucks away with the header while you read on, and comes back on any scroll up (Header.tsx).
 * A small red "tongue", like the pendant tongues of a vase band, slides to the place you are in.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { AREAS, TABS, type AreaId } from "@/config/areas";
import { status, useConnection } from "@/lib/connection";
import { useUI } from "@/lib/ui";
import styles from "./TabBar.module.css";

const ICONS: Partial<Record<AreaId, ReactNode>> = {
  // a papyrus roll, open between its two rollers
  library: <><rect x="3.5" y="4" width="3.6" height="16" rx="1.8" /><rect x="16.9" y="4" width="3.6" height="16" rx="1.8" /><path d="M7.1 6.5h9.8v11H7.1z" /><path d="M9.6 10h4.8M9.6 13.5h4.8" /></>,
  // the letter alpha
  study: <path d="M18.6 7.2c-.8 3.6-2 6.9-3.6 8.9-1.2 1.4-2.6 2.2-4.2 2.2-2.6 0-4.4-2.1-4.4-5.1 0-3.3 2.2-6 5-6 2.3 0 3.6 1.8 4.3 4.5.7 2.6 1.3 6.6 3.3 6.6" />,
  // a colonnade under its roof
  wiki: <><path d="M3 8.2 12 4l9 4.2z" /><path d="M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7M3.5 20h17M4 10.3h16" /></>,
  // a lens
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.3 15.3 5.2 5.2" /><path d="M7.6 10.5a2.9 2.9 0 0 1 2.9-2.9" /></>,
  // two voices
  forum: <><path d="M4.5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H9.5L6 16v-3H4.5A1.5 1.5 0 0 1 3 11.5V6a1.5 1.5 0 0 1 1.5-1.5z" /><path d="M18.5 9h1a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5H19v3l-3.5-3h-4a1.5 1.5 0 0 1-1.5-1.5V15" /></>,
  // a ribbon marking your place
  treasury: <path d="M7 3.5h10a.5.5 0 0 1 .5.5v16.2l-5.5-4.3-5.5 4.3V4a.5.5 0 0 1 .5-.5z" />,
};

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function TabBar() {
  const pathname = usePathname();
  const current = TABS.findIndex((t) => [AREAS[t.id].href, ...(t.also ?? [])].some((h) => under(pathname, h)));
  const offline = status(useConnection()) === "offline";
  const searchOpen = useUI((s) => s.searchOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  return (
    <nav className={styles.bar} aria-label="Areas of the site" style={{ viewTransitionName: "site-tabbar" }}>
      {/* a plain sign on the phone when the connection is gone (the header's light says it on every screen) */}
      {offline && <p className={styles.offline} role="status">Offline · your downloaded texts, library and study still work</p>}
      <div className={styles.tabs} style={{ "--i": Math.max(current, 0) } as CSSProperties} data-none={current < 0 || undefined}>
        <span className={styles.ind} aria-hidden="true" />
        {TABS.map((t, i) => {
          const a = AREAS[t.id];
          // Search opens the universal search from wherever you are
          if (t.id === "search") return (
            <button key={t.id} type="button" className={`${styles.tab} ${styles.searchTab}`} onClick={() => setSearchOpen(true)}
              aria-haspopup="dialog" aria-expanded={searchOpen} aria-current={i === current ? "page" : undefined}>
              <span className={styles.lens}><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS.search}</svg></span>
              <span className={styles.label}>Search<span className="visually-hidden">, {a.name}</span></span>
            </button>
          );
          return (
            <Link key={t.id} className={styles.tab} href={a.href} transitionTypes={["page-turn"]} aria-current={i === current ? "page" : undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[t.id]}</svg>
              <span className={styles.label}>{a.english}<span className="visually-hidden">, {a.name}</span></span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
