import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "shikshaintel.in",
          },
        ],
        destination: "https://www.shikshaintel.in/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
