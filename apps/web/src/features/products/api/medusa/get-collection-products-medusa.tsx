"use client";

import { getProductsByCollectionId } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

export const getCollectionProductsMedusa = async (collectionId: string) => {
	if (!collectionId) return [];
	return getProductsByCollectionId(collectionId);
};

export const useGetCollectionProductsMedusa = (
	collectionId: string | undefined,
	regionId: string | undefined,
) => {
	return useQuery({
		queryKey: ["collection-products", collectionId],
		queryFn: () => getCollectionProductsMedusa(collectionId!),
		staleTime: Infinity,
		enabled: !!collectionId,
	});
};
