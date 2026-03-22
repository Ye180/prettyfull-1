import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://admin.prettyfull.shop";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@prettyfull/ui", "@prettyfull/store"],
  async rewrites() {
    return [
      {
        source: "/store/:path*",
        destination: `${MEDUSA_BACKEND_URL}/store/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${MEDUSA_BACKEND_URL}/auth/:path*`,
      },
      {
        source: "/admin/:path*",
        destination: `${MEDUSA_BACKEND_URL}/admin/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-storage.prettyfull.shop",
        pathname: "/api/browse/prettyfull/**",
      },
      {
        protocol: "https",
        hostname: "dev-storage.prettyfull.com",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
  //  i18n: {
  //   locales: ['en', 'fr'], // List all the languages you want to support
  //   defaultLocale: 'en', // Default language
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
