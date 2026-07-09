"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

export const getCollectionProductsMedusa = async (
	collectionId: string,
	regionId: string
) => {
	if (!collectionId || !regionId) return [];

	const response = await sdk.store.product.list({
		fields: "*variants.calculated_price,*images",
		region_id: regionId,
		collection_id: [collectionId],
		limit: 20,
	});

	return response.products || [];
};

export const useGetCollectionProductsMedusa = (
	collectionId: string | undefined,
	regionId: string | undefined
) => {
	return useQuery({
		queryKey: ["collection-products", collectionId, regionId],
		queryFn: () => getCollectionProductsMedusa(collectionId!, regionId!),
		staleTime: 5 * 60 * 1000,
		enabled: !!collectionId && !!regionId,
	});
};
