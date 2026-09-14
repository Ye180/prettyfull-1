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
import { useCollectionFilters } from "../hooks/use-collection-filters";
import { useCollectionProducts } from "../hooks/use-collection-products";

// 7 lignes de la grille dense (5 colonnes en desktop) avant le bouton "See More".
const PAGE_SIZE = 35;

const INITIAL_FILTERS: FilterState = {
	categories: [],
	sizes: [],
	minPrice: "",
	maxPrice: "",
	color: "",
	fits: [],
	materials: [],
	availability: "all",
};

export const CollectionViews = () => {
	const params = useParams();
	const slug = (params.slug as string) || "";

	const { q, sort, order, setSearch, setSort } = useCollectionFilters();
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const [searchDraft, setSearchDraft] = useState(q);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Debounce : un fetch par pause de frappe, pas par caractère (même logique
	// que `Toolbar`, l'organism plus abouti mais jamais branché à cette vue).
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchDraft !== q) setSearch(searchDraft);
		}, 400);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	// Nouvelle recherche/tri => on repart du premier palier de "Load More".
	useEffect(() => {
		setLimit(PAGE_SIZE);
	}, [q, sort, order]);

	const { data, isLoading } = useCollectionProducts({
		categorySlug: slug,
		limit,
		sort,
		order,
		q,
		minPrice: null,
		maxPrice: null,
	});

	const formattedTitle =
		data?.categoryName || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Collection");
	const allProducts = data?.products ?? [];
	const hasMore = data?.meta.hasNext ?? false;

	// Prix min/max encore local (le back n'expose pas les autres facettes du
	// panneau) : mêmes bornes qu'avant, juste appliquées aux vrais produits.
	const products = allProducts.filter((p) => {
		const price = p.colors[0]?.price ?? 0;
		if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
		if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
		return true;
	});

	const selectedSort = sort === "basePrice" && order === "asc" ? "Prix croissant" : "Prix décroissant";

	return (
		<main className="w-full bg-white pb-16">
			{/* Breadcrumbs & Title */}
			<div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-center space-y-3">
				<nav className="flex items-center justify-center gap-2 text-[1.4rem] text-neutral-500">
					<Link href="/" className="hover:text-black transition-colors">Accueil</Link>
					<span>›</span>
					<Link href="/collections" className="hover:text-black transition-colors">Produit</Link>
					<span>›</span>
					<Link href="/collections" className="hover:text-black transition-colors">Collection</Link>
					<span>›</span>
					<span className="text-black font-semibold">{formattedTitle}</span>
				</nav>
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#080808]">
					{formattedTitle}
				</h1>
				<p className="text-[1.5rem] text-[#666666]">
					Découvrez notre sélection {formattedTitle} et plongez dans nos pièces les plus populaires !
				</p>
			</div>

			{/* Knitwear Texture Hero Banner */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="relative w-full h-[260px] sm:h-[340px] rounded-[2.6rem] overflow-hidden">
					<Image
						src="/collections/banner-mode.jpg"
						alt={formattedTitle}
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black/20" />
					<div className="absolute inset-x-0 bottom-6 flex justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
						<span>Sélection</span>
						<span>{formattedTitle}</span>
						<span>Découvrir la collection</span>
					</div>
				</div>
			</section>

			{/* Toolbar & Filters */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-wrap items-center gap-4 justify-between border-b border-neutral-200 pb-6">
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
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
							</svg>
							<span>Filtrer</span>
						</button>

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

					<div className="flex items-center gap-3">
						<select
							value={selectedSort}
							onChange={(e) => {
								if (e.target.value === "Prix croissant") setSort("basePrice", "asc");
								else setSort("basePrice", "desc");
							}}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="Prix décroissant">Prix décroissant</option>
							<option value="Prix croissant">Prix croissant</option>
						</select>
					</div>
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
									onChange={setFilters}
									onClear={() => setFilters(INITIAL_FILTERS)}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="flex-1">
						{!isLoading && products.length === 0 ? (
							<div className="flex flex-col items-center text-center py-24">
								<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
									<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400">
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
									onClick={() => {
										setSearchDraft("");
										setSearch("");
										setFilters(INITIAL_FILTERS);
									}}
									className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition shadow-lg group text-sm sm:text-base cursor-pointer"
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
									className="inline-flex items-center px-10 py-3 text-sm font-medium text-white bg-black rounded-full transition-colors hover:bg-neutral-800 cursor-pointer"
								>
									See More
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Stratosphere CTA Banner */}
			<PhotoOverlayBanner
				image="/banner/banner4.jpg"
				title="Let's Take Your Fashion to The Stratosphere"
				subtitle="Ready to elevate your style? Let's launch your fashion into the stratosphere with bold choices and unique trends!"
				cta={{
					label: "Get Started Now",
					href: "/collections",
				}}
				contained={true}
				height="lg"
			/>
		</main>
	);
};

export default CollectionViews;
