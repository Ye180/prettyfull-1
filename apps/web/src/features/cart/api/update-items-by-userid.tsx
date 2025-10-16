import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CardProps } from "@prettyfull/ui";
import { useMutation } from "@tanstack/react-query";

interface UpdateProductParams {
	productId: string;
	userId: string;
}

export const updateCardsByUserId = async ({
	userId,
	productId,
}: UpdateProductParams): Promise<CardProps> => {
	const response = await apiClient.patch<CardProps>(
		API_ROUTES.cart.updateItemsProductByUserId(userId, productId)
	);
	return response.data;
};

export const useUpdateCardsByUserId = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: updateCardsByUserId,
		onSuccess,
		onError,
	});
};
