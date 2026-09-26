"use client";

import { useUI } from "@/lib/ui";

export default function Toast() {
  const toast = useUI((s) => s.toast);
  return (
    <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
      {toast?.text}
    </div>
  );
}
