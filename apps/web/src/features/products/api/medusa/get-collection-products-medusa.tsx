"use client";

import { fetchProductsByCategory } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/**
 * Produits d'une collection.
 *
 * Les « collections » du storefront correspondent aux rayons du catalogue :
 * l'identifiant reçu est de la forme `col_<categoryId>`, ou directement un
 * slug de rayon.
 */
export const getCollectionProductsMedusa = async (collectionId: string) => {
	if (!collectionId) return [];
	return fetchProductsByCategory(collectionId.replace(/^col_/, ""));
};

export const useGetCollectionProductsMedusa = (collectionId: string | undefined) =>
	useQuery({
		queryKey: ["collection-products", collectionId],
		queryFn: () => getCollectionProductsMedusa(collectionId!),
		staleTime: 5 * 60 * 1000,
		enabled: !!collectionId,
	});
