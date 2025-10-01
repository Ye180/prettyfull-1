import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@prettyfull/ui"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
