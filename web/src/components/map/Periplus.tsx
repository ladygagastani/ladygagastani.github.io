"use client";
/**
 * The Periplus: a map of the Greek world in the colours of a painted vase (clay land, an Aegean sea), with
 * every place the library mentions. Dots grow with the number of mentions; click one to see what the
 * texts say of it, and where. Wheel, drag (one finger on a phone), pinch, double-click or the buttons to move about; the
 * keyboard works too (arrows to pan, + and − to zoom). ?p=<Pleiades id> opens a place.
 *
 * The map is painted on a canvas by an engine outside React (engine.ts, draw.ts), once per screen frame
 * at most: the zoom glides, a flick keeps the map drifting a moment, and places fade in and out as they
 * find room. This component feeds it gestures and choices, and draws the panel.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fold, loadCatalog, type CatalogIndex } from "@/lib/catalog";
import { KINDS, kindOf, loadMap, loadSavedPlaces, mapSize, project, shortName, typeLabel, useSavedPlaces, type Base, type Place, type PlacesMeta } from "@/lib/map";
import { useSettings } from "@/lib/settings";
import { buildLods, type Pt } from "./draw";
import { MapEngine, trailVelocity } from "./engine";
import styles from "./Periplus.module.css";

export interface EntryLink { slug: string; title: string }

const fmt = (n: number) => n.toLocaleString("en-GB");
const radius = (n: number) => Math.min(9.5, 2.4 + Math.sqrt(n) / 6);
const nameStyle = (type: string, kind: string): Pt["name"] => (kind === "region" ? "region" : kind === "water" ? (type === "river" ? "river" : "sea") : null);

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

/** the engine for this map: the coastlines at four levels of detail, and every place projected */
function makeEngine(base: Base, places: Place[]) {
  const [W, H] = mapSize(base);
  const proj = (rings: number[][]) => rings.map((r) => { const o: number[] = []; for (let i = 0; i < r.length; i += 2) o.push(...project(base, r[i], r[i + 1])); return o; });
  const pts: Pt[] = places.map((p) => {
    const [x, y] = project(base, p.lon, p.lat), kind = kindOf(p.type);
    return { p, x, y, kind, r: radius(p.n), name: nameStyle(p.type, kind) };
  });
  return new MapEngine(W, H, pts, new Map(pts.map((t) => [t.p.id, t])), buildLods(proj(base.water), proj(base.lakes)), [project(base, 13, 44.5), project(base, 36.5, 30.5)]);
}

