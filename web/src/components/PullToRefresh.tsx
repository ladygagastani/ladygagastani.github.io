"use client";
/**
 * Pull down to refresh, on touch screens (the Town Hall and a thread): at the top of the page, a pull
 * brings down a ring; let go past the mark and `onPull` runs, and the ring spins until `busy` is false.
 * The browser's own pull-to-refresh (which reloads the whole page) is switched off while this is on the
 * page. Nothing changes for a mouse or a keyboard: the pages have their own ways to load more.
 */
import { useEffect, useRef, useState } from "react";

const MARK = 64;

export default function PullToRefresh({ onPull, busy }: { onPull: () => void; busy: boolean }) {
  const [pull, setPull] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const cb = useRef(onPull);
  useEffect(() => { cb.current = onPull; });

  // the ring stays a moment after the new posts arrive, so a quick answer does not flicker
  useEffect(() => {
    if (!waiting || busy) return;
    const t = setTimeout(() => setWaiting(false), 350);
    return () => clearTimeout(t);
  }, [busy, waiting]);

  useEffect(() => {
    if (!matchMedia("(pointer: coarse)").matches) return;
    const root = document.documentElement, before = root.style.overscrollBehaviorY;
    root.style.overscrollBehaviorY = "contain";
    let y0 = -1, d = 0;
    const start = (e: TouchEvent) => { y0 = scrollY <= 0 && e.touches.length === 1 ? e.touches[0].clientY : -1; d = 0; };
    const move = (e: TouchEvent) => {
      if (y0 < 0 || e.touches.length !== 1) return;
      const dy = e.touches[0].clientY - y0;
      if (dy <= 0 || scrollY > 0) { if (d) { d = 0; setPull(0); } if (scrollY > 0) y0 = -1; return; }
      e.preventDefault();                  // the page itself stays put while the ring comes down
      d = Math.min(MARK * 1.8, dy * 0.5);  // it gets heavier the further it goes
      setPull(d);
    };
    const end = () => {
      if (y0 < 0) return;
      y0 = -1;
      if (d >= MARK) { setWaiting(true); cb.current(); }
      d = 0;
      setPull(0);
    };
    addEventListener("touchstart", start, { passive: true });
    addEventListener("touchmove", move, { passive: false });
    addEventListener("touchend", end);
    addEventListener("touchcancel", end);
    return () => {
      root.style.overscrollBehaviorY = before;
      removeEventListener("touchstart", start); removeEventListener("touchmove", move);
      removeEventListener("touchend", end); removeEventListener("touchcancel", end);
    };
  }, []);

  const shown = waiting ? MARK : pull;
  return (
    <div className="pull" data-waiting={waiting || undefined} data-ready={pull >= MARK || undefined} aria-hidden={!waiting}
      style={{ "--pull": `${shown}px`, "--turn": `${Math.min(1, pull / MARK)}` } as React.CSSProperties}>
      <span className="pull-ring" />
      <span className="visually-hidden" role="status">{waiting ? "Refreshing…" : ""}</span>
    </div>
  );
}
