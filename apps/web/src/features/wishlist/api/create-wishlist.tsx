import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const createWishlist = async (productId: string) => {
	const response = await apiClient.post(API_ROUTES.wishlist.add(productId));
	return response.data;
};

export const useCreateWishlist = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: createWishlist,
		onSuccess,
		onError,
	});
};
