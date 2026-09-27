"use client";

import { useEffect, useState } from "react";
import { loadAudioManifest, play } from "@/lib/audio";
import styles from "./Academy.module.css";

/** A play button for a recording, shown only if the recording exists. */
export default function Say({ k, label }: { k: string; label: string }) {
  const [has, setHas] = useState(false);
  useEffect(() => { let live = true; loadAudioManifest().then((m) => { if (live) setHas(!!m[k]); }); return () => { live = false; }; }, [k]);
  if (!has) return null;
  return (
    <button type="button" className={styles.say} onClick={() => play(k)} aria-label={`Listen: ${label}`} title="Listen (reconstructed Classical Attic)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>
    </button>
  );
}
