import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/app-icon";

/** The app icons for installing the site: a black-figure amphora on clay, drawn here (no image files). */
export const dynamic = "force-static";
export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }, { size: "maskable-512" }];
}

export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const maskable = size.startsWith("maskable");
  const px = maskable ? 512 : Number(size) || 192;
  // a maskable icon keeps its drawing inside the central safe zone
  return new ImageResponse(<AppIcon px={px} pot={maskable ? 0.62 : 0.78} round={!maskable} />, { width: px, height: px });
}
