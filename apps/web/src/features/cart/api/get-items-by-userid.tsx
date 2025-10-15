import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getItemsCartByUserId = async (userId: string) => {
	const response = await apiClient.get(API_ROUTES.cart.getItem(userId));
	return response.data;
};

export const useGetItemsCartByUserId = (userId: string) => {
	return useQuery({
		queryKey: [CART_QUERY_KEY, userId],
		queryFn: () => getItemsCartByUserId(userId),
		enabled: !!userId,
	});
};
