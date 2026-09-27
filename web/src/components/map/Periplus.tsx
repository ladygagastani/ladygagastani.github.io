"use client";
/**
 * The Periplus: a map of the Greek world drawn like a painted vase (clay land, black-gloss sea), with
 * every place the library mentions. Dots grow with the number of mentions; click one to see what the
 * texts say of it, and where. Wheel, drag, pinch, double-click or the buttons to move about; the
 * keyboard works too (arrows to pan, + and − to zoom). ?p=<Pleiades id> opens a place.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { KINDS, kindOf, loadMap, loadSavedPlaces, mapSize, project, ringsPath, typeLabel, useSavedPlaces, type Base, type Place, type PlacesMeta } from "@/lib/map";
import { useSettings } from "@/lib/settings";
import styles from "./Periplus.module.css";

export interface EntryLink { slug: string; title: string }
interface View { k: number; tx: number; ty: number }

const fmt = (n: number) => n.toLocaleString("en-GB");
const radius = (n: number) => Math.min(11, 2.4 + Math.sqrt(n) / 5.5);
const TEXT_KINDS = new Set(["region", "water"]);   // drawn as names, not dots

export default function Periplus({ entriesByPlace }: { entriesByPlace: Record<string, EntryLink[]> }) {
  const [data, setData] = useState<{ base: Base; places: Place[]; meta: PlacesMeta } | null>(null);
  const [failed, setFailed] = useState(false);
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  useEffect(() => {
    loadMap().then(setData, () => setFailed(true));
    loadCatalog().then(setIdx, () => undefined);
    loadSavedPlaces();
  }, []);

  if (failed) return <p className={`wrap ${styles.status}`}>The map&apos;s data could not be loaded. Check the connection light at the top of the page, then reload.</p>;
  if (!data) return <div className={`wrap ${styles.status}`} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Unrolling the map…</div>;
  return <MapView base={data.base} places={data.places} meta={data.meta} idx={idx} entriesByPlace={entriesByPlace} />;
}

function MapView({ base, places, meta, idx, entriesByPlace }: { base: Base; places: Place[]; meta: PlacesMeta; idx: CatalogIndex | null; entriesByPlace: Record<string, EntryLink[]> }) {
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get("p");
  const motion = useSettings((s) => s.motion);
  const [W, H] = useMemo(() => mapSize(base), [base]);
  const sea = useMemo(() => ringsPath(base, base.water), [base]);
  const lakes = useMemo(() => ringsPath(base, base.lakes), [base]);
  const pts = useMemo(() => places.map((p) => { const [x, y] = project(base, p.lon, p.lat); return { p, x, y, kind: kindOf(p.type) }; }), [base, places]);
  const byId = useMemo(() => new Map(pts.map((q) => [q.p.id, q])), [pts]);

  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [view, setView] = useState<View>({ k: 0, tx: 0, ty: 0 });
  const viewRef = useRef(view);
  useLayoutEffect(() => { viewRef.current = view; }, [view]);
  const [home, setHome] = useState<View | null>(null);
  const homeSet = useRef(false);
  const anim = useRef(0);

  const [kinds, setKinds] = useState<Set<string>>(() => new Set(KINDS.map((k) => k.id)));
  const [greekNames, setGreekNames] = useState(true);
  const [q, setQ] = useState("");
  const saved = useSavedPlaces((s) => s.saved);
  const toggleSaved = useSavedPlaces((s) => s.toggle);
  const reduce = motion === "reduce" || (motion === "auto" && typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  // fit the Aegean on first show; the whole map is the furthest you can zoom out
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      setSize([w, h]);
      if (w && h && !homeSet.current) {
        homeSet.current = true;
        const [x0, y0] = project(base, 13, 44.5), [x1, y1] = project(base, 36.5, 30.5);
        const k = Math.min(w / (x1 - x0), h / (y1 - y0));
        const v = { k, tx: w / 2 - ((x0 + x1) / 2) * k, ty: h / 2 - ((y0 + y1) / 2) * k };
        setHome(v);
        setView(v);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [base]);

  const minK = size[0] ? Math.min(size[0] / W, size[1] / H) : 0.01;
  const maxK = home ? home.k * 14 : 1;
  const clampView = useCallback((v: View): View => {
    const k = Math.max(minK, Math.min(maxK, v.k));
    // keep some of the map on screen
    const [w, h] = size;
    const tx = Math.min(w * 0.6, Math.max(w * 0.4 - W * k, v.tx));
    const ty = Math.min(h * 0.6, Math.max(h * 0.4 - H * k, v.ty));
    return { k, tx, ty };
  }, [minK, maxK, size, W, H]);

  const animateTo = useCallback((to: View, ms = 700) => {
    cancelAnimationFrame(anim.current);
    const from = viewRef.current, target = clampView(to);
    if (reduce || ms === 0) { setView(target); return; }
    const t0 = performance.now();
    // zoom in log space so the motion feels even
    const step = (t: number) => {
      const u = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - u, 3);
      const k = Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e);
      // keep the point between the two centres moving on a straight line
      const cx = size[0] / 2, cy = size[1] / 2;
      const mx0 = (cx - from.tx) / from.k, my0 = (cy - from.ty) / from.k;
      const mx1 = (cx - target.tx) / target.k, my1 = (cy - target.ty) / target.k;
      const mx = mx0 + (mx1 - mx0) * e, my = my0 + (my1 - my0) * e;
      setView({ k, tx: cx - mx * k, ty: cy - my * k });
      if (u < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [clampView, reduce, size]);

  const zoomAt = useCallback((factor: number, px: number, py: number, animate = false) => {
    const v = viewRef.current;
    const k = Math.max(minK, Math.min(maxK, v.k * factor));
    const next = { k, tx: px - ((px - v.tx) * k) / v.k, ty: py - ((py - v.ty) * k) / v.k };
    if (animate) animateTo(next, 300); else setView(clampView(next));
  }, [minK, maxK, animateTo, clampView]);

  const flyTo = useCallback((id: string) => {
    const t = byId.get(id);
    if (!t || !home) return;
    const k = Math.max(viewRef.current.k, home.k * (t.kind === "region" ? 1.6 : 3.2));
    // leave room for the panel on wide screens: centre a little left of the middle
    animateTo({ k, tx: size[0] * 0.5 - t.x * k, ty: size[1] * 0.5 - t.y * k });
  }, [byId, animateTo, size, home]);

  const select = useCallback((id: string | null) => {
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("p", id); else sp.delete("p");
    router.replace(`?${sp.toString()}`, { scroll: false });
    if (id) flyTo(id);
  }, [params, router, flyTo]);

  // opened with ?p=: go there once the map has its size
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !selectedId || !home) return;
    opened.current = true;
    flyTo(selectedId);
  }, [selectedId, flyTo, home]);

  // ---- pointer handling: drag to pan, two fingers to pinch, wheel to zoom
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(0);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    cancelAnimationFrame(anim.current);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const rect = stage.current!.getBoundingClientRect();
    if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      moved.current += Math.abs(dx) + Math.abs(dy);
      const v = viewRef.current;
      setView(clampView({ k: v.k, tx: v.tx + dx, ty: v.ty + dy }));
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.entries()].map(([id, p]) => (id === e.pointerId ? { x: e.clientX, y: e.clientY } : p));
      const [oa, ob] = [...pointers.current.values()];
      const d0 = Math.hypot(oa.x - ob.x, oa.y - ob.y), d1 = Math.hypot(a.x - b.x, a.y - b.y);
      if (d0 > 0) zoomAt(d1 / d0, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      moved.current += 10;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => { pointers.current.delete(e.pointerId); };
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0018)), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [zoomAt]);
  const onKey = (e: React.KeyboardEvent) => {
    const [w, h] = size, v = viewRef.current, step = 80;
    if (e.key === "+" || e.key === "=") zoomAt(1.5, w / 2, h / 2, true);
    else if (e.key === "-" || e.key === "_") zoomAt(1 / 1.5, w / 2, h / 2, true);
    else if (e.key === "ArrowLeft") animateTo({ ...v, tx: v.tx + step }, 200);
    else if (e.key === "ArrowRight") animateTo({ ...v, tx: v.tx - step }, 200);
    else if (e.key === "ArrowUp") animateTo({ ...v, ty: v.ty + step }, 200);
    else if (e.key === "ArrowDown") animateTo({ ...v, ty: v.ty - step }, 200);
    else if (e.key === "Escape") select(null);
    else return;
    e.preventDefault();
  };

  // ---- what to draw at this zoom: more places as you zoom in
  const found = useMemo(() => {
    const n = fold(q).trim();
    if (n.length < 2) return [];
    return places.filter((p) => fold(p.grc).includes(n) || p.en.toLowerCase().includes(q.trim().toLowerCase()) || (p.also ?? []).some((a) => fold(a).includes(n))).slice(0, 8);
  }, [q, places]);
  const { k, tx, ty } = view;
  const zoom = home ? k / home.k : 1;
  const [w, h] = size;
  const shown = useMemo(() => {
    const limit = Math.round(90 * zoom * zoom);
    const out: typeof pts = [];
    let rank = 0;
    for (const t of pts) {
      if (!kinds.has(t.kind) && t.kind !== "other") continue;
      rank++;
      const sx = t.x * k + tx, sy = t.y * k + ty;
      if (sx < -40 || sy < -20 || sx > w + 40 || sy > h + 20) continue;
      if (rank > limit && t.p.id !== selectedId && !saved[t.p.id]) continue;
      out.push(t);
    }
    return out;
  }, [pts, kinds, k, tx, ty, w, h, zoom, selectedId, saved]);

  // labels: the most-mentioned first, skipping any that would overlap one already placed
  const labels = useMemo(() => {
    const boxes: [number, number, number, number][] = [];
    const out: { t: (typeof pts)[number]; x: number; y: number; text: string; big: boolean }[] = [];
    const max = Math.min(140, 26 + Math.round(24 * zoom));
    const order = [...shown].sort((a, b) => (b.p.id === selectedId ? 1 : 0) - (a.p.id === selectedId ? 1 : 0) || b.p.n - a.p.n);
    for (const t of order) {
      if (out.length >= max) break;
      const text = greekNames ? t.p.grc : t.p.en.split("/")[0].replace(/ \(.*\)$/, "");
      const big = TEXT_KINDS.has(t.kind);
      const fs = big ? 12 : 12.5;
      const tw = text.length * fs * (big ? 0.72 : 0.56), th = fs * 1.2;
      const sx = t.x * k + tx, sy = t.y * k + ty;
      const x = big ? sx - tw / 2 : sx + radius(t.p.n) + 3, y = big ? sy : sy + fs * 0.35;
      const box: [number, number, number, number] = [x - 2, y - th, x + tw + 2, y + 3];
      if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      boxes.push(box);
      out.push({ t, x, y, text, big });
    }
    return out;
  }, [shown, k, tx, ty, zoom, greekNames, selectedId]);

  const sel = selectedId ? byId.get(selectedId)?.p ?? null : null;
  const onDotClick = (id: string) => { if (moved.current < 6) select(id === selectedId ? null : id); };

  return (
    <div className={`wrap ${styles.layout}`}>
      <div className={styles.mapCol}>
        <div ref={stage} className={styles.stage} tabIndex={0} role="application" aria-label="Map of the Greek world. Use the arrow keys to move and plus or minus to zoom; places are listed in the panel."
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          onDoubleClick={(e) => { const r = stage.current!.getBoundingClientRect(); zoomAt(2, e.clientX - r.left, e.clientY - r.top, true); }}
          onKeyDown={onKey}>
          {w > 0 && (
            <svg width={w} height={h} className={styles.svg} aria-hidden="true">
              <defs>
                <pattern id="waves" width="14" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0 5 Q3.5 2 7 5 T14 5" className={styles.wave} />
                </pattern>
              </defs>
              <rect width={w} height={h} className={styles.land} />
              <g transform={`translate(${tx} ${ty}) scale(${k})`}>
                <path d={sea} className={styles.sea} />
                <path d={sea} className={styles.waves} style={{ fill: "url(#waves)" }} />
                <path d={lakes} className={styles.lake} />
                <path d={sea} className={styles.coast} />
              </g>
              <g>
                {shown.filter((t) => !TEXT_KINDS.has(t.kind)).map((t, i) => (
                  <circle key={t.p.id} cx={t.x * k + tx} cy={t.y * k + ty} r={radius(t.p.n)}
                    className={`${styles.dot} ${t.p.checked ? styles.checked : styles.auto} ${saved[t.p.id] ? styles.saved : ""}`}
                    style={{ "--i": Math.min(i, 60) } as React.CSSProperties}
                    onClick={() => onDotClick(t.p.id)}><title>{`${t.p.grc} · ${t.p.en}`}</title></circle>
                ))}
              </g>
              <g>
                {labels.map(({ t, x, y, text, big }) => (
                  <text key={t.p.id} x={x} y={y} className={`${big ? (t.kind === "water" ? styles.waterName : styles.regionName) : styles.name} ${t.p.id === selectedId ? styles.selName : ""} ${big && !t.p.checked ? styles.autoName : ""}`}
                    lang={greekNames ? "grc" : undefined} onClick={() => onDotClick(t.p.id)}>{text}</text>
                ))}
              </g>
              {sel && (() => { const t = byId.get(sel.id)!; return <circle cx={t.x * k + tx} cy={t.y * k + ty} r={radius(sel.n) + 7} className={styles.ring} />; })()}
            </svg>
          )}
          <div className={styles.controls}>
            <button type="button" onClick={() => zoomAt(1.6, w / 2, h / 2, true)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => zoomAt(1 / 1.6, w / 2, h / 2, true)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => home && animateTo(home)} aria-label="Back to the Aegean" title="Back to the Aegean">⌂</button>
          </div>
          <div className={styles.compass} aria-hidden="true">N</div>
        </div>
        <div className={styles.filters} role="group" aria-label="What to show">
          {KINDS.map((kd) => (
            <button key={kd.id} type="button" className="chip" aria-pressed={kinds.has(kd.id)}
              onClick={() => setKinds((s) => { const n = new Set(s); if (n.has(kd.id)) n.delete(kd.id); else n.add(kd.id); return n; })}>{kd.label}</button>
          ))}
          <button type="button" className="chip" aria-pressed={greekNames} onClick={() => setGreekNames(!greekNames)}>{greekNames ? "Names in Greek" : "Names in English"}</button>
        </div>
      </div>

      <aside className={styles.panel} aria-live="polite">
        <div className={styles.search}>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a place: Σπάρτη, Delos…" aria-label="Find a place" />
          {found.length > 0 && (
            <ul className={styles.found}>
              {found.map((p) => (
                <li key={p.id}><button type="button" onClick={() => { setQ(""); select(p.id); }}><b lang="grc">{p.grc}</b> <span>{p.en.split("/")[0]}</span> <small>{fmt(p.n)}</small></button></li>
              ))}
            </ul>
          )}
        </div>
        {sel ? <PlaceCard p={sel} idx={idx} entries={entriesByPlace[sel.id] ?? []} saved={!!saved[sel.id]} onSave={() => toggleSaved(sel.id)} onClose={() => select(null)} />
          : <Intro places={places} meta={meta} onPick={select} />}
      </aside>
    </div>
  );
}

function PlaceCard({ p, idx, entries, saved, onSave, onClose }: { p: Place; idx: CatalogIndex | null; entries: EntryLink[]; saved: boolean; onSave: () => void; onClose: () => void }) {
  const top = p.w[0]?.[1] ?? 1;
  const workName = (id: string) => {
    const w = idx?.work.get(id);
    const a = w ? idx?.authorOf.get(id) : null;
    return w ? `${a?.name ? `${a.name}, ` : ""}${w.title}` : id;
  };
  return (
    <div className={styles.card} key={p.id}>
      <p className="label">{typeLabel(p.type)}{p.approx ? " · position approximate" : ""}</p>
      <h2 className={styles.placeName}><span lang="grc">{p.grc}</span><small>{p.en}</small></h2>
      <p className={styles.count}>Named <b>{fmt(p.n)}</b> times in <b>{fmt(p.works)}</b> {p.works === 1 ? "work" : "works"} of the library{p.also?.length ? <> (also as <span lang="grc">{p.also.join(", ")}</span>)</> : null}.</p>
      {!p.checked && <p className={styles.caveat}>Matched automatically by its name, and not yet checked by hand: some names belong to people or gods as well as places.</p>}
      {p.alt > 0 && <p className={styles.caveat}>Pleiades lists {p.alt} other {p.alt === 1 ? "place" : "places"} with this name; the map shows the one Pleiades connects most other places to.</p>}
      {entries.length > 0 && (
        <div className={styles.entries}>
          <p className="label">In the Painted Stoa</p>
          {entries.map((e) => <Link key={e.slug} href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}>{e.title} →</Link>)}
        </div>
      )}
      <p className="label">Where the texts name it most</p>
      <ol className={styles.works}>
        {p.w.map(([id, n]) => (
          <li key={id}>
            <Link href={`/search?m=lemma&q=${encodeURIComponent(p.grc)}&w=${id}`} transitionTypes={["page-turn"]}>{workName(id)}</Link>
            <span className={styles.bar} style={{ width: `${Math.max(4, (n / top) * 100)}%` }} aria-hidden="true" />
            <small>{fmt(n)}</small>
          </li>
        ))}
      </ol>
      <div className={styles.actions}>
        <button type="button" className={`btn ${saved ? "" : "ghost"}`} onClick={onSave} aria-pressed={saved}>{saved ? "Saved to my places" : "Save this place"}</button>
        <Link className="btn ghost" href={`/search?m=lemma&q=${encodeURIComponent(p.grc)}`} transitionTypes={["page-turn"]}>Every mention</Link>
      </div>
      <p className={styles.small}>
        <a href={`https://pleiades.stoa.org/places/${p.id}`} target="_blank" rel="noopener noreferrer">This place in Pleiades ↗</a> · <button type="button" className={styles.linkBtn} onClick={onClose}>Close</button>
      </p>
    </div>
  );
}

function Intro({ places, meta, onPick }: { places: Place[]; meta: PlacesMeta; onPick: (id: string) => void }) {
  return (
    <div className={styles.card}>
      <p className="label">The places the library names</p>
      <p>Every dot is a place named in the Greek texts of the library; the bigger the dot, the more often it is named. Regions, seas and rivers are written across the map. Choose one to see which works name it most.</p>
      <p className="label">Most named</p>
      <ol className={styles.top}>
        {places.slice(0, 12).map((p) => (
          <li key={p.id}><button type="button" onClick={() => onPick(p.id)}><b lang="grc">{p.grc}</b> <span>{p.en.split("/")[0].replace(/ \(.*\)$/, "")}</span> <small>{fmt(p.n)}</small></button></li>
        ))}
      </ol>
      <div className={styles.key} aria-label="Key">
        <span><i className={`${styles.keyDot} ${styles.checked}`} /> checked by hand</span>
        <span><i className={`${styles.keyDot} ${styles.auto}`} /> matched automatically (rivers and regions in paler letters)</span>
      </div>
      <details className={styles.method}>
        <summary>How the places were found</summary>
        <p>
          The word analyses of the GLAUx project give every word of {fmt(meta.names)} different names in the library its dictionary form. A name is
          matched to the Pleiades gazetteer of ancient places when it is the same Greek word as a name Pleiades records for a place it has located
          (accents and breathings ignored). {fmt(meta.matched)} places were found this way. Where several places share a name, the one Pleiades connects
          most other places to is shown. Names used mostly for people or gods rather than a place (Κῦρος the king, not the river) are left out. A few famous places that Pleiades records without the texts&apos; Greek spelling (Κνωσσός, Μυκήνη, Τίρυνς) were joined to their Pleiades place by hand.
        </p>
        <p>
          The {fmt(meta.checked)} places named at least {meta.checkedMin} times, and the great regions and rivers, were checked by hand; the rest are
          matched automatically and may be wrong. Counts are GLAUx&apos;s, from its own texts, which cover 1,186 of the library&apos;s works.
        </p>
      </details>
    </div>
  );
}
