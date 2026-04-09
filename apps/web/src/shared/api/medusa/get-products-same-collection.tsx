"use client";

import { sdk } from "@/lib/api/sdk";
import { COLLECTIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";

const getProductsSameCollection = async (regionId: string) => {
	const { products } = await sdk.store.product.list({
		fields: "*variants.calculated_price, *collection",
		region_id: regionId,
	});

	const grouped: Record<
		string,
		{
			collection_id: string | null;
			collection: any | null;
			categorie?: any | null;
			products: any[];
		}
	> = {};

	// First, group products by collection_id
	for (const product of products) {
		const collectionId = product.collection_id;

		const categorieId = product.collection?.metadata?.categorie_id;
		const categorie =
			typeof categorieId === "string" ? categorieId.split(",") : undefined;

		if (!collectionId || !categorie || categorie.length === 0) continue;

		if (!grouped[collectionId]) {
			grouped[collectionId] = {
				collection_id: collectionId,
				collection: null,
				products: [],
				categorie: categorie,
			};
		}

		grouped[collectionId]?.products.push(product);
	}

	// Then, fetch the collection data for each group
	await Promise.all(
		Object.values(grouped).map(async (group) => {
			if (!group.collection_id) return;
			const { collection } = await sdk.store.collection.retrieve(
				group.collection_id as string,
				{ fields: "id,title,handle,metadata" },
			);
			group.collection = collection;
		}),
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
