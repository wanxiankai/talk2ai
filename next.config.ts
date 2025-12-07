import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',  // GitHub 头像
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',      // Google 头像
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',   // Facebook 头像
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',                  // Twitter 头像
      },
    ],
  },
};

export default nextConfig;
