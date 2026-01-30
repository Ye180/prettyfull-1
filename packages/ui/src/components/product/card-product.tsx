"use client";

// =============================================================================
// CardProduct : Carte produit principale avec sélection couleur/taille
// =============================================================================

import { cn, formatCurrency_FR } from "@prettyfull/utils";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

// Type assertion to fix React version mismatch between packages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Image = NextImage as any;

import { useAddItemToCartMedusa } from "../../../../../apps/web/src/features/cart/api/medusa/add-item-to-cart-medusa";
import { ColorSelector } from "./color-selector";
import { SizeSelector } from "./size-selector";
import type { NormalizedCollectionProduct } from "./types";

import { Button } from "../../button";
import { Heart } from "../../icons/heart.icon";

import { useRegionStore } from "../../../../../apps/web/src/stores/useRegion";
import { AddToCardIcon } from "../../icons/add-cart.icon";
// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CardProductProps {
	/** Données du produit normalisées */
	product: NormalizedCollectionProduct;
	/** Prix à afficher (en centimes) - optionnel */
	price?: number;
	/** Prix barré (en centimes) - optionnel */
	originalPrice?: number;
	/** Devise */
	currency?: string;
	/** Callback appelé lors de l'ajout au panier */
	onAddToCart?: (variantId: string, quantity: number) => void;
	/** Classes CSS additionnelles */
	className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Formate un prix en centimes vers un affichage EUR.
 */
function formatPrice(amount: number, currency = "EUR"): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency,
	}).format(amount / 100);
}

// -----------------------------------------------------------------------------
// Composant
// -----------------------------------------------------------------------------

