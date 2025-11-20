"use client";

import { sdk } from "@/lib/api/sdk";
import { PARENTS_CATEGORIES_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getParentsCategoryMedusa = async () => {
	const response = sdk.store.category
		.list({
			fields: "category_children.id,category_children.name",
			include_descendants_tree: true,
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

export const useGetParentsCategoryMedusa = () => {
	return useQuery({
		queryKey: [PARENTS_CATEGORIES_MEDUSA_QUERY_KEY],
		queryFn: () => getParentsCategoryMedusa(),
	});
};
