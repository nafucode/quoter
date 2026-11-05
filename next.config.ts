import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path(.*\\.(?:png|jpg|jpeg|webp|gif|svg|avif|PNG|JPG|JPEG))',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=3600, stale-while-revalidate=86400',
      }],
    }];
  },
};

export default nextConfig;
