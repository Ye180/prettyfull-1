import { API_ROUTES } from "@/shared/lib/api";
import apiClient from "@/shared/lib/client";
import { CATEGORIES_QUERY_KEY } from "@/utils/query-keys";
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

export const getCategory = async ({ etats }: { etats?: etatsTypes }) => {
	const response = await apiClient.get(API_ROUTES.categories.getAll, {
		params: {
			...etats,
		},
	});
	return response.data;
};

export const useGetCategory = (etats?: etatsTypes) => {
	return useQuery({
		queryKey: [CATEGORIES_QUERY_KEY, etats],
		queryFn: () => getCategory({ etats }),
	});
};
