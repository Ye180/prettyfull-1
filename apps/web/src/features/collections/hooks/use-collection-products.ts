"use client";

import { fetchProductsRaw, storeApi } from "@/lib/store-api";
import { normalizeStandaloneProducts } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";
import type { SortField } from "./use-collection-filters";

interface CollectionProductsParams {
	/** Rayon ciblé ; absent (ou vide) = tout le catalogue (page `/collections`). */
	categorySlug?: string;
	/** Palier croissant plutôt que page accumulée - même logique que `useProductReviews`. */
	limit: number;
	sort: SortField;
	order: "asc" | "desc";
	q: string;
	minPrice: number | null;
	maxPrice: number | null;
	/** Tailles sélectionnées (correspondance « ou »). */
	sizes?: string[];
	/** Couleurs sélectionnées (correspondance « ou »). */
	colors?: string[];
	stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
	onSale?: boolean;
}

/** Catégorie d'un produit brut, dérivée du `collection` renvoyé par `toRawProduct`. */
const categoryOf = (product: {
	collection: { title: string; handle: string; metadata: unknown } | null;
}) => {
	const metadata = product.collection?.metadata as { categorie_id?: string } | null;
	return {
		id: metadata?.categorie_id ?? "",
		name: product.collection?.title ?? "",
		handle: product.collection?.handle ?? "",
	};
};

/**
 * Produits d'un rayon (ou de tout le catalogue si `categorySlug` est omis),
 * avec vrais filtres/tri/recherche, adossés à `fetchProductsRaw`.
 *
 * Le nom du rayon n'est requêté que si `categorySlug` est fourni (titre de la
 * page `/collections/[slug]`) ; sinon chaque produit porte sa propre catégorie
 * (utile quand la liste mélange plusieurs rayons, page `/collections`).
 */
const getCollectionProducts = async (params: CollectionProductsParams) => {
	const [category, { products, meta }] = await Promise.all([
		params.categorySlug
			? storeApi
					.get<{
						id: string;
						name: string;
						slug: string;
						imageUrl: string | null;
						bannerUrl: string | null;
					}>(`/api/store/categories/${encodeURIComponent(params.categorySlug)}`)
					.catch(() => null)
			: Promise.resolve(null),
		fetchProductsRaw({
			categorySlug: params.categorySlug,
			limit: params.limit,
			sort: params.sort,
			order: params.order,
			q: params.q || undefined,
			minPrice: params.minPrice ?? undefined,
			maxPrice: params.maxPrice ?? undefined,
			size: params.sizes && params.sizes.length > 0 ? params.sizes.join(",") : undefined,
			color: params.colors && params.colors.length > 0 ? params.colors.join(",") : undefined,
			stockStatus: params.stockStatus,
			onSale: params.onSale,
		}),
	]);

	const normalized = normalizeStandaloneProducts(
		products.map((product) => {
			const cat = categoryOf(product);
			return { product_id: product.id, product, category_id: cat.id, category: cat };
		}),
	);

	return {
		categoryName: category?.name ?? "",
		categoryImage: category?.bannerUrl || category?.imageUrl || "",
		products: normalized,
		meta,
	};
};

export const useCollectionProducts = (params: CollectionProductsParams) =>
	useQuery({
		queryKey: ["collection-products", params],
		queryFn: () => getCollectionProducts(params),
		staleTime: 5 * 60 * 1000,
	});
