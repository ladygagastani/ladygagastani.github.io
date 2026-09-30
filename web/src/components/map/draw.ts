/**
 * The Periplus drawn on a canvas: the sea and coasts at a level of detail that suits the zoom, then only
 * as many places and names as fit without touching (the most-named first), each fading in and out as
 * the view changes. Pure drawing and layout; Periplus.tsx owns the view and the gestures.
 */
import type { Place } from "@/lib/map";

export interface View { k: number; tx: number; ty: number }
export interface Pt { p: Place; x: number; y: number; kind: string; r: number; name: "region" | "sea" | "river" | null }

// ---------------------------------------------------------------- coastlines

/** Douglas–Peucker on a flat, projected ring [x, y, x, y…]; tiny rings (islets, pools) are dropped. */
export function simplifyRing(r: number[], tol: number): number[] | null {
  const n = r.length / 2;
  if (!tol) return r;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); y0 = Math.min(y0, r[i + 1]); y1 = Math.max(y1, r[i + 1]); }
  if (Math.max(x1 - x0, y1 - y0) < tol * 2.5) return null;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack: [number, number][] = [[0, n - 1]];
  const t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const ax = r[a * 2], ay = r[a * 2 + 1], dx = r[b * 2] - ax, dy = r[b * 2 + 1] - ay, len = dx * dx + dy * dy;
    let far = -1, best = t2;
    for (let i = a + 1; i < b; i++) {
      const px = r[i * 2] - ax, py = r[i * 2 + 1] - ay;
      const d = len ? (px * dy - py * dx) ** 2 / len : px * px + py * py;
      if (d > best) { best = d; far = i; }
    }
    if (far >= 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(r[i * 2], r[i * 2 + 1]);
  return out.length >= 6 ? out : null;
}

export interface Lod { tol: number; sea: Path2D; lakes: Path2D }
const TOLS = [0, 1, 2, 3.5, 6, 12];   // map units (100 to a degree of latitude)

/** The sea and lakes at four levels of detail; `rings` are already projected. */
export function buildLods(water: number[][], lakes: number[][]): Lod[] {
  const path = (rings: number[][], tol: number) => {
    const p = new Path2D();
    for (const r of rings) {
      const s = simplifyRing(r, tol);
      if (!s) continue;
      p.moveTo(s[0], s[1]);
      for (let i = 2; i < s.length; i += 2) p.lineTo(s[i], s[i + 1]);
      p.closePath();
    }
    return p;
  };
  return TOLS.map((tol) => ({ tol, sea: path(water, tol), lakes: path(lakes, tol) }));
}
/** the coarsest level whose error stays under a pixel */
export const lodFor = (lods: Lod[], k: number) => lods.reduce((best, l) => (l.tol * k <= 0.9 ? l : best), lods[0]);

// ---------------------------------------------------------------- colours and type

export interface Look {
  land: string; sea: string; coast: string; wave: string; name: string; halo: string; seaName: string;
  accent: string; accentOnSea: string; ink: string; ink2: string; greek: string; body: string; label: string;
}
export function readLook(el: Element): Look {
  const cs = getComputedStyle(el), v = (n: string) => cs.getPropertyValue(n).trim();
  return {
    land: v("--map-land"), sea: v("--map-sea"), coast: v("--map-coast"), wave: v("--map-wave"), name: v("--map-name"),
    halo: v("--map-halo"), seaName: v("--map-sea-name"), accent: v("--accent"), accentOnSea: v("--accent-on-ink") || v("--accent"), ink: v("--ink"), ink2: v("--ink-2"),
    greek: v("--f-greek"), body: v("--f-body"), label: v("--f-label"),
  };
}

/** A small tile of sea with painted waves, to fill the sea with in one pass (at the screen's pixel density). */
export function waveTile(look: Look, dpr: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.round(16 * dpr); c.height = Math.round(10 * dpr);
  const g = c.getContext("2d")!;
  g.fillStyle = look.sea;
  g.fillRect(0, 0, c.width, c.height);
  g.scale(dpr, dpr);
  g.strokeStyle = look.wave; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(4, 2.5, 8, 6); g.quadraticCurveTo(12, 9.5, 16, 6); g.stroke();
  return c;
}

