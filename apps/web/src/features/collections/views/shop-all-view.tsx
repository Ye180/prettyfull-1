"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import ProductCardSkeleton from "@/shared/components/organims/product-loading";
import { useRegionStore } from "@/stores/useRegion";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollectionBanners } from "../hooks/use-collection-banners";
import { useCollectionFacets } from "../hooks/use-collection-facets";
import { useCollectionFilters } from "../hooks/use-collection-filters";
import { useCollectionProducts } from "../hooks/use-collection-products";
import SidebarFilter, { FilterState } from "../organims/sidebar-filter";

// 7 lignes de la grille dense (5 colonnes en desktop) avant le bouton "See More".
const PAGE_SIZE = 35;

/** `image` peut être une URL ou `{ url }` selon la source (§ `useGetCategory`). */
const imageUrlOf = (image: string | { url: string } | undefined): string | undefined =>
	typeof image === "string" ? image : image?.url;

export const ShopAllView = () => {
	const searchParams = useSearchParams();
	const { data: categories } = useGetCategory();
	const { data: heroBanners } = useCollectionBanners("collection_top");
	const { data: promoBanners } = useCollectionBanners("collection_promo");
	const { data: footerBanners } = useCollectionBanners("collection_footer");
	const tHero = useTranslations("HomePage.hero");

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
	const [categorySlug, setCategorySlug] = useState(
		searchParams.get("category") ?? "",
	);

	// Un lien du header ("Men" / "Ladies" / "New Collection") pointe vers
	// `/collections?category=...` : on suit la navigation plutôt que de figer
	// la valeur au premier rendu.
	useEffect(() => {
		setCategorySlug(searchParams.get("category") ?? "");
	}, [searchParams]);

	// Debounce : un fetch par pause de frappe, pas par caractère.
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchDraft !== q) setSearch(searchDraft);
		}, 400);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	// Nouveau filtre/tri/rayon => on repart du premier palier de "Load More".
	useEffect(() => {
		setLimit(PAGE_SIZE);
	}, [q, sort, order, categorySlug, minPrice, maxPrice, sizes, colors, availability]);

	const { data, isLoading } = useCollectionProducts({
		categorySlug: categorySlug || undefined,
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
		categorySlug: categorySlug || undefined,
		q,
	});

	const filters: FilterState = {
		categorySlug,
		sizes,
		colors,
		minPrice: minPrice != null ? String(minPrice) : "",
		maxPrice: maxPrice != null ? String(maxPrice) : "",
		availability,
	};

	const applyFilters = (next: FilterState) => {
		setCategorySlug(next.categorySlug);
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
		setCategorySlug("");
		clearFilters();
	};

	const displayedProducts = data?.products ?? [];
	const hasMore = data?.meta.hasNext ?? false;

	const SORT_OPTIONS = [
		{ value: "createdAt:desc", label: "Nouveautés", sort: "createdAt" as const, order: "desc" as const },
		{ value: "basePrice:asc", label: "Prix croissant", sort: "basePrice" as const, order: "asc" as const },
		{ value: "basePrice:desc", label: "Prix décroissant", sort: "basePrice" as const, order: "desc" as const },
		{ value: "name:asc", label: "Nom (A → Z)", sort: "name" as const, order: "asc" as const },
	];
	const selectedSortValue = `${sort}:${order}`;

	const heroBanner = heroBanners?.[0];
	const heroImage = heroBanner?.image || "/home/cover-desktop.jpg";
	const heroTitle = heroBanner?.title || "New Season Essentials";
	const heroSubtitle =
		heroBanner?.subtitle || "Soft silhouettes and modern staples for everyday wear.";
	const heroCta = heroBanner?.cta || tHero("ctaButton");
	const heroLink = heroBanner?.link || "#catalog-grid";

	const promos = (promoBanners ?? []).slice(0, 2);
	const footerBanner = footerBanners?.[0];
	const featuredCategories = (categories ?? []).filter((category) => category.isFeatured);

	return (
		<main className="pb-16 w-full bg-white">
			{/* 1. Hero */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
				<div className="relative w-full min-h-[480px] lg:min-h-[520px] rounded-[2.6rem] overflow-hidden bg-[#888]">
					<Image
						src={heroImage}
						alt={heroTitle}
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover object-center"
					/>
					<div className="absolute inset-0 pointer-events-none bg-black/25" />

					{/* Labels top */}
					<div className="absolute inset-x-0 top-8 flex justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
						<span>{tHero("eyebrowLeft")}</span>
						<span className="hidden sm:inline">{tHero("eyebrowCenter")}</span>
						<span>{tHero("eyebrowRight")}</span>
					</div>

					{/* Headline Left */}
					<div className="relative z-10 flex flex-col justify-end h-full min-h-[480px] lg:min-h-[520px] p-8 sm:p-12 lg:p-16 max-w-xl text-white space-y-4">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
							{heroTitle}
						</h1>
						<p className="text-[1.5rem] sm:text-[1.6rem] text-white/90">{heroSubtitle}</p>
						<a
							href={heroLink}
							className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[1.4rem] font-semibold rounded-full whitespace-nowrap hover:bg-neutral-100 transition-all self-start shadow"
						>
							<span>{heroCta}</span>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 0 1-8 0" />
							</svg>
						</a>
					</div>
				</div>
			</section>

			{/* 2. Dual Promotion Cards - pilotées depuis Admin > Contenu (bannières "collection_promo") */}
			{promos.length > 0 && (
				<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
					<div className={`grid grid-cols-1 gap-6 ${promos.length > 1 ? "md:grid-cols-2" : ""}`}>
						{promos.map((promo) => (
							<div
								key={promo.id}
								className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group"
							>
								<Image
									src={promo.image}
									alt={promo.title || "Promotion"}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-black/35" />
								<div className="flex relative z-10 flex-col justify-end p-8 space-y-2 h-full text-white">
									{promo.title && (
										<h3 className="text-3xl font-bold text-white">{promo.title}</h3>
									)}
									{promo.subtitle && (
										<p className="text-[1.4rem] text-white/85">{promo.subtitle}</p>
									)}
									{promo.link && (
										<Link
											href={promo.link}
											className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[1.3rem] font-medium rounded-full self-start hover:bg-white/90 transition-all mt-2"
										>
											<span>{promo.cta || "Découvrir"}</span>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.2"
											>
												<line x1="7" y1="17" x2="17" y2="7" />
												<polyline points="7 7 17 7 17 17" />
											</svg>
										</Link>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* 3. Shop by Collection - catégories marquées "Mise en avant" dans Admin > Catalogue */}
			{featuredCategories.length > 0 && (
				<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
					<div className="flex justify-between items-center pb-8">
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#080808]">
							Shop by Collection
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
						{featuredCategories.map((category) => (
							<div
								key={category.id}
								className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group"
							>
								{imageUrlOf(category.image) && (
									<Image
										src={imageUrlOf(category.image)!}
										alt={category.name}
										fill
										sizes="(max-width: 640px) 100vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-black/25" />
								<div className="flex relative z-10 flex-col justify-end p-6 space-y-2 h-full text-white">
									<h3 className="text-2xl font-bold text-white">{category.name}</h3>
									<Link
										href={COLLECTION_PATHS.collectionDetail(category.handle)}
										className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-[1.2rem] font-medium rounded-full self-start hover:bg-white/90 transition-all"
									>
										<span>See Collection</span>
										<svg
											width="13"
											height="13"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<line x1="7" y1="17" x2="17" y2="7" />
											<polyline points="7 7 17 7 17 17" />
										</svg>
									</Link>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* 4. Toolbar & Search Bar */}
			<section
				id="catalog-grid"
				className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
			>
				<div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-neutral-200">
					{/* Filter toggle + search : un seul contrôle visuel */}
					<div className="flex items-stretch flex-1 min-w-[240px] max-w-lg">
						<button
							onClick={() => setSidebarOpen((prev) => !prev)}
							className={`flex items-center gap-2 px-4 py-2.5 rounded-l-full rounded-r-none border border-r-0 transition-all text-[1.4rem] font-medium shrink-0 ${
								sidebarOpen
									? "bg-black text-white border-black"
									: "border-neutral-300 text-black hover:border-black"
							} cursor-pointer`}
							aria-label="Toggle filter sidebar"
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
							<span>Filter</span>
						</button>

						{/* Search input */}
						<div className="relative flex-1 min-w-[160px]">
							<svg
								className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
								width="16"
								height="16"
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
								className="w-full pl-11 pr-4 py-2.5 rounded-r-full rounded-l-none border border-l-0 border-neutral-200 text-[1.4rem] outline-none focus:border-black transition-colors"
							/>
						</div>
					</div>

					{/* Quick dropdown filters */}
					<div className="flex flex-wrap gap-3 items-center">
						{/* Category dropdown */}
						<select
							value={categorySlug}
							onChange={(e) => setCategorySlug(e.target.value)}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="">Toutes les catégories</option>
							{categories?.map((category) => (
								<option key={category.id} value={category.handle}>
									{category.name}
								</option>
							))}
						</select>

						{/* Size dropdown */}
						<select
							value={sizes[0] ?? ""}
							onChange={(e) => setSizes(e.target.value ? [e.target.value] : [])}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="">Toutes tailles</option>
							{facets?.sizes.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>

						{/* Sort dropdown */}
						<select
							value={selectedSortValue}
							onChange={(e) => {
								const option = SORT_OPTIONS.find((o) => o.value === e.target.value);
								if (option) setSort(option.sort, option.order);
							}}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							{SORT_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>

			{/* 5. Main Catalog Layout (Sidebar + Product Grid) */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-10 items-start">
					{/* Collapsible Sidebar Filter */}
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
									categoryOptions={categories?.map((category) => ({
										slug: category.handle,
										name: category.name,
									}))}
									sizeOptions={facets?.sizes ?? []}
									colorOptions={facets?.colors ?? []}
									isLoadingFacets={isLoadingFacets}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Product Grid */}
					<div className="flex-1">
						{!isLoading && displayedProducts.length === 0 ? (
							<div className="flex flex-col items-center py-24 text-center">
								<div className="flex justify-center items-center mb-6 w-16 h-16 bg-gray-100 rounded-full">
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
								<span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
									Aucun résultat
								</span>
								<h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
									Aucun produit ne correspond à votre recherche
								</h2>
								<p className="mt-2 max-w-md text-gray-500">
									Essayez d&apos;ajuster vos filtres ou votre recherche.
								</p>
								<button
									onClick={resetAllFilters}
									className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition shadow-lg group text-sm sm:text-base cursor-pointer"
								>
									<span>Réinitialiser les filtres</span>
									<ArrowRightIcon className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
								</button>
							</div>
						) : (
							<GridCardProduct action_grid hideSort className="max-sm:gap-y-8">
								<>
									{isLoading
										? Array.from({ length: PAGE_SIZE }).map((_, index) => (
												<ProductCardSkeleton key={index} />
											))
										: displayedProducts.map((product, index) => (
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

						{/* Load More Button */}
						{hasMore && (
							<div className="flex justify-center pt-8">
								<button
									onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
									className="inline-flex items-center px-10 py-3 text-sm font-medium text-white bg-black rounded-full transition-colors hover:bg-neutral-800 cursor-pointer"
								>
									See More
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* 6. Bandeau de fin - piloté depuis Admin > Contenu (bannière "collection_footer") */}
			<PhotoOverlayBanner
				image={footerBanner?.image || "/banner/banner4.jpg"}
				title={footerBanner?.title || "Let's Take Your Fashion to The Stratosphere"}
				subtitle={
					footerBanner?.subtitle ||
					"Ready to elevate your style? Let's launch your fashion into the stratosphere with bold choices and unique trends!"
				}
				cta={{
					label: footerBanner?.cta || "Get Started Now",
					href: footerBanner?.link || "/collections",
				}}
				contained={true}
				height="lg"
			/>
		</main>
	);
};

export default ShopAllView;
