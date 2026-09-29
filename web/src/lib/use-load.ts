"use client";
/** Load something once per key, with its state (loading, done or error); stale results are ignored. */
import { useEffect, useState } from "react";

export type Load<T> = { state: "loading" } | { state: "done"; value: T } | { state: "error"; message: string };
const loading = { state: "loading" } as const;
export function useLoad<T>(key: string, fn: () => Promise<T>, enabled = true): Load<T> {
  const [v, setV] = useState<{ key: string; load: Load<T> }>({ key: "", load: loading });
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fn().then((value) => { if (live) setV({ key, load: { state: "done", value } }); }, (e: Error) => { if (live) setV({ key, load: { state: "error", message: e.message } }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return v.key === key ? v.load : loading;
}

/**
 * Like useLoad, and reloadable: reload() fetches again and keeps showing the last result until the
 * new one arrives (so a vote or a new reply does not blank the page).
 */
export function useReloadable<T>(key: string, fn: () => Promise<T>, enabled = true): { data: T | undefined; error: unknown; reload: () => void; busy: boolean } {
  const [ver, setVer] = useState(0);
  const [st, setSt] = useState<{ key: string; data?: T; error?: unknown; ver?: number }>({ key: "" });
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fn().then(
      (data) => { if (live) setSt({ key, data, ver }); },
      (error: unknown) => { if (live) setSt((s) => ({ key, data: s.key === key ? s.data : undefined, error, ver })); },
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ver, enabled]);
  const same = st.key === key;
  // busy: the newest request (a reload included) has not answered yet
  return { data: same ? st.data : undefined, error: same ? st.error : undefined, reload: () => setVer((v) => v + 1), busy: !same || st.ver !== ver };
}
