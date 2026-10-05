"use client";

import { fetchProductsRaw, storeApi } from "@/lib/store-api";
import { normalizeStandaloneProducts } from "@prettyfull/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
	const { products, meta } = await fetchProductsRaw({
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
		});

	const normalized = normalizeStandaloneProducts(
		products.map((product) => {
			const cat = categoryOf(product);
			return { product_id: product.id, product, category_id: cat.id, category: cat };
		}),
	);

	return { products: normalized, meta };
};

export const useCollectionProducts = (params: CollectionProductsParams) =>
	useQuery({
		queryKey: ["collection-products", params],
		queryFn: () => getCollectionProducts(params),
		staleTime: 5 * 60 * 1000,
		// Filtre, tri ou "Voir plus" : on garde la grille affichée pendant le
		// rechargement plutôt que de la remplacer par des squelettes.
		placeholderData: keepPreviousData,
	});

interface CollectionCategory {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	imageUrl: string | null;
	bannerUrl: string | null;
}

/**
 * Infos du rayon (titre, description, visuel), requêtées à part des produits :
 * l'en-tête de page s'affiche dès qu'elles arrivent, sans attendre la grille.
 */
export const useCollectionCategory = (slug: string) =>
	useQuery({
		queryKey: ["collection-category", slug],
		queryFn: () =>
			storeApi
				.get<CollectionCategory>(`/api/store/categories/${encodeURIComponent(slug)}`)
				.catch(() => null),
		enabled: Boolean(slug),
		staleTime: 10 * 60 * 1000,
	});
