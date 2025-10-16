import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { ORDERS_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getOrders = async () => {
	const res = await apiClient.get(API_ROUTES.orders.getAll);
	return res.data;
};

export const useGetOrders = () => {
	return useQuery({
		queryKey: [ORDERS_QUERY_KEY],
		queryFn: getOrders,
	});
};