function MapView({ base, places, meta, idx, entriesByPlace }: { base: Base; places: Place[]; meta: PlacesMeta; idx: CatalogIndex | null; entriesByPlace: Record<string, EntryLink[]> }) {
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get("p");
  const motion = useSettings((s) => s.motion);
  const reduce = motion === "reduce" || (motion === "auto" && typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [engine] = useState(() => makeEngine(base, places));

  const [kinds, setKinds] = useState<Set<string>>(() => new Set(KINDS.map((k) => k.id)));
  const [greekNames, setGreekNames] = useState(false);
  const [q, setQ] = useState("");
  const saved = useSavedPlaces((s) => s.saved);
  const toggleSaved = useSavedPlaces((s) => s.toggle);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const hoverRef = useRef(hover);
  useEffect(() => { hoverRef.current = hover; }, [hover]);
  const [homeReady, setHomeReady] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const scaleBar = useRef<HTMLDivElement>(null);

  // give the engine its canvas, follow the frame's size and the theme
  useLayoutEffect(() => {
    const el = stage.current!;
    engine.attach({ stage: el, canvas: canvas.current!, ring: ring.current!, scale: scaleBar.current! }, () => setHomeReady(true));
    const ro = new ResizeObserver(() => engine.resize(el.clientWidth, el.clientHeight));
    ro.observe(el);
    const restyle = () => engine.restyle();
    const mo = new MutationObserver(restyle);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", restyle);
    const fonts = () => engine.fontsChanged();
    document.fonts?.addEventListener?.("loadingdone", fonts);
    return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener("change", restyle); document.fonts?.removeEventListener?.("loadingdone", fonts); engine.detach(); };
  }, [engine]);

  // what is shown, and what is chosen, feed the next frame
  useEffect(() => {
    engine.setOptions({ kinds, greek: greekNames, selected: selectedId, saved, hover: hover?.id ?? null, reduce });
  }, [engine, kinds, greekNames, selectedId, saved, hover, reduce]);

  const select = (id: string | null) => {
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("p", id); else sp.delete("p");
    router.replace(`?${sp.toString()}`, { scroll: false });
    if (id) engine.flyTo(id);
  };

  // opened with ?p=: go there once the map has its size
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !selectedId || !homeReady) return;
    opened.current = true;
    engine.flyTo(selectedId);
  }, [engine, selectedId, homeReady]);

  // ---- mouse and pen: drag to pan (with a glide when let go), hover to name a place
  const drag = useRef<{ x: number; y: number; trail: { t: number; x: number; y: number }[] } | null>(null);
  const moved = useRef(0);
  const lastTouch = useRef(0);
  const local = (e: { clientX: number; clientY: number }) => { const r = stage.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0 || (e.target as Element).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, trail: [{ t: performance.now(), x: e.clientX, y: e.clientY }] };
    moved.current = 0;
    engine.stop();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y, v = engine.v;
      moved.current += Math.abs(dx) + Math.abs(dy);
      d.x = e.clientX; d.y = e.clientY;
      d.trail.push({ t: performance.now(), x: e.clientX, y: e.clientY });
      if (d.trail.length > 12) d.trail.shift();
      engine.set({ k: v.k, tx: v.tx + dx, ty: v.ty + dy });
      if (hover) setHover(null);
      return;
    }
    const [x, y] = local(e), id = (e.target as Element).closest("button") ? null : engine.hitAt(x, y, false);
    if (id !== (hover?.id ?? null)) setHover(id ? { id, x, y } : null);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (d && moved.current > 6 && e.type === "pointerup") engine.fling(trailVelocity(d.trail));
  };
  const onClick = (e: React.MouseEvent) => {
    if (moved.current > 6 || (e.target as Element).closest("button")) return;
    const id = engine.hitAt(...local(e), performance.now() - lastTouch.current < 800);
    if (id) select(id === selectedId ? null : id);
  };

  // ---- touch: one finger moves the map (with a glide when let go), two fingers zoom it (and move it as they go).
  // On a phone the map leaves part of the page in view above or below it, to scroll the page by.
  useEffect(() => {
    const el = stage.current!;
    let last: { x: number; y: number; d: number } | null = null, one: { x: number; y: number } | null = null;
    let trail: { t: number; x: number; y: number }[] = [];
    const mid = (t: TouchList) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2, d: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY) });
    const track = (x: number, y: number) => { trail.push({ t: performance.now(), x, y }); if (trail.length > 12) trail.shift(); };
    const start = (e: TouchEvent) => {
      lastTouch.current = performance.now();
      engine.stop();
      if (e.touches.length === 2) { last = mid(e.touches); one = null; trail = []; }
      else if (e.touches.length === 1) { moved.current = 0; one = { x: e.touches[0].clientX, y: e.touches[0].clientY }; trail = []; track(one.x, one.y); }
    };
    const move = (e: TouchEvent) => {
      if (e.touches.length === 2 && last) {
        e.preventDefault();
        // follow both fingers: the point that was between them stays between them, their spread sets the zoom
        const m = mid(e.touches), r = el.getBoundingClientRect(), v = engine.v;
        const k = engine.limitK(v.k * (last.d > 0 ? m.d / last.d : 1)), wx = (last.x - r.left - v.tx) / v.k, wy = (last.y - r.top - v.ty) / v.k;
        engine.set({ k, tx: m.x - r.left - wx * k, ty: m.y - r.top - wy * k });
        moved.current += 10;
        track(m.x, m.y);
        last = m;
      } else if (e.touches.length === 1 && one) {
        e.preventDefault();
        const x = e.touches[0].clientX, y = e.touches[0].clientY, v = engine.v;
        moved.current += Math.abs(x - one.x) + Math.abs(y - one.y);
        engine.set({ k: v.k, tx: v.tx + x - one.x, ty: v.ty + y - one.y });
        one = { x, y };
        track(x, y);
        if (hoverRef.current) setHover(null);
      }
    };
    const end = (e: TouchEvent) => {
      lastTouch.current = performance.now();
      if (e.touches.length === 1) {
        // from two fingers back to one: carry on moving from where that finger is, without a jump
        last = null; trail = [];
        one = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        track(one.x, one.y);
        return;
      }
      if (!e.touches.length) {
        if (e.type === "touchend" && moved.current > 6) engine.fling(trailVelocity(trail));
        last = null; one = null; trail = [];
      }
    };
    // the wheel (and a trackpad's pinch) zooms, gliding
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      engine.wheel(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : e.ctrlKey ? 0.01 : 0.0022)), ...local(e));
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", start); el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end); el.removeEventListener("touchcancel", end);
      el.removeEventListener("wheel", wheel);
    };
  }, [engine]);

  const onKey = (e: React.KeyboardEvent) => {
    const v = engine.v, step = 90;
    if (e.key === "+" || e.key === "=") engine.zoomAt(1.6, engine.w / 2, engine.h / 2);
    else if (e.key === "-" || e.key === "_") engine.zoomAt(1 / 1.6, engine.w / 2, engine.h / 2);
    else if (e.key === "ArrowLeft") engine.go({ ...v, tx: v.tx + step }, 240);
    else if (e.key === "ArrowRight") engine.go({ ...v, tx: v.tx - step }, 240);
    else if (e.key === "ArrowUp") engine.go({ ...v, ty: v.ty + step }, 240);
    else if (e.key === "ArrowDown") engine.go({ ...v, ty: v.ty - step }, 240);
    else if (e.key === "Escape") select(null);
    else return;
    e.preventDefault();
  };

  const found = useMemo(() => {
    const n = fold(q).trim();
    if (n.length < 2) return [];
    return places.filter((p) => fold(p.grc).includes(n) || fold(shortName(p)).includes(n) || p.en.toLowerCase().includes(q.trim().toLowerCase()) || (p.also ?? []).some((a) => fold(a).includes(n))).slice(0, 8);
  }, [q, places]);

  const byId = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const sel = selectedId ? byId.get(selectedId) ?? null : null;
  const hovered = hover ? byId.get(hover.id) : null;

  return (
    <div className={`wrap ${styles.layout}`}>
      <div className={styles.mapCol}>
        {/* the search comes first, above the map; its suggestions drop down over it */}
        <div className={styles.search} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
          <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a place: Σπάρτη, Delos…" aria-label="Find a place" />
          {found.length > 0 && (
            <ul className={styles.found}>
              {found.map((p) => (
                <li key={p.id}><button type="button" onClick={() => { setQ(""); select(p.id); }}><b>{shortName(p)}</b> <span lang="grc">{p.grc}</span> <small>{fmt(p.n)}</small></button></li>
              ))}
            </ul>
          )}
        </div>
        <div ref={stage} className={styles.stage} tabIndex={0} role="application" aria-label="Map of the Greek world. Use the arrow keys to move and plus or minus to zoom; places are listed in the panel."
          data-hover={hover ? "" : undefined}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          onPointerLeave={() => setHover(null)} onClick={onClick}
          onDoubleClick={(e) => { if (!(e.target as Element).closest("button")) engine.zoomAt(2, ...local(e)); }}
          onKeyDown={onKey}>
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
          <div ref={ring} className={styles.ring} hidden aria-hidden="true" />
          {hovered && hover && (
            <p className={styles.tip} style={{ transform: `translate(${Math.round(hover.x)}px, ${Math.round(hover.y)}px)` }} aria-hidden="true">
              <b>{shortName(hovered)}</b> <span lang="grc">{hovered.grc}</span> <small>{fmt(hovered.n)}</small>
            </p>
          )}
          <div className={styles.controls} data-avoid="">
            <div className={styles.zoomPair}>
              <button type="button" onClick={() => engine.zoomAt(1.6, engine.w / 2, engine.h / 2)} aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
              <button type="button" onClick={() => engine.zoomAt(1 / 1.6, engine.w / 2, engine.h / 2)} aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg></button>
            </div>
            <button type="button" className={styles.homeBtn} onClick={() => engine.home && engine.go(engine.home)} aria-label="Back to the Aegean" title="Back to the Aegean">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7M6.5 9.5V20h11V9.5" /></svg>
            </button>
          </div>
          <div className={styles.compass} aria-hidden="true" data-avoid="">
            <svg viewBox="0 0 24 34"><path d="M12 2 17 17 12 14 7 17Z" className={styles.north} /><path d="M12 32 7 17 12 20 17 17Z" /></svg>
            <span>N</span>
          </div>
          <div ref={scaleBar} className={styles.scale} aria-hidden="true" data-avoid=""><i /><span /></div>
        </div>
        <div className={styles.filters} role="group" aria-label="What to show">
          {KINDS.map((kd) => (
            <button key={kd.id} type="button" className="chip" aria-pressed={kinds.has(kd.id)}
              onClick={() => setKinds((ks) => { const n = new Set(ks); if (n.has(kd.id)) n.delete(kd.id); else n.add(kd.id); return n; })}>{kd.label}</button>
          ))}
          <button type="button" className="chip" aria-pressed={greekNames} onClick={() => setGreekNames(!greekNames)}>Names in Greek</button>
        </div>
      </div>

      <aside className={styles.panel} aria-live="polite">
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
      <h2 className={styles.placeName}>{shortName(p)}<small lang="grc">{p.grc}</small></h2>
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
          <li key={p.id}><button type="button" onClick={() => onPick(p.id)}><b>{shortName(p)}</b> <span lang="grc">{p.grc}</span> <small>{fmt(p.n)}</small></button></li>
        ))}
      </ol>
      <div className={styles.key} aria-label="Key">
        <span><i className={`${styles.keyDot} ${styles.checked}`} /> checked by hand</span>
        <span><i className={styles.keyDot} /> matched automatically (rivers and regions in paler letters)</span>
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
