"use client";

import type { StoreProduct, StoreProductOption, StoreVariant } from "@/lib/store-api/types";
import { useCartStore } from "@prettyfull/store";
import { toast } from "@prettyfull/ui";

/**
 * Ajout au panier depuis la fiche produit : appariement de la déclinaison
 * choisie, contrôle de stock, puis écriture dans le panier partagé
 * (`@prettyfull/store`) - le même que celui que lit `/cart` et que
 * `CardProduct` alimente déjà, pour que « ajouter au panier » depuis la fiche
 * produit se retrouve réellement dans le panier affiché.
 */
export function useAddToCart(
	product: StoreProduct | null | undefined,
	options: {
		colorOption?: StoreProductOption;
		sizeOption?: StoreProductOption;
		selectedColor: string;
		selectedSize: string;
		currentImages: string[];
		currencyCode?: string;
	},
) {
	const addItem = useCartStore((state) => state.addItem);
	const { colorOption, sizeOption, selectedColor, selectedSize, currentImages, currencyCode } =
		options;

	const handleAddToCart = (quantity: number = 1) => {
		// Une taille n'est exigée que si ce produit en propose réellement une
		// (`sizeOption`) - sans grille de tailles, rien ne permettrait jamais
		// de la choisir et l'ajout au panier resterait bloqué à tort.
		if (sizeOption && !selectedSize) {
			toast.error("Sélectionnez une taille", {
				description: "Veuillez choisir une taille avant d'ajouter au panier.",
			});
			return;
		}

		// Combinaison exacte choisie : coloris **et** taille. Ne filtrer que sur
		// la taille suffisait tant qu'un produit ne portait qu'une couleur ; avec
		// des variantes réelles, `find` renvoyait toujours le premier coloris.
		const matchesOption = (variant: StoreVariant, optionId: string, value: string) =>
			variant.options?.find((opt) => opt.option_id === optionId)?.value === value;

		const matchingVariant = product?.variants?.find((variant) => {
			if (colorOption && !matchesOption(variant, colorOption.id, selectedColor)) {
				return false;
			}

			if (sizeOption) return matchesOption(variant, sizeOption.id, selectedSize);

			// Produit sans grille de tailles : le titre de la variante fait foi.
			return variant.title === selectedSize || !selectedSize;
		});

		if (!matchingVariant) {
			toast.error("Taille non disponible", { description: "Ce variant n'existe pas." });
			return;
		}

		const purchasable =
			!matchingVariant.manage_inventory ||
			matchingVariant.allow_backorder ||
			(matchingVariant.inventory_quantity ?? 1) > 0;

		if (!purchasable) {
			toast.error("Rupture de stock", { description: "Cette taille n'est plus disponible." });
			return;
		}

		const variantLabel: Record<string, string> = {};
		if (colorOption) variantLabel[colorOption.title] = selectedColor;
		if (sizeOption) variantLabel[sizeOption.title] = selectedSize;

		addItem({
			productId: matchingVariant.id,
			product: {
				id: product!.id,
				name: product!.title,
				image: currentImages[0] || product?.images?.[0]?.url,
			},
			quantity,
			selectedVariants: variantLabel,
			unitPrice: {
				amount: matchingVariant.calculated_price?.calculated_amount ?? 0,
				currency: currencyCode === "xof" ? "FCFA" : "USD",
			},
			// Triplet du point de stock : c'est lui, et non le libellé affiché, que
			// le tunnel d'achat renvoie à l'API pour réserver la bonne déclinaison.
			selection: {
				productId: product!.id,
				variantId: matchingVariant.variant_id,
				sizeId: matchingVariant.size_id,
			},
		});

		toast.cart("Ajouté au panier", {
			description: `${product?.title} a été ajouté à votre panier.`,
		});
	};

	return { handleAddToCart };
}
