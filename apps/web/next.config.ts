import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * En-têtes de sécurité appliqués à toutes les pages.
 *
 * - `frame-ancestors 'none'` + `X-Frame-Options` : le site ne peut pas être
 *   affiché dans une iframe tierce (clickjacking).
 * - `base-uri`, `object-src`, `form-action` : verrous CSP sans risque de
 *   casser les scripts inline de Next.
 * - HSTS : force HTTPS pendant 2 ans (ignoré en HTTP local).
 *
 * ponytail: pas de `script-src` strict - il exige des nonces par requête via
 * le proxy ; à ajouter si une surface XSS apparaît (contenu HTML riche).
 */
const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
	},
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{ key: "Strict-Transport-Security", value: "max-age=63072000" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Hôte public du stockage R2 (`NEXT_PUBLIC_MEDIA_URL`, ex. `https://cdn.prettyfull.shop`
 * ou `https://pub-xxxx.r2.dev`), lu à la compilation : `next/image` n'optimise
 * que les hôtes déclarés.
 */
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
	? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
	: null;

const nextConfig: NextConfig = {
	transpilePackages: ["@prettyfull/ui", "@prettyfull/store"],
	poweredByHeader: false,

	/**
	 * Service worker de la PWA (`public/sw.js`, voir docs/pwa.md).
	 *
	 * `no-cache` : le navigateur doit revérifier le fichier à chaque visite,
	 * sinon une nouvelle version resterait invisible jusqu'à 24 h. La CSP
	 * limite le worker à du code servi par le site lui-même.
	 */
	async headers() {
		return [
			{ source: "/:path*", headers: securityHeaders },
			{
				source: "/sw.js",
				headers: [
					{ key: "Content-Type", value: "application/javascript; charset=utf-8" },
					{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
					{ key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
				],
			},
		];
	},

	images: {
		/**
		 * Visuels téléversés depuis le back-office.
		 *
		 * Stockage R2 (`NEXT_PUBLIC_MEDIA_URL`). Les deux hôtes UploadThing
		 * restent déclarés : les visuels téléversés avant la migration y sont
		 * toujours servis tant qu'ils n'ont pas été ré-envoyés vers R2.
		 */
		remotePatterns: [
			...(mediaHost ? [{ protocol: "https" as const, hostname: mediaHost }] : []),
			{ protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
			{ protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
			{ protocol: "https", hostname: "images.unsplash.com" },
		],
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
