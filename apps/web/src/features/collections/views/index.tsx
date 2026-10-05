"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import SidebarFilter, { FilterState } from "../organims/sidebar-filter";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import ProductCardSkeleton from "@/shared/components/organims/product-loading";
import { useRegionStore } from "@/stores/useRegion";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useCollectionFacets } from "../hooks/use-collection-facets";
import { useCollectionFilters } from "../hooks/use-collection-filters";
import {
	useCollectionCategory,
	useCollectionProducts,
} from "../hooks/use-collection-products";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";

// 7 lignes de la grille dense (5 colonnes en desktop) avant le bouton "See More".
const PAGE_SIZE = 35;

const SORT_OPTIONS = [
	{
		value: "createdAt:desc",
		label: "Nouveautés",
		sort: "createdAt" as const,
		order: "desc" as const,
	},
	{
		value: "basePrice:asc",
		label: "Prix croissant",
		sort: "basePrice" as const,
		order: "asc" as const,
	},
	{
		value: "basePrice:desc",
		label: "Prix décroissant",
		sort: "basePrice" as const,
		order: "desc" as const,
	},
	{
		value: "name:asc",
		label: "Nom (A → Z)",
		sort: "name" as const,
		order: "asc" as const,
	},
];

export const CollectionViews = () => {
	const params = useParams();
	const slug = (params.slug as string) || "";

	const {
		q,
		sort,
		order,
		minPrice,
		maxPrice,
		sizes,
		colors,
		availability,
		setSearch,
		setSort,
		setPriceRange,
		setSizes,
		setColors,
		setAvailability,
		clear: clearFilters,
	} = useCollectionFilters();
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const [searchDraft, setSearchDraft] = useState(q);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Debounce : un fetch par pause de frappe, pas par caractère.
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchDraft !== q) setSearch(searchDraft);
		}, 400);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	// Nouveau filtre/tri => on repart du premier palier de "Load More".
	useEffect(() => {
		setLimit(PAGE_SIZE);
	}, [q, sort, order, minPrice, maxPrice, sizes, colors, availability]);

	const t = useTranslations("CollectionPage.page");
	const { data: category, isLoading: isLoadingCategory } =
		useCollectionCategory(slug);
	const { data, isLoading } = useCollectionProducts({
		categorySlug: slug,
		limit,
		sort,
		order,
		q,
		minPrice,
		maxPrice,
		sizes,
		colors,
		stockStatus: availability === "in_stock" ? "in_stock" : undefined,
		onSale: availability === "on_sale" ? true : undefined,
	});

	const { data: facets, isLoading: isLoadingFacets } = useCollectionFacets({
		categorySlug: slug,
		q,
	});

	const filters: FilterState = {
		categorySlug: slug,
		sizes,
		colors,
		minPrice: minPrice != null ? String(minPrice) : "",
		maxPrice: maxPrice != null ? String(maxPrice) : "",
		availability,
	};

	const applyFilters = (next: FilterState) => {
		setSizes(next.sizes);
		setColors(next.colors);
		setAvailability(next.availability);
		const nextMin = next.minPrice.trim() === "" ? null : Number(next.minPrice);
		const nextMax = next.maxPrice.trim() === "" ? null : Number(next.maxPrice);
		setPriceRange(
			nextMin != null && !Number.isNaN(nextMin) ? nextMin : null,
			nextMax != null && !Number.isNaN(nextMax) ? nextMax : null,
		);
	};

	const resetAllFilters = () => {
		setSearchDraft("");
		setSearch("");
		clearFilters();
	};

	const formattedTitle = category?.name ?? "";
	const heroImage = getMediaUrl(category?.bannerUrl || category?.imageUrl);
	const products = data?.products ?? [];
	const hasMore = data?.meta.hasNext ?? false;

	const selectedSortValue = `${sort}:${order}`;

	return (
		<main className="w-full bg-white pb-16">
			{/* Breadcrumbs & Title */}
			<div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-center space-y-3">
				<nav className="flex items-center justify-center gap-2 text-[1.4rem] text-neutral-500">
					<Link href="/" className="hover:text-black transition-colors">
						Accueil
					</Link>
					<span>›</span>
					<Link
						href="/collections"
						className="hover:text-black transition-colors"
					>
						Produit
					</Link>
					<span>›</span>
					<Link
						href="/collections"
						className="hover:text-black transition-colors"
					>
						Collection
					</Link>
					<span>›</span>
					{isLoadingCategory ? (
						<span className="inline-block w-24 h-4 rounded animate-pulse bg-neutral-200" />
					) : (
						<span className="text-black font-semibold">{formattedTitle}</span>
					)}
				</nav>
				{isLoadingCategory ? (
					<div
						className="flex flex-col items-center gap-4 pt-2"
						aria-busy="true"
					>
						<div className="w-[28rem] max-w-full h-[5.2rem] rounded-md animate-pulse bg-neutral-200" />
						<div className="w-[42rem] max-w-full h-5 rounded animate-pulse bg-neutral-100" />
					</div>
				) : (
					<>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#080808]">
							{formattedTitle}
						</h1>
						{category?.description && (
							<p className="mx-auto max-w-[60rem] text-[1.5rem] text-[#666666]">
								{category.description}
							</p>
						)}
					</>
				)}
			</div>

			{/* Bannière de catégorie */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="relative w-full h-[260px] sm:h-[340px] rounded-2xl overflow-hidden bg-(--color-surface-card)">
					{isLoadingCategory ? (
						<div className="absolute inset-0 animate-pulse bg-neutral-200" />
					) : heroImage ? (
						<Image
							src={heroImage}
							alt={formattedTitle}
							fill
							priority
							sizes="(max-width: 1400px) 100vw, 1400px"
							className="object-cover"
							unoptimized
						/>
					) : null}
					{!isLoadingCategory && heroImage && (
						<>
							<div className="absolute inset-0 bg-black/20" />
							<div className="absolute inset-x-0 bottom-6 flex justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
								<span>Sélection</span>
								<span>{formattedTitle}</span>
								<span>Découvrir la collection</span>
							</div>
						</>
					)}
				</div>
			</section>

			{/* Toolbar compacte : Filtre | N produits | Trier */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-wrap items-center gap-4 justify-between border-b border-neutral-200 pb-6">
					<div className="flex flex-wrap gap-3 items-center">
						<button
							onClick={() => setSidebarOpen((prev) => !prev)}
							className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-[1.4rem] font-medium shrink-0 ${
								sidebarOpen
									? "bg-stone-900 text-white border-stone-900"
									: "border-neutral-300 text-black hover:border-stone-900"
							} cursor-pointer`}
							aria-label="Afficher/masquer les filtres"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
							</svg>
							<span>Filtre</span>
						</button>

						<div className="relative w-[220px] max-w-full">
							<svg
								className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<input
								type="text"
								placeholder="Rechercher..."
								value={searchDraft}
								onChange={(e) => setSearchDraft(e.target.value)}
								className="py-2.5 pr-3 pl-9 w-full text-[1.3rem] rounded-lg border outline-none transition-colors border-neutral-200 focus:border-stone-900"
							/>
						</div>

						{isLoading ? (
							<span className="inline-block w-20 h-4 rounded animate-pulse bg-neutral-200" />
						) : (
							<span className="text-[1.3rem] text-neutral-500 whitespace-nowrap">
								{data?.meta.total ?? 0} produits
							</span>
						)}
					</div>

					<select
						value={selectedSortValue}
						onChange={(e) => {
							const option = SORT_OPTIONS.find(
								(o) => o.value === e.target.value,
							);
							if (option) setSort(option.sort, option.order);
						}}
						className="px-4 py-2.5 rounded-lg border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-stone-900"
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</section>

			{/* Products Grid */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-start gap-10">
					<AnimatePresence>
						{sidebarOpen && (
							<motion.div
								key="sidebar-filter"
								initial={{ opacity: 0, x: -24 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -24 }}
								transition={{ duration: 0.22, ease: "easeOut" }}
								className="hidden md:block shrink-0"
							>
								<SidebarFilter
									filters={filters}
									onChange={applyFilters}
									onClear={resetAllFilters}
									sizeOptions={facets?.sizes ?? []}
									colorOptions={facets?.colors ?? []}
									isLoadingFacets={isLoadingFacets}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="flex-1">
						{!isLoading && products.length === 0 ? (
							<div className="flex flex-col items-center text-center py-24">
								<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										className="text-gray-400"
									>
										<circle cx="11" cy="11" r="7" />
										<line x1="21" y1="21" x2="16.65" y2="16.65" />
									</svg>
								</div>
								<span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
									Aucun résultat
								</span>
								<h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
									Aucun produit ne correspond à votre recherche
								</h2>
								<p className="mt-2 text-gray-500 max-w-md">
									Essayez d&apos;ajuster vos filtres ou votre recherche.
								</p>
								<button
									onClick={resetAllFilters}
									className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-lg hover:bg-black transition shadow-lg group text-sm sm:text-base cursor-pointer"
								>
									<span>Réinitialiser les filtres</span>
									<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
								</button>
							</div>
						) : (
							<GridCardProduct action_grid hideSort className="max-sm:gap-y-8">
								<>
									{isLoading
										? Array.from({ length: PAGE_SIZE }).map((_, index) => (
												<ProductCardSkeleton key={index} />
											))
										: products.map((product, index) => (
												<CardProduct
													key={product.collectionId}
													product={product}
													currencyCode={currencyCode}
													priority={index < 4}
												/>
											))}
								</>
							</GridCardProduct>
						)}

						{hasMore && (
							<div className="flex justify-center pt-8">
								<button
									onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
									className="inline-flex items-center px-10 py-3 text-sm font-medium text-white bg-stone-900 rounded-lg transition-colors hover:bg-black cursor-pointer"
								>
									Voir plus
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Bandeau de fin */}
			<PhotoOverlayBanner
				image="/products/shop/hero-shopping.jpg"
				title={t("footerTitle")}
				subtitle={t("footerSubtitle")}
				cta={{
					label: "Découvrir la boutique",
					href: "/collections",
				}}
				contained={true}
				height="lg"
			/>
		</main>
	);
};

export default CollectionViews;
