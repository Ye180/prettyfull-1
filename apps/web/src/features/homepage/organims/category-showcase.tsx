"use client";

import { useGetShopCategories } from "@/features/homepage/api/medusa/get-best-selling-products";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

/**
 * Photos choisies à la main pour cette vitrine (mêmes handles que
 * `product-recommendations.tsx`) - contrairement aux autres sections
 * produit de la page, l'effet "affiche" recherché ici demande un visuel
 * cohérent et net sur les 4 tuiles, pas la photo (parfois floue ou absente)
 * telle qu'actuellement saisie en back-office pour chaque catégorie.
 */
const CURATED_ORDER = ["vitamines", "bien_etre", "proteines", "mineraux"] as const;
const CURATED: Record<(typeof CURATED_ORDER)[number], { image: string; description: string }> = {
	vitamines: {
		image: "/category/category-vitamins.jpg",
		description: "Vitamines essentielles pour l'immunité et l'énergie.",
	},
	bien_etre: {
		image: "/category/category-wellness.jpg",
		description: "Probiotiques, oméga-3 et formules bien-être au naturel.",
	},
	proteines: {
		image: "/category/category-protein.jpg",
		description: "Protéines et compléments sportifs pour la récupération.",
	},
	mineraux: {
		image: "/category/category-minerals.jpg",
		description: "Magnésium, fer, zinc et autres minéraux du quotidien.",
	},
};
const DEFAULT_FALLBACK = {
	image: "/category/category-principale.jpg",
	description: "Découvrez notre sélection dans cette gamme.",
};

/**
 * Grille éditoriale plein cadre, 4 catégories - dernière section de
 * l'accueil, juste avant le footer. Sans marge ni coin arrondi
 * volontairement : contrairement aux autres sections produit de la page, on
 * veut ici l'effet "affiche" plutôt que "carte".
 */
export const CategoryShowcase = () => {
	const { data: categories, isLoading } = useGetShopCategories();

	const tiles = useMemo(() => {
		const all = categories ?? [];
		// Priorité aux 4 catégories choisies (dans cet ordre précis) ; si l'une
		// d'elles n'existe pas encore côté back-office, on complète avec les
		// premières catégories restantes pour ne jamais afficher une grille
		// incomplète.
		const curated = CURATED_ORDER.map((handle) =>
			all.find((c) => c.handle === handle),
		).filter((c): c is NonNullable<typeof c> => Boolean(c));
		const rest = all.filter((c) => !curated.some((cc) => cc.id === c.id));
		return [...curated, ...rest].slice(0, 4);
	}, [categories]);

	if (!isLoading && tiles.length === 0) return null;

	return (
		<section className="w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2">
				{isLoading
					? Array.from({ length: 4 }, (_, i) => (
							<div
								key={i}
								className="bg-gray-200 animate-pulse aspect-4/5 sm:aspect-square"
							/>
						))
					: tiles.map((category) => {
							const curatedMeta = (
								CURATED as Record<
									string,
									{ image: string; description: string } | undefined
								>
							)[category.handle];
							const imageUrl =
								curatedMeta?.image ||
								getMediaUrl(category.product_category_image?.[0]?.url) ||
								DEFAULT_FALLBACK.image;
							const description =
								curatedMeta?.description ||
								category.description ||
								DEFAULT_FALLBACK.description;

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
										sizes="(max-width: 640px) 100vw, 50vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
										unoptimized
									/>
									<div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/0 to-transparent" />
									<div className="flex absolute top-0 left-0 flex-col gap-1.5 p-6 sm:p-8 max-w-[80%]">
										<h3 className="text-[1.8rem] sm:text-[2.2rem] font-bold text-white [font-family:var(--font-display)]!">
											{category.name}
										</h3>
										<p className="text-[1.3rem] leading-snug text-white/85">
											{description}
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
