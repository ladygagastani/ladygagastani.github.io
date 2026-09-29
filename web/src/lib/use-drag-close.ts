import { useEffect, useRef } from "react";

/**
 * A sheet or drawer that follows a finger and goes away when let go far enough: down for a sheet
 * at the bottom of the screen ("down"), left for a drawer at the left edge ("left").
 *
 * Spread the returned handlers on the parts that can be dragged (a handle, a title row). While it is
 * dragged, the element gets `draggingClass` (to switch its transition off) and the CSS variable
 * `--drag` (how far, in px, as a negative number for "left"); the CSS moves it by that. A tap that
 * does not move stays a tap. When let go short of the mark it springs back (`--drag` goes to 0);
 * past it, `onClose` runs and `--drag` is left where the finger was, so it slides on from there.
 * Call `reset()` before showing it again.
 */
export function useDragToClose(opts: {
  el: () => HTMLElement | null;
  onClose: () => void;
  direction: "down" | "left";
  draggingClass: string;
  /** Only where this is true (e.g. phones); default always. */
  when?: () => boolean;
}) {
  const g = useRef<{ id: number; x: number; y: number; d: number; on: boolean } | null>(null);
  const o = useRef(opts);
  useEffect(() => { o.current = opts; });

  const end = (e: React.PointerEvent, mayClose: boolean) => {
    const s = g.current, el = o.current.el();
    if (!s || s.id !== e.pointerId) return;
    g.current = null;
    if (!s.on || !el) return;
    el.classList.remove(o.current.draggingClass);
    const size = o.current.direction === "down" ? el.offsetHeight : el.offsetWidth;
    if (mayClose && s.d > Math.min(120, size * 0.25)) o.current.onClose();
    else el.style.setProperty("--drag", "0px");
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0 || (o.current.when && !o.current.when())) return;
      g.current = { id: e.pointerId, x: e.clientX, y: e.clientY, d: 0, on: false };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = g.current, el = o.current.el();
      if (!s || !el || s.id !== e.pointerId) return;
      const down = o.current.direction === "down";
      const along = down ? e.clientY - s.y : s.x - e.clientX;
      const across = down ? e.clientX - s.x : e.clientY - s.y;
      if (!s.on) {
        if (Math.abs(across) > 12 && Math.abs(across) > Math.abs(along)) { g.current = null; return; }  // a scroll the other way
        if (along < 8) return;
        s.on = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        el.classList.add(o.current.draggingClass);
      }
      s.d = Math.max(0, along);
      el.style.setProperty("--drag", `${down ? s.d : -s.d}px`);
    },
    onPointerUp: (e: React.PointerEvent) => end(e, true),
    onPointerCancel: (e: React.PointerEvent) => end(e, false),
  };

  const reset = () => o.current.el()?.style.removeProperty("--drag");
  return { handlers, reset };
}
