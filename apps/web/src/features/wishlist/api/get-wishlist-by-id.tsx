import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { WISHLIST_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const checkWishlist = async (productId: string) => {
	try {
		const response = await apiClient.get(API_ROUTES.wishlist.check(productId));
		return response.data;
	} catch (error) {
		console.error("Error checking wishlist:", error);
		throw error;
	}
};

export const useCheckWishlistById = (productId: string) => {
	return useQuery({
		queryKey: [WISHLIST_QUERY_KEY, productId],
		queryFn: () => checkWishlist(productId),
		enabled: !!productId,
	});
};
