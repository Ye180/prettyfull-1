import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@prettyfull/ui", "@prettyfull/store"],

	images: {
		/**
		 * Visuels téléversés depuis le back-office.
		 *
		 * UploadThing sert les fichiers sur `<app-id>.ufs.sh` : le sous-domaine
		 * porte l'identifiant de l'application, inconnu à la compilation. Le
		 * motif générique évite d'avoir à recompiler le storefront si l'app
		 * change, et reste limité au domaine du prestataire.
		 *
		 * `utfs.io` couvre les fichiers téléversés avant la v7.
		 */
		remotePatterns: [
			{ protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
			{ protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
		],
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
