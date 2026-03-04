import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // No special webpack config needed — GeoJSON/JSON are handled natively by Next.js
};

export default nextConfig;
