import type { Category, CategoryNode, Product } from "@prettyfull/contracts";

/**
 * Lecture serveur de l'API publique pour le SEO (métadonnées, sitemap).
 *
 * Distinct de `lib/store-api` (client navigateur, jeton en mémoire) : ici, pas
 * de session, des réponses mises en cache par Next, et jamais d'exception - un
 * backend injoignable ne doit pas casser le rendu d'une page, seulement
 * retomber sur les métadonnées par défaut.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7777").replace(/\/+$/, "");

const REVALIDATE_SECONDS = 600;

const get = async <T>(path: string): Promise<T | null> => {
	try {
		const response = await fetch(`${API_URL}${path}`, {
			next: { revalidate: REVALIDATE_SECONDS },
			signal: AbortSignal.timeout(5_000),
		});
		return response.ok ? ((await response.json()) as T) : null;
	} catch {
		return null;
	}
};

export const getProduct = (handle: string) =>
	get<Product>(`/api/store/products/${encodeURIComponent(handle)}`);

export const getCategoryTree = () => get<CategoryNode[]>("/api/store/categories?tree=true");

/** Rayons à plat, hors racine « Boutique » (conteneur de navigation, pas une page de vente). */
export const getCategories = async (): Promise<Category[]> => {
	const tree = (await getCategoryTree()) ?? [];
	const flat = (nodes: CategoryNode[]): CategoryNode[] =>
		nodes.flatMap((node) => [node, ...flat(node.children ?? [])]);
	return flat(tree).filter((node) => node.depth > 0);
};

export const getCategory = async (slug: string): Promise<Category | null> =>
	(await getCategories()).find((category) => category.slug === slug) ?? null;

/** Tous les produits publiés, par pages de 100 (maximum de l'API). */
export const getAllProducts = async (): Promise<Product[]> => {
	const products: Product[] = [];
	for (let page = 1; page <= 50; page += 1) {
		const result = await get<{ data: Product[]; meta: { hasNext: boolean } }>(
			`/api/store/products?limit=100&page=${page}`,
		);
		if (!result) break;
		products.push(...result.data);
		if (!result.meta.hasNext) break;
	}
	return products;
};
