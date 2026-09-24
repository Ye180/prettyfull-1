"use client";

import { fetchProductFacets } from "@/lib/store-api/queries";
import { useQuery } from "@tanstack/react-query";

interface CollectionFacetsParams {
	/** Même rayon que `useCollectionProducts` ; absent = tout le catalogue. */
	categorySlug?: string;
	q: string;
}

/**
 * Tailles/couleurs distinctes et bornes de prix du rayon regardé - alimente
 * `SidebarFilter` pour qu'elle ne propose jamais une valeur sans résultat.
 *
 * Scopé par rayon/recherche seulement, pas par les autres filtres cochés
 * (voir `getProductFacets` côté back) : la liste ne doit pas se vider au fil
 * des sélections.
 */
export const useCollectionFacets = (params: CollectionFacetsParams) =>
	useQuery({
		queryKey: ["collection-facets", params],
		queryFn: () =>
			fetchProductFacets({
				categorySlug: params.categorySlug,
				q: params.q || undefined,
			}),
		staleTime: 5 * 60 * 1000,
	});
