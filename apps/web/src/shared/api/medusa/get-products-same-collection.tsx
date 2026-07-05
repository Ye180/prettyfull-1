"use client";

import { sdk } from "@/lib/api/sdk";
import { COLLECTIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";

const getProductsSameCollection = async (regionId: string) => {
	const { products } = await sdk.store.product.list({
		fields:
			"*variants.calculated_price, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *variants.options, *variants.options.option, *collection, *collection.metadata",
		region_id: regionId,
		limit: 250,
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

	for (const product of products) {
		const collectionId = product.collection_id;
		const categorieId = product.collection?.metadata?.categorie_id;
		const categorie =
			typeof categorieId === "string" ? categorieId.split(",") : undefined;

		if (!collectionId || !categorie || categorie.length === 0) continue;

		if (!grouped[collectionId]) {
			grouped[collectionId] = {
				collection_id: collectionId,
				collection: product.collection ?? null,
				products: [],
				categorie,
			};
		}

		grouped[collectionId]?.products.push(product);
	}

	return Object.values(grouped);
};

export const useGetProductsSameCollection = () => {
	const region = useRegionStore((state) => state.region);
	const regionId = region?.id;

	return useQuery({
		queryKey: [COLLECTIONS_MEDUSA_QUERY_KEY, regionId],
		queryFn: () => getProductsSameCollection(regionId!),
		staleTime: 5 * 60 * 1000,
		enabled: !!regionId,
	});
};
