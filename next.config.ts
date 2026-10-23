import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    domains: ["https://ijscsxogfxphbzhiyajz.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ijscsxogfxphbzhiyajz.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
