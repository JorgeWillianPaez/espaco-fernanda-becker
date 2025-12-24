import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
