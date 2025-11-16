import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { SITE_CONTENT_QUERY_KEY } from "@/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * 🗑️ Hook pour supprimer un site-content
 */
export const useDeleteSiteContent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await apiClient.delete(
				API_ROUTES.siteContent.remove(id)
			);
			return response.data;
		},
		onSuccess: () => {
			// Invalider le cache pour rafraîchir la liste
			queryClient.invalidateQueries({
				queryKey: [SITE_CONTENT_QUERY_KEY],
			});
			toast.success("Contenu supprimé avec succès");
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ||
					"Erreur lors de la suppression du contenu"
			);
		},
	});
};
