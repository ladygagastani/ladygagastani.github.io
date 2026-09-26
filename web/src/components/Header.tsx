"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AREAS, NAV, SITE } from "@/config/areas";
import { useSettings } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const theme = useSettings((s) => s.theme);
  const setSettings = useSettings((s) => s.set);
  const openSettings = useUI((s) => s.openSettings);

  const toggleTheme = () => {
    const dark = theme === "dark" || (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    setSettings({ theme: dark ? "light" : "dark" });
  };

  return (
    <header className={styles.top} style={{ viewTransitionName: "site-header" }}>
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
          <Link className={styles.tbtn} href={AREAS.search.href} transitionTypes={["page-turn"]} aria-label={`${AREAS.search.name}: ${AREAS.search.english}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <span className={styles.txt}>{AREAS.search.name}</span>
          </Link>
          <button className={styles.tbtn} type="button" onClick={toggleTheme} aria-label="Switch between light and dark">
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