/** Greek and English capitals as maps letter them: no accents or breathings. */
const caps = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().normalize("NFC");

export interface Label {
  key: string; text: string; font: string; spacing: number; x: number; y: number; w: number; align: "left" | "center" | "right";
  style: "place" | "region" | "sea" | "river";
  sea: boolean;   // written on the sea: clay letters on the black, as on a vase
}

const labelFont = (look: Look, style: Label["style"], greek: boolean, small: boolean) => {
  const f = greek ? look.greek : look.body;
  if (style === "region") return { font: `${small ? 10.5 : 11}px ${look.label}`, spacing: small ? 2.2 : 2.8, size: 11 };
  if (style === "sea") return { font: `italic ${small ? 13 : 14}px ${f}`, spacing: 1, size: 14 };
  if (style === "river") return { font: `italic ${small ? 12 : 12.5}px ${f}`, spacing: 0.4, size: 12.5 };
  return { font: `${small ? 12.5 : 13}px ${f}`, spacing: 0, size: 13 };
};

const widths = new Map<string, number>();
function measure(g: CanvasRenderingContext2D, text: string, font: string, spacing: number) {
  const key = `${font}|${spacing}|${text}`;
  let w = widths.get(key);
  if (w === undefined) { g.font = font; w = g.measureText(text).width + spacing * Math.max(0, [...text].length - 1); widths.set(key, w); }
  return w;
}
/** forget measured widths (after the fonts arrive) */
export const clearWidths = () => widths.clear();

// ---------------------------------------------------------------- what fits

export interface Layout { dots: Pt[]; labels: Label[] }
export interface Box { x0: number; y0: number; x1: number; y1: number }

/**
 * Choose what to show: dots in order of how often the texts name them (a place seen a moment ago counts
 * a little more, so the picture does not flicker while zooming), each only where it does not touch one
 * already placed; then names beside them where there is room, inside the frame. How many depends on the
 * size of the map, so a phone is as calm as a big screen.
 */
