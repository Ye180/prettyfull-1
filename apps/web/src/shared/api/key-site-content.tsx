import { API_ROUTES } from "@/api";
import { KEY_CONTENT_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/client";

const getKeySiteContent = async () => {
	const response = await apiClient.get(API_ROUTES.siteContent.getKeyContent, {
		headers: {
			"Accept-Language": "fr",
		},
	});
	return response.data;
};

export const useGetSiteKeyContent = () => {
	return useQuery({
		queryKey: [KEY_CONTENT_QUERY_KEY],
		queryFn: () => getKeySiteContent(),
	});
};
