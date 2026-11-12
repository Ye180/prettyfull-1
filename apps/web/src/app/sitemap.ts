import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/lib/seo/api";
import { SITE_URL, absoluteUrl } from "@/lib/seo/site";

// Lu au moment de la requête : au build, l'API n'est pas forcément joignable.
// Les appels réseau restent mis en cache par Next (voir `lib/seo/api.ts`).
export const dynamic = "force-dynamic";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
	{ path: "/", priority: 1, changeFrequency: "daily" },
	{ path: "/collections", priority: 0.9, changeFrequency: "daily" },
	{ path: "/about", priority: 0.5, changeFrequency: "yearly" },
	{ path: "/faq", priority: 0.5, changeFrequency: "monthly" },
	{ path: "/contact", priority: 0.4, changeFrequency: "yearly" },
	{ path: "/shipping-return", priority: 0.4, changeFrequency: "yearly" },
	{ path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

	return [
		...STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
			url: absoluteUrl(path),
			changeFrequency,
			priority,
		})),
		...categories.map((category) => ({
			url: absoluteUrl(`/collections/${category.slug}`),
			lastModified: category.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		})),
		...products.map((product) => ({
			url: absoluteUrl(`/products/${product.slug}`),
			lastModified: product.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.7,
			images: product.images.slice(0, 3).map((image) => absoluteUrl(image.url)),
		})),
	].filter((entry) => entry.url.startsWith(SITE_URL));
}
