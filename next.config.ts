import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "files.edgestore.dev",
      },
    ],
  },
  output: "standalone", // great for Docker/deployment
  reactStrictMode: false, // optional: disables double-rendering in dev
  experimental: {
    // Optional: only if you want to fallback to the Pages Router behavior
    // appDir: false, // disables App Router (reverts to pages/)
  },
};

export default nextConfig;
