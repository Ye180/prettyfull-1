import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { PRODUCTS_QUERY_KEY } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

type PaginationParams = {
	page?: number;
	limit?: number;
};

export const getProduct = async ({
	pagination,
}: {
	pagination: PaginationParams;
}) => {
	const response = await apiClient.get(API_ROUTES.products.getAll, {
		params: {
			...pagination,
		},
		headers: {
			"Accept-Language": "fr",
		},
	});
	return response.data;
};

export const useGetProducts = (paginationParams: PaginationParams) => {
	return useQuery({
		queryKey: [PRODUCTS_QUERY_KEY, paginationParams],
		queryFn: () => getProduct({ pagination: paginationParams }),
	});
};
