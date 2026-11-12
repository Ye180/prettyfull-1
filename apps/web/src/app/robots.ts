import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/seo/site";

/** Pages privées ou sans valeur pour un moteur de recherche. */
const PRIVATE_PATHS = [
	"/api/",
	"/cart",
	"/checkout",
	"/account",
	"/order-confirmation",
	"/login",
	"/create-account",
	"/wishlist",
	"/offline.html",
];

export default function robots(): MetadataRoute.Robots {
	// Dev, staging, localhost : on ferme tout et on ne publie pas de sitemap.
	if (!IS_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };

	return {
		rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
