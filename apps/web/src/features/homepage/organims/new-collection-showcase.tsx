"use client";

import { useGetNewCollectionProducts } from "@/features/homepage/api/medusa/get-new-collection-products";
import { useRegionStore } from "@/stores/useRegion";
import { CardProduct, normalizeStandaloneProducts } from "@prettyfull/ui";
import { useMemo, useRef } from "react";

export const NewCollectionShowcase = () => {
	const { data: rawProducts, isLoading } = useGetNewCollectionProducts();
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const scrollRef = useRef<HTMLDivElement>(null);

	const products = useMemo(() => {
		const inputs = (rawProducts ?? []).map((product) => ({
			product_id: product.id,
			product,
			category_id: "",
			category: { id: "", name: "", handle: "" },
		}));
		return normalizeStandaloneProducts(inputs);
	}, [rawProducts]);

	const scrollByCard = (direction: 1 | -1) => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({
			left: direction * el.clientWidth * 0.45,
			behavior: "smooth",
		});
	};

	if (!isLoading && products.length === 0) return null;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* Header */}
			<div className="pb-10 space-y-2 max-w-xl">
				<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
					Découvrez Notre Nouvelle Collection
				</h2>
				<p className="text-[1.4rem] text-[#666666]">
					Les dernières arrivées de la boutique, à découvrir en avant-première.
				</p>
			</div>

			{/* Horizontal Scrolling Product Carousel */}
			<div className="relative">
				<div
					ref={scrollRef}
					className="flex overflow-x-auto gap-4 items-start pb-2 sm:gap-5 snap-x snap-mandatory scrollbar-hide scroll-smooth"
				>
					{isLoading
						? Array.from({ length: 5 }, (_, i) => (
								<div
									key={i}
									className="shrink-0 w-[46%] sm:w-55 lg:w-65 animate-pulse space-y-3"
								>
									<div className="w-full bg-gray-200 rounded-[2.2rem] aspect-3/4" />
									<div className="w-2/3 h-5 bg-gray-200 rounded" />
								</div>
							))
						: products.map((product, index) => (
								<div
									key={product.collectionId}
									className="shrink-0 snap-start w-[46%] sm:w-110 lg:w-120"
								>
									<CardProduct
										product={product}
										currencyCode={currencyCode}
										priority={index < 2}
									/>
								</div>
							))}
				</div>

				{/* Floating nav arrows overlapping the image row */}
				<button
					aria-label="Previous"
					onClick={() => scrollByCard(-1)}
					className="hidden sm:flex absolute left-0 -translate-x-1/2 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
				</button>
				<button
					aria-label="Next"
					onClick={() => scrollByCard(1)}
					className="hidden sm:flex absolute right-0 translate-x-1/2 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>
			</div>
		</section>
	);
};

export default NewCollectionShowcase;
