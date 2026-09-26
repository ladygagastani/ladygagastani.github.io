"use client";

import { COLLECTIONS, zipUrl } from "@/config/sources";
import { useUI } from "@/lib/ui";
import styles from "./OfflineActions.module.css";

const Icon = {
  download: <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  reconnect: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />,
};
const svg = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{d}</svg>
);

/**
 * Download / Load from a folder / Reconnect folders.
 * Downloads go straight to the original GitHub collections. Loading and reconnecting arrive
 * with the reader in Phase 2.
 */
export default function OfflineActions({ compact = false }: { compact?: boolean }) {
  const toast = useUI((s) => s.showToast);
  const later = () => toast("This arrives with the reader in Phase 2.");

  return (
    <div className={`${styles.list} ${compact ? styles.compact : ""}`}>
      <div className={styles.item}>
        {svg(Icon.download)}
        <div>
          <b>Download the library</b>
          <span>The original collections from GitHub, unchanged. Each is several hundred megabytes.</span>
          <div className={styles.links}>
            {COLLECTIONS.map((c) => (
              <a key={c.id} href={zipUrl(c)} rel="noopener">{c.name} <small>(ZIP)</small></a>
            ))}
          </div>
        </div>
      </div>
      <button type="button" className={styles.item} onClick={later}>
        {svg(Icon.folder)}
        <div><b>Load from a folder</b><span>Already downloaded? Choose the folder or ZIP file and read from it.</span></div>
      </button>
      <button type="button" className={styles.item} onClick={later}>
        {svg(Icon.reconnect)}
        <div><b>Reconnect folders</b><span>After a restart your browser asks permission again. One click restores it.</span></div>
      </button>
    </div>
  );
}
