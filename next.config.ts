import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows images from any HTTPS link
      },
      {
        protocol: "http",
        hostname: "**", // Allows images from any HTTP link
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.GET_VIDEO_LINK_API}/:path*`,
      },
    ];
  },
};

export default nextConfig;
