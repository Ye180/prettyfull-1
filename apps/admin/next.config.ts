import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@prettyfull/ui", "@prettyfull/utils"],
};

export default nextConfig;
