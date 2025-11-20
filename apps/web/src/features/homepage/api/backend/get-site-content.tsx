import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { SITE_CONTENT_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getSiteContent = async (lang: string) => {
	const response = await apiClient.get(API_ROUTES.siteContent.visibleContent, {
		headers: {
			"Accept-Language": lang || "en",
		},
	});
	return response.data;
};

export const useGetSiteContent = async (lang: string) => {
	return useQuery({
		queryKey: [SITE_CONTENT_QUERY_KEY, lang],
		queryFn: () => getSiteContent(lang),
	});
};
