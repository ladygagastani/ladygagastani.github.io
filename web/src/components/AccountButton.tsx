"use client";
/**
 * The account link in the header: "Sign in", or the member's name once signed in. It contacts
 * Supabase only when this browser already holds a session; otherwise it is a plain link.
 */
import Link from "next/link";
import { useEffect } from "react";
import { hasSavedSession, useAccount } from "@/lib/community/client";
import styles from "./Header.module.css";

export default function AccountButton() {
  const start = useAccount((s) => s.start);
  const name = useAccount((s) => s.profile?.display_name ?? null);
  useEffect(() => { if (hasSavedSession()) start(); }, [start]);
  return (
    <Link className={styles.tbtn} href="/account" transitionTypes={["page-turn"]} aria-label={name ? `Your account: ${name}` : "Sign in or join"} title={name ?? "Sign in or join"}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
      <span className={styles.txt}>{name ?? "Sign in"}</span>
    </Link>
  );
}
