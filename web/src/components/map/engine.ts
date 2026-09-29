/**
 * The Periplus' engine: the view (zoom and position), the motions that change it (a glide to a view, the
 * wheel's smooth zoom, a flick's drift) and the frame loop that paints the canvas (draw.ts). It lives
 * outside React, so moving the map never waits for the page to re-render; Periplus.tsx feeds it events
 * and what is chosen or filtered.
 */
import { clearWidths, layout, lodFor, paint, readLook, waveTile, zoomPath, type Box, type Label, type Layout, type Look, type Lod, type Pt, type View } from "./draw";

const KM_PER_UNIT = 1.1132;   // a map unit is a hundredth of a degree of latitude
export const MAX_ZOOM = 14;    // times the opening view
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const fmt = (n: number) => n.toLocaleString("en-GB");

type Motion =
  | { type: "path"; t0: number; ms: number; at: (t: number) => [number, number, number]; to: View }
  | { type: "wheel"; k: number; ax: number; ay: number; wx: number; wy: number }
  | { type: "fling"; vx: number; vy: number };

export interface Options { kinds: Set<string>; greek: boolean; selected: string | null; saved: Record<string, number>; hover: string | null; reduce: boolean }
interface Els { stage: HTMLElement; canvas: HTMLCanvasElement; ring: HTMLElement; scale: HTMLElement }

/** how fast a drag was going over its last tenth of a second, in px per ms */
export function trailVelocity(trail: { t: number; x: number; y: number }[]) {
  const now = performance.now(), recent = trail.filter((p) => now - p.t < 100);
  if (recent.length < 2) return null;
  const a = recent[0], b = recent[recent.length - 1], dt = b.t - a.t;
  return dt > 0 ? { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt } : null;
}

export class MapEngine {
  v: View = { k: 1, tx: 0, ty: 0 };
  home: View | null = null;
  w = 0; h = 0;
  lay: Layout | null = null;
  private dpr = 1;
  private look: Look | null = null;
  private waves: CanvasPattern | null = null;
  private motion: Motion | null = null;
  private raf = 0;
  private last = 0;
  private laidFor = "";
  private laidAt = 0;
  private touchedAt = 0;   // the last time a finger or the mouse moved the map directly
  private dotA = new Map<string, number>();
  private labA = new Map<string, { l: Label; dx: number; dy: number; a: number; on: boolean }>();
  private scaleKm = 0;
  private els: Els | null = null;
  private avoid: Box[] = [];
  opts: Options = { kinds: new Set(), greek: true, selected: null, saved: {}, hover: null, reduce: false };
  /** called once the opening view is known */
  private onHome: () => void = () => {};

  constructor(private W: number, private H: number, private pts: Pt[], private byId: Map<string, Pt>, private lods: Lod[], private opening: [[number, number], [number, number]]) {}

  attach(els: Els, onHome: () => void) { this.els = els; this.onHome = onHome; this.restyle(); }
  detach() { cancelAnimationFrame(this.raf); this.raf = 0; this.els = null; }

  setOptions(o: Options) { this.opts = o; this.laidFor = ""; this.request(); }

  /** read the theme's colours and fonts again (on a theme change), then redraw */
  restyle() {
    const els = this.els;
    if (!els) return;
    const look = readLook(els.stage);
    this.look = look;
    this.waves = els.canvas.getContext("2d")!.createPattern(waveTile(look, this.dpr), "repeat");
    this.fontsChanged();
    // names are measured and drawn in the site's fonts, once they have arrived
    Promise.all([document.fonts.load(`13px ${look.greek}`, "Ἀθῆναι Ῥώμη"), document.fonts.load(`11px ${look.label}`, "ΘΡΑΚΗ")]).then(() => this.fontsChanged(), () => undefined);
  }
  fontsChanged() { clearWidths(); this.laidFor = ""; this.request(); }

