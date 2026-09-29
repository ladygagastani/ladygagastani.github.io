import type { MetadataRoute } from "next";
import { sitePaths } from "@/lib/site-paths";
import { absolute } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitePaths().map((p) => ({ url: absolute(p === "/" ? "/" : p) }));
}
