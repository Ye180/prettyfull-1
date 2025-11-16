import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { ORDERS_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getOrders = async (id: string) => {
	const res = await apiClient.get(API_ROUTES.orders.getById(id));
	return res.data;
};

export const useGetOrders = (id: string) => {
	return useQuery({
		queryKey: [ORDERS_QUERY_KEY, id],
		queryFn: () => getOrders(id),
		enabled: !!id,
	});
};
