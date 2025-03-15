import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  typescript: {
    // 在生產環境忽略 TypeScript 錯誤
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // 在生產環境忽略 ESLint 錯誤
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // 這是 Vercel 上自動啟用的
  // output: 'standalone',
};

export default nextConfig;
