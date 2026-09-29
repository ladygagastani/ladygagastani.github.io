"use client";
/**
 * "Report a bug": opens the Town Hall's bug form with the page you were on already filled in
 * (and, from the error page, the message it showed).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const bugHref = (page?: string, err?: string) =>
  `/town-hall/new?c=bugs${page ? `&page=${encodeURIComponent(page)}` : ""}${err ? `&err=${encodeURIComponent(err.slice(0, 500))}` : ""}`;

export default function ReportBugLink({ className, err, children = "Report a bug" }: { className?: string; err?: string; children?: ReactNode }) {
  const router = useRouter();
  return (
    <Link href={bugHref()} className={className} onClick={(e) => {
      // the page is read when clicked, so it is the one you are on now
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      router.push(bugHref(location.pathname + location.search, err));
    }}>{children}</Link>
  );
}
