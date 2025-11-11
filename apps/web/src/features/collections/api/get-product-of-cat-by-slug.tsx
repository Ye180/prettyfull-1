import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { PRODUCTS_QUERY_KEY_BY_SLUG } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

type PaginationParams = {
	page?: number;
	limit?: number;
};

export const getProductBySlug = async ({
	categorySlug,
}: {
	// pagination: PaginationParams;
	categorySlug: string;
}) => {
	const response = await apiClient.get(
		API_ROUTES.products.getByCategorySlug(categorySlug),
		{
			headers: {
				"Accept-Language": "fr",
			},
		}
	);
	return response.data;
};

export const useGetProductsByCategorySlug = (categorySlug: string) => {
	return useQuery({
		queryKey: [PRODUCTS_QUERY_KEY_BY_SLUG, categorySlug],
		queryFn: () => getProductBySlug({ categorySlug }),
	});
};
