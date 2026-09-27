import { ImageResponse } from "next/og";

/** The app icons for installing the site: a black-figure amphora on clay, drawn here (no image files). */
export const dynamic = "force-static";
export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }, { size: "maskable-512" }];
}

export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const maskable = size.startsWith("maskable");
  const px = maskable ? 512 : Number(size) || 192;
  const pot = maskable ? 0.62 : 0.78;   // a maskable icon keeps its drawing inside the central safe zone
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E6C39B", borderRadius: maskable ? 0 : px * 0.18 }}>
        <svg width={px * pot} height={px * pot} viewBox="0 0 100 100">
          {/* lip, neck, shoulders, body tapering to a foot; two handles */}
          <path fill="#1B1410" d="M36 6h28v4h-3v14c9 3 17 11 19 22 2 13-3 26-13 35l-1 5h5v6H29v-6h5l-1-5C23 72 18 59 20 46c2-11 10-19 19-22V10h-3z" />
          <path fill="none" stroke="#1B1410" strokeWidth="4" d="M39 14c-10 0-14 8-13 16M61 14c10 0 14 8 13 16" />
          <path fill="none" stroke="#A33A16" strokeWidth="2.4" d="M24 52h52M26 60h48" />
          {/* a band of rays above the foot, as on black-figure pots */}
          <path fill="#E6C39B" d="M34 78l3-10 3 10zM41 78l3-10 3 10zM48 78l3-10 3 10zM55 78l3-10 3 10zM62 78l3-10 3 10z" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
