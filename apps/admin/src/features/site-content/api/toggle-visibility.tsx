import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { SITE_CONTENT_QUERY_KEY } from "@/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * 🔄 Hook pour toggle la visibilité d'un site-content
 */
export const useToggleVisibility = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
			const response = await apiClient.patch(
				API_ROUTES.siteContent.toggleVisible(id),
				{
					isActive,
				}
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Invalider le cache pour rafraîchir la liste
			queryClient.invalidateQueries({
				queryKey: [SITE_CONTENT_QUERY_KEY],
			});
			toast.success(
				data.isActive
					? "Contenu activé avec succès"
					: "Contenu désactivé avec succès"
			);
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ||
					"Erreur lors du changement de visibilité"
			);
		},
	});
};
