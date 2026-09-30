"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AREAS, NAV, SITE } from "@/config/areas";
import { useSettings } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import { barsHeld } from "@/lib/header";
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
  const setSearchOpen = useUI((s) => s.setSearchOpen);
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
        else if (y + innerHeight >= root.scrollHeight - 2) set(false); // at the very end, too: nothing more to read on to
        else if (dy > 6 && !el.matches(":focus-within") && !barsHeld()) set(true);  // reading on: tuck it away
        else if (dy < -6) set(false);                                // any scroll back up: bring it back
        else return;                                                 // small jitters keep the reference point
        lastY = y;
      });
    };
    // keyboard users tabbing into the header always see it
    const show = () => { set(false); lastY = scrollY; };
    showRef.current = show;
    // a tap on the reader's page asks for a clean page, or for the bars back (setBars in lib/header.ts)
    const onBars = (e: Event) => { const want = (e as CustomEvent<boolean | undefined>).detail; set(want ?? !hidden); lastY = scrollY; };
    check();
    addEventListener("scroll", check, { passive: true });
    addEventListener("mathesis:bars", onBars);
    el.addEventListener("focusin", show);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", check); removeEventListener("mathesis:bars", onBars); el.removeEventListener("focusin", show); };
  }, []);

  // a new page starts with the header showing
  useEffect(() => { showRef.current?.(); }, [pathname]);

  // On narrow screens the menu scrolls sideways: show which side has more, and keep the current area in view.
  const navRef = useRef<HTMLElement>(null);
  const [more, setMore] = useState({ left: false, right: false });
  useEffect(() => {
    const n = navRef.current;
    if (!n) return;
    const update = () => {
      const left = n.scrollLeft > 2, right = n.scrollLeft + n.clientWidth < n.scrollWidth - 2;
      setMore((m) => (m.left === left && m.right === right ? m : { left, right }));
    };
    update();
    n.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(n);
    return () => { n.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);
  useEffect(() => {
    const n = navRef.current, a = n?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!n || !a || n.scrollWidth <= n.clientWidth) return;
    const x = a.getBoundingClientRect().left - n.getBoundingClientRect().left + n.scrollLeft;
    n.scrollTo({ left: x - (n.clientWidth - a.offsetWidth) / 2 });
  }, [pathname]);
  const scrollMenu = () => navRef.current?.scrollBy({ left: navRef.current.clientWidth * 0.6, behavior: "smooth" });

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

        <div className={styles.areasWrap} data-more-left={more.left || undefined} data-more-right={more.right || undefined}>
        <nav ref={navRef} className={styles.areas} aria-label="Areas of the site">
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
        {/* a pointer and touch hint only: keyboard users reach every area by Tab, which scrolls it into view */}
        <button type="button" className={styles.areasMore} onClick={scrollMenu} tabIndex={-1} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" /></svg>
        </button>
        </div>

        <div className={styles.tools}>
          <ConnectionLight />
          {/* phones: the bottom bar has Search, so the header offers the forum here instead */}
          <Link className={`${styles.tbtn} ${styles.phoneOnly}`} href={AREAS.forum.href} transitionTypes={["page-turn"]}
            aria-label={`${AREAS.forum.name}: ${AREAS.forum.english}`} aria-current={isActive(pathname, AREAS.forum.href) ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H9.5L6 16v-3H4.5A1.5 1.5 0 0 1 3 11.5V6a1.5 1.5 0 0 1 1.5-1.5z" /><path d="M18.5 9h1a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5H19v3l-3.5-3h-4a1.5 1.5 0 0 1-1.5-1.5V15" /></svg>
          </Link>
          <button className={`${styles.tbtn} ${styles.notPhone}`} type="button" onClick={() => setSearchOpen(true)} aria-haspopup="dialog"
            aria-label={`${AREAS.search.name}: ${AREAS.search.english}`} title="Search (or press / on any page)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <span className={styles.txt}>{AREAS.search.name}</span>
          </button>
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
