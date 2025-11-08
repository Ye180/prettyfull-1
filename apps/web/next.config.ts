import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@prettyfull/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
