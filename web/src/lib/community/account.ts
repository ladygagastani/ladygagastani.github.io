"use client";
/**
 * Who is signed in, without loading the Supabase library: the header's account button is on every
 * page, and supabase-js (about 60 KB) is fetched only when someone is signed in or opens a community
 * page (lib/community/client.ts, which re-exports all of this).
 *
 * Privacy: the site contacts Supabase only on the community pages and the account page, or when
 * someone is already signed in (a saved session in this browser). Reading, study and the wiki never
 * do. `hasSavedSession()` checks for a session without contacting anyone.
 */
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { SUPABASE_URL } from "@/config/supabase";

export const STORAGE_KEY = `sb-${new URL(SUPABASE_URL).hostname.split(".")[0]}-auth-token`;

/** When this browser's Treasury last kept in step with the account (lib/community/sync.ts). */
export const LAST_SYNCED = "mathesis:synced";
export const lastSynced = (): string | null => { try { return localStorage.getItem(LAST_SYNCED); } catch { return null; } };

export function hasSavedSession(): boolean {
  try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
}

export interface Profile {
  id: string; display_name: string; bio: string; role: "member" | "moderator";
  banned_until: string | null; ban_reason: string | null; created_at: string;
}

interface AccountStore {
  ready: boolean;                 // the session has been read
  session: Session | null;
  profile: Profile | null;
  start: () => void;              // connect (idempotent)
  refreshProfile: () => Promise<void>;
}

let started = false;
export const useAccount = create<AccountStore>()((set, get) => ({
  ready: false,
  session: null,
  profile: null,
  start: () => {
    if (started) return;
    started = true;
    // the library is loaded only now: once someone is signed in, or a community page asks
    void import("./client").then(({ supabase }) => {
      const sb = supabase();
      sb.auth.getSession().then(({ data }) => {
        set({ session: data.session, ready: true });
        if (data.session) void get().refreshProfile();
      });
      sb.auth.onAuthStateChange((_event, session) => {
        set({ session, ready: true });
        if (session) void get().refreshProfile(); else set({ profile: null });
      });
    });
  },
  refreshProfile: async () => {
    const uid = get().session?.user.id;
    if (!uid) { set({ profile: null }); return; }
    const { supabase } = await import("./client");
    const { data } = await supabase().from("profiles").select("*").eq("id", uid).maybeSingle();
    set({ profile: (data as Profile | null) ?? null });
  },
}));

export const isModerator = (p: Profile | null) => p?.role === "moderator";
export const isBanned = (p: Profile | null) => !!p?.banned_until && new Date(p.banned_until) > new Date();

/** A readable message from a Supabase error (the database's own messages are written for readers). */
export function problem(e: unknown): string {
  const m = (e as { message?: string } | null)?.message ?? String(e);
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "The Town Hall could not be reached. Check the connection light at the top of the page, then try again.";
  if (/JWT|not authenticated|permission denied|row-level security/i.test(m)) return "You need to be signed in (with a confirmed email address) to do that.";
  return m;
}
