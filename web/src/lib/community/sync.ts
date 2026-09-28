"use client";
/**
 * Keep the Treasury in step between devices: the account holds one copy (table "treasuries",
 * readable only by its member). A sync merges the account's copy into this browser, then saves the
 * merged result back. Merging never loses work: the newer copy of each record wins, and a
 * deletion wins over any copy older than it.
 */
import { applyIncoming, gather, type ApplyReport } from "@/lib/treasury-apply";
import { parseExport } from "@/lib/treasury-io";
import type { Position } from "@/lib/position";
import { supabase } from "./client";
import { LAST_SYNCED as LAST } from "./account";

export { lastSynced } from "./account";

export async function syncTreasury(uid: string, onPositions?: (p: Record<string, Position>) => void): Promise<{ report: ApplyReport | null; at: string }> {
  const sb = supabase();
  const { data: row, error } = await sb.from("treasuries").select("data").eq("user_id", uid).maybeSingle();
  if (error) throw error;
  // the account's copy is checked like a restored file before anything is merged
  const report = row?.data ? await applyIncoming(parseExport(JSON.stringify(row.data)), onPositions) : null;
  const merged = await gather();
  const at = new Date().toISOString();
  const { error: e2 } = await sb.from("treasuries").upsert({ user_id: uid, data: merged, updated_at: at });
  if (e2) throw e2;
  try { localStorage.setItem(LAST, at); } catch { /* not remembered */ }
  return { report, at };
}
