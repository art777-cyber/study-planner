import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // ❌ REMOVE export mode completely
  output: "standalone",

  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;