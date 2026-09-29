"use client";
/**
 * What a page shows if something on it fails unexpectedly: the header and footer stay, and the
 * reader is offered a way on instead of a blank screen. Nothing is sent anywhere (no trackers).
 */
import Link from "next/link";
import { useEffect } from "react";

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="wrap" style={{ paddingBlock: "clamp(48px, 8vw, 96px)", display: "grid", gap: 18, maxWidth: 720 }} role="alert">
      <p className="label">Something went wrong</p>
      <h1 className="page-title">This page stumbled <span lang="grc">σφάλμα</span></h1>
      <p className="muted" style={{ fontSize: "1.1rem" }}>
        Part of this page failed while it was working. Your notes, marks and saved words are safe: they are kept in this browser.
        Try again, or go back to the home page.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button type="button" className="btn" onClick={reset}>Try again</button>
        <Link className="btn ghost" href="/">The Propylaea (home)</Link>
      </div>
      <details className="muted" style={{ fontSize: "0.85rem" }}>
        <summary>What happened</summary>
        <p style={{ marginTop: 8, fontFamily: "monospace", overflowWrap: "anywhere" }}>{error.message || "An unknown error."}</p>
      </details>
    </div>
  );
}
