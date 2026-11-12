import type { Metadata } from "next";

/**
 * Constantes et fabrique de métadonnées SEO du storefront.
 *
 * Tout ce qui est propre au site (nom, URL, textes par défaut) est ici : pour
 * réutiliser ce module dans un autre projet, seul ce fichier change.
 * Guide complet : docs/seo.md
 */

export const SITE_NAME = "Prettyfull";

/** URL publique, sans `/` final. Posée par `NEXT_PUBLIC_STOREFRONT_URL` au build. */
export const SITE_URL = (process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://www.prettyfull.shop").replace(
	/\/+$/,
	"",
);

export const SITE_TAGLINE = "Vitamines, soins et produits américains livrés à Abidjan";

export const SITE_DESCRIPTION =
	"Prettyfull : vitamines, compléments, soins du visage et du corps, parfums et iPhone importés des USA, authentiques et livrés à Abidjan. Paiement sécurisé en FCFA.";

export const SITE_KEYWORDS = [
	"Prettyfull",
	"vitamines Abidjan",
	"compléments alimentaires Côte d'Ivoire",
	"produits américains Abidjan",
	"soins du visage",
	"soins du corps",
	"collagène",
	"iPhone Abidjan",
	"parfums",
	"made in USA",
	"livraison Abidjan",
];

export const SITE_LOCALE = "fr_CI";
export const SOCIAL_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined;

const NON_INDEXABLE_HOST = /^(localhost|127\.|dev\.|staging\.|test\.|preview\.)/;

/**
 * `false` sur localhost et sur les environnements dev/staging : ils ne doivent
 * jamais entrer dans Google (contenu dupliqué avec la production).
 * `NEXT_PUBLIC_NOINDEX=true` force aussi l'exclusion.
 */
export const IS_INDEXABLE =
	process.env.NEXT_PUBLIC_NOINDEX !== "true" &&
	!NON_INDEXABLE_HOST.test(new URL(SITE_URL).hostname);

export const absoluteUrl = (path = "/"): string =>
	/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Coupe proprement sur un mot, avec « … » : Google tronque autour de 155-160 caractères. */
export const truncate = (text: string | null | undefined, max = 155): string => {
	const clean = (text ?? "").replace(/\s+/g, " ").trim();
	if (clean.length <= max) return clean;
	return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

export const OG_DEFAULT_IMAGE = {
	url: absoluteUrl("/opengraph-image.png"),
	width: 1200,
	height: 630,
	alt: `${SITE_NAME} : ${SITE_TAGLINE}`,
};

interface PageSeo {
	/** Sans le nom du site : le template du layout racine l'ajoute. */
	title: string;
	description: string;
	/** Chemin canonique, ex. `/products/collagene`. */
	path: string;
	keywords?: string[];
	images?: { url: string; alt?: string; width?: number; height?: number }[];
	/** `product` pour une fiche, `website` sinon. */
	type?: "website" | "article";
	noindex?: boolean;
}

/** Métadonnées complètes (title, description, canonical, Open Graph, Twitter) pour une page indexable. */
export const buildMetadata = ({
	title,
	description,
	path,
	keywords,
	images,
	type = "website",
	noindex = false,
}: PageSeo): Metadata => {
	const url = absoluteUrl(path);
	const cleanDescription = truncate(description);
	const ogImages = images?.length ? images : [OG_DEFAULT_IMAGE];

	return {
		title,
		description: cleanDescription,
		keywords,
		alternates: { canonical: url },
		openGraph: {
			type,
			url,
			siteName: SITE_NAME,
			locale: SITE_LOCALE,
			title: `${title} | ${SITE_NAME}`,
			description: cleanDescription,
			images: ogImages,
		},
		twitter: {
			card: "summary_large_image",
			site: SOCIAL_HANDLE,
			title: `${title} | ${SITE_NAME}`,
			description: cleanDescription,
			images: ogImages.map((image) => image.url),
		},
		robots: noindex ? { index: false, follow: false } : undefined,
	};
};

/** Pages privées (panier, compte, paiement…) : jamais dans l'index. */
export const noIndexMetadata = (title: string): Metadata => ({
	title,
	robots: { index: false, follow: false, nocache: true },
});
