import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { SITE_CONTENT_QUERY_KEY } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

type GetSiteContentsParams = {
	type?: string;
	isActive?: boolean;
};

/**
 * Récupère tous les site-content (route admin)
 * Avec population des catégories
 */
export const getAllSiteContents = async (params?: GetSiteContentsParams) => {
	const response = await apiClient.get(API_ROUTES.siteContent.getAll, {
		params,
		headers: {
			"Accept-Language": "fr",
		},
	});
	return response.data;
};

/**
 * Hook pour récupérer tous les site-content (admin)
 */
export const useGetAllSiteContents = (params?: GetSiteContentsParams) => {
	return useQuery({
		queryKey: [SITE_CONTENT_QUERY_KEY, "all", params],
		queryFn: () => getAllSiteContents(params),
	});
};

/**
 * Récupère uniquement les site-content visibles (isActive: true)
 * Route publique avec population des catégories
 */
export const getVisibleSiteContents = async (id: string, data?: string) => {
	const response = await apiClient.get(
		API_ROUTES.siteContent.toggleVisible(id),
		data
			? {
					params: data ? { data } : undefined,
					headers: {
						"Accept-Language": "fr",
					},
				}
			: undefined
	);
	return response.data;
};

/**
 * Hook pour récupérer les site-content visibles (public)
 */
export const useGetVisibleSiteContents = (type?: string) => {
	return useQuery({
		queryKey: [SITE_CONTENT_QUERY_KEY, "visible", type],
		queryFn: () => getVisibleSiteContents(type),
	});
};
