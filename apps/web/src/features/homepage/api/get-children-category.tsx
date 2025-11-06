import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CATEGORIES_CHILDREN_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export interface Category {
	id: string;
	name: string;
	description: string;
	slug: string;
	icon: string;
	image: string;
	isActive: boolean;
	isVisible: boolean;
	sortOrder: number;
	productCount: number;
	parentId: string | null;
	children: Category[];
	seoMeta: {
		keywords: string[];
	};
}

export type etatsTypes = {
	first?: boolean | undefined;
	second?: boolean | undefined;
};

export const getChildrenCategory = async (slug: string) => {
	const response = await apiClient.get(
		API_ROUTES.categories.getChildrenCategories(slug),
		{
			headers: {
				"Accept-Language": "fr",
			},
		}
	);
	return response.data;
};

export const useGetChildrenCategory = (slug: string) => {
	return useQuery({
		queryKey: [CATEGORIES_CHILDREN_QUERY_KEY, slug],
		queryFn: () => getChildrenCategory(slug),
	});
};
