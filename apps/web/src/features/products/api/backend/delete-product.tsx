import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CardProps } from "@prettyfull/ui";
import { useMutation } from "@tanstack/react-query";

interface RemoveProductParams {
	id: string;
}

export const removeProduct = async ({
	id,
}: RemoveProductParams): Promise<CardProps> => {
	const response = await apiClient.post<CardProps>(
		API_ROUTES.products.remove(id)
	);
	return response.data;
};

export const useRemoveProduct = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: removeProduct,
		onSuccess,
		onError,
	});
};
