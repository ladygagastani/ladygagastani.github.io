"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AREAS, NAV, SITE } from "@/config/areas";
import { useSettings } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import ConnectionLight from "./ConnectionLight";
import AccountButton from "./AccountButton";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const theme = useSettings((s) => s.theme);
  const setSettings = useSettings((s) => s.set);
  const openSettings = useUI((s) => s.openSettings);
  const ref = useRef<HTMLElement>(null);
  const showRef = useRef<() => void>(null);

  // Slide away while scrolling down, come back on any scroll up (see lib/header.ts).
  useEffect(() => {
    const el = ref.current, root = document.documentElement;
    if (!el) return;
    let h = el.offsetHeight, lastY = scrollY, hidden = false, frame = 0;
    const set = (hide: boolean) => {
      if (hide === hidden) return;
      hidden = hide;
      root.dataset.hdr = hide ? "hidden" : "shown";
      root.style.setProperty("--hdr-vis", hide ? "0px" : `${h}px`);
    };
    const ro = new ResizeObserver(() => {
      h = el.offsetHeight;
      root.style.setProperty("--hdr-h", `${h}px`);
      if (!hidden) root.style.setProperty("--hdr-vis", `${h}px`);
    });
    ro.observe(el);
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY, dy = y - lastY;
        root.toggleAttribute("data-scrolled", y > 4);
        if (y <= h) set(false);                                      // near the top: always showing
        else if (dy > 6 && !el.matches(":focus-within")) set(true);  // reading on: tuck it away
        else if (dy < -6) set(false);                                // any scroll back up: bring it back
        else return;                                                 // small jitters keep the reference point
        lastY = y;
      });
    };
    // keyboard users tabbing into the header always see it
    const show = () => { set(false); lastY = scrollY; };
    showRef.current = show;
    check();
    addEventListener("scroll", check, { passive: true });
    el.addEventListener("focusin", show);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", check); el.removeEventListener("focusin", show); };
  }, []);

  // a new page starts with the header showing
  useEffect(() => { showRef.current?.(); }, [pathname]);

  const toggleTheme = () => {
    const dark = theme === "dark" || (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    setSettings({ theme: dark ? "light" : "dark" });
  };

  return (
    <header ref={ref} className={styles.top} style={{ viewTransitionName: "site-header" }}>
      <div className={`wrap ${styles.row}`}>
        <Link className={styles.brand} href="/" transitionTypes={["page-turn"]} aria-label={`${SITE.latin}, home`}>
          <span className={styles.brandGr} lang="grc">{SITE.greek}</span>
          <span className={styles.brandEn}>{SITE.latin}</span>
        </Link>

        <nav className={styles.areas} aria-label="Areas of the site">
          {NAV.map((id) => {
            const a = AREAS[id];
            const active = isActive(pathname, a.href);
            return (
              <Link key={id} href={a.href} transitionTypes={["page-turn"]} aria-current={active ? "page" : undefined}>
                <b>{a.name}</b>
                <small>{a.english}</small>
              </Link>
            );
          })}
        </nav>

        <div className={styles.tools}>
          <ConnectionLight />
          <Link className={styles.tbtn} href={AREAS.search.href} transitionTypes={["page-turn"]} aria-label={`${AREAS.search.name}: ${AREAS.search.english}`} title="Search (or press / on any page)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <span className={styles.txt}>{AREAS.search.name}</span>
          </Link>
          <AccountButton />
          <button className={`${styles.tbtn} ${styles.theme}`} type="button" onClick={toggleTheme} aria-label="Switch between light and dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" /></svg>
          </button>
          <button className={styles.tbtn} type="button" onClick={openSettings} aria-label="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
            <span className={styles.txt}>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
