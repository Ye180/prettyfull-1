import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const update = async (data: any) => {
	// Si data est un FormData, on le passe tel quel
	// Sinon on fait un PATCH JSON classique
	const isFormData = data instanceof FormData;
	const id = isFormData ? data.get("id") : data.id;

	const response = await apiClient.patch(
		API_ROUTES.siteContent.update_step2(id as string),
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
export const useUpdateSiteContent2 = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: update,
		onSuccess,
		onError,
	});
};
