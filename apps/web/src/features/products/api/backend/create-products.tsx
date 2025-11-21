import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CardProps } from "@prettyfull/ui";
import { useMutation } from "@tanstack/react-query";

export const createProduct = async (
	productData: Omit<CardProps, "id">
): Promise<CardProps> => {
	const response = await apiClient.post<CardProps>(
		API_ROUTES.products.getAll,
		productData
	);
	return response.data;
};

export const useCreateProduct = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: createProduct,
		onSuccess,
		onError,
	});
};
