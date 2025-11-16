import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { ORDERS_QUERY_KEY } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

type PaginationParams = {
	page?: number;
	limit?: number;
};

export const getOrders = async ({
	pagination,
}: {
	pagination: PaginationParams;
}) => {
	const response = await apiClient.get(API_ROUTES.orders.getAll, {
		params: {
			...pagination,
		},
		headers: {
			"Accept-Language": "fr",
		},
	});
	return response.data;
};

export const useGetOrders = (paginationParams: PaginationParams) => {
	return useQuery({
		queryKey: [ORDERS_QUERY_KEY, paginationParams],
		queryFn: () => getOrders({ pagination: paginationParams }),
	});
};
