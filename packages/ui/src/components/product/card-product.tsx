"use client";

// =============================================================================
// CardProduct : Carte produit compacte, sans sélecteur de variante
// =============================================================================

import { cn, getMediaUrl } from "@prettyfull/utils";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Image = NextImage as any;

import { useCartStore } from "@prettyfull/store";
import { DiscountBadge, PriceBlock } from "./price-block";
import type { NormalizedCollectionProduct } from "./types";

import { Button } from "../../button";
import { Heart } from "../../icons/heart.icon";
import { toast } from "../toast/toaster";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CardProductProps {
	product: NormalizedCollectionProduct;
	className?: string;
	/** Code devise pour l'affichage du prix (ex: "xof" → FCFA) */
	currencyCode?: string;
	/** Activer le chargement prioritaire de l'image (utiliser uniquement pour les premières cartes above-the-fold) */
	priority?: boolean;
}

// -----------------------------------------------------------------------------
// Composant
// -----------------------------------------------------------------------------

export const CardProduct: React.FC<CardProductProps> = ({
	product,
	className,
	currencyCode = "xof",
	priority = false,
}) => {
	const router = useRouter();

	const currencySymbol = currencyCode === "xof" ? "FCFA" : "$";

	const [isImageLoading, setIsImageLoading] = useState(true);

	const addItem = useCartStore((state) => state.addItem);

	// Un seul produit = une seule fiche : plus de choix couleur/taille côté
	// storefront, on résout directement la première déclinaison achetable.
	const defaultColor = product?.colors[0];
	const defaultVariant =
		defaultColor?.variants.find((v) => v.purchasable) ??
		defaultColor?.variants[0];

	// --- Handlers ---
	const handleNavigate = useCallback(() => {
		const handle = defaultColor?.handle || product.collectionHandle;
		router.push(`/products/${handle}`);
	}, [defaultColor?.handle, product.collectionHandle, router]);

	const handleAddToCart = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (!defaultVariant) {
				toast.error("Produit indisponible", {
					description: "Ce produit n'est plus disponible.",
				});
				return;
			}

			if (!defaultVariant.purchasable) {
				toast.error("Rupture de stock", {
					description: "Ce produit n'est plus disponible.",
				});
				return;
			}

			addItem({
				productId: defaultVariant.id,
				product: {
					id: defaultColor?.productId ?? defaultVariant.id,
					name: product?.collectionTitle ?? defaultColor?.title ?? "",
					image: defaultColor?.thumbnail,
				},
				quantity: 1,
				selectedVariants: {},
				unitPrice: {
					amount: defaultVariant.calculated_price?.calculated_amount ?? 0,
					currency: currencyCode,
				},
				// Triplet du point de stock : c'est lui, et non le libellé affiché, que
				// le tunnel d'achat renvoie à l'API pour réserver la bonne déclinaison.
				selection: {
					productId: defaultColor?.productId ?? defaultVariant.id,
					variantId: defaultVariant.variantId ?? null,
					sizeId: defaultVariant.sizeId ?? null,
				},
			});

			toast.cart("Ajouté au panier", {
				description: product?.collectionTitle
					? `${product.collectionTitle} a été ajouté à votre panier.`
					: "Votre article a été ajouté à votre panier.",
			});
		},
		[
			defaultColor,
			defaultVariant,
			product?.collectionTitle,
			addItem,
			currencyCode,
		],
	);

	// --- Rendu conditionnel si pas de couleur ---
	if (!defaultColor) {
		return (
			<article className={cn("w-full max-w-sm animate-pulse", className)}>
				<div className="bg-gray-200 rounded-lg aspect-3/4" />
				<div className="mt-3 w-3/4 h-4 bg-gray-200 rounded" />
				<div className="mt-2 w-1/2 h-4 bg-gray-200 rounded" />
			</article>
		);
	}

	const thumbnailSrc = getMediaUrl(defaultColor.thumbnail);

	return (
		<article className={cn("pb-4 space-y-3 w-full group", className)}>
			{/* ===== Image principale ===== */}
			<div
				className="overflow-hidden relative bg-gray-50 rounded-lg cursor-pointer"
				onClick={handleNavigate}
			>
				<div className="relative w-full aspect-3/4">
					<DiscountBadge
						price={defaultColor.price}
						compareAtPrice={defaultColor.compareAtPrice}
						className="absolute top-3 left-3"
					/>

					{isImageLoading && (
						<div className="flex absolute inset-0 z-10 justify-center items-center bg-gray-100">
							<div className="w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-black" />
						</div>
					)}

					<Image
						src={thumbnailSrc}
						alt={`${product.collectionTitle} - ${defaultColor.label}`}
						width={600}
						height={800}
						sizes="(max-width: 639px) 50vw, (max-width: 1024px) 33vw, 25vw"
						className={cn(
							"object-cover transition-opacity duration-300",
							isImageLoading ? "opacity-0" : "opacity-100",
						)}
						onLoad={() => setIsImageLoading(false)}
						onError={() => setIsImageLoading(false)}
						unoptimized
						priority={priority}
					/>

					{/* Cœur wishlist */}
					<button
						type="button"
						onClick={(e) => e.stopPropagation()}
						className="flex absolute top-3 right-3 z-20 justify-center items-center w-9 h-9 bg-white rounded-full shadow-sm cursor-pointer"
						aria-label="Ajouter aux favoris"
					>
						<Heart className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* ===== Infos produit ===== */}
			<div className="space-y-1.5">
				<h3 className="text-sm font-medium tracking-wide truncate line-clamp-1">
					{defaultColor?.title}
				</h3>

				<PriceBlock
					price={defaultColor.price}
					compareAtPrice={defaultColor.compareAtPrice}
					currencySymbol={currencySymbol}
					className="flex gap-1 items-baseline"
				/>

				<Button
					type="button"
					variant="outline"
					onClick={handleAddToCart}
					className="py-2.5 text-xs font-semibold tracking-wide uppercase"
				>
					+ Ajouter
				</Button>
			</div>
		</article>
	);
};

export default CardProduct;
