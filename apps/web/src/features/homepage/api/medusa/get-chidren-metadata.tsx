import { sdk } from "@/lib/api/sdk";
import type { StoreProductCategoryListResponse } from "@medusajs/types";
import { useQuery } from "@tanstack/react-query";

export const CATEGORIES_ALL_KEY = "product-categories-all";

const CATEGORY_FIELDS =
	"name, handle, *product_category_image, *category_children, *category_children.metadata, *category_children.product_category_image";

export const fetchAllProductCategories = async () => {
	const { product_categories } =
		await sdk.client.fetch<StoreProductCategoryListResponse>(
			`/store/product-categories`,
			{ query: { fields: CATEGORY_FIELDS } },
		);
	return product_categories;
};

export const useGetCategoryByHandler = (
	handle: string,
	metadata: string | string[],
) => {
	const metadataArray = Array.isArray(metadata) ? metadata : [metadata];

	const { data: allCategories, isLoading } = useQuery({
		queryKey: [CATEGORIES_ALL_KEY],
		queryFn: fetchAllProductCategories,
		staleTime: 10 * 60 * 1000,
	});

	return metadataArray.map((metadataKey) => {
		const category = allCategories?.find((cat) => cat.handle === handle);
		const data = category?.category_children?.filter(
			(child) =>
				child?.metadata &&
				metadataKey in (child.metadata as Record<string, unknown>),
		);
		return {
			isLoading,
			data: data ?? (isLoading ? undefined : []),
		};
	});
};

export const getCategoryByHandle = async (_categoryHandle: string[]) => {
	return sdk.client.fetch("/store/product-categories", {
		query: { fields: "*category_children, *products, *product_category_image" },
	});
};
