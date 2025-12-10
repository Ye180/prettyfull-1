// import { API_ROUTES } from "@/api";
// import apiClient from "@/shared/lib/client";
// // import { CardProps } from "@prettyfull/ui";
// import { useMutation } from "@tanstack/react-query";

// interface RemoveWishlistItemParams {
// 	id: string;
// }

// export const removeWishlistItem = async ({
// 	id,
// }: RemoveWishlistItemParams): Promise<CardProps> => {
// 	const response = await apiClient.delete<CardProps>(
// 		API_ROUTES.wishlist.remove(id)
// 	);
// 	return response.data;
// };

// export const useRemoveWishlistItem = ({
// 	onSuccess,
// 	onError,
// }: {
// 	onSuccess?: () => void;
// 	onError?: () => void;
// } = {}) => {
// 	return useMutation({
// 		mutationFn: removeWishlistItem,
// 		onSuccess,
// 		onError,
// 	});
// };
