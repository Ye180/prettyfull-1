import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const create = async (data: any) => {
	// Si data est un FormData, on le passe tel quel
	// Sinon on fait un POST JSON classique
	const isFormData = data instanceof FormData;

	const response = await apiClient.post(
		API_ROUTES.siteContent.create_step1,
		data,
		{
			headers: isFormData
				? { "Content-Type": "multipart/form-data" }
				: { "Content-Type": "application/json" },
		}
	);
	return response?.data;
};

// Hook personnalisé pour utiliser la mutation
export const useCreateSiteContent = ({
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
