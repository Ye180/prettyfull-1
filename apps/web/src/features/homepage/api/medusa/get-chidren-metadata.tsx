"use client";

import { fetchCategoryTree } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export const CATEGORIES_ALL_KEY = "product-categories-all";

export const fetchAllProductCategories = () => fetchCategoryTree();

/**
 * Rayons rattachés à une section de la page d'accueil.
 *
 * Les clés de section (`third_section`, `sixth_section`…) sont injectées dans
 * `metadata` par l'adaptateur, à partir des mises en avant configurées dans le
 * back-office : ces emplacements sont donc pilotables sans toucher au front.
 */
export const useGetCategoryByHandler = (
	handle: string,
	metadata: string | string[],
) => {
	const metadataArray = Array.isArray(metadata) ? metadata : [metadata];

	const { data: allCategories, isLoading } = useQuery({
		queryKey: [CATEGORIES_ALL_KEY],
		queryFn: fetchAllProductCategories,
		staleTime: 10 * 60 * 1000,
	});

	return metadataArray.map((metadataKey) => {
		const category = allCategories?.find((cat) => cat.handle === handle);
		const data = category?.category_children?.filter(
			(child) =>
				child?.metadata &&
				metadataKey in (child.metadata as Record<string, unknown>),
		);

		return { isLoading, data: data ?? (isLoading ? undefined : []) };
	});
};
