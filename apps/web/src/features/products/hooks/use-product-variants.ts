"use client";

import type { StoreProduct, StoreProductOption, StoreVariant } from "@/lib/store-api/types";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Dérivation coloris/taille/images d'une fiche produit.
 *
 * Extrait de la vue PDP (§5 du plan de refonte) : c'était la moitié du fichier
 * en `useMemo`/`useEffect`, ce qui rendait le composant illisible. Regroupé
 * ici, la vue redevient une simple composition.
 */

interface ColorVariantGroup {
	label: string;
	variants: StoreVariant[];
	images: string[];
}

const findOption = (
	options: StoreProductOption[] | undefined,
	...titles: string[]
): StoreProductOption | undefined =>
	options?.find((opt) => titles.includes(opt.title.toLowerCase()));

const optionValue = (
	variant: StoreVariant,
	optionId: string | undefined,
): string | undefined =>
	optionId ? variant.options?.find((opt) => opt.option_id === optionId)?.value : undefined;

export function useProductVariants(product: StoreProduct | null | undefined) {
	const [activeImage, setActiveImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");

	const colorOption = useMemo(() => findOption(product?.options, "color", "couleur"), [product]);
	const sizeOption = useMemo(() => findOption(product?.options, "size", "taille"), [product]);

	const colorVariants = useMemo((): ColorVariantGroup[] => {
		if (!product?.variants || product.variants.length === 0) return [];

		const colorMap = new Map<string, ColorVariantGroup>();
		const productImgUrls = product.images?.map((img) => img.url) ?? [];

		if (!colorOption) {
			if (sizeOption) {
				// Pas de couleur mais des tailles - grouper TOUS les variants ensemble.
				const variantImgs = product.variants.flatMap((v) => v.images?.map((img) => img.url) ?? []);
				colorMap.set("__default__", {
					label: "__default__",
					variants: product.variants,
					images: [...new Set([...variantImgs, ...productImgUrls])],
				});
			} else {
				product.variants.forEach((variant, index) => {
					const variantLabel = variant.title || `Variant ${index + 1}`;
					const variantImgs = variant.images?.map((img) => img.url) ?? [];
					if (!colorMap.has(variantLabel)) {
						colorMap.set(variantLabel, {
							label: variantLabel,
							variants: [variant],
							images: [...new Set([...variantImgs, ...productImgUrls])],
						});
					}
				});
			}
			return Array.from(colorMap.values());
		}

		product.variants.forEach((variant) => {
			const colorValue = optionValue(variant, colorOption.id);
			if (!colorValue || colorMap.has(colorValue)) return;

			const colorVariantsList = product.variants.filter(
				(v) => optionValue(v, colorOption.id) === colorValue,
			);
			const colorImages = colorVariantsList.flatMap((v) => v.images?.map((img) => img.url) ?? []);
			const allImages = [...new Set([...colorImages, ...productImgUrls])];

			colorMap.set(colorValue, {
				label: colorValue,
				variants: colorVariantsList,
				images: allImages.length > 0 ? allImages : productImgUrls,
			});
		});

		return Array.from(colorMap.values());
	}, [product, colorOption, sizeOption]);

	const availableSizes = useMemo(() => {
		// Sans option Taille, ce produit (ou ce coloris) n'a aucune taille
		// réelle : `variant.title` ne porterait ici que le nom du coloris ou
		// du produit, jamais une taille, et ne doit donc jamais alimenter ce
		// sélecteur.
		if (!sizeOption) return [];

		const currentColorVariants =
			colorVariants.find((cv) => cv.label === selectedColor)?.variants ?? [];

		const sizesSet = new Set<string>();
		currentColorVariants.forEach((variant) => {
			const sizeValue = optionValue(variant, sizeOption.id);
			if (sizeValue) sizesSet.add(sizeValue);
		});

		return Array.from(sizesSet);
	}, [selectedColor, colorVariants, sizeOption]);

	const currentImages = useMemo(() => {
		const productImgUrls = product?.images?.map((img) => img.url) ?? [];
		if (!selectedColor || colorVariants.length === 0) return productImgUrls;

		const variantImgs = colorVariants.find((cv) => cv.label === selectedColor)?.images ?? [];
		return [...new Set([...variantImgs, ...productImgUrls])];
	}, [selectedColor, colorVariants, product]);

	// `colorVariants` porte toujours au moins un groupe interne (même « sans
	// coloris »), pour que la dérivation des images/tailles ait un point
	// d'ancrage unique. Il ne devient un vrai sélecteur que si le produit a
	// une option Couleur - sinon son étiquette (le nom du produit, ou le
	// jeton interne « __default__ ») ne doit jamais atteindre l'affichage.
	const availableColors = useMemo(
		() => (colorOption ? colorVariants.map((cv) => cv.label) : []),
		[colorVariants, colorOption],
	);

	/** Coloris → code hexadécimal, porté par les variantes de l'API. */
	const colorSwatches = useMemo(() => {
		const swatches: Record<string, string | null> = {};
		for (const variant of product?.variants ?? []) {
			const label = optionValue(variant, colorOption?.id);
			if (label && !(label in swatches)) swatches[label] = variant.color_hex ?? null;
		}
		return swatches;
	}, [product, colorOption]);

	/** Prix le plus bas toutes déclinaisons confondues. */
	const productPrice = useMemo(() => {
		const prices = (product?.variants ?? [])
			.map((v) => v.calculated_price?.calculated_amount ?? 0)
			.filter((p) => p > 0);
		return prices.length > 0 ? Math.min(...prices) : 0;
	}, [product]);

	// Le produit change (navigation vers une autre fiche) : on repart à zéro.
	useEffect(() => {
		setSelectedColor("");
		setSelectedSize("");
		setActiveImage(0);
	}, [product?.id]);

	// Un groupe est présélectionné (via `colorVariants`, pas `availableColors` :
	// même sans option Couleur visible, le groupe interne doit être choisi pour
	// que la liste des tailles et la galerie se résolvent) - sans lui, le
	// produit paraît indisponible.
	useEffect(() => {
		if (!selectedColor && colorVariants.length > 0) {
			setSelectedColor(colorVariants[0]!.label);
		}
	}, [colorVariants, selectedColor]);

	const handleColorChange = useCallback((newColor: string) => {
		setSelectedColor(newColor);
		setSelectedSize("");
		setActiveImage(0);
	}, []);

	const handleSizeChange = useCallback((size: string) => {
		setSelectedSize(size);
	}, []);

	return {
		activeImage,
		setActiveImage,
		selectedColor,
		selectedSize,
		colorOption,
		sizeOption,
		colorVariants,
		availableSizes,
		currentImages,
		availableColors,
		colorSwatches,
		productPrice,
		handleColorChange,
		handleSizeChange,
	};
}
