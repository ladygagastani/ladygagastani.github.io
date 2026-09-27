/**
 * Whether the site can reach the network, the state of its offline copy (the service worker in
 * public/sw.js), and the Reconnect button's work. Shown by the connection light in the header.
 *
 * The browser's own online flag can say "online" on a network that reaches nothing, so a check
 * asks this site for a tiny file and waits at most a few seconds.
 */
import { create } from "zustand";

export type Status = "online" | "offline" | "syncing";
export type Copy = "unsupported" | "none" | "keeping" | "kept";

interface ConnectionState {
  online: boolean;
  busy: string | null;          // what is being done now ("Checking the connection…")
  copy: Copy;                   // the offline copy of the site
  checked: number | null;       // when the connection was last checked
  report: { ok: boolean; lines: string[] } | null;
  setOnline: (v: boolean) => void;
  setCopy: (c: Copy) => void;
  check: () => Promise<{ ok: boolean; ms: number }>;
  reconnect: () => Promise<void>;
}

export const status = (s: Pick<ConnectionState, "online" | "busy" | "copy">): Status =>
  s.busy || s.copy === "keeping" ? "syncing" : s.online ? "online" : "offline";

async function ping(ms = 5000): Promise<{ ok: boolean; ms: number }> {
  const t0 = performance.now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(`/offline.json?ping=${Date.now()}`, { cache: "no-store", signal: ctl.signal });
    return { ok: r.ok, ms: Math.round(performance.now() - t0) };
  } catch {
    return { ok: false, ms: Math.round(performance.now() - t0) };
  } finally { clearTimeout(timer); }
}

/** Ask the offline helper to fetch every page again (after a new build or a long time offline). */
function keepAgain(): Promise<boolean> {
  return new Promise((resolve) => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) return resolve(false);
    const done = (e: MessageEvent) => { if (e.data === "kept") { navigator.serviceWorker.removeEventListener("message", done); resolve(true); } };
    navigator.serviceWorker.addEventListener("message", done);
    sw.postMessage("keep-again");
    setTimeout(() => { navigator.serviceWorker.removeEventListener("message", done); resolve(false); }, 120_000);
  });
}

export const useConnection = create<ConnectionState>()((set, get) => ({
  online: true,
  busy: null,
  copy: "none",
  checked: null,
  report: null,
  setOnline: (online) => set({ online }),
  setCopy: (copy) => set({ copy }),

  async check() {
    const r = await ping();
    set({ online: r.ok, checked: Date.now() });
    return r;
  },

  async reconnect() {
    if (get().busy) return;
    const lines: string[] = [];
    let ok = true;
    // folders first: the browser only lets a site ask for folder permission straight after a click
    set({ busy: "Reconnecting your folders…", report: null });
    try {
      const { useOffline } = await import("./offline");
      const off = useOffline.getState();
      if (!off.ready) await off.refresh();
      if (useOffline.getState().folders.length) lines.push(await useOffline.getState().reconnect());
    } catch (e) { ok = false; lines.push(`Folders could not be reconnected: ${(e as Error).message}`); }

    set({ busy: "Checking the connection…" });
    const r = await get().check();
    if (r.ok) lines.push(`Connected: the site answered in ${r.ms} ms.`);
    else { ok = false; lines.push("Still offline: the site could not be reached. Everything you have downloaded keeps working."); }

    if (r.ok && get().copy !== "unsupported") {
      set({ busy: "Updating the offline copy of the site…", copy: "keeping" });
      const kept = await keepAgain();
      set({ copy: kept ? "kept" : get().copy === "keeping" ? "none" : get().copy });
      lines.push(kept ? "The offline copy of the site is up to date." : "The offline copy of the site could not be updated just now; it will be on the next visit.");
    }
    lines.push("Your notes, marks, saved words and favourites are kept in this browser, so there is nothing to send: nothing made offline can be lost. Syncing between devices comes with accounts.");
    set({ busy: null, report: { ok, lines } });
  },
}));
