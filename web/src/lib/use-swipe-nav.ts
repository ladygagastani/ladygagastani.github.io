import { useEffect, useRef } from "react";

/**
 * A sideways swipe with a finger over an area moves to the next (1) or previous (-1) of something:
 * a tab, a list. Touch events, not pointer events: a browser cancels the pointer as soon as a swipe
 * looks like a scroll. Swipes that start in a text field, near the screen's edges (the phone's own
 * "back" gesture) or inside [data-noswipe] are left alone, as are mostly-vertical ones (scrolling).
 */
export function useSwipeNav(onSwipe: (dir: 1 | -1) => void) {
  const cb = useRef(onSwipe);
  useEffect(() => { cb.current = onSwipe; });
  const s = useRef<{ x: number; y: number; t: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0], el = e.target as Element;
      s.current = e.touches.length !== 1 || t.clientX < 24 || t.clientX > innerWidth - 24
        || el.closest("input, textarea, select, [contenteditable], [data-noswipe]") ? null : { x: t.clientX, y: t.clientY, t: e.timeStamp };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const a = s.current, t = e.changedTouches[0];
      s.current = null;
      if (!a || !t || e.timeStamp - a.t > 800) return;
      const dx = t.clientX - a.x, dy = t.clientY - a.y;
      if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) cb.current(dx < 0 ? 1 : -1);
    },
    onTouchCancel: () => { s.current = null; },
  };
}
