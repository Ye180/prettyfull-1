// import { API_ROUTES } from "@/api";
// import apiClient from "@/shared/lib/client";
// import { CardProps } from "@prettyfull/ui";
// import { useMutation } from "@tanstack/react-query";

// export const removeWishlistAll = async (): Promise<CardProps> => {
// 	const response = await apiClient.delete(API_ROUTES.wishlist.removeAll);
// 	return response.data;
// };

// export const useRemoveWishlistAll = ({
// 	onSuccess,
// 	onError,
// }: {
// 	onSuccess?: () => void;
// 	onError?: () => void;
// } = {}) => {
// 	return useMutation({
// 		mutationFn: removeWishlistAll,
// 		onSuccess,
// 		onError,
// 	});
// };
