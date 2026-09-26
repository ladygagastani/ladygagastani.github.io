/**
 * Draws a shareable image of a passage: Greek (with chosen words highlighted), the translation
 * beneath it when there is one, the citation and a small site credit, in the pottery theme.
 */
export interface ImageInput {
  words: { t: string; hl: boolean }[];   // Greek words in order
  translation: string | null;
  cite: string;
  dark: boolean;
}

const THEMES = {
  light: { bg: "#E6C39B", panel: "#F3E3CC", ink: "#1B1410", ink2: "#5A3E2B", accent: "#A33A16", band: "#1B1410" },
  dark: { bg: "#16110E", panel: "#241A14", ink: "#EDCBA0", ink2: "#BE9876", accent: "#E0673A", band: "#C8703A" },
};

const fontVar = (name: string, fallback: string) =>
  `${getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback}, serif`;

function wrap(ctx: CanvasRenderingContext2D, words: string[], max: number): number[][] {
  const lines: number[][] = [[]];
  let width = 0;
  const space = ctx.measureText(" ").width;
  words.forEach((w, i) => {
    const ww = ctx.measureText(w).width;
    if (lines[lines.length - 1].length && width + space + ww > max) { lines.push([]); width = 0; }
    width += (lines[lines.length - 1].length ? space : 0) + ww;
    lines[lines.length - 1].push(i);
  });
  return lines;
}

function meander(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, s: number, colour: string) {
  ctx.strokeStyle = colour; ctx.lineWidth = s / 10; ctx.lineCap = "square";
  const u = s / 20;
  for (let cx = x; cx + s <= x + w + 0.5; cx += s) {
    ctx.beginPath();
    ctx.moveTo(cx, y + u); ctx.lineTo(cx + s, y + u); ctx.moveTo(cx, y + 19 * u); ctx.lineTo(cx + s, y + 19 * u);
    ctx.moveTo(cx + 3 * u, y + 19 * u); ctx.lineTo(cx + 3 * u, y + 4 * u); ctx.lineTo(cx + 16 * u, y + 4 * u); ctx.lineTo(cx + 16 * u, y + 16 * u);
    ctx.lineTo(cx + 7 * u, y + 16 * u); ctx.lineTo(cx + 7 * u, y + 8 * u); ctx.lineTo(cx + 12 * u, y + 8 * u); ctx.lineTo(cx + 12 * u, y + 12 * u);
    ctx.stroke();
  }
}

export async function renderPassageImage(input: ImageInput): Promise<HTMLCanvasElement> {
  const t = input.dark ? THEMES.dark : THEMES.light;
  const greekFont = fontVar("--font-didot", '"GFS Didot"');
  const bodyFont = fontVar("--font-alegreya", "Alegreya");
  await Promise.all([document.fonts.load(`44px ${greekFont}`, "Ααω"), document.fonts.load(`italic 26px ${bodyFont}`), document.fonts.load(`600 22px ${bodyFont}`)]).catch(() => undefined);

  const W = 1200, PAD = 84, INNER = W - PAD * 2, BAND = 24;
  const scratch = document.createElement("canvas").getContext("2d")!;
  scratch.font = `44px ${greekFont}`;
  const gLines = wrap(scratch, input.words.map((w) => w.t), INNER);
  scratch.font = `italic 26px ${bodyFont}`;
  const trWords = input.translation ? input.translation.split(/\s+/) : [];
  const tLines = trWords.length ? wrap(scratch, trWords, INNER) : [];
  const H = PAD + BAND + 56 + gLines.length * 66 + (tLines.length ? 36 + tLines.length * 40 : 0) + 70 + BAND + PAD;

  const canvas = document.createElement("canvas");
  const dpr = 2;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = t.panel; ctx.fillRect(PAD / 2, PAD / 2, W - PAD, H - PAD);
  meander(ctx, PAD, PAD / 2 + 18, INNER, BAND, t.band);
  meander(ctx, PAD, H - PAD / 2 - 18 - BAND, INNER, BAND, t.band);

  let y = PAD + BAND + 70;
  ctx.textBaseline = "alphabetic";
  ctx.font = `44px ${greekFont}`;
  const space = ctx.measureText(" ").width;
  for (const line of gLines) {
    let x = PAD;
    for (const i of line) {
      const w = input.words[i];
      const ww = ctx.measureText(w.t).width;
      ctx.fillStyle = w.hl ? t.accent : t.ink;
      ctx.fillText(w.t, x, y);
      if (w.hl) { ctx.fillRect(x, y + 8, ww, 3); }
      x += ww + space;
    }
    y += 66;
  }
  if (tLines.length) {
    y += 20;
    ctx.font = `italic 26px ${bodyFont}`;
    ctx.fillStyle = t.ink2;
    for (const line of tLines) { ctx.fillText(line.map((i) => trWords[i]).join(" "), PAD, y); y += 40; }
  }
  y += 34;
  ctx.font = `600 22px ${bodyFont}`;
  ctx.fillStyle = t.accent;
  ctx.fillText(input.cite, PAD, y);
  ctx.font = `20px ${greekFont}`;
  ctx.fillStyle = t.ink2;
  const credit = "Μάθησις Στοιχείων";
  ctx.fillText(credit, W - PAD - ctx.measureText(credit).width, y);
  return canvas;
}
