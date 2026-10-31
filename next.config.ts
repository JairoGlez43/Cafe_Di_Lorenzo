import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: HTML, CSS, JS and images only, no server (spec 0001).
  // cacheComponents/partialPrefetching (template defaults) enable PPR, which
  // export mode rejects; a single static page needs neither.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
