"use client";

import {
	CATEGORIES_ALL_KEY,
	fetchAllProductCategories,
} from "./get-chidren-metadata";
import { useQuery } from "@tanstack/react-query";

export const useGetParentsCategoryMedusa = () => {
	return useQuery({
		queryKey: [CATEGORIES_ALL_KEY],
		queryFn: fetchAllProductCategories,
		staleTime: 10 * 60 * 1000,
		select: (categories) =>
			categories.filter(
				(cat) =>
					Array.isArray((cat as any).category_children) &&
					(cat as any).category_children.length > 0,
			),
	});
};
