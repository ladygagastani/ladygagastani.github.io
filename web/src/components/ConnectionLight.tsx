"use client";
/**
 * The connection light in the header: online, offline or syncing, always visible. Clicking it
 * opens a small panel that says what works offline and has the Reconnect button. It also
 * registers the offline helper (public/sw.js) in the built site.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { status, useConnection } from "@/lib/connection";
import { useOffline } from "@/lib/offline";
import { AREAS } from "@/config/areas";
import styles from "./Header.module.css";

const LABEL = { online: "Online", offline: "Offline", syncing: "Syncing" } as const;

function useRegister() {
  useEffect(() => {
    const { setOnline, setCopy, check } = useConnection.getState();
    const on = () => { setOnline(true); check(); };
    const off = () => setOnline(false);
    addEventListener("online", on);
    addEventListener("offline", off);
    if (!navigator.onLine) setOnline(false);

    if (!("serviceWorker" in navigator)) setCopy("unsupported");
    else if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(`/sw.js?build=${process.env.NEXT_PUBLIC_BUILD}`).then((reg) => {
        const watch = (w: ServiceWorker | null) => {
          if (!w) return;
          setCopy("keeping");
          w.addEventListener("statechange", () => { if (w.state === "activated") setCopy("kept"); if (w.state === "redundant") setCopy("none"); });
        };
        if (reg.installing) watch(reg.installing);
        else if (reg.active) setCopy("kept");
        reg.addEventListener("updatefound", () => watch(reg.installing));
      }).catch(() => setCopy("none"));
    }
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);
}

export default function ConnectionLight() {
  useRegister();
  const s = useConnection();
  const st = status(s);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const offline = useOffline();

  useEffect(() => {
    if (!open) return;
    if (!offline.ready) offline.refresh().catch(() => undefined);
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("pointerdown", close);
    addEventListener("keydown", key);
    return () => { removeEventListener("pointerdown", close); removeEventListener("keydown", key); };
  }, [open, offline]);

  const texts = offline.browser.reduce((n, b) => n + b.files, 0) + Object.values(offline.zipImported).reduce((n, x) => n + x, 0);
  const copyText = s.copy === "kept" ? "Every page of the site is kept in this browser, so it opens without a connection."
    : s.copy === "keeping" ? "Keeping a copy of every page of the site in this browser…"
    : s.copy === "unsupported" ? "This browser cannot keep an offline copy of the site."
    : "The offline copy of the site is made on your first visit to the built site.";

  return (
    <div className={styles.conn} ref={box}>
      <button type="button" className={`${styles.tbtn} ${styles.light}`} data-status={st} aria-expanded={open} aria-haspopup="dialog"
        onClick={() => setOpen(!open)} title={`${LABEL[st]}: click for details and Reconnect`} aria-label={`Connection: ${LABEL[st]}`}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.txt}>{LABEL[st]}</span>
      </button>
      {open && (
        <div className={styles.connPanel} role="dialog" aria-label="Connection and offline reading">
          <p className={styles.connHead} data-status={st}><span className={styles.dot} aria-hidden="true" /> <b>{s.busy ?? (st === "online" ? "You are online" : st === "offline" ? "You are offline" : "Syncing…")}</b></p>
          <ul className={styles.connList}>
            <li>{copyText}</li>
            <li>{texts ? `${texts.toLocaleString("en-GB")} text files are downloaded` : "No texts are downloaded yet"}{offline.folders.length ? `, and ${offline.folders.length} folder${offline.folders.length === 1 ? " is" : "s are"} connected` : ""}.
              {offline.lookups.words || offline.lookups.lsj ? " Word look-ups are downloaded too." : ""}</li>
            <li>Your notes, marks and saved words live in this browser and work offline.</li>
          </ul>
          <div className={styles.connActs}>
            <button type="button" className="btn small" onClick={() => s.reconnect()} disabled={!!s.busy}>{s.busy ? "Working…" : "Reconnect"}</button>
            <Link className="btn small ghost" href={AREAS.downloads.href} transitionTypes={["page-turn"]} onClick={() => setOpen(false)}>{AREAS.downloads.name}</Link>
          </div>
          {s.report && (
            <div className={styles.connReport} role="status" data-ok={s.report.ok}>
              {s.report.lines.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
