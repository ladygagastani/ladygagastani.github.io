"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COLLECTIONS } from "@/config/sources";
import { loadCatalog, fold, type CatalogIndex, type CollectionId } from "@/lib/catalog";
import { planDownload } from "@/lib/texts/download";
import { useOffline, mb, transferEstimate } from "@/lib/offline";
import { useUI } from "@/lib/ui";
import { JobProgress } from "@/components/OfflineActions";
import styles from "./ScrollCase.module.css";

const LANGS: [string, string][] = [["grc", "Greek"], ["eng", "English"], ["lat", "Latin"], ["deu", "German"], ["fre", "French"]];

export default function ScrollCase() {
  const s = useOffline();
  const toast = useUI((u) => u.showToast);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [cols, setCols] = useState<CollectionId[]>(["perseus", "first1k"]);
  const [langs, setLangs] = useState<string[]>(["grc", "eng"]);
  const [scope, setScope] = useState<"all" | "authors">("all");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [where, setWhere] = useState<"browser" | "folder">("browser");
  const [confirm, setConfirm] = useState<CollectionId | null>(null);
  const zipInput = useRef<HTMLInputElement>(null);

  useEffect(() => { loadCatalog().then(setIdx).catch(() => undefined); useOffline.getState().refresh().catch(() => undefined); }, []);
  useEffect(() => {
    const on = () => { useOffline.getState().refresh(); };
    addEventListener("online", on); addEventListener("offline", on);
    return () => { removeEventListener("online", on); removeEventListener("offline", on); };
  }, []);

  const workIds = useMemo(() => {
    if (scope === "all" || !idx) return null;
    const ids = new Set<string>();
    for (const a of idx.catalog.authors) if (picked.has(a.id)) for (const w of a.works) ids.add(w.id);
    return ids;
  }, [scope, picked, idx]);
  const plan = useMemo(() => (idx ? planDownload(idx, { cols, langs, workIds }) : null), [idx, cols, langs, workIds]);

  const authors = useMemo(() => {
    const f = fold(q.trim());
    return (idx?.catalog.authors ?? []).filter((a) => a.works.some((w) => w.texts.some((t) => cols.includes(t.col))) && (!f || fold(a.name).includes(f)));
  }, [idx, q, cols]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const act = (p: Promise<string>) => p.then(toast, (e: Error) => toast(e.message));

  async function start() {
    if (!plan?.texts.length) return;
    const label = scope === "all" ? `Downloading ${cols.map((c) => COLLECTIONS.find((x) => x.id === c)!.name).join(" and ")}` : `Downloading ${picked.size} author${picked.size === 1 ? "" : "s"}`;
    if (where === "browser") return s.download({ cols, langs, workIds, label });
    let handle: FileSystemDirectoryHandle;
    try { handle = await window.showDirectoryPicker!({ id: "mathesis-save", mode: "readwrite" }); } catch { return; }
    await s.download({ cols, langs, workIds, label: `${label} into "${handle.name}"` }, { kind: "folder", handle, id: `folder:${handle.name}` });
    toast(`Saved into "${handle.name}". Connect that folder with "Load from a folder" to read from it.`);
  }

  const waiting = s.folders.filter((f) => f.access !== "granted").length;

  return (
    <div className={`wrap ${styles.page}`}>
      {/* ---------------------------------------------------------- what you have */}
      <section className={styles.card} aria-labelledby="have">
        <div className={styles.cardHead}>
          <h2 id="have">Your offline library</h2>
          <span className={styles.status}><i className={s.online ? styles.on : styles.off} />{s.online ? "Online" : "Offline"}</span>
        </div>
        <div className={styles.haveGrid}>
          <div>
            <h3 className="label">In this browser</h3>
            {!s.supportsBrowser && <p className="muted">This browser cannot store files. Use a recent Chrome, Edge, Firefox or Safari.</p>}
            {s.supportsBrowser && !s.browser.length && !Object.keys(s.zipImported).length && <p className="muted">Nothing saved yet.</p>}
            <ul className={styles.have}>
              {COLLECTIONS.map((c) => {
                const b = s.browser.find((x) => x.col === c.id);
                const z = s.zipImported[c.repo];
                if (!b && !z) return null;
                return (
                  <li key={c.id}>
                    <span><b>{c.name}</b> {b ? `${b.files.toLocaleString()} texts, ${mb(b.bytes)}` : ""}{z ? `${b ? " · " : ""}${z.toLocaleString()} texts from a ZIP` : ""}</span>
                    {confirm === c.id
                      ? <span className={styles.confirm}>Remove them? <button type="button" className="chip" onClick={() => { s.removeBrowserCopy(c.id).then(() => toast(`Removed ${c.name} from this browser.`)); setConfirm(null); }}>Remove</button> <button type="button" className="chip" onClick={() => setConfirm(null)}>Keep</button></span>
                      : <button type="button" className="chip" onClick={() => setConfirm(c.id)}>Remove</button>}
                  </li>
                );
              })}
            </ul>
            {s.usage && s.usage.quota > 0 && <p className={styles.small}>This site uses {mb(s.usage.used)} of the {mb(s.usage.quota)} your browser allows it.</p>}
          </div>
          <div>
            <h3 className="label">Connected folders</h3>
            {!s.supportsFolders && <p className="muted">This browser cannot connect folders (Chrome and Edge can). Use a ZIP file or browser storage instead.</p>}
            {s.supportsFolders && !s.folders.length && <p className="muted">None yet.</p>}
            <ul className={styles.have}>
              {s.folders.map((f) => (
                <li key={f.id}>
                  <span><b>{f.name}</b> {f.roots.length ? `· ${f.roots.length} collection${f.roots.length === 1 ? "" : "s"}` : "· no collection found"} · {f.access === "granted" ? "available" : "needs reconnecting"}</span>
                  <button type="button" className="chip" onClick={() => s.forget(f.id)}>Forget</button>
                </li>
              ))}
            </ul>
            <div className={styles.row}>
              {s.supportsFolders && <button type="button" className="btn ghost" onClick={() => act(s.connect())}>Load from a folder</button>}
              <button type="button" className="btn ghost" onClick={() => zipInput.current?.click()}>Load a ZIP file</button>
              {s.supportsFolders && <button type="button" className="btn" disabled={!waiting} onClick={() => act(s.reconnect())}>Reconnect folders{waiting ? ` (${waiting})` : ""}</button>}
            </div>
            <input ref={zipInput} type="file" accept=".zip,application/zip" hidden
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) act(s.loadZip(f)); }} />
          </div>
        </div>
        <JobProgress />
      </section>

      {/* ---------------------------------------------------------- download */}
      <section className={styles.card} aria-labelledby="get">
        <h2 id="get">Download texts</h2>
        <p className="muted">Each file comes straight from the collection on GitHub, at the exact version this site uses, and is checked against GitHub&apos;s own fingerprint for it. Nothing is changed.</p>

        <fieldset className={styles.fs}>
          <legend className="label">Collections</legend>
          {COLLECTIONS.map((c) => (
            <label key={c.id} className={styles.check}><input type="checkbox" checked={cols.includes(c.id)} onChange={() => setCols(toggle(cols, c.id))} /> {c.name} <span className="muted">— {c.description}</span></label>
          ))}
        </fieldset>

        <fieldset className={styles.fs}>
          <legend className="label">Languages</legend>
          <div className={styles.row}>
            {LANGS.map(([code, name]) => (
              <label key={code} className={styles.check}><input type="checkbox" checked={langs.includes(code)} onChange={() => setLangs(toggle(langs, code))} /> {name}</label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fs}>
          <legend className="label">What to download</legend>
          <div className={styles.row}>
            <label className={styles.check}><input type="radio" name="scope" checked={scope === "all"} onChange={() => setScope("all")} /> Everything in the chosen collections</label>
            <label className={styles.check}><input type="radio" name="scope" checked={scope === "authors"} onChange={() => setScope("authors")} /> Only the authors I choose</label>
          </div>
          {scope === "authors" && (
            <div className={styles.picker}>
              <input type="search" id="scrollcase-author-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find an author" aria-label="Find an author" />
              <ul>
                {authors.map((a) => (
                  <li key={a.id}><label className={styles.check}><input type="checkbox" checked={picked.has(a.id)}
                    onChange={() => setPicked((p) => { const n = new Set(p); if (n.has(a.id)) n.delete(a.id); else n.add(a.id); return n; })} /> {a.name} <span className="muted">({a.works.length})</span></label></li>
                ))}
              </ul>
              <p className={styles.small}>{picked.size} chosen</p>
            </div>
          )}
        </fieldset>

        <fieldset className={styles.fs}>
          <legend className="label">Where to keep them</legend>
          <div className={styles.row}>
            <label className={styles.check}><input type="radio" name="where" checked={where === "browser"} onChange={() => setWhere("browser")} /> In this browser <span className="muted">— simplest; nothing to manage</span></label>
            <label className={styles.check}><input type="radio" name="where" checked={where === "folder"} disabled={!s.supportsFolders} onChange={() => setWhere("folder")} /> In a folder on this computer <span className="muted">— survives clearing browser data (Chrome and Edge)</span></label>
          </div>
        </fieldset>

        <div className={styles.go}>
          <p>
            {plan ? <><b>{plan.texts.length.toLocaleString()} files</b>, {mb(plan.bytes)} on disk, about {mb(transferEstimate(plan.bytes))} to download.</> : "Working out the size…"}
          </p>
          <button type="button" className="btn" disabled={!plan?.texts.length || s.job?.running || !s.online} onClick={start}>
            {s.job?.running ? "Downloading…" : "Download"}
          </button>
        </div>
        <p className={styles.small}>Files you already have are skipped, so you can stop at any time and continue later.</p>
      </section>
    </div>
  );
}
