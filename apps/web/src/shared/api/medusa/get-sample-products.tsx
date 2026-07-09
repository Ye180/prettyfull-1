"use client";

import { sdk } from "@/lib/api/sdk";
import { PRODUCTS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";

type StandaloneProduct = {
	product_id: string;
	product: any;
	category_id: string;
	category: any;
};

type StandaloneProductsResult = {
	category: any | null;
	products: StandaloneProduct[];
};

/**
 * Récupère les produits qui appartiennent à une catégorie
 * mais qui n'ont PAS de collection (produits uniques/standalone)
 */
const getStandaloneProductsByCategory = async (
	regionId: string,
	categoryHandle: string
): Promise<StandaloneProductsResult> => {
	// 1. Récupérer l'ID de la catégorie à partir de son handle
	const { product_categories } = await sdk.store.category.list({
		handle: categoryHandle,
	});

	const category = product_categories[0];
	if (!category) {
		return {
			category: null,
			products: [],
		};
	}

	const categoryId = category.id;

	// 2. Récupérer tous les produits de cette catégorie
	const { products } = await sdk.store.product.list({
		fields: "*variants.calculated_price, *categories",
		region_id: regionId,
		category_id: [categoryId],
	});

	// 3. Filtrer les produits qui n'ont PAS de collection (standalone)
	const standaloneProducts: StandaloneProduct[] = products
		.filter((product) => !product.collection_id)
		.map((product) => ({
			product_id: product.id,
			product,
			category_id: categoryId,
			category,
		}));

	return {
		category,
		products: standaloneProducts,
	};
};

/**
 * Hook qui retourne les produits standalone (sans collection)
 * appartenant à une catégorie spécifique
 */
export const useGetStandaloneProductsByCategory = (categoryHandle: string) => {
	const region = useRegionStore((state) => state.region);
	const regionId = region?.id;

	return useQuery({
		queryKey: [
			PRODUCTS_MEDUSA_QUERY_KEY,
			"standalone-by-category",
			categoryHandle,
			regionId,
		],
		queryFn: () => getStandaloneProductsByCategory(regionId!, categoryHandle),
		staleTime: 5 * 60 * 1000,
		enabled: !!regionId && !!categoryHandle,
	});
};

/**
 * Récupère TOUS les produits d'une catégorie (collections + standalone)
 * et les retourne dans un format unifié
 */
const getAllProductsByCategory = async (
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
			standaloneProducts: [],
		};
	}

	const categoryId = category.id;

	// 2. Récupérer tous les produits avec leurs collections
	const { products } = await sdk.store.product.list({
		fields: "*variants.calculated_price, *collection, *categories",
		region_id: regionId,
	});

	// 3. Séparer les produits en deux groupes
	type CollectionGroup = {
		collection_id: string | null;
		collection: any | null;
		categorie: string[];
		products: any[];
	};

	const grouped: Record<string, CollectionGroup> = {};
	const standaloneProducts: StandaloneProduct[] = [];

	for (const product of products) {
		const collectionId = product.collection_id;
		const categorieId = product.collection?.metadata?.categorie_id;
		const categories =
			typeof categorieId === "string" ? categorieId.split(",") : undefined;

		// Produit avec collection ET catégorie dans metadata
		if (collectionId && categories && categories.length > 0) {
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
		// Produit SANS collection mais avec la catégorie recherchée
		else if (!collectionId) {
			const productCategories = product.categories || [];
			const hasCategory = productCategories.some(
				(cat: any) => cat.id === categoryId
			);

			if (hasCategory) {
				standaloneProducts.push({
					product_id: product.id,
					product,
					category_id: categoryId,
					category,
				});
			}
		}
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
		standaloneProducts,
	};
};

/**
 * Hook qui retourne TOUS les produits d'une catégorie
 * (collections + produits standalone)
 */
export const useGetSampleProducts = (categoryHandle: string) => {
	const region = useRegionStore((state) => state.region);
	const regionId = region?.id;

	return useQuery({
		queryKey: [
			PRODUCTS_MEDUSA_QUERY_KEY,
			"all-by-category",
			categoryHandle,
			regionId,
		],
		queryFn: () => getAllProductsByCategory(regionId!, categoryHandle),
		enabled: !!regionId && !!categoryHandle,
	});
};
