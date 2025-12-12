import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Allow embedding on any site for the embed pages
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
          {
            key: 'Permissions-Policy',
            value: 'autoplay=*, fullscreen=*, encrypted-media=*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
