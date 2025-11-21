"use client";
import { sdk } from "@/lib/api/sdk";
import { PRODUCT_MEDUSA_BY_CATEGORY_HANDLE_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

const GetProductByCategoryHandle = async ({ handle }: { handle: string }) => {
	const { product_categories } = await sdk.store.category.list({ handle });

	const category = product_categories[0];

	// si trouvé

	if (category) {
		const { products, count } = await sdk.store.product.list({
			category_id: category.id,
			limit: 20, // optionnel
			offset: 0, // optionnel
		});

		return { products, count };

		// products = liste des produits de la catégorie
	}
};

export const useGetProductByCategoryHandle = (handle: string) => {
	return useQuery({
		queryKey: [PRODUCT_MEDUSA_BY_CATEGORY_HANDLE_QUERY_KEY, handle],
		queryFn: () => GetProductByCategoryHandle({ handle }),
	});
};
