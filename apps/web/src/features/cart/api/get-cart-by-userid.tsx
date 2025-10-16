import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getCartByUserId = async (userId: string) => {
	const response = await apiClient.get(
		API_ROUTES.cart.addItemsToCartByUserId(userId)
	);
	return response.data;
};

export const useGetCartByUserId = (userId: string) => {
	return useQuery({
		queryKey: [CART_QUERY_KEY, userId],
		queryFn: () => getCartByUserId(userId),
		enabled: !!userId,
	});
};
