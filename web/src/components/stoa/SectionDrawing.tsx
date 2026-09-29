/**
 * The Kerameikos' opening picture: a section drawing, the way excavators draw the side of a trench,
 * layer by layer, each deposit with its own hatching. It is an illustration, not a real site. The
 * outlines draw themselves on arrival (visible at rest, so reduced motion shows the finished drawing),
 * and each numbered layer links to its part of the page.
 */
import type { Layer } from "@/wiki/kerameikos";
import styles from "./Kerameikos.module.css";

const W = 1000;
// the boundaries between deposits, from the surface down (y at x = 0, 125 … 1000)
const B = [
  [42, 38, 44, 40, 36, 42, 46, 40, 42],
  [96, 92, 100, 104, 98, 94, 100, 96, 92],
  [168, 174, 166, 160, 170, 176, 168, 162, 170],
  [246, 240, 252, 258, 248, 242, 250, 256, 248],
  [318, 324, 316, 310, 320, 326, 314, 320, 322],
];
const BOTTOM = 372;

/** a smooth line through evenly spaced points (Catmull-Rom as cubic Béziers) */
function smooth(ys: number[], reverse = false): string {
  const pts = ys.map((y, i) => [(i * W) / (ys.length - 1), y] as const);
  const p = reverse ? [...pts].reverse() : pts;
  let d = `${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[Math.max(0, i - 1)], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[Math.min(p.length - 1, i + 2)];
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6} ${x2} ${y2}`;
  }
  return d;
}
const band = (i: number) => (i < B.length - 1 ? `M ${smooth(B[i])} L ${smooth(B[i + 1], true)} Z` : `M ${smooth(B[i])} L ${W} ${BOTTOM} L 0 ${BOTTOM} Z`);
const mid = (i: number, x: number) => {
  const k = Math.round((x / W) * 8);
  return i < B.length - 1 ? (B[i][k] + B[i + 1][k]) / 2 : (B[i][k] + BOTTOM) / 2;
};

// a looters' pit, cut from the surface down into the wall layer
const PIT = "M 628 41 C 634 110, 650 196, 690 214 C 722 226, 752 196, 760 132 C 764 96, 768 60, 772 42";
// the wall: three courses of stones
const STONES = [
  [170, 222, 46, 24], [218, 224, 52, 22], [272, 221, 44, 25], [318, 225, 40, 21],
  [184, 199, 50, 22], [236, 197, 48, 24], [286, 200, 46, 21],
  [206, 176, 44, 21], [252, 175, 50, 22],
];
// sherds in the clay layer
const SHERDS = [[88, 128], [140, 146], [388, 120], [452, 150], [530, 128], [600, 142], [820, 118], [880, 150], [940, 126], [300, 138]];

