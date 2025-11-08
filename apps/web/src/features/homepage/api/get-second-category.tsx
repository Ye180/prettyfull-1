import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { CATEGORIES_SECOND_QUERY_KEY } from "@/shared/utils/query-keys";
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

export const getCategory = async () => {
	const response = await apiClient.get(
		API_ROUTES.categories.getSecondaireCategories,
		{
			headers: {
				"Accept-Language": "fr",
			},
		}
	);
	return response.data;
};

export const useGetSecondCategory = () => {
	return useQuery({
		queryKey: [CATEGORIES_SECOND_QUERY_KEY],
		queryFn: () => getCategory(),
	});
};
