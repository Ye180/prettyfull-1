import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { CUSTOMERS_QUERY_KEY } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

type PaginationParams = {
	page?: number;
	limit?: number;
};

export const getCustomers = async () => {
	const response = await apiClient.get(
		API_ROUTES.orders.getAllCustomersWithOrders,
		{
			headers: {
				"Accept-Language": "fr",
			},
		}
	);
	return response.data;
};

export const useGetCustomers = () => {
	return useQuery({
		queryKey: [CUSTOMERS_QUERY_KEY],
		queryFn: () => getCustomers(),
	});
};