export function layout(g: CanvasRenderingContext2D, pts: Pt[], v: View, w: number, h: number, o: {
  look: Look; greek: boolean; kinds: Set<string>; selected: string | null; saved: Record<string, number>; shown: Set<string>;
  avoid: Box[];                              // the buttons, compass and scale over the map
  onSea: (x: number, y: number) => boolean;  // is this point of the frame on the sea?
}): Layout {
  const small = w < 520;
  const area = w * h;
  const dotBudget = Math.max(24, Math.round(area / 3600));
  const labelBudget = Math.max(10, Math.round(area / 8000));
  const pad = 4;

  // a coarse grid of the boxes placed so far, so each test looks only nearby
  const CELL = 48, cols = Math.ceil(w / CELL) + 2, grid = new Map<number, Box[]>();
  const cells = (b: Box, f: (i: number) => boolean | void) => {
    for (let cy = Math.floor(b.y0 / CELL); cy <= Math.floor(b.y1 / CELL); cy++)
      for (let cx = Math.floor(b.x0 / CELL); cx <= Math.floor(b.x1 / CELL); cx++) if (f((cy + 1) * cols + cx + 1)) return true;
    return false;
  };
  const hits = (b: Box, skip?: Box) => cells(b, (i) => grid.get(i)?.some((o) => o !== skip && b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0));
  const add = (b: Box) => { cells(b, (i) => { const l = grid.get(i); if (l) l.push(b); else grid.set(i, [b]); }); };
  for (const b of o.avoid) add(b);

  const cand = pts.filter((t) => {
    if (!o.kinds.has(t.kind) && t.kind !== "other" && t.p.id !== o.selected) return false;
    const sx = t.x * v.k + v.tx, sy = t.y * v.k + v.ty;
    return sx > -60 && sy > -30 && sx < w + 60 && sy < h + 30;
  });
  const score = new Map<Pt, number>();
  for (const t of cand) score.set(t, (t.p.id === o.selected ? 1e9 : o.saved[t.p.id] ? 1e8 : 0) + t.p.n * (o.shown.has(t.p.id) ? 1.4 : 1));
  cand.sort((a, b) => score.get(b)! - score.get(a)!);

  // 1. dots (names written across the map have none)
  const dots: Pt[] = [], dotBox = new Map<string, Box>();
  for (const t of cand) {
    if (t.name) continue;
    if (dots.length >= dotBudget && t.p.id !== o.selected && !o.saved[t.p.id]) continue;
    // each dot keeps a little clear ground around it
    const sx = t.x * v.k + v.tx, sy = t.y * v.k + v.ty, r = t.r + 4;
    const b = { x0: sx - r, y0: sy - r, x1: sx + r, y1: sy + r };
    if (t.p.id !== o.selected && hits(b)) continue;
    add(b); dotBox.set(t.p.id, b); dots.push(t);
  }

  // 2. names: the selected place first, then by rank, trying right, left, above and below a dot
  const labels: Label[] = [];
  for (const t of cand) {
    if (labels.length >= labelBudget && t.p.id !== o.selected) break;
    const own = dotBox.get(t.p.id);
    if (!t.name && !own) continue;
    const style: Label["style"] = t.name ?? "place";
    const raw = o.greek ? t.p.grc : t.p.en.split("/")[0].replace(/ \(.*\)$/, "");
    const text = style === "region" ? caps(raw) : raw;
    const { font, spacing, size } = labelFont(o.look, style, o.greek, small);
    const tw = measure(g, text, font, spacing), th = size * 1.15;
    const sx = t.x * v.k + v.tx, sy = t.y * v.k + v.ty, r = t.r;
    const tries: [number, number, Label["align"]][] = t.name
      ? [[sx, sy + size * 0.35, "center"]]
      : [[sx + r + 4, sy + size * 0.35, "left"], [sx - r - 4, sy + size * 0.35, "right"], [sx, sy - r - 5, "center"], [sx, sy + r + size + 3, "center"]];
    for (const [x, y, align] of tries) {
      const x0 = align === "left" ? x : align === "right" ? x - tw : x - tw / 2;
      const b = { x0: x0 - 2, y0: y - size * 0.95, x1: x0 + tw + 2, y1: y - size * 0.95 + th };
      if (b.x0 < pad || b.x1 > w - pad || b.y0 < pad || b.y1 > h - pad) continue;   // never cut off at the frame
      // the chosen place is named first, and may cover a neighbour's dot
      if (t.p.id !== o.selected && hits(b, own)) continue;
      add(b);
      // on the sea if most of the name is (its two ends and middle, halfway up the letters)
      const my = y - size * 0.35, sea = +o.onSea(x0, my) + +o.onSea(x0 + tw / 2, my) + +o.onSea(x0 + tw, my) >= 2;
      labels.push({ key: t.p.id, text, font, spacing, x, y, w: tw, align, style, sea });
      break;
    }
  }
  return { dots, labels };
}

// ---------------------------------------------------------------- painting

function text(g: CanvasRenderingContext2D, l: Label, fill: string, halo: string, haloW: number) {
  g.font = l.font;
  g.lineJoin = "round";
  g.lineWidth = haloW;
  g.strokeStyle = halo;
  g.fillStyle = fill;
  if (!l.spacing) {
    g.textAlign = l.align;
    if (haloW) g.strokeText(l.text, l.x, l.y);
    g.fillText(l.text, l.x, l.y);
    return;
  }
  // letter by letter, for spaced capitals (canvas letter-spacing is not everywhere yet)
  g.textAlign = "left";
  let x = l.align === "left" ? l.x : l.align === "right" ? l.x - l.w : l.x - l.w / 2;
  for (const ch of l.text) {
    if (haloW) g.strokeText(ch, x, l.y);
    g.fillText(ch, x, l.y);
    x += measure(g, ch, l.font, 0) + l.spacing;
  }
}

export interface Frame {
  g: CanvasRenderingContext2D; dpr: number; w: number; h: number; v: View; look: Look; lod: Lod; waves: CanvasPattern | null;
  dots: { t: Pt; a: number }[]; labels: { l: Label; a: number; t: Pt }[]; selected: string | null; hover: string | null; saved: Record<string, number>;
}

