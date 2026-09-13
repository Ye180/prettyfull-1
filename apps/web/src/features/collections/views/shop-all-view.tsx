"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import SidebarFilter, { FilterState } from "../organims/sidebar-filter";
import GridCollectionLayout from "../organims/grid-layout";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { useCollectionFilters } from "../hooks/use-collection-filters";
import { useCollectionProducts } from "../hooks/use-collection-products";

const PAGE_SIZE = 24;

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

export const ShopAllView = () => {
	const searchParams = useSearchParams();
	const { data: categories } = useGetCategory();

	const { q, sort, order, setSearch, setSort } = useCollectionFilters();
	const [searchDraft, setSearchDraft] = useState(q);
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedSize, setSelectedSize] = useState("M");
	const [categorySlug, setCategorySlug] = useState(searchParams.get("category") ?? "");

	// Un lien du header ("Men" / "Ladies" / "New Collection") pointe vers
	// `/collections?category=...` : on suit la navigation plutôt que de figer
	// la valeur au premier rendu.
	useEffect(() => {
		setCategorySlug(searchParams.get("category") ?? "");
	}, [searchParams]);

	// Debounce : un fetch par pause de frappe, pas par caractère (même logique
	// que `Toolbar`, l'organism plus abouti mais jamais branché à cette vue).
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchDraft !== q) setSearch(searchDraft);
		}, 400);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	// Nouvelle recherche/tri/rayon => on repart du premier palier de "Load More".
	useEffect(() => {
		setLimit(PAGE_SIZE);
	}, [q, sort, order, categorySlug]);

	const { data, isLoading } = useCollectionProducts({
		categorySlug: categorySlug || undefined,
		limit,
		sort,
		order,
		q,
		minPrice: null,
		maxPrice: null,
	});

	const allProducts = data?.products ?? [];
	const hasMore = data?.meta.hasNext ?? false;

	// Prix min/max encore local (le back n'expose pas les autres facettes du
	// panneau) : mêmes bornes qu'avant, juste appliquées aux vrais produits.
	const displayedProducts = allProducts.filter((p) => {
		const price = p.colors[0]?.price ?? 0;
		if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
		if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
		return true;
	});

	const selectedSort = sort === "basePrice" && order === "asc" ? "Low to High" : "High to Low";

	return (
		<main className="w-full bg-white pb-16">
			{/* 1. Hero: New Season Essentials */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
				<div className="relative w-full min-h-[480px] lg:min-h-[520px] rounded-[2.6rem] overflow-hidden bg-[#888]">
					<Image
						src="/home/cover-desktop.jpg"
						alt="New Season Essentials"
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover object-center"
					/>
					<div className="absolute inset-0 bg-black/25 pointer-events-none" />

					{/* Labels top */}
					<div className="absolute inset-x-0 top-8 flex justify-between px-8 text-[1.4rem] font-medium text-white/90 sm:px-12 z-10">
						<span>All Styles</span>
						<span className="hidden sm:inline">Shop Everything</span>
						<span>Everyday Wear</span>
					</div>

					{/* Headline Left */}
					<div className="relative z-10 flex flex-col justify-end h-full min-h-[480px] lg:min-h-[520px] p-8 sm:p-12 lg:p-16 max-w-xl text-white space-y-4">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
							New Season Essentials
						</h1>
						<p className="text-[1.5rem] sm:text-[1.6rem] text-white/90">
							Soft silhouettes and modern staples for everyday wear.
						</p>
						<a
							href="#catalog-grid"
							className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[1.4rem] font-semibold rounded-full whitespace-nowrap hover:bg-neutral-100 transition-all self-start shadow"
						>
							<span>Shop Now</span>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 0 1-8 0" />
							</svg>
						</a>
					</div>
				</div>
			</section>

			{/* 2. Dual Promotion Cards */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Mid-Season Sale */}
					<div className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group">
						<Image
							src="/banner/banner6.jpg"
							alt="Mid-Season Sale"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/35" />
						<div className="relative z-10 flex flex-col justify-end h-full p-8 text-white space-y-2">
							<h3 className="text-3xl font-bold text-white">Mid-Season Sale</h3>
							<p className="text-[1.4rem] text-white/85">Up to 40% off selected styles</p>
							<a
								href="#catalog-grid"
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[1.3rem] font-medium rounded-full self-start hover:bg-white/90 transition-all mt-2"
							>
								<span>Shop Sale</span>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</a>
						</div>
					</div>

					{/* Everyday Knitwear */}
					<div className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group">
						<Image
							src="/home/cover-box-3.jpg"
							alt="Everyday Knitwear"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/35" />
						<div className="relative z-10 flex flex-col justify-end h-full p-8 text-white space-y-2">
							<h3 className="text-3xl font-bold text-white">Everyday Knitwear</h3>
							<p className="text-[1.4rem] text-white/85">Lightweight layers you'll reach for daily</p>
							<a
								href="#catalog-grid"
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[1.3rem] font-medium rounded-full self-start hover:bg-white/90 transition-all mt-2"
							>
								<span>Explore</span>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Shop by Collection */}
			<section className="w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
				<div className="flex items-center justify-between pb-8">
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#080808]">
						Shop by Collection
					</h2>
					<div className="flex items-center space-x-3">
						<button
							aria-label="Previous"
							className="w-10 h-10 rounded-full border border-gray-300 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
						</button>
						<button
							aria-label="Next"
							className="w-10 h-10 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center transition-colors shadow cursor-pointer"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{/* Jacket */}
					<div className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group">
						<Image
							src="/home/commerce.jpg"
							alt="Jacket"
							fill
							sizes="(max-width: 640px) 100vw, 33vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/25" />
						<div className="relative z-10 flex flex-col justify-end h-full p-6 text-white space-y-2">
							<h3 className="text-2xl font-bold text-white">Jacket</h3>
							<Link
								href="/collections"
								className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-[1.2rem] font-medium rounded-full self-start hover:bg-white/90 transition-all"
							>
								<span>See Collection</span>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</Link>
						</div>
					</div>

					{/* T-Shirts */}
					<div className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group">
						<Image
							src="/home/presentation.jpg"
							alt="T-Shirts"
							fill
							sizes="(max-width: 640px) 100vw, 33vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/25" />
						<div className="relative z-10 flex flex-col justify-end h-full p-6 text-white space-y-2">
							<h3 className="text-2xl font-bold text-white">T-Shirts</h3>
							<Link
								href="/collections"
								className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-[1.2rem] font-medium rounded-full self-start hover:bg-white/90 transition-all"
							>
								<span>See Collection</span>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</Link>
						</div>
					</div>

					{/* Shorts */}
					<div className="relative w-full h-[280px] rounded-[2.2rem] overflow-hidden group">
						<Image
							src="/home/promotion.jpg"
							alt="Shorts"
							fill
							sizes="(max-width: 640px) 100vw, 33vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/25" />
						<div className="relative z-10 flex flex-col justify-end h-full p-6 text-white space-y-2">
							<h3 className="text-2xl font-bold text-white">Shorts</h3>
							<Link
								href="/collections"
								className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-[1.2rem] font-medium rounded-full self-start hover:bg-white/90 transition-all"
							>
								<span>See Collection</span>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="7" y1="17" x2="17" y2="7" />
									<polyline points="7 7 17 7 17 17" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* 4. Toolbar & Search Bar */}
			<section id="catalog-grid" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
								placeholder="Search something..."
								value={searchDraft}
								onChange={(e) => setSearchDraft(e.target.value)}
								className="w-full pl-11 pr-4 py-2.5 rounded-r-full rounded-l-none border border-l-0 border-neutral-200 text-[1.4rem] outline-none focus:border-black transition-colors"
							/>
						</div>
					</div>

					{/* Quick dropdown filters */}
					<div className="flex items-center gap-3 flex-wrap">
						{/* Category dropdown */}
						<select
							value={categorySlug}
							onChange={(e) => setCategorySlug(e.target.value)}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="">Category</option>
							{categories?.map((category) => (
								<option key={category.id} value={category.handle}>
									{category.name}
								</option>
							))}
						</select>

						{/* Size dropdown */}
						<select
							value={selectedSize}
							onChange={(e) => setSelectedSize(e.target.value)}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="XS">XS</option>
							<option value="S">S</option>
							<option value="M">M</option>
							<option value="L">L</option>
							<option value="XL">XL</option>
						</select>

						{/* Sort dropdown */}
						<select
							value={selectedSort}
							onChange={(e) => {
								if (e.target.value === "Low to High") setSort("basePrice", "asc");
								else setSort("basePrice", "desc");
							}}
							className="px-4 py-2.5 rounded-full border border-neutral-200 text-[1.3rem] font-medium bg-white text-neutral-800 outline-none cursor-pointer hover:border-black"
						>
							<option value="High to Low">High to Low</option>
							<option value="Low to High">Low to High</option>
						</select>
					</div>
				</div>
			</section>

			{/* 5. Main Catalog Layout (Sidebar + Product Grid) */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-start gap-10">
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
									onChange={setFilters}
									onClear={() => setFilters(INITIAL_FILTERS)}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Product Grid */}
					<div className="flex-1">
						{!isLoading && displayedProducts.length === 0 ? (
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
										setCategorySlug("");
									}}
									className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition shadow-lg group text-sm sm:text-base cursor-pointer"
								>
									<span>Réinitialiser les filtres</span>
									<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
								</button>
							</div>
						) : (
							<GridCollectionLayout products={displayedProducts} loading={isLoading} />
						)}

						{/* Load More Button */}
						{hasMore && (
							<div className="flex justify-center pt-8">
								<button
									onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
									className="px-10 py-3 rounded-full border border-neutral-300 hover:border-black text-[1.4rem] font-medium transition-all cursor-pointer"
								>
									Load More...
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* 6. Stratosphere Call-To-Action Banner */}
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

export default ShopAllView;
