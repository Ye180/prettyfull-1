import { toMajorUnit, type Category, type Product } from "@prettyfull/contracts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, truncate } from "./site";

/** Constructeurs de graphes Schema.org (voir docs/seo.md). */

export const organizationSchema = () => ({
	"@context": "https://schema.org",
	"@type": "Store",
	"@id": `${SITE_URL}/#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	logo: absoluteUrl("/icons/icon-512.png"),
	image: absoluteUrl("/opengraph-image.png"),
	description: SITE_DESCRIPTION,
	email: "contact@prettyfull.shop",
	areaServed: { "@type": "City", name: "Abidjan" },
	address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
	currenciesAccepted: "XOF",
});

export const websiteSchema = () => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	url: SITE_URL,
	name: SITE_NAME,
	inLanguage: "fr",
	publisher: { "@id": `${SITE_URL}/#organization` },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: absoluteUrl(item.path),
	})),
});

const AVAILABILITY: Record<string, string> = {
	in_stock: "https://schema.org/InStock",
	low_stock: "https://schema.org/LimitedAvailability",
	out_of_stock: "https://schema.org/OutOfStock",
};

/** Fiche produit éligible aux résultats enrichis (prix, disponibilité) de Google. */
export const productSchema = (product: Product) => {
	const price = toMajorUnit(product.basePrice, product.currency);
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
		name: product.name,
		description: truncate(product.shortDescription || product.longDescription, 300),
		image: product.images.map((image) => absoluteUrl(image.url)),
		sku: product.sku || product.id,
		category: product.categories[0]?.name,
		keywords: product.tags.length ? product.tags.join(", ") : undefined,
		offers: {
			"@type": "Offer",
			url: absoluteUrl(`/products/${product.slug}`),
			priceCurrency: product.currency.toUpperCase(),
			price,
			availability: AVAILABILITY[product.stockStatus] ?? "https://schema.org/InStock",
			itemCondition: "https://schema.org/NewCondition",
			seller: { "@id": `${SITE_URL}/#organization` },
		},
	};
};

export const collectionSchema = (category: Category) => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: category.name,
	description: truncate(category.description, 300),
	url: absoluteUrl(`/collections/${category.slug}`),
	isPartOf: { "@id": `${SITE_URL}/#website` },
});
