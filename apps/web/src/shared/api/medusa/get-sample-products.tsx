"use client";

import type { Paginated, Product } from "@prettyfull/contracts";
import { storeApi, toRawProduct } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/**
 * Produits d'un rayon, au format brut attendu par les grilles de
 * `@prettyfull/ui`.
 *
 * `collections` reste vide : le modèle ne distingue pas collection et rayon,
 * et les vues traitent déjà ce cas en se rabattant sur `standaloneProducts`.
 */
const getAllProductsByCategory = async (categoryHandle: string) => {
	const [category, response] = await Promise.all([
		storeApi
			.get<{ id: string; name: string; slug: string }>(
				`/api/store/categories/${encodeURIComponent(categoryHandle)}`,
			)
			.catch(() => null),
		storeApi.get<Paginated<Product>>(
			`/api/store/categories/${encodeURIComponent(categoryHandle)}/products?limit=100`,
		),
	]);

	if (!category) {
		return { category: null, collections: [], standaloneProducts: [] };
	}

	const shape = { id: category.id, name: category.name, handle: category.slug };

	return {
		category: shape,
		collections: [] as {
			collection_id: string;
			collection: { id: string; title: string; handle: string };
			products: ReturnType<typeof toRawProduct>[];
		}[],
		standaloneProducts: response.data.map((product) => ({
			product_id: product.id,
			product: toRawProduct(product),
			category_id: category.id,
			category: shape,
		})),
	};
};

export const useGetSampleProducts = (categoryHandle: string) =>
	useQuery({
		queryKey: ["sample-products", "all-by-category", categoryHandle],
		queryFn: () => getAllProductsByCategory(categoryHandle),
		staleTime: 5 * 60 * 1000,
		enabled: !!categoryHandle,
	});
