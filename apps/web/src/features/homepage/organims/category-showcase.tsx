"use client";

import { useGetPrimaryCategories } from "@/features/homepage/api/medusa/get-primary-categories";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/products/shop/hero-shopping.jpg";

/**
 * Grille éditoriale plein cadre de tous les rayons principaux - dernière
 * section de l'accueil, juste avant le footer. Photo et description viennent
 * du back-office (Catalogue > Catégories). Sans marge ni coin arrondi
 * volontairement : effet "affiche" plutôt que "carte".
 */
export const CategoryShowcase = () => {
	const { data: categories, isLoading } = useGetPrimaryCategories();
	const tiles = categories ?? [];

	if (!isLoading && tiles.length === 0) return null;

	return (
		<section className="w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				{isLoading
					? Array.from({ length: 8 }, (_, i) => (
							<div
								key={i}
								className="bg-gray-200 animate-pulse aspect-4/5 sm:aspect-square"
							/>
						))
					: tiles.map((category) => {
							const imageUrl =
								getMediaUrl(category.product_category_image?.[0]?.url) || FALLBACK_IMAGE;

							return (
								<Link
									key={category.id}
									href={COLLECTION_PATHS.collectionDetail(category.handle)}
									className="overflow-hidden relative w-full aspect-4/5 sm:aspect-square group"
								>
									<Image
										src={imageUrl}
										alt={category.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
										unoptimized
									/>
									<div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/0 to-transparent" />
									<div className="flex absolute top-0 left-0 flex-col gap-1.5 p-6 sm:p-8 max-w-[80%]">
										<h3 className="text-[1.8rem] sm:text-[2.2rem] font-bold text-white [font-family:var(--font-display)]!">
											{category.name}
										</h3>
										<p className="text-[1.3rem] leading-snug text-white/85">
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

export default CategoryShowcase;
