import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/app-icon";

/**
 * The icon an iPhone shows when the site is added to its home screen, at the address iPhones look for
 * by themselves (and linked from every page by layout.tsx). A .png name, so it is served as an image.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<AppIcon px={180} pot={0.74} round={false} />, { width: 180, height: 180 });
}
