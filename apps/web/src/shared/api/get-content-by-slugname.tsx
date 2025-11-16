import { API_ROUTES } from "@/api";
import { SLUGNAMES_CONTENT_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/client";

const getSiteContentBySlugName = async (slugName: string) => {
	const response = await apiClient.get(
		API_ROUTES.siteContent.getByCategorySlug(slugName, "fr"),
		{
			headers: {
				"Accept-Language": "fr",
			},
		}
	);
	return response.data;
};

export const useGetSiteSlugNameContent = (slugName: string) => {
	return useQuery({
		queryKey: [SLUGNAMES_CONTENT_QUERY_KEY, slugName],
		queryFn: () => getSiteContentBySlugName(slugName),
		enabled: !!slugName,
	});
};
