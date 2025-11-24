import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

interface RemoveCardsParams {
	productId: string;
	userId: string;
}

export const removeCartByUserId = async ({
	userId,
	productId,
}: RemoveCardsParams) => {
	const response = await apiClient.delete(
		API_ROUTES.cart.removeItemsCartByUserId(userId, productId)
	);
	return response.data;
};

export const useRemoveCartByUserId = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: removeCartByUserId,
		onSuccess,
		onError,
	});
};
