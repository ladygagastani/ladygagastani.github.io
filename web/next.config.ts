import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a new id for every build: the service worker is registered with it, so a new build replaces the offline copy
  env: { NEXT_PUBLIC_BUILD: String(Date.now()) },
};

export default nextConfig;