  /** the frame has a new size (first show, a window resized, a phone turned round) */
  resize(w: number, h: number) {
    const els = this.els;
    if (!els || !w || !h) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    // keep the middle of the map in the middle
    if (this.w) this.v = { ...this.v, tx: this.v.tx + (w - this.w) / 2, ty: this.v.ty + (h - this.h) / 2 };
    this.w = w; this.h = h;
    els.canvas.width = Math.round(w * dpr); els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = `${w}px`; els.canvas.style.height = `${h}px`;
    if (dpr !== this.dpr) { this.dpr = dpr; this.restyle(); }
    if (!this.home) {
      // open on the Aegean; the whole map is the furthest you can zoom out
      const [[x0, y0], [x1, y1]] = this.opening;
      const k = Math.min(w / (x1 - x0), h / (y1 - y0));
      this.home = { k, tx: w / 2 - ((x0 + x1) / 2) * k, ty: h / 2 - ((y0 + y1) / 2) * k };
      this.v = this.home;
      this.onHome();
    }
    this.v = this.clamp(this.v);
    this.measureAvoid();
    this.laidFor = "";
    this.request();
  }

  /** where the buttons, compass and scale sit over the map, so that no dot or name hides under them */
  measureAvoid() {
    const els = this.els;
    if (!els) return;
    const r0 = els.stage.getBoundingClientRect();
    this.avoid = [...els.stage.querySelectorAll("[data-avoid]")].map((e) => {
      const r = e.getBoundingClientRect();
      return { x0: r.left - r0.left - 4, y0: r.top - r0.top - 4, x1: r.right - r0.left + 4, y1: r.bottom - r0.top + 4 };
    });
  }

  // ---------------------------------------------------------------- limits and motions

  /** the zoom kept between the whole map and MAX_ZOOM times the opening view */
  limitK(k: number) { return Math.max(Math.min(this.w / this.W, this.h / this.H), Math.min(this.home ? this.home.k * MAX_ZOOM : k, k)); }
  clamp(v: View): View {
    const k = this.limitK(v.k), { w, h, W, H } = this;
    // keep some of the map on screen
    return { k, tx: Math.min(w * 0.6, Math.max(w * 0.4 - W * k, v.tx)), ty: Math.min(h * 0.6, Math.max(h * 0.4 - H * k, v.ty)) };
  }
  stop() { this.motion = null; }

  /** jump (a drag or pinch follows the finger exactly) */
  set(v: View) { this.v = this.clamp(v); this.motion = null; this.touchedAt = performance.now(); this.request(); }

  /** glide to a view; far away, the map zooms out, travels and zooms back in */
  go(to: View, ms?: number) {
    const target = this.clamp(to);
    if (this.opts.reduce) { this.set(target); return; }
    const c = (v: View): [number, number, number] => [(this.w / 2 - v.tx) / v.k, (this.h / 2 - v.ty) / v.k, this.w / v.k];
    const path = zoomPath(c(this.v), c(target));
    const widest = this.w / Math.min(this.w / this.W, this.h / this.H);
    this.motion = {
      type: "path", t0: performance.now(), ms: ms ?? Math.max(320, Math.min(1500, path.S * 900)), to: target,
      at: (t) => { const [x, y, ww] = path.at(t); return [x, y, Math.min(widest, ww)]; },
    };
    this.request();
  }

  /** zoom by `factor` about a point of the frame, gliding; pressed again mid-glide, it carries on from where the glide was going */
  zoomAt(factor: number, px: number, py: number) {
    const m = this.motion, v = m?.type === "path" ? m.to : this.v, k = this.limitK(v.k * factor);
    this.go({ k, tx: px - ((px - v.tx) * k) / v.k, ty: py - ((py - v.ty) * k) / v.k });
  }

  /** the wheel (or a trackpad's pinch): the zoom glides toward where the wheel has sent it, the point under the pointer staying put */
  wheel(factor: number, ax: number, ay: number) {
    const m = this.motion, k = this.limitK((m?.type === "wheel" ? m.k : this.v.k) * factor), v = this.v;
    if (this.opts.reduce) { this.set({ k, tx: ax - ((ax - v.tx) * k) / v.k, ty: ay - ((ay - v.ty) * k) / v.k }); return; }
    this.motion = { type: "wheel", k, ax, ay, wx: (ax - v.tx) / v.k, wy: (ay - v.ty) / v.k };
    this.request();
  }

