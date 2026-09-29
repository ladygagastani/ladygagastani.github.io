import type { Metadata } from "next";
import Page from "@/components/Page";
import DailySession from "@/components/academy/DailySession";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `Today's session · ${AREAS.study.name}`, ...NOINDEX };

export default function TodayPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(24px, 4vw, 48px)" }}>
        <DailySession />
      </div>
    </Page>
  );
}
