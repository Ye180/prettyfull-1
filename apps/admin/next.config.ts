import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@prettyfull/ui", "@prettyfull/utils"],

	/**
	 * Le panel affiche les visuels via `<img>` plutôt que `next/image` - les
	 * URL sont saisies ou téléversées par l'administrateur et inconnues à la
	 * compilation. Le motif est déclaré malgré tout pour qu'un futur passage à
	 * `next/image` n'échoue pas silencieusement.
	 */
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
			{ protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
		],
	},
};

export default nextConfig;
