"use client";
/**
 * Phones: a button beside a home-page section's title that folds the section away, or opens it again.
 * Folded sections are remembered (localStorage "mathesis:folds") and written onto <html data-folds>,
 * which the CSS reads (home.module.css). The boot script in <head> (lib/settings.ts) writes it before
 * the first paint, so a folded section never flashes open. Wide screens show every section in full.
 */
import { useEffect, useState } from "react";

export const FOLDS_KEY = "mathesis:folds";
export type FoldId = "learn" | "passage" | "stoa" | "forum" | "offline";

const read = (): string[] => { try { return JSON.parse(localStorage.getItem(FOLDS_KEY) || "[]"); } catch { return []; } };

export default function HomeFold({ id, title, className }: { id: FoldId; title: string; className?: string }) {
  const [folded, setFolded] = useState(false);
  useEffect(() => { setFolded(read().includes(id)); }, [id]);
  const toggle = () => {
    const now = read().filter((x) => x !== id);
    if (!folded) now.push(id);
    try { localStorage.setItem(FOLDS_KEY, JSON.stringify(now)); } catch { /* not kept */ }
    document.documentElement.dataset.folds = now.join(" ");
    setFolded(!folded);
  };
  return (
    <button type="button" className={className} aria-expanded={!folded} onClick={toggle}>
      <span className="visually-hidden">{folded ? "Show" : "Fold away"} “{title}”</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  );
}
