import { offlinePages, OFFLINE_DATA } from "@/config/pages";

export const dynamic = "force-static";

/** What the service worker keeps for offline use, and which build it belongs to. */
export function GET() {
  return Response.json({ build: process.env.NEXT_PUBLIC_BUILD ?? "dev", pages: offlinePages(), data: OFFLINE_DATA });
}
