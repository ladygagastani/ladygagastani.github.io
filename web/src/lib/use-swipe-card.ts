import { useEffect, useRef } from "react";
import { prefersReducedMotion, useSettings } from "./settings";

export type SwipeDir = "left" | "right" | "up";

/**
 * A card that follows the finger (or mouse) and is thrown off the screen to answer: right, left or up.
 * While it is dragged, the element gets `data-lean` (the answer it would give if let go now) and the
 * CSS variable `--lean` (0 to 1, how sure), for the CSS to show a label. Let go past the mark, or with
 * a flick, and it flies off that way before `onSwipe` runs; otherwise it springs back.
 * Only while `enabled()` is true (e.g. once a flashcard shows its answer).
 */
export function useSwipeCard(opts: { el: () => HTMLElement | null; enabled: () => boolean; onSwipe: (dir: SwipeDir) => void }) {
  const o = useRef(opts);
  useEffect(() => { o.current = opts; });
  const g = useRef<{ id: number; x: number; y: number; t: number; on: boolean; dx: number; dy: number } | null>(null);
  const MARK = 110;

  const lean = (dx: number, dy: number): SwipeDir | null =>
    dy < -40 && -dy > Math.abs(dx) ? "up" : dx > 40 ? "right" : dx < -40 ? "left" : null;

  const place = (el: HTMLElement, dx: number, dy: number) => {
    el.style.transform = `translate(${dx}px, ${Math.min(dy, 40)}px) rotate(${dx * 0.05}deg)`;
    const l = lean(dx, dy);
    if (l) el.dataset.lean = l; else delete el.dataset.lean;
    el.style.setProperty("--lean", String(Math.min(1, Math.max(Math.abs(dx), -dy) / MARK)));
  };
  const reset = (el: HTMLElement, animate: boolean) => {
    el.style.transition = animate ? "transform 0.3s var(--ease)" : "";
    el.style.transform = "";
    delete el.dataset.lean;
    el.style.removeProperty("--lean");
    if (animate) setTimeout(() => { el.style.transition = ""; }, 320);
  };

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0 || !o.current.enabled()) return;
      g.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, on: false, dx: 0, dy: 0 };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = g.current, el = o.current.el();
      if (!s || !el || s.id !== e.pointerId) return;
      s.dx = e.clientX - s.x; s.dy = e.clientY - s.y;
      if (!s.on) {
        if (Math.hypot(s.dx, s.dy) < 10) return;
        s.on = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        el.style.transition = "none";
      }
      place(el, s.dx, s.dy);
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = g.current, el = o.current.el();
      g.current = null;
      if (!s || !el || !s.on || s.id !== e.pointerId) return;
      const ms = Math.max(1, e.timeStamp - s.t), fast = Math.hypot(s.dx, s.dy) / ms > 0.8 && Math.hypot(s.dx, s.dy) > 50;
      const dir = Math.abs(s.dx) > MARK || -s.dy > MARK || fast ? lean(s.dx * 3, s.dy * 3) : null;
      if (!dir) { reset(el, true); return; }
      if (prefersReducedMotion(useSettings.getState().motion)) { reset(el, false); o.current.onSwipe(dir); return; }
      // off the screen the way it was thrown, then the answer (the next card takes its place)
      el.style.transition = "transform 0.28s ease-in, opacity 0.28s";
      el.style.transform = dir === "up" ? `translate(${s.dx}px, -120vh)` : `translate(${dir === "right" ? "" : "-"}130vw, ${s.dy}px) rotate(${dir === "right" ? 24 : -24}deg)`;
      el.style.opacity = "0";
      setTimeout(() => {
        o.current.onSwipe(dir);
        // once the next card is drawn in its place, bring the element back to the middle
        requestAnimationFrame(() => { el.style.opacity = ""; reset(el, false); });
      }, 280);
    },
    onPointerCancel: () => { const el = o.current.el(); g.current = null; if (el) reset(el, true); },
  };
}
