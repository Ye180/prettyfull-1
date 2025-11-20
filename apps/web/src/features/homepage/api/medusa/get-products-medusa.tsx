"use client";

import { sdk } from "@/lib/api/sdk";
import { PRODUCTS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => {
	const response = sdk.store.product
		.list()
		.then(({ products, count, offset, limit }) => {
			// Filtrer les produits pour ne garder que ceux qui ont au moins une variante
			const productsWithVariants = products.filter(
				(product) =>
					Array.isArray(product.variants) && product.variants.length > 0
			);
			// productsWithVariants contient maintenant uniquement les produits avec au moins une variante
			return products;
		});
	return response;
};

export const useGetProductsMedusa = () => {
	return useQuery({
		queryKey: [PRODUCTS_MEDUSA_QUERY_KEY],
		queryFn: () => getProductsMedusa(),
	});
};
