"use client";

import { useUI } from "@/lib/ui";

/** The not-found page's way into the universal search. */
export default function NotFoundSearch() {
  const open = useUI((s) => s.setSearchOpen);
  return (
    <button type="button" className="btn" onClick={() => open(true)} aria-haspopup="dialog">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
      Search for what you were looking for
    </button>
  );
}
