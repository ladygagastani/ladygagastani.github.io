"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COLLECTIONS, zipUrl } from "@/config/sources";
import { useOffline, mb, transferEstimate } from "@/lib/offline";
import { useUI } from "@/lib/ui";
import { AREAS } from "@/config/areas";
import type { CollectionId } from "@/lib/catalog";
import styles from "./OfflineActions.module.css";

const svg = (d: React.ReactNode) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{d}</svg>;
const ICON = {
  download: <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  reconnect: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />,
};

/** Progress of the current download or ZIP import, with a pause button. */
export function JobProgress() {
  const job = useOffline((s) => s.job);
  const cancel = useOffline((s) => s.cancel);
  if (!job) return null;
  const p = job.progress;
  const pct = p && p.totalFiles ? Math.round((p.files / p.totalFiles) * 100) : 0;
  return (
    <div className={styles.job} role="status" aria-live="polite">
      <div className={styles.jobHead}>
        <b>{job.label}</b>
        {job.running && job.kind === "download" && <button type="button" className="chip" onClick={cancel}>Pause</button>}
      </div>
      <div className={styles.bar}><span style={{ width: `${pct}%` }} /></div>
      <p className="muted">
        {!p ? "Starting…" : `${p.files.toLocaleString("en-GB")} of ${p.totalFiles.toLocaleString("en-GB")} files${p.totalBytes ? ` · ${mb(p.bytes)} of ${mb(p.totalBytes)}` : ""}`}
        {!job.running && !job.error && p && (p.files === p.totalFiles ? " · Done." : " · Paused. Start it again to resume.")}
      </p>
      {job.error && <p className={styles.err}>{job.error}</p>}
      {p && p.failed.length > 0 && <p className={styles.err}>{p.failed.length} file{p.failed.length === 1 ? "" : "s"} could not be downloaded. Start again to retry them.</p>}
    </div>
  );
}

/**
 * Download / Load / Reconnect, as on the front page and in Settings.
 * Downloads fetch only the original Greek and English XML files from GitHub, checked against
 * GitHub's own fingerprints, into this browser's storage.
 */
export default function OfflineActions({ compact = false }: { compact?: boolean }) {
  const s = useOffline();
  const toast = useUI((u) => u.showToast);
  const zipInput = useRef<HTMLInputElement>(null);
  const [sizes, setSizes] = useState<Partial<Record<CollectionId, number>>>({});

  useEffect(() => { useOffline.getState().refresh().catch(() => undefined); }, []);
  useEffect(() => {
    let live = true;
    const { plan, lookupsSize } = useOffline.getState();
    // texts plus the word look-ups that come with them
    Promise.all(COLLECTIONS.map(async (c) => {
      const o = { cols: [c.id], langs: ["grc", "eng"] };
      return [c.id, (await plan(o)).bytes + (await lookupsSize(o))] as const;
    }))
      .then((r) => { if (live) setSizes(Object.fromEntries(r)); }).catch(() => undefined);
    return () => { live = false; };
  }, []);

  const waiting = s.folders.filter((f) => f.access !== "granted").length;
  const saved = (id: CollectionId) => s.browser.find((b) => b.col === id);

  const act = (p: Promise<string>) => p.then(toast, (e: Error) => toast(e.message));
  const load = () => (s.supportsFolders ? act(s.connect()) : zipInput.current?.click());

  return (
    <div className={`${styles.list} ${compact ? styles.compact : ""}`}>
      <div className={styles.item}>
        {svg(ICON.download)}
        <div>
          <b>Download the library</b>
          <span>The Greek and English text files straight from GitHub, each checked against the original, plus the word analyses and dictionary for offline look-ups.</span>
          <div className={styles.quick}>
            {COLLECTIONS.map((c) => {
              const have = saved(c.id);
              return (
                <button key={c.id} type="button" className="chip" disabled={s.job?.running}
                  onClick={() => s.download({ cols: [c.id], langs: ["grc", "eng"], label: `Downloading ${c.name}` })}>
                  {c.name}
                  <small className={styles.size}>
                    {sizes[c.id] ? ` · about ${mb(transferEstimate(sizes[c.id]!))} to download` : ""}
                    {have ? ` · ${have.files.toLocaleString("en-GB")} saved` : ""}
                  </small>
                </button>
              );
            })}
          </div>
          {!compact && <JobProgress />}
          <p className={styles.small}>
            More choices (single authors, a folder instead of the browser) in <Link href={AREAS.downloads.href} transitionTypes={["page-turn"]}>{AREAS.downloads.name}</Link>.
            {" "}Or get the full repositories as ZIPs:{" "}
            {COLLECTIONS.map((c, i) => <span key={c.id}>{i ? ", " : ""}<a href={zipUrl(c)} rel="noopener">{c.repo}</a></span>)}.
          </p>
        </div>
      </div>

      <button type="button" className={styles.item} onClick={load}>
        {svg(ICON.folder)}
        <div>
          <b>Load from a folder</b>
          <span>{s.supportsFolders
            ? "Already have the collections on this computer? Choose the folder (or a ZIP from the Scroll Case)."
            : "Choose a collection ZIP downloaded from GitHub; its texts are copied into this browser."}</span>
        </div>
      </button>
      <input ref={zipInput} type="file" accept=".zip,application/zip" hidden
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) act(s.loadZip(f)); }} />

      <button type="button" className={styles.item} onClick={() => act(s.reconnect())} disabled={!s.supportsFolders}>
        {svg(ICON.reconnect)}
        <div>
          <b>Reconnect folders</b>
          <span>{!s.supportsFolders ? "Only needed for connected folders, which this browser does not support."
            : waiting ? `${waiting} folder${waiting === 1 ? " needs" : "s need"} your permission again after a restart. One click restores it.`
            : s.folders.length ? "All connected folders are available." : "After a restart your browser asks permission again. One click restores it."}</span>
        </div>
      </button>
      {compact && <JobProgress />}
    </div>
  );
}
