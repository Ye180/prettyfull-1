"use client";

import { sdk } from "@/lib/api/sdk";
import { COLLECTIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";

type CollectionGroup = {
	collection_id: string | null;
	collection: any | null;
	categorie: string[];
	products: any[];
};

/**
 * Récupère toutes les collections qui ont la catégorie spécifiée dans leur metadata
 */
const getCollectionsByCategory = async (
	regionId: string,
	categoryHandle: string
) => {
	// 1. Récupérer l'ID de la catégorie à partir de son handle
	const { product_categories } = await sdk.store.category.list({
		handle: categoryHandle,
	});

	const category = product_categories[0];
	if (!category) {
		return {
			category: null,
			collections: [],
		};
	}

	const categoryId = category.id;

	// 2. Récupérer tous les produits avec leurs collections
	const { products } = await sdk.store.product.list({
		fields: "*variants.calculated_price, *collection",
		region_id: regionId,
	});

	// 3. Grouper les produits par collection_id
	const grouped: Record<string, CollectionGroup> = {};

	for (const product of products) {
		const collectionId = product.collection_id;
		const categorieId = product.collection?.metadata?.categorie_id;
		const categories =
			typeof categorieId === "string" ? categorieId.split(",") : undefined;

		if (!collectionId || !categories || categories.length === 0) continue;

		if (!grouped[collectionId]) {
			grouped[collectionId] = {
				collection_id: collectionId,
				collection: null,
				products: [],
				categorie: categories,
			};
		}

		grouped[collectionId].products.push(product);
	}

	// 4. Récupérer les données de chaque collection
	await Promise.all(
		Object.values(grouped).map(async (group) => {
			if (!group.collection_id) return;
			const { collection } = await sdk.store.collection.retrieve(
				group.collection_id,
				{ fields: "id,title,handle,metadata" }
			);
			group.collection = collection;
		})
	);

	// 5. Filtrer les collections qui contiennent la catégorie recherchée
	const collectionsWithCategory = Object.values(grouped).filter((group) =>
		group.categorie.includes(categoryId)
	);

	return {
		category,
		collections: collectionsWithCategory,
	};
};

/**
 * Hook qui retourne les collections ayant une catégorie spécifique
 * basée sur le handle de la catégorie passé en argument
 */
export const useGetCollectionsByCategory = (categoryHandle: string) => {
	const region = useRegionStore((state) => state.region);
	const regionId = region?.id;

	return useQuery({
		queryKey: [
			COLLECTIONS_MEDUSA_QUERY_KEY,
			"by-category",
			categoryHandle,
			regionId,
		],
		queryFn: () => getCollectionsByCategory(regionId!, categoryHandle),
		enabled: !!regionId && !!categoryHandle,
	});
};
