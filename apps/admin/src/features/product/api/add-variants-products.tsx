import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const addVariants = async ({
	productId,
	data,
}: {
	productId: string;
	data: FormData;
}) => {
	const response = await apiClient.post(
		API_ROUTES.products.addVariants(productId),
		data,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return response?.data;
};

// Hook personnalisé pour utiliser la mutation
export const useAddVariants = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: addVariants,
		onSuccess,
		onError,
	});
};
