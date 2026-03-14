import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@prettyfull/ui", "@prettyfull/store"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-storage.prettyfull.shop",
        pathname: "/api/browse/prettyfull/**",
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
