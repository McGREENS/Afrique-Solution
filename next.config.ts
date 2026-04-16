import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['whatsapp-web.js']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude WhatsApp Web.js from server-side bundling during build
      config.externals = config.externals || [];
      config.externals.push('whatsapp-web.js');
    }
    return config;
  },
  // Ignore WhatsApp auth files during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;