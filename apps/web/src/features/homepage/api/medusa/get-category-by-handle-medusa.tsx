"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

export const getCategoryByHandleMedusa = async (handle: string) => {
	const response = sdk.store.category
		.list({
			fields:
				"name, handle, category_children.id,category_children.name, category_children.handle,",
			// include_descendants_tree: true,
			handle: handle,
		})
		.then(({ product_categories }) => {
			// Filtrer uniquement les catégories qui ont au moins un enfant
			const categoriesWithChildren = product_categories.filter(
				(cat) =>
					Array.isArray(cat.category_children) &&
					cat.category_children.length > 0
			);
			// categoriesWithChildren contient maintenant uniquement les catégories avec enfants
			return categoriesWithChildren;
		});
	return response;
};

export const useGetCategoryByHandleMedusa = (handle: string) => {
	return useQuery({
		queryKey: [handle],
		queryFn: () => getCategoryByHandleMedusa(handle),
	});
};
