import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { WISHLIST_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getWishlist = async () => {
	const response = await apiClient.get(API_ROUTES.wishlist.get);
	return response.data;
};

export const useGetWishlist = () => {
	return useQuery({
		queryKey: [WISHLIST_QUERY_KEY],
		queryFn: getWishlist,
	});
};
