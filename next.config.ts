import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['whatsapp-web.js'],
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;