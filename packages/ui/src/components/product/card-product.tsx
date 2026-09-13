"use client";

// =============================================================================
// CardProduct : Carte produit principale avec sélection couleur/taille
// =============================================================================

import { cn, formatCurrency_FR, getMediaUrl } from "@prettyfull/utils";
import { ImageOff } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Image = NextImage as any;

import { useCartStore } from "@prettyfull/store";
import { ColorSelector } from "./color-selector";
import { SizeSelector } from "./size-selector";
import type { NormalizedCollectionProduct } from "./types";

import { Button } from "../../button";
import { AddToCardIcon } from "../../icons/add-cart.icon";
import { CloseIcon as CloseIconImported } from "../../icons/close.icon";
import { Heart } from "../../icons/heart.icon";
import { toast } from "../toast/toaster";
import { Drawer, DrawerClose, DrawerContent } from "../ui/drawer";

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
// Icône inline CloseIcon (desktop overlay uniquement)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Composant
// -----------------------------------------------------------------------------

export const CardProduct: React.FC<CardProductProps> = ({
	product,
	className,
	currencyCode,
	priority = false,
}) => {
	const router = useRouter();

	const currencySymbol = currencyCode === "xof" ? "FCFA" : "$";

	// --- State ---
	const [activeColorIndex, setActiveColorIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [showSizeSelector, setShowSizeSelector] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		setIsMobile(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const addItem = useCartStore((state) => state.addItem);

	// --- Données dérivées ---
	const activeColor = product?.colors[activeColorIndex];

	const availableSizes = useMemo(() => activeColor?.sizes ?? [], [activeColor]);

	const unavailableSizes = useMemo(
		() =>
			activeColor?.variants.filter((v) => !v.purchasable).map((v) => v.size) ??
			[],
		[activeColor],
	);

	// --- Handlers ---
	const handleNavigate = useCallback(() => {
		const handle = activeColor?.handle || product.collectionHandle;
		router.push(`/products/${handle}`);
	}, [activeColor?.handle, product.collectionHandle, router]);

	const handleSelectColor = useCallback((index: number) => {
		setActiveColorIndex(index);
		setSelectedSize(null);
		setIsImageLoading(true);
	}, []);

	const handleSelectSize = useCallback((size: string) => {
		setSelectedSize(size);
	}, []);

	const handleToggleSizeSelector = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowSizeSelector((prev) => !prev);
	}, []);

	const handleAddToCart = useCallback(
		(e: React.MouseEvent, size: string) => {
			e.stopPropagation();

			if (!size) {
				setShowSizeSelector(true);
				return;
			}

			const matchingVariant = activeColor?.variants.find(
				(variant) => variant.size === size,
			);

			if (!matchingVariant) {
				toast.error("Taille non disponible", {
					description: "Ce variant n'existe pas pour cette couleur.",
				});
				return;
			}

			if (!matchingVariant.purchasable) {
				toast.error("Rupture de stock", {
					description: "Cette taille n'est plus disponible.",
				});
				return;
			}

			addItem({
				productId: matchingVariant.id,
				product: {
					id: activeColor?.productId ?? matchingVariant.id,
					name: product?.collectionTitle ?? activeColor?.title ?? "",
					image: activeColor?.thumbnail,
				},
				quantity: 1,
				selectedVariants: { size },
				unitPrice: {
					amount: matchingVariant.calculated_price?.calculated_amount ?? 0,
					currency: currencyCode === "xof" ? "FCFA" : "USD",
				},
			});

			toast.cart("Ajouté au panier", {
				description: product?.collectionTitle
					? `${product.collectionTitle} a été ajouté à votre panier.`
					: "Votre article a été ajouté à votre panier.",
			});
			setShowSizeSelector(false);
		},
		[activeColor, product?.collectionTitle, addItem, currencyCode],
	);

	const handleCloseSizeSelector = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setShowSizeSelector(false);
	}, []);

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

	const thumbnailSrc = getMediaUrl(activeColor.thumbnail);

	return (
		<article className={cn("pb-4 space-y-3 w-full group", className)}>
			{/* ===== Image principale ===== */}
			<div
				className="overflow-hidden relative bg-gray-50 rounded-none cursor-pointer"
				onClick={handleNavigate}
			>
				<div className="relative w-full aspect-3/4">
					{thumbnailSrc ? (
						<>
							{isImageLoading && (
								<div className="flex absolute inset-0 z-10 justify-center items-center bg-gray-100">
									<div className="w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-black" />
								</div>
							)}

							<Image
								src={thumbnailSrc}
								alt={`${product.collectionTitle} - ${activeColor.label}`}
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
						</>
					) : (
						// Visuel manquant : un repli neutre plutôt qu'une image cassée —
						// la carte reste affichée, avec sa couleur, son prix et ses tailles.
						<div className="flex absolute inset-0 justify-center items-center bg-gray-100">
							<ImageOff className="w-10 h-10 text-gray-300" strokeWidth={1.25} />
						</div>
					)}

					{/* Boutons d'action desktop (hover) */}
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

					{/* Bouton mobile */}
					<div className="absolute right-4 bottom-4 flex-col space-y-4 rounded-lg max-md:flex w-fit md:hidden">
						<button
							type="button"
							onClick={handleToggleSizeSelector}
							className="py-2 px-2 text-[1.4rem] font-medium shadow-sm text-white h-fit w-fit bg-secondary rounded-full"
						>
							<AddToCardIcon className="w-12 h-12 text-white" />
						</button>
					</div>

					{/* Sélecteur de taille Desktop (overlay) */}
					{!isMobile && showSizeSelector && availableSizes.length > 0 && (
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
								unavailableSizes={unavailableSizes}
								selectedSize={selectedSize}
								onChange={handleSelectSize}
								onClick={(e, size) => handleAddToCart(e, size)}
								compact
							/>
						</div>
					)}
				</div>
			</div>

			{/* Sélecteur de taille Mobile (drawer) */}
			{isMobile && (
				<Drawer open={showSizeSelector} onOpenChange={setShowSizeSelector}>
					<DrawerContent
						className="max-h-[80vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="px-6 pb-4 h-[20vh]">
							<div className="flex justify-between items-center pb-2 mb-6 border-b border-gray-200">
								<h3 className="text-[2rem] font-semibold">
									Sélectionnez une taille
								</h3>
								<DrawerClose asChild>
									<button
										type="button"
										className="text-gray-500 hover:text-black"
										aria-label="Fermer"
									>
										<CloseIconImported className="w-8 h-8" />
									</button>
								</DrawerClose>
							</div>
							<SizeSelector
								sizes={availableSizes}
								unavailableSizes={unavailableSizes}
								selectedSize={selectedSize}
								onChange={handleSelectSize}
								onClick={(e, size) => handleAddToCart(e, size)}
								compact={false}
							/>
						</div>
					</DrawerContent>
				</Drawer>
			)}

			{/* ===== Infos produit ===== */}
			<div className="space-y-2">
				<div className="flex justify-between items-start text-[#000]">
					{/*
					 * `min-w-0` est indispensable : sans lui, un enfant flex ne
					 * rétrécit jamais sous sa largeur intrinsèque, et `truncate`
					 * n'a plus rien à couper — le titre déborde alors sous la
					 * ligne de couleurs au lieu d'être tronqué proprement.
					 */}
					<h3 className="min-w-0 flex-1 tracking-[0.03em] text-2xl! max-md:text-[1.8rem]! truncate">
						{activeColor?.title}
					</h3>
					<h3 className="shrink-0 tracking-[0.03em] text-2xl! max-md:text-[1.8rem]! whitespace-nowrap!">
						{formatCurrency_FR(activeColor?.price, currencySymbol)}
					</h3>
				</div>

				<ColorSelector
					colors={product.colors}
					activeIndex={activeColorIndex}
					onChange={handleSelectColor}
					hidden={product.isStandalone}
				/>

				{availableSizes.length > 0 && (
					<SizeSelector
						sizes={availableSizes}
						unavailableSizes={unavailableSizes}
						selectedSize={selectedSize}
						onChange={handleSelectSize}
						onClick={(e, size) => handleAddToCart(e, size)}
						compact
					/>
				)}
			</div>
		</article>
	);
};

export default CardProduct;
