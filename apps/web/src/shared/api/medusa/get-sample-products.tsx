"use client";

import { getCategoryByHandle, getProductsByCategoryId, toRawProduct } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const getAllProductsByCategory = async (categoryHandle: string) => {
	const category = getCategoryByHandle(categoryHandle);
	if (!category) {
		return { category: null, collections: [], standaloneProducts: [] };
	}

	const standaloneProducts = getProductsByCategoryId(category.id).map((product) => ({
		product_id: product.id,
		product: toRawProduct(product),
		category_id: category.id,
		category: { id: category.id, name: category.name, handle: category.handle },
	}));

	return {
		category,
		collections: [] as Array<{
			collection_id: string;
			collection: { id: string; title: string; handle: string };
			products: ReturnType<typeof toRawProduct>[];
		}>,
		standaloneProducts,
	};
};

export const useGetSampleProducts = (categoryHandle: string) => {
	return useQuery({
		queryKey: ["sample-products", "all-by-category", categoryHandle],
		queryFn: () => getAllProductsByCategory(categoryHandle),
		enabled: !!categoryHandle,
	});
};
