"use client";

import ProductCardSkeleton from "@/shared/components/organims/product-loading";
import { useRegionStore } from "@/stores/useRegion";
import { CardProduct, NormalizedCollectionProduct } from "@prettyfull/ui";
import AdCard from "./ad-card";

// Visuels lifestyle déjà présents dans public/, réutilisés pour les cartes "Ad".
const AD_IMAGES = ["/home/commerce1.jpg", "/home/presentation.jpg", "/home/commerce.jpg"];

// Une carte "Ad" en col-span-2 toutes les 6 cartes produit, pattern masonry
// irrégulier proche de l'inspo (jamais après la dernière carte).
const AD_EVERY = 6;

const GridCollectionLayout = ({
	products,
	loading,
}: {
	products: NormalizedCollectionProduct[];
	loading: boolean;
}) => {
	const currencyCode = useRegionStore((state) => state.region?.currency_code);

	const gridClass = "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 w-full";

	if (!products || loading) {
		return (
			<div className={gridClass}>
				{Array.from({ length: 12 }).map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-4 text-center h-[60vh]">
				<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400">
						<circle cx="11" cy="11" r="7" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
						<line x1="8" y1="11" x2="14" y2="11" />
					</svg>
				</div>
				<span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
					Aucun résultat
				</span>
				<h3 className="mt-3 text-xl font-bold text-gray-900">
					Aucun produit disponible
				</h3>
			</div>
		);
	}

	const nodes: React.ReactNode[] = [];
	let adCount = 0;

	products.forEach((product, index) => {
		nodes.push(
			<CardProduct key={product.collectionId} product={product} currencyCode={currencyCode} priority={index < 4} />,
		);

		const isLast = index === products.length - 1;
		if ((index + 1) % AD_EVERY === 0 && !isLast) {
			nodes.push(
				<AdCard
					key={`ad-${index}`}
					image={AD_IMAGES[adCount % AD_IMAGES.length] ?? AD_IMAGES[0]!}
					className="col-span-2"
				/>,
			);
			adCount += 1;
		}
	});

	return <div className={gridClass}>{nodes}</div>;
};

export default GridCollectionLayout;
