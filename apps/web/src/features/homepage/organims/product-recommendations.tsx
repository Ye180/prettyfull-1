"use client";

import { useGetShopCategories } from "@/features/homepage/api/medusa/get-best-selling-products";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

/** Trois rayons mis en avant, choisis pour montrer l'étendue de l'offre. */
const SPOTLIGHT = ["iphone-seconde-main", "raw-hair", "biscuits-americains"];

export const ProductRecommendations = () => {
	const { data: categories, isLoading } = useGetShopCategories();

	const spotlightCategories = useMemo(() => {
		const all = categories ?? [];
		const picked = SPOTLIGHT.map((handle) => all.find((c) => c.handle === handle)).filter(
			(c): c is NonNullable<typeof c> => Boolean(c),
		);
		return (picked.length === SPOTLIGHT.length ? picked : all).slice(0, 3);
	}, [categories]);

	if (!isLoading && spotlightCategories.length === 0) return null;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10">
				<div className="max-w-xl space-y-2">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Nos coups de cœur
					</h2>
					<p className="text-[1.4rem] text-[#666666]">
						iPhone de seconde main, cheveux naturels, épicerie américaine : de quoi se faire plaisir.
					</p>
				</div>

				<Link
					href={COLLECTION_PATHS.collectionList}
					className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-[1.4rem] font-medium rounded-lg whitespace-nowrap hover:bg-black transition-all self-start sm:self-auto shadow"
				>
					<span>Voir tout</span>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="7" y1="17" x2="17" y2="7" />
						<polyline points="7 7 17 7 17 17" />
					</svg>
				</Link>
			</div>

			{/* Category Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{isLoading
					? Array.from({ length: 3 }, (_, i) => (
							<div key={i} className="space-y-4 animate-pulse">
								<div className="w-full bg-gray-200 rounded-lg aspect-16/11" />
								<div className="w-2/3 h-6 bg-gray-200 rounded" />
								<div className="w-full h-4 bg-gray-100 rounded" />
							</div>
						))
					: spotlightCategories.map((category) => {
							const imageUrl =
								getMediaUrl(category.product_category_image?.[0]?.url) || "/products/shop/hero-shopping.jpg";
							return (
								<Link
									key={category.id}
									href={COLLECTION_PATHS.collectionDetail(category.handle)}
									className="group flex flex-col space-y-4"
								>
									<div className="relative w-full aspect-16/11 rounded-lg overflow-hidden bg-[#F5F5F5]">
										<Image
											src={imageUrl}
											alt={category.name}
											fill
											sizes="(max-width: 768px) 100vw, 33vw"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											unoptimized
										/>
									</div>
									<div className="space-y-2">
										<h3 className="text-[1.7rem] font-bold text-[#080808] group-hover:text-black leading-snug">
											{category.name}
										</h3>
										<p className="text-[1.4rem] text-[#666666] leading-relaxed">
											{category.description}
										</p>
									</div>
								</Link>
							);
						})}
			</div>
		</section>
	);
};

export default ProductRecommendations;
