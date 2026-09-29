import type { Metadata, Viewport } from "next";
import { GFS_Didot, Alegreya, Alegreya_Sans_SC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import SettingsPanel, { SettingsApplier } from "@/components/SettingsPanel";
import Toast from "@/components/Toast";
import Reveal from "@/components/Reveal";
import QuickSearch from "@/components/search/QuickSearch";
import FloatingReaderSlot from "@/components/reader/FloatingReaderSlot";
import { ResumeTracker } from "@/components/Resume";
import { Suspense } from "react";
import { SITE } from "@/config/areas";
import { BOOT_SCRIPT, THEME_COLOURS } from "@/lib/settings";
import { SHARE_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

// next/font downloads these at build time and serves them from this site,
// so visitors' browsers never contact Google (no-trackers decision).
// Every alphabet range of each font is always available (the browser fetches one when a page uses
// its letters); `subsets` only names the files preloaded with every page, so it lists just what the
// first screen needs: Greek text and headings are GFS Didot, English is Alegreya.
const didot = GFS_Didot({ weight: "400", subsets: ["greek", "greek-ext", "latin"], variable: "--font-didot", display: "swap" });
const alegreya = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-alegreya", display: "swap" });
const alegreyaSC = Alegreya_Sans_SC({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-alegreya-sc", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.latin} · ${SITE.greek}`, template: `%s · ${SITE.latin}` },
  description: SITE.tagline,
  // what a link to any page looks like when it is shared (a page with its own title and description overrides these)
  openGraph: { type: "website", siteName: SITE.latin, locale: "en_GB", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
  // added to an iPhone's home screen, it opens as an app of its own (the manifest says the same for other phones)
  appleWebApp: { capable: true, title: SITE.latin, statusBarStyle: "default" },
  icons: { apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // a theme chosen in Settings overrides these (applySettings in lib/settings.ts)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOURS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOURS.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${didot.variable} ${alegreya.variable} ${alegreyaSC.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <SettingsApplier />
        <Header />
        {children}
        <Footer />
        <TabBar />
        <SettingsPanel />
        <Toast />
        <Reveal />
        <QuickSearch />
        <FloatingReaderSlot />
        <Suspense fallback={null}><ResumeTracker /></Suspense>
      </body>
    </html>
  );
}
