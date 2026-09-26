import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ComingSoon from "@/components/ComingSoon";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `${AREAS.downloads.name} · ${AREAS.downloads.english}` };

const ITEMS = [
  "Download the original collections for offline reading",
  "Load them from a folder or ZIP file, and reconnect folders after a restart",
  "Choose authors or works to keep, and see how much space they use"
];

export default function DownloadsPage() {
  return (
    <Page>
      <AreaHeader id="downloads" />
      <ComingSoon id="downloads" items={ITEMS} />
    </Page>
  );
}
