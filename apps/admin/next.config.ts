import type { NextConfig } from "next";

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
	transpilePackages: ["@prettyfull/ui", "@prettyfull/utils"],
	poweredByHeader: false,

	async headers() {
		return [
			{
				source: "/:path*",
				// Le back-office ne doit jamais être indexé.
				headers: [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
		];
	},

	/**
	 * Le panel affiche les visuels via `<img>` plutôt que `next/image` - les
	 * URL sont saisies ou téléversées par l'administrateur et inconnues à la
	 * compilation. Le motif est déclaré malgré tout pour qu'un futur passage à
	 * `next/image` n'échoue pas silencieusement.
	 */
	images: {
		remotePatterns: [
			...(mediaHost ? [{ protocol: "https" as const, hostname: mediaHost }] : []),
			// Visuels téléversés avant la migration vers R2.
			{ protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
			{ protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
		],
	},
};

export default nextConfig;
