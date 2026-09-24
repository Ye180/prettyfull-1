"use client";

import type { Paginated, Product } from "@prettyfull/contracts";
import { fetchCategories, storeApi, toRawProduct } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/**
 * Produits groupés par rayon, pour les rangées de la page d'accueil.
 *
 * Les rayons sont chargés d'abord, puis leurs produits en parallèle : les
 * enchaîner ferait attendre le premier rendu autant de fois qu'il y a de
 * rayons.
 */
const getProductsSameCollection = async () => {
	const categories = await fetchCategories();

	return Promise.all(
		categories.map(async (category) => {
			const response = await storeApi.get<Paginated<Product>>(
				`/api/store/categories/${encodeURIComponent(category.handle)}/products?limit=20`,
			);

			return {
				collection_id: `col_${category.id}`,
				collection: {
					id: `col_${category.id}`,
					title: category.name,
					handle: category.handle,
					metadata: { categorie_id: category.id },
				},
				categorie: [category.id],
				products: response.data.map(toRawProduct),
			};
		}),
	);
};

export const useGetProductsSameCollection = () =>
	useQuery({
		queryKey: ["products-same-collection"],
		queryFn: () => getProductsSameCollection(),
		staleTime: 5 * 60 * 1000,
	});