export function paint(f: Frame) {
  const { g, dpr, w, h, v, look } = f;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.globalAlpha = 1;
  g.fillStyle = look.land;
  g.fillRect(0, 0, w, h);

  // the sea with its waves (a steady size on screen, in one pass), lakes, and the coast where it shows
  g.setTransform(dpr * v.k, 0, 0, dpr * v.k, dpr * v.tx, dpr * v.ty);
  if (f.waves) f.waves.setTransform(new DOMMatrix([1 / (dpr * v.k), 0, 0, 1 / (dpr * v.k), 0, 0]));
  g.fillStyle = f.waves ?? look.sea;
  g.fill(f.lod.sea, "evenodd");
  g.fillStyle = look.sea;
  g.globalAlpha = 0.9;
  g.fill(f.lod.lakes, "evenodd");
  if (look.coast !== look.sea) {   // by day the coast is the sea's own black: nothing to draw
    g.globalAlpha = 0.55;
    g.strokeStyle = look.coast;
    g.lineWidth = 0.8 / v.k;
    g.lineJoin = "round";
    g.stroke(f.lod.sea);
  }
  g.globalAlpha = 1;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.textBaseline = "alphabetic";

  // names across the land and sea go under the dots
  for (const { l, a } of f.labels) {
    if (l.style === "place") continue;
    g.globalAlpha = a * (l.style === "region" ? 0.78 : 0.95);
    if (l.sea) text(g, l, look.seaName, look.sea, 3);
    else if (l.style === "region") text(g, l, look.ink2, look.halo, 3);
    else text(g, l, look.name, look.halo, 3);
  }

  // dots: filled red where checked by hand, hollow where matched automatically
  for (const { t, a } of f.dots) {
    const sx = t.x * v.k + v.tx, sy = t.y * v.k + v.ty;
    const grow = f.hover === t.p.id ? 1.5 : 0;
    g.globalAlpha = a;
    g.beginPath();
    g.arc(sx, sy, (t.r + grow) * (0.55 + 0.45 * a), 0, Math.PI * 2);
    g.fillStyle = t.p.checked ? look.accent : look.halo;
    g.fill();
    g.lineWidth = f.saved[t.p.id] ? 2.4 : 1.4;
    g.strokeStyle = f.saved[t.p.id] ? look.ink : t.p.checked ? look.halo : look.accent;
    g.stroke();
  }

  // place names on top
  for (const { l, a, t } of f.labels) {
    if (l.style !== "place") continue;
    g.globalAlpha = a;
    const sel = t.p.id === f.selected || t.p.id === f.hover;
    const font = l.font;
    if (sel) l.font = `bold ${l.font}`;
    if (l.sea) text(g, l, sel ? look.accentOnSea : look.seaName, look.sea, 3);
    else text(g, l, sel ? look.accent : look.name, look.halo, 3.5);
    l.font = font;
  }
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- moving between views

/**
 * A smooth zoom-and-pan from one view to another (van Wijk and Nuij, "Smooth and efficient zooming and
 * panning", 2003, as d3 does it): a long way is travelled by zooming out, across and back in.
 * Views are [centre x, centre y, width of the world shown]; returns the path and a fitting duration.
 */
export function zoomPath(a: [number, number, number], b: [number, number, number], rho = 1.35) {
  const [ux0, uy0, w0] = a, [ux1, uy1, w1] = b, dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy;
  const rho2 = rho * rho, rho4 = rho2 * rho2;
  if (d2 < 1e-9) {
    const S = Math.log(w1 / w0) / rho;
    return { S: Math.abs(S), at: (t: number): [number, number, number] => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)] };
  }
  const d1 = Math.sqrt(d2);
  const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  return {
    S: Math.abs(S),
    at: (t: number): [number, number, number] => {
      const s = t * S, c0 = Math.cosh(r0), u = (w0 / (rho2 * d1)) * (c0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
      return [ux0 + u * dx, uy0 + u * dy, (w0 * c0) / Math.cosh(rho * s + r0)];
    },
  };
}
