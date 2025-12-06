"use client";

import { sdk } from "@/lib/api/sdk";
import { COLLECTIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";

const getProductsSameCollection = async (regionId: string) => {
	const { products } = await sdk.store.product.list({
		fields: "*variants.calculated_price",
		region_id: regionId,
	});

	const grouped: Record<
		string,
		{
			collection_id: string | null;
			collection: any | null;
			products: any[];
		}
	> = {};

	// First, group products by collection_id
	for (const product of products) {
		const collectionId = product.collection_id;
		if (!collectionId) continue;

		if (!grouped[collectionId]) {
			grouped[collectionId] = {
				collection_id: collectionId,
				collection: null,
				products: [],
			};
		}

		grouped[collectionId].products.push(product);
	}

	// Then, fetch the collection data for each group
	await Promise.all(
		Object.values(grouped).map(async (group) => {
			if (!group.collection_id) return;
			const { collection } = await sdk.store.collection.retrieve(
				group.collection_id as string
			);
			group.collection = collection;
		})
	);

	return Object.values(grouped);
};

export const useGetProductsSameCollection = () => {
	const region = useRegionStore((state) => state.region);
	const regionId = region?.id;

	return useQuery({
		queryKey: [COLLECTIONS_MEDUSA_QUERY_KEY, regionId],
		queryFn: () => getProductsSameCollection(regionId!),
		enabled: !!regionId,
	});
};
