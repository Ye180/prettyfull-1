"use client";

import { useRelatedProducts } from "@/features/products/hooks/use-related-products";
import SectionHeading from "@/shared/components/molecules/core/section-heading";
import { useRegionStore } from "@/stores/useRegion";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import Link from "next/link";
import Container from "../../../../../../../packages/ui/src/layouts/helpers/container";

interface ProductSuggestionProps {
	categorySlug: string | undefined;
	excludeProductId: string;
}

const ProductSuggestion = ({
	categorySlug,
	excludeProductId,
}: ProductSuggestionProps) => {
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const { data: products, isLoading } = useRelatedProducts(
		categorySlug,
		excludeProductId,
	);

	if (!isLoading && (!products || products.length === 0)) return null;

	return (
		// La fiche produit est bornée à `max-w-400` (§views/index.tsx) : cette
		// section sort de cette colonne pour respirer davantage que le reste de
		// la page, sans aller jusqu'au bord de l'écran comme les sections d'accueil.
		<div className="relative left-1/2 w-screen -translate-x-1/2">
			<Container maxWidth="1900px" className="py-8 space-y-8">
				<SectionHeading title="Tu peux aussi aimer" />

				<GridCardProduct action_grid className="max-sm:gap-y-8">
					<>
						{isLoading
							? Array.from({ length: 4 }).map((_, index) => (
									<div
										key={index}
										className="w-full aspect-3/4 bg-gray-100 rounded-[2.2rem] animate-pulse"
									/>
								))
							: products!.map((product, index) => (
									<CardProduct
										key={product.collectionId}
										product={product}
										currencyCode={currencyCode}
										priority={index < 4}
									/>
								))}
					</>
				</GridCardProduct>

				<div className="flex justify-center">
					<Link
						href="/collections"
						className="inline-flex items-center px-8 py-3 text-sm font-medium text-white bg-black rounded-full transition-colors hover:bg-gray-800"
					>
						See More
					</Link>
				</div>
			</Container>
		</div>
	);
};

export default ProductSuggestion;
