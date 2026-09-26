"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds a gentle lift-in to `.rv` elements as they scroll into view.
 * Content is fully visible without it; this only adds motion, and never for reduced motion.
 */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    const reduce = html.dataset.motion === "reduce" ||
      (html.dataset.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    document.querySelectorAll(".rv:not(.in)").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
