import type { MetadataRoute } from "next";
import { SITE } from "@/config/areas";

export const dynamic = "force-static";

/** Lets the site be installed as an app, opening straight to the Propylaea, and working offline. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.latin} · ${SITE.greek}`,
    short_name: SITE.latin,
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#E6C39B",
    theme_color: "#1B1410",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
