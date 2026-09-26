import type { Metadata, Viewport } from "next";
import { GFS_Didot, Alegreya, Alegreya_Sans_SC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SettingsPanel, { SettingsApplier } from "@/components/SettingsPanel";
import Toast from "@/components/Toast";
import Reveal from "@/components/Reveal";
import { SITE } from "@/config/areas";
import { BOOT_SCRIPT } from "@/lib/settings";
import "./globals.css";

// next/font downloads these at build time and serves them from this site,
// so visitors' browsers never contact Google (no-trackers decision).
const didot = GFS_Didot({ weight: "400", subsets: ["greek", "greek-ext", "latin"], variable: "--font-didot", display: "swap" });
const alegreya = Alegreya({ subsets: ["latin", "latin-ext", "greek", "greek-ext"], style: ["normal", "italic"], variable: "--font-alegreya", display: "swap" });
const alegreyaSC = Alegreya_Sans_SC({ weight: ["500", "700"], subsets: ["latin", "greek"], variable: "--font-alegreya-sc", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${SITE.latin} · ${SITE.greek}`, template: `%s · ${SITE.latin}` },
  description: SITE.tagline,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E6C39B" },
    { media: "(prefers-color-scheme: dark)", color: "#16110E" },
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
        <SettingsPanel />
        <Toast />
        <Reveal />
      </body>
    </html>
  );
}