export const CardProduct: React.FC<CardProductProps> = ({
	product,
	//   price,
	originalPrice,
	currency = "EUR",
	onAddToCart,
	className,
}) => {
	const router = useRouter();

	const regions = useRegionStore((state) => state.region);

	// --- State ---
	const [activeColorIndex, setActiveColorIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [showSizeSelector, setShowSizeSelector] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(true);

	const addItemToCartMutation = useAddItemToCartMedusa();

	// --- Données dérivées ---
	const activeColor = product?.colors[activeColorIndex];

	const availableSizes = useMemo(() => {
		return activeColor?.sizes ?? [];
	}, [activeColor]);

	//   const hasPromotion = originalPrice && price && price < originalPrice;
	//   const promotionPercentage = hasPromotion
	//     ? Math.round(((originalPrice - price) / originalPrice) * 100)
	//     : 0;

	// --- Handlers ---
	const handleNavigate = useCallback(() => {
		const handle = activeColor?.handle || product.collectionHandle;
		router.push(`/products/${handle}`);
	}, [activeColor, product?.collectionHandle, router]);

	const handleSelectColor = useCallback((index: number) => {
		setActiveColorIndex(index);
		setSelectedSize(null);
		setIsImageLoading(true);
	}, []);

	const handleSelectSize = useCallback(
		(size: string) => {
			setSelectedSize(size);
			console.log("Selected size:", size);
		},
		[selectedSize]
	);

	const handleToggleSizeSelector = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowSizeSelector((prev) => !prev);
	}, []);

	const handleAddToCart = useCallback(
		(e: React.MouseEvent, size: string) => {
			e.stopPropagation();

			if (!selectedSize) {
				// Ouvrir le sélecteur de taille si pas encore sélectionné
				setShowSizeSelector(true);
				return;
			}

			setSelectedSize(size);

			// if (!onAddToCart || !activeColor) return;

			const matchingVariant = activeColor?.variants.find(
				(variant) => variant.size === selectedSize
			);

			const cartId = localStorage.getItem("cart_id");

			// IMPORTANT: Avec Medusa, on envoie le variant_id directement
			// Adapter votre API backend pour accepter variant_id au lieu de selectedVariants
			addItemToCartMutation.mutate(
				{
					cartId: cartId || "",
					quantity: 1,
					variant_id: matchingVariant?.id || "", // ou adapter votre API
				},
				{
					onSuccess: () => {
						console.log("Produit ajouté !");
						alert("Produit ajouté au panier !");
					},
					onError: (error: any) => {
						console.error("Erreur lors de l'ajout:", error);
						alert(
							`Erreur: ${error?.message || "Impossible d'ajouter au panier"}`
						);
					},
				}
			);

			if (!matchingVariant) {
				console.error("Variant non trouvé pour la taille:", selectedSize);
				return;
			}

			//   onAddToCart(matchingVariant.id, 1);

			console.log(matchingVariant.id);
			setShowSizeSelector(false);
		},
		[selectedSize, onAddToCart, activeColor]
	);

	const handleCloseSizeSelector = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setShowSizeSelector(false);
		},
		[selectedSize]
	);

	// --- Rendu conditionnel si pas de couleur ---
	if (!activeColor) {
		return (
			<article className={cn("w-full max-w-sm animate-pulse", className)}>
				<div className="bg-gray-200 rounded-lg aspect-3/4" />
				<div className="mt-3 w-3/4 h-4 bg-gray-200 rounded" />
				<div className="mt-2 w-1/2 h-4 bg-gray-200 rounded" />
			</article>
		);
	}

	console.log(product);

	return (
		<article className={cn("pb-4 space-y-3 w-full group", className)}>
			{/* ===== Image principale ===== */}
			<div
				className="overflow-hidden relative bg-gray-50 rounded-none cursor-pointer"
				onClick={handleNavigate}
			>
				{/* Aspect ratio container */}
				<div className="relative w-full aspect-3/4">
					{/* Loading spinner */}
					{isImageLoading && (
						<div className="flex absolute inset-0 z-10 justify-center items-center bg-gray-100">
							<div className="w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-black" />
						</div>
					)}

					{/* Image */}
					<Image
						src={activeColor.thumbnail}
						alt={`${product.collectionTitle} - ${activeColor.label}`}
						width={600}
						height={800}
						sizes="
						(max-width: 344px) 100px,
						(max-width: 375px) 100px,
						(max-width: 639px) 150px,
						(max-width: 767px) 200px,
						(max-width: 989px) 250px,
						(max-width: 1179px) 200px,
						(max-width: 1366px) 250px,
						(max-width: 1800px) 400px,
						(max-width: 2800px) 400px,
						400px
						"
						className={cn(
							"object-cover transition-opacity duration-300",
							isImageLoading ? "opacity-0" : "opacity-100"
						)}
						onLoad={() => setIsImageLoading(false)}
						priority
					/>

					{/* Badge promotion */}
					{/* {hasPromotion && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
              -{promotionPercentage}%
            </span>
          )} */}

					{/* Boutons d'action (visibles au hover sur desktop) */}
					<div className="flex absolute right-0 left-0 bottom-4 gap-3 justify-between items-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden">
						<Button
							type="button"
							onClick={handleToggleSizeSelector}
							className="pt-4 pb-5 px-4 w-2/3 text-[1.4rem] font-medium"
						>
							Ajouter au panier
						</Button>
						<button
							type="button"
							onClick={(e) => e.stopPropagation()}
							className="p-4 text-2xl rounded-full cursor-pointer w-fit bg-secondary"
							aria-label="Ajouter aux favoris"
						>
							<Heart className="w-8 h-8" />
						</button>
					</div>

					<div className="absolute right-4 bottom-4 flex-col space-y-4 rounded-lg max-md:flex w-fit md:hidden">
						<button
							type="button"
							onClick={handleToggleSizeSelector}
							className="py-2 px-2 text-[1.4rem] font-medium shadow-sm text-white h-fit w-fit bg-secondary rounded-full"
						>
							<AddToCardIcon className="w-12 h-12 text-white" />
						</button>
						<button
							type="button"
							onClick={(e) => e.stopPropagation()}
							className="p-4 text-2xl rounded-full shadow-sm cursor-pointer w-fit bg-secondary"
							aria-label="Ajouter aux favoris"
						>
							<Heart className="w-8 h-8" />
						</button>
					</div>

					{/* Sélecteur de taille (overlay) */}
					{showSizeSelector && availableSizes.length > 0 && (
						<div
							className="absolute right-4 bottom-4 left-4 p-4 space-y-4 bg-white rounded-lg shadow-xl lg:px-8 lg:py-5"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center pb-4 mb-3">
								<span className="text-sm font-semibold">Size</span>
								<button
									type="button"
									onClick={handleCloseSizeSelector}
									className="text-gray-500 hover:text-black"
									aria-label="Fermer"
								>
									<CloseIcon className="w-8 h-8" />
								</button>
							</div>
							<SizeSelector
								sizes={availableSizes}
								selectedSize={selectedSize}
								onChange={handleSelectSize}
								onClick={(e, size) => handleAddToCart(e, size)}
								compact
							/>
						</div>
					)}
				</div>
			</div>

			{/* ===== Infos produit ===== */}
			<div className="space-y-2">
				{/* Titre */}
				<div className="flex justify-between items-start text-[#000] ">
					<h3 className="tracking-[0.03em] text-2xl! max-md:text-[2rem]!  md:text-[2.2rem]! truncate line-clamp-1">
						{activeColor?.title}
					</h3>
					<h3 className="text-2xl!  max-md:text-[2rem]! md:text-[2.2rem]!whitespace-nowrap">
						{formatCurrency_FR(
							activeColor?.price,
							regions?.currency_code === "xof" ? "FCFA" : "$"
						)}
					</h3>
				</div>

				{/* <h1>{formatCurrency_FR(priceInfo.price.amount)}</h1> */}

				{/* Prix */}
				{/* <div className="flex gap-2 items-baseline">
          {price !== undefined && (
            <span className="text-base font-semibold text-black">
              {formatPrice(price, currency)}
            </span>
          )}
          {hasPromotion && originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice, currency)}
            </span>
          )}
        </div> */}

				{/* Sélecteur de couleurs (masqué pour les produits standalone) */}
				<ColorSelector
					colors={product.colors}
					activeIndex={activeColorIndex}
					onChange={handleSelectColor}
					hidden={product.isStandalone}
				/>
			</div>

			{/* ===== Bouton mobile ===== */}
			{/* <button
				type="button"
				onClick={handleToggleSizeSelector}
				className="w-full rounded-full bg-black py-2.5 text-sm font-medium text-white transition hover:bg-black/90 md:hidden"
			>
				Ajouter au panier
			</button> */}
		</article>
	);
};

// -----------------------------------------------------------------------------
// Icônes inline (pour éviter les dépendances externes)
// -----------------------------------------------------------------------------

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className={className}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
		/>
	</svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className={className}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6 18 18 6M6 6l12 12"
		/>
	</svg>
);

export default CardProduct;