  /** let go while moving: the map drifts on and slows to a stop */
  fling(vel: { vx: number; vy: number } | null) {
    if (!vel || this.opts.reduce || Math.hypot(vel.vx, vel.vy) < 0.25) return;
    this.motion = { type: "fling", vx: Math.max(-4, Math.min(4, vel.vx)), vy: Math.max(-4, Math.min(4, vel.vy)) };
    this.request();
  }

  /** fly to a place, close enough to see its neighbours */
  flyTo(id: string) {
    const t = this.byId.get(id);
    if (!t || !this.home) return;
    const k = Math.max(this.v.k, this.home.k * (t.name === "region" ? 1.6 : 3.2));
    this.go({ k, tx: this.w * 0.5 - t.x * k, ty: this.h * 0.5 - t.y * k });
  }

  /** the place under a point of the frame: the nearest dot or name, with room for a fingertip */
  hitAt(x: number, y: number, touch: boolean): string | null {
    const lay = this.lay, v = this.v;
    if (!lay) return null;
    let best: string | null = null, bestD = Infinity;
    for (const t of lay.dots) {
      const d = Math.hypot(t.x * v.k + v.tx - x, t.y * v.k + v.ty - y);
      if (d <= Math.max(t.r + (touch ? 6 : 3), touch ? 22 : 0) && d < bestD) { best = t.p.id; bestD = d; }
    }
    if (best) return best;
    for (const l of lay.labels) {
      const x0 = l.align === "left" ? l.x : l.align === "right" ? l.x - l.w : l.x - l.w / 2;
      if (x >= x0 - 4 && x <= x0 + l.w + 4 && y >= l.y - 14 && y <= l.y + 5) return l.key;
    }
    return null;
  }

  // ---------------------------------------------------------------- the frame loop

  request() { if (!this.raf && this.els) this.raf = requestAnimationFrame(this.frame); }

  private frame = (t: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(64, t - this.last) : 16;
    this.last = t;
    let moving = false;
    const m = this.motion;
    if (m?.type === "path") {
      const u = Math.min(1, (t - m.t0) / m.ms), [cx, cy, ww] = m.at(ease(u)), k = this.w / ww;
      this.v = { k, tx: this.w / 2 - cx * k, ty: this.h / 2 - cy * k };
      if (u < 1) moving = true; else { this.v = m.to; this.motion = null; }
    } else if (m?.type === "wheel") {
      const lk = Math.log(this.v.k), goal = Math.log(m.k), next = lk + (goal - lk) * (1 - Math.exp(-dt / 75)), k = Math.exp(next);
      this.v = this.clamp({ k, tx: m.ax - m.wx * k, ty: m.ay - m.wy * k });
      if (Math.abs(goal - next) > 0.002) moving = true; else this.motion = null;
    } else if (m?.type === "fling") {
      this.v = this.clamp({ k: this.v.k, tx: this.v.tx + m.vx * dt, ty: this.v.ty + m.vy * dt });
      const d = Math.exp(-dt / 325);
      m.vx *= d; m.vy *= d;
      if (Math.hypot(m.vx, m.vy) > 0.015) moving = true; else this.motion = null;
    }
    const fading = this.draw(dt);
    if (moving || fading) this.raf = requestAnimationFrame(this.frame);
    else {
      this.last = 0;
      // where the map rests, for the browser tests
      this.els?.stage.setAttribute("data-view", `${this.v.k.toFixed(5)} ${this.v.tx.toFixed(1)} ${this.v.ty.toFixed(1)}`);
    }
  };

