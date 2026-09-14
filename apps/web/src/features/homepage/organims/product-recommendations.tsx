"use client";

import { useGetShopCategories } from "@/features/homepage/api/medusa/get-best-selling-products";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	robes: "Des robes pour toutes les occasions, du quotidien aux soirées les plus élégantes.",
	hauts: "Chemisiers, pulls et t-shirts pensés pour se marier avec tout le reste de votre garde-robe.",
	ensembles: "Des tenues coordonnées prêtes à porter, pour un look abouti en un seul geste.",
	accessoires: "Sacs, bijoux et lunettes pour signer chacune de vos tenues.",
	nouveautes: "Les dernières arrivées de la boutique, à découvrir en premier.",
	soldes: "Nos meilleures pièces à prix réduit, en quantités limitées.",
};

export const ProductRecommendations = () => {
	const { data: categories, isLoading } = useGetShopCategories();

	const spotlightCategories = useMemo(() => (categories ?? []).slice(0, 3), [categories]);

	if (!isLoading && spotlightCategories.length === 0) return null;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10">
				<div className="max-w-xl space-y-2">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Acheter par Catégorie
					</h2>
					<p className="text-[1.4rem] text-[#666666]">
						De la robe de soirée aux accessoires du quotidien, retrouvez tout notre univers mode.
					</p>
				</div>

				<Link
					href={COLLECTION_PATHS.collectionList}
					className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[1.4rem] font-medium rounded-full whitespace-nowrap hover:bg-[#222] transition-all self-start sm:self-auto shadow"
				>
					<span>Voir tout</span>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="7" y1="17" x2="17" y2="7" />
						<polyline points="7 7 17 7 17 17" />
					</svg>
				</Link>
			</div>

			{/* Category Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{isLoading
					? Array.from({ length: 3 }, (_, i) => (
							<div key={i} className="space-y-4 animate-pulse">
								<div className="w-full bg-gray-200 rounded-[2.2rem] aspect-16/11" />
								<div className="w-2/3 h-6 bg-gray-200 rounded" />
								<div className="w-full h-4 bg-gray-100 rounded" />
							</div>
						))
					: spotlightCategories.map((category) => {
							const imageUrl =
								getMediaUrl(category.product_category_image?.[0]?.url) || "/category/category1.jpg";
							return (
								<Link
									key={category.id}
									href={COLLECTION_PATHS.collectionDetail(category.handle)}
									className="group flex flex-col space-y-4"
								>
									<div className="relative w-full aspect-16/11 rounded-[2.2rem] overflow-hidden bg-[#F5F5F5]">
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
											{CATEGORY_DESCRIPTIONS[category.handle] ??
												"Découvrez notre sélection dans cette catégorie."}
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
