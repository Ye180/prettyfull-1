import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CardProps } from "@prettyfull/ui";
import { useMutation } from "@tanstack/react-query";

export const removeCartByUserId = async (
	userId: string
): Promise<CardProps> => {
	const response = await apiClient.delete(
		API_ROUTES.cart.removeCartById(userId)
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