  /** lay out (when the view has changed), fade, paint; true while something is still fading */
  private draw(dt: number): boolean {
    const els = this.els, g = els?.canvas.getContext("2d"), op = this.opts, look = this.look;
    if (!els || !g || !look || !this.w) return false;
    const { v, w, h } = this;
    const key = `${v.k.toFixed(6)} ${v.tx.toFixed(2)} ${v.ty.toFixed(2)} ${w} ${h}`;
    // while the map moves, what fits is worked out a few times a second (the dots and names still move every frame)
    const now = performance.now(), busy = !!this.motion || now - this.touchedAt < 120;
    if (!this.lay || (key !== this.laidFor && (this.laidFor === "" || !busy || now - this.laidAt > 60))) {
      this.laidAt = now;
      const shown = new Set<string>();
      for (const [id, a] of this.dotA) if (a > 0.5) shown.add(id);
      // a coarse coastline is plenty to tell whether a name sits on the sea
      const coarse = this.lods[Math.min(3, this.lods.length - 1)].sea;
      const onSea = (x: number, y: number) => g.isPointInPath(coarse, (x - v.tx) / v.k, (y - v.ty) / v.k, "evenodd");
      g.setTransform(1, 0, 0, 1, 0, 0);
      this.lay = layout(g, this.pts, v, w, h, { look, greek: op.greek, kinds: op.kinds, selected: op.selected, saved: op.saved, shown, avoid: this.avoid, onSea });
      this.laidFor = key;
    }
    const step = op.reduce ? 1 : Math.min(1, dt / 200);
    let fading = key !== this.laidFor;   // come back to lay out the final view
    const want = new Set(this.lay.dots.map((t) => t.p.id));
    for (const id of want) { const a = Math.min(1, (this.dotA.get(id) ?? 0) + step); this.dotA.set(id, a); if (a < 1) fading = true; }
    for (const [id, a] of this.dotA) if (!want.has(id)) { const b = a - step; if (b <= 0) this.dotA.delete(id); else { this.dotA.set(id, b); fading = true; } }
    for (const e of this.labA.values()) e.on = false;
    for (const l of this.lay.labels) {
      const t = this.byId.get(l.key)!, sx = t.x * v.k + v.tx, sy = t.y * v.k + v.ty;
      this.labA.set(l.key, { l, dx: l.x - sx, dy: l.y - sy, a: this.labA.get(l.key)?.a ?? 0, on: true });
    }
    const labels: { l: Label; a: number; t: Pt }[] = [];
    for (const [id, e] of this.labA) {
      e.a = e.on ? Math.min(1, e.a + step) : e.a - step;
      if (e.a <= 0) { this.labA.delete(id); continue; }
      if (e.a < 1) fading = true;
      const t = this.byId.get(id)!;
      e.l.x = t.x * v.k + v.tx + e.dx; e.l.y = t.y * v.k + v.ty + e.dy;
      labels.push({ l: e.l, a: e.a, t });
    }
    const dots = [...this.dotA].map(([id, a]) => ({ t: this.byId.get(id)!, a }));
    paint({ g, dpr: this.dpr, w, h, v, look, lod: lodFor(this.lods, v.k), waves: this.waves, dots, labels, selected: op.selected, hover: op.hover, saved: op.saved });

    // the ring round the chosen place, and the scale bar, are plain HTML over the canvas
    const sel = op.selected ? this.byId.get(op.selected) : null;
    els.ring.hidden = !sel;
    if (sel) {
      const r = sel.r + 7;
      els.ring.style.transform = `translate(${sel.x * v.k + v.tx - r}px, ${sel.y * v.k + v.ty - r}px)`;
      els.ring.style.width = els.ring.style.height = `${2 * r}px`;
    }
    const most = (KM_PER_UNIT / v.k) * 90;   // km across 90 px
    const p = 10 ** Math.floor(Math.log10(most)), km = [5, 2, 1].map((x) => x * p).find((x) => x <= most) ?? p;
    if (km !== this.scaleKm) { this.scaleKm = km; els.scale.querySelector("span")!.textContent = `${fmt(km)} km`; }
    (els.scale.firstElementChild as HTMLElement).style.width = `${(km / KM_PER_UNIT) * v.k}px`;
    return fading;
  }
}