export default function SectionDrawing({ layers }: { layers: Layer[] }) {
  const labelX = 944;
  return (
    <figure className={styles.drawing}>
      <svg viewBox={`-20 0 ${W + 40} ${BOTTOM + 34}`} role="group" aria-labelledby="kd-cap">
        <defs>
          <pattern id="kd-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="0.9" /><circle cx="6.5" cy="7" r="0.7" /></pattern>
          <pattern id="kd-dash" width="14" height="8" patternUnits="userSpaceOnUse"><path d="M1 2h5M8 6h5" /></pattern>
          <pattern id="kd-pebble" width="18" height="14" patternUnits="userSpaceOnUse"><ellipse cx="4" cy="4" rx="2.4" ry="1.6" /><ellipse cx="13" cy="10" rx="1.8" ry="1.3" /></pattern>
          <pattern id="kd-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v8" /></pattern>
          <pattern id="kd-cross" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0v10M0 0h10" /></pattern>
          <pattern id="kd-loose" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M2 3l3 2M8 9l2-3M6 1l1 2" /></pattern>
        </defs>

        {/* the deposits, each with its hatching, then their outlines drawn on */}
        {["dots", "dash", "pebble", "hatch", "cross"].map((p, i) => (
          <path key={p} d={band(i)} className={`${styles.fill} ${styles[`f${i}`]}`} style={{ "--i": i } as React.CSSProperties} fill={`url(#kd-${p})`} />
        ))}
        <path d={`M ${smooth(B[0])} L ${W} ${BOTTOM} L 0 ${BOTTOM} Z`} className={styles.frame} pathLength={1} />
        {B.map((ys, i) => <path key={i} d={`M ${smooth(ys)}`} className={styles.line} pathLength={1} style={{ "--i": i } as React.CSSProperties} />)}

        {/* the wall */}
        <g className={styles.objects} style={{ "--i": 5 } as React.CSSProperties}>
          {STONES.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={8} className={styles.stone} />)}
        </g>
        {/* the grave: its cut, and a storage jar laid on its side */}
        <g className={styles.objects} style={{ "--i": 6 } as React.CSSProperties}>
          <path d="M 418 252 C 420 280, 424 304, 430 312 L 560 312 C 566 300, 570 280, 572 256" className={styles.cut} />
          {/* a transport amphora on its side: pointed foot at the left, neck and mouth at the right */}
          <path d="M 446 287 L 458 285 C 466 270, 496 263, 522 268 C 534 270, 542 275, 546 280 L 560 281 L 560 293 L 546 294 C 542 299, 534 304, 522 306 C 496 311, 466 304, 458 289 Z" className={styles.pot} />
          <path d="M 546 280 C 548 268, 534 264, 530 270 M 546 294 C 548 306, 534 310, 530 304 M 560 279 L 560 295" className={styles.pot} />
        </g>
        {/* sherds */}
        <g className={styles.objects} style={{ "--i": 4 } as React.CSSProperties}>
          {SHERDS.map(([x, y], i) => <path key={i} d={`M ${x} ${y} q 7 -6 15 -2 l -2 4 q -6 -3 -11 2 z`} className={styles.sherd} transform={`rotate(${(i * 47) % 60 - 30} ${x} ${y})`} />)}
        </g>
        {/* the looters' pit cuts through everything above the grave */}
        <path d={`${PIT} Z`} className={styles.pitBg} />
        <path d={`${PIT} Z`} className={styles.pitFill} fill="url(#kd-loose)" />
        <path d={PIT} className={styles.pit} pathLength={1} />
        <text x={700} y={70} className={styles.note} textAnchor="middle">looters&apos; pit</text>

        {/* datum line and scale */}
        <path d={`M -10 18 H ${W + 10}`} className={styles.datum} />
        <path d="M 20 10 l 6 8 l 6 -8 z" className={styles.datumMark} />
        <text x={40} y={14} className={styles.note}>datum</text>
        <g className={styles.scale} transform={`translate(0 ${BOTTOM + 16})`}>
          <path d="M 0 0 H 100 M 0 -5 V 5 M 50 -3 V 3 M 100 -5 V 5" />
          <text x={108} y={4} className={styles.note}>1 m</text>
        </g>

        {/* the layers' numbers, as on a real drawing; each links to its part of the page. On a phone they sit
            closer than a finger's width, so the list under the drawing offers the same links as full rows
            (data-tap-equivalent tells scripts/phone-audit.mjs so) */}
        {layers.map((l, i) => (
          <a key={l.id} href={`#${l.id}`} className={styles.ctx} aria-label={`Layer ${i + 1}: ${l.title}`} data-tap-equivalent="">
            {/* a wider circle, unseen, so a finger can find the number on a small screen */}
            <circle cx={labelX} cy={mid(i, labelX)} r={36} className={styles.ctxHit} />
            <circle cx={labelX} cy={mid(i, labelX)} r={15} />
            <text x={labelX} y={mid(i, labelX) + 5} textAnchor="middle">{i + 1}</text>
          </a>
        ))}
      </svg>
      <figcaption id="kd-cap">
        <b>A section drawing.</b> Excavators draw the side of every trench like this, layer by layer, before the next layer is dug away. The deepest layers are usually the oldest, unless something, like the looters&apos; pit here, has cut through them. (An illustration, not a real site.)
      </figcaption>
      <ol className={styles.legend}>
        {layers.map((l, i) => (
          <li key={l.id}><a href={`#${l.id}`}><span className={styles.num}>{i + 1}</span> <b>{l.title}</b> <small>{l.deposit}</small></a></li>
        ))}
        <li aria-hidden="true"><span className={`${styles.num} ${styles.natural}`}>·</span> <small>the natural subsoil: nothing human below</small></li>
      </ol>
    </figure>
  );
}
