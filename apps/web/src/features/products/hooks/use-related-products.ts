"use client";

import type { Paginated, Product } from "@prettyfull/contracts";
import { normalizeStandaloneProducts } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";
import { storeApi, toQuery, toRawProduct } from "@/lib/store-api";

/**
 * Produits « à découvrir aussi » : autres articles du même rayon.
 *
 * Passe par `toRawProduct` (forme brute attendue par `CardProduct`), pas par
 * `fetchProductsByCategory`/`toStoreProduct` - cette dernière est une forme
 * d'affichage plus pauvre, déjà documentée comme telle dans `adapters.ts`.
 * Même chemin que `get-sample-products.tsx`, qui alimente la grille de rayon.
 */
const RELATED_LIMIT = 9;

const fetchRelatedProducts = async (categorySlug: string, excludeProductId: string) => {
	const response = await storeApi.get<Paginated<Product>>(
		`/api/store/categories/${encodeURIComponent(categorySlug)}/products${toQuery({ limit: RELATED_LIMIT })}`,
	);

	const products = response.data.filter((product) => product.id !== excludeProductId).slice(0, 8);

	return normalizeStandaloneProducts(
		products.map((product) => ({
			product_id: product.id,
			product: toRawProduct(product),
			category_id: product.categories[0]?.id ?? "",
			category: {
				id: product.categories[0]?.id ?? "",
				name: product.categories[0]?.name ?? "",
				handle: categorySlug,
			},
		})),
	);
};

export function useRelatedProducts(categorySlug: string | undefined, excludeProductId: string) {
	return useQuery({
		queryKey: ["related-products", categorySlug, excludeProductId],
		queryFn: () => fetchRelatedProducts(categorySlug!, excludeProductId),
		enabled: !!categorySlug,
		staleTime: 5 * 60 * 1000,
	});
}
