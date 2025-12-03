"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

export const getCollectionProductsMedusa = async (collectionId: string) => {
	if (!collectionId) return [];

	const response = await sdk.store.product.list({
		fields: "*variants.calculated_price,*images",
		region_id: "reg_01KAGE6E6H99WSEH3F2A8BB684",
		collection_id: [collectionId],
		limit: 20,
	});

	return response.products || [];
};

export const useGetCollectionProductsMedusa = (
	collectionId: string | undefined
) => {
	return useQuery({
		queryKey: ["collection-products", collectionId],
		queryFn: () => getCollectionProductsMedusa(collectionId!),
		enabled: !!collectionId,
	});
};
