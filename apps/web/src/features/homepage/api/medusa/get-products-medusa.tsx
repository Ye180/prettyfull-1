"use client";

import { sdk } from "@/lib/api/sdk";
import { PRODUCTS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => {
	const response = sdk.store.product
		.list({
			fields: "*variants.calculated_price",
			region_id: "reg_01KAGE6E6H99WSEH3F2A8BB684",
		})
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
