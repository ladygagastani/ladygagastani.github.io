/**
 * The site's icon, a black-figure amphora on clay, drawn for next/og's ImageResponse (no image files):
 * used by the install icons (app/icons/[size]) and the iPhone home-screen icon (app/apple-icon.tsx).
 * `pot` is how much of the square the vase fills; `round` rounds the corners (iPhones round their own).
 */
export function AppIcon({ px, pot, round }: { px: number; pot: number; round: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E6C39B", borderRadius: round ? px * 0.18 : 0 }}>
      <svg width={px * pot} height={px * pot} viewBox="0 0 100 100">
        {/* lip, neck, shoulders, body tapering to a foot; two handles */}
        <path fill="#1B1410" d="M36 6h28v4h-3v14c9 3 17 11 19 22 2 13-3 26-13 35l-1 5h5v6H29v-6h5l-1-5C23 72 18 59 20 46c2-11 10-19 19-22V10h-3z" />
        <path fill="none" stroke="#1B1410" strokeWidth="4" d="M39 14c-10 0-14 8-13 16M61 14c10 0 14 8 13 16" />
        <path fill="none" stroke="#A33A16" strokeWidth="2.4" d="M24 52h52M26 60h48" />
        {/* a band of rays above the foot, as on black-figure pots */}
        <path fill="#E6C39B" d="M34 78l3-10 3 10zM41 78l3-10 3 10zM48 78l3-10 3 10zM55 78l3-10 3 10zM62 78l3-10 3 10z" />
      </svg>
    </div>
  );
}
