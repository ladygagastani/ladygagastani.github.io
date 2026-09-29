"use client";
/**
 * A "back to top" button for long pages (the reader and the wiki's entries). It appears once you have scrolled
 * a screen or so down, and takes you to the top; keyboard focus goes back to the top of the page too.
 * On the page it is fixed at the bottom right, above the phone's bars. In a reader pane that scrolls inside its
 * own box (side by side, or the floating window) it sits in that pane instead and scrolls the pane.
 * `page={false}` shows nothing when the pane does not scroll by itself (a second book on a phone), so the page
 * never gets two buttons.
 */
import { useEffect, useState, type RefObject } from "react";
import styles from "./BackToTop.module.css";

const SHOW_AFTER = 700;   // px scrolled before it appears

/** The pane's own scroller, when it really scrolls (on phones a side-by-side pane grows and the page scrolls instead). */
const scrolls = (el: HTMLElement | null | undefined): el is HTMLElement => !!el && el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflowY !== "visible";

export default function BackToTop({ paneRef, page = true }: { paneRef?: RefObject<HTMLElement | null>; page?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = paneRef?.current;
      setShow((scrolls(el) ? el.scrollTop : window.scrollY) > SHOW_AFTER);
    };
    const el = paneRef?.current;
    window.addEventListener("scroll", check, { passive: true });
    el?.addEventListener("scroll", check, { passive: true });
    check();   // a page can open already scrolled (Back, or a link to a passage)
    return () => { window.removeEventListener("scroll", check); el?.removeEventListener("scroll", check); };
  }, [paneRef]);

  if (!show) return null;
  const inPane = !!paneRef && scrolls(paneRef.current);
  if (!inPane && !page) return null;
  const up = () => {
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const el = paneRef?.current;
    if (scrolls(el)) el.scrollTo({ top: 0, behavior }); else window.scrollTo({ top: 0, behavior });
    // the next Tab starts from the top of the page, not from where you were
    if (!inPane) document.getElementById("main")?.focus({ preventScroll: true });
  };
  const button = (
    <button type="button" className={styles.btt} onClick={up} aria-label="Back to top" title="Back to top">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6" /></svg>
      <span>Top</span>
    </button>
  );
  return inPane ? <div className={styles.inPane}>{button}</div> : button;
}
