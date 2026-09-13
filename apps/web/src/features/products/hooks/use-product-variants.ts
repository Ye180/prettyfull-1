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

export interface CollectionColorVariant {
	id: string;
	handle: string;
	title: string;
	color: string | null;
	image: string;
	isActive: boolean;
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

export function useProductVariants(
	product: StoreProduct | null | undefined,
	collectionProducts: StoreProduct[] | undefined,
) {
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
				// Pas de couleur mais des tailles — grouper TOUS les variants ensemble.
				const thumbs = product.variants.map((v) => v.thumbnail).filter(Boolean) as string[];
				colorMap.set("__default__", {
					label: "__default__",
					variants: product.variants,
					images: [...new Set([...thumbs, ...productImgUrls])],
				});
			} else {
				product.variants.forEach((variant, index) => {
					const variantLabel = variant.title || `Variant ${index + 1}`;
					const variantImage = variant.thumbnail || productImgUrls[0] || "";
					if (!colorMap.has(variantLabel)) {
						colorMap.set(variantLabel, {
							label: variantLabel,
							variants: [variant],
							images: [...new Set([...(variantImage ? [variantImage] : []), ...productImgUrls])],
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
			const colorImages = colorVariantsList.map((v) => v.thumbnail).filter(Boolean) as string[];
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
		const currentColorVariants =
			colorVariants.find((cv) => cv.label === selectedColor)?.variants ?? [];

		if (!sizeOption) {
			return currentColorVariants.map((v) => v.title).filter(Boolean);
		}

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

	const availableColors = useMemo(() => colorVariants.map((cv) => cv.label), [colorVariants]);

	/** Coloris → code hexadécimal, porté par les variantes de l'API. */
	const colorSwatches = useMemo(() => {
		const swatches: Record<string, string | null> = {};
		for (const variant of product?.variants ?? []) {
			const label = optionValue(variant, colorOption?.id);
			if (label && !(label in swatches)) swatches[label] = variant.color_hex ?? null;
		}
		return swatches;
	}, [product, colorOption]);

	/** Variantes de couleur de la même collection (autres coloris du produit). */
	const collectionColorVariants = useMemo((): CollectionColorVariant[] => {
		if (!collectionProducts || collectionProducts.length <= 1 || !product) return [];

		const productsWithColors = collectionProducts.map((p) => {
			const colorOpt = findOption(p.options, "color", "couleur");
			const firstVariant = p.variants[0];
			const colorValue =
				colorOpt && firstVariant ? optionValue(firstVariant, colorOpt.id) : undefined;

			return {
				id: p.id,
				handle: p.handle,
				title: p.title,
				color: p.variants[0]?.color_hex ?? colorValue ?? null,
				image: p.thumbnail || p.images?.[0]?.url || "",
				isActive: p.id === product.id,
			};
		});

		const uniqueColors = new Map<string, CollectionColorVariant>();
		productsWithColors.forEach((p) => {
			const colorKey = p.color || p.id;
			if (!uniqueColors.has(colorKey)) uniqueColors.set(colorKey, p);
		});

		return Array.from(uniqueColors.values());
	}, [collectionProducts, product]);

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

	// Un coloris est présélectionné : sans lui, la liste des tailles reste
	// vide et le produit paraît indisponible.
	useEffect(() => {
		if (!selectedColor && availableColors.length > 0) {
			setSelectedColor(availableColors[0]!);
		}
	}, [availableColors, selectedColor]);

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
		collectionColorVariants,
		productPrice,
		handleColorChange,
		handleSizeChange,
	};
}
