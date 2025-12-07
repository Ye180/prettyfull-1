import { sdk } from "@/lib/api/sdk";
import type { StoreProductCategoryListResponse } from "@medusajs/types";
import { useQuery } from "@tanstack/react-query";

export const getCategoryByHandler = async (
	handle: string,
	metadataKey: string
) => {
	// ...

	const { product_categories } =
		await sdk.client.fetch<StoreProductCategoryListResponse>(
			`/store/product-categories`,
			{
				query: {
					fields:
						"*category_children, *products, *product_category_image, *category_children.metadata , *category_children.product_category_image",
					// ...
				},
				// ...
			}
		);

	const category = product_categories.find((cat) => cat.handle === handle);

	if (!category?.category_children) {
		return [];
	}

	// Filtre les enfants qui ont la clé metadata spécifiée
	const childrenWithMetadata = category.category_children.filter(
		(child) => child?.metadata && metadataKey in child.metadata
	);

	return childrenWithMetadata;
};

export const useGetCategoryByHandler = (handle: string, metadata: string) => {
	return useQuery({
		queryKey: ["ddd", handle, metadata],
		queryFn: () => getCategoryByHandler(handle, metadata),
	});
};

export const getCategoryByHandle = async (categoryHandle: string[]) => {
	return sdk.client.fetch("/store/product-categories", {
		query: {
			fields: "*category_children, *products, *product_category_image",
			// ...
		},
	});
};
