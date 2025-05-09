import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'avatars.githubusercontent.com',  // GitHub 头像
      'lh3.googleusercontent.com',      // Google 头像
      'platform-lookaside.fbsbx.com',   // Facebook 头像
      'pbs.twimg.com',                  // Twitter 头像
    ],
  },
};

export default nextConfig;
