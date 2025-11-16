/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	transpilePackages: ["@prettyfull/ui"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "dev-storage.prettyfull.shop",
			},
		],
	},
};

export default nextConfig;
