import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const create = async (data) => {
	const response = await apiClient.post(API_ROUTES.products.create, data);
	return response?.data;
};

// Hook personnalisé pour utiliser la mutation
export const useCreate = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: create,
		onSuccess,
		onError,
	});
};
