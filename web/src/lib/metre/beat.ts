/**
 * Playing a line's rhythm: a long syllable lasts two beats, a short one one beat (the ancient
 * rule of thumb), with a soft tone for each syllable and a stronger one where each foot begins.
 * It sounds the rhythm only, not the words: there is no recording of the line.
 */
export interface Beat { i: number; q: "L" | "S" | "X"; strong: boolean }

let ctx: AudioContext | null = null;
let stopCurrent: (() => void) | null = null;

/** Play the beats; onStep(i) is called as each syllable sounds, onStep(-1) at the end. Returns a stop function. */
export function playBeats(beats: Beat[], onStep: (i: number) => void, shortMs = 190): () => void {
  stopCurrent?.();
  const AC = (globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext });
  const Ctor = AC.AudioContext ?? AC.webkitAudioContext;
  if (Ctor) ctx ??= new Ctor();
  const timers: ReturnType<typeof setTimeout>[] = [];
  let t = 0;
  const start = ctx ? ctx.currentTime + 0.05 : 0;
  for (const b of beats) {
    const dur = (b.q === "S" ? 1 : 2) * shortMs;
    if (ctx) tone(ctx, start + t / 1000, dur / 1000, b.strong);
    const at = t;
    timers.push(setTimeout(() => onStep(b.i), at + 50));
    t += dur;
  }
  timers.push(setTimeout(() => onStep(-1), t + 80));
  const stop = () => { timers.forEach(clearTimeout); onStep(-1); if (stopCurrent === stop) stopCurrent = null; };
  stopCurrent = stop;
  return stop;
}

/** Play the rhythm of a scanned verse line in the page, lighting each syllable ([data-i]) as it sounds. */
export function playLine(line: HTMLElement, cls: { playing: string; now: string }): () => void {
  const syls = [...line.querySelectorAll<HTMLElement>("[data-i]")];
  const seen = new Set<number>();
  const beats: Beat[] = [];
  for (const s of syls) {
    const i = Number(s.dataset.i);
    if (seen.has(i)) continue;
    seen.add(i);
    beats.push({ i, q: s.dataset.q as Beat["q"], strong: i === 0 || s.dataset.f === "1" });
  }
  line.classList.add(cls.playing);
  return playBeats(beats, (i) => {
    syls.forEach((s) => s.classList.toggle(cls.now, Number(s.dataset.i) === i));
    if (i < 0) line.classList.remove(cls.playing);
  });
}

function tone(c: AudioContext, at: number, dur: number, strong: boolean) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = "triangle";
  o.frequency.value = strong ? 330 : 247;
  const peak = strong ? 0.22 : 0.12;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(peak, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0008, at + Math.min(dur * 0.85, 0.5));
  o.connect(g).connect(c.destination);
  o.start(at); o.stop(at + dur);
}
