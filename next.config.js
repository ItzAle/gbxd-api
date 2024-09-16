/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERCEL_DEPLOY_HOOK_URL: process.env.VERCEL_DEPLOY_HOOK_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  optimizeFonts: true,
};

module.exports = nextConfig;
