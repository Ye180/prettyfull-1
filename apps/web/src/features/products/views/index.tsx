"use client";

import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import Reviews from "@/features/products/components/organims/reviews";
import ProductSkeleton from "@/shared/components/organims/product-fiche-loading";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductInfos from "../../../../../../packages/ui/src/components/products/products-infos";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsByHandleMedusa } from "../api/medusa/get-product-by-handle-medusa";

export default function ProductViews() {
	const params = useParams();

	const { data: product, isLoading } = useGetProductsByHandleMedusa(
		params.handle as string
	);

	const [activeImage, setActiveImage] = useState<number>(0);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [disabled, setDisabled] = useState(true);

	// ===== EXTRACTION DES OPTIONS (Color, Size) =====
	const colorOption = useMemo(() => {
		return product?.options?.find(
			(opt: any) =>
				opt.title.toLowerCase() === "color" ||
				opt.title.toLowerCase() === "couleur"
		);
	}, [product]);

	const sizeOption = useMemo(() => {
		return product?.options?.find(
			(opt: any) =>
				opt.title.toLowerCase() === "size" ||
				opt.title.toLowerCase() === "taille"
		);
	}, [product]);

	// ===== MAPPER LES COULEURS DISPONIBLES =====
	const colorVariants = useMemo(() => {
		if (!product?.variants || product.variants.length === 0) return [];

		if (!colorOption) return [];

		const colorMap = new Map<
			string,
			{
				label: string;
				variants: any[];
				images: string[];
			}
		>();

		product.variants.forEach((variant: any) => {
			const colorValue = variant.options?.find(
				(opt: any) => opt.option_id === colorOption.id
			)?.value;

			if (colorValue && !colorMap.has(colorValue)) {
				// Récupérer tous les variants de cette couleur
				const colorVariantsList = (product.variants || []).filter((v: any) =>
					v.options?.some(
						(o: any) => o.option_id === colorOption.id && o.value === colorValue
					)
				);

				// Récupérer toutes les images des variants de cette couleur
				const colorImages = colorVariantsList
					.map((v: any) => v.thumbnail)
					.filter((img: string) => img);

				// Si pas d'images spécifiques, utiliser les images du produit
				const finalImages =
					colorImages.length > 0
						? colorImages
						: product.images?.map((img: any) => img.url) || [];

				colorMap.set(colorValue, {
					label: colorValue,
					variants: colorVariantsList,
					images: finalImages,
				});
			}
		});

		return Array.from(colorMap.values());
	}, [product, colorOption]);

	// ===== TAILLES DISPONIBLES POUR LA COULEUR ACTIVE =====
	const availableSizes = useMemo(() => {
		if (!selectedColor || colorVariants.length === 0) return [];

		const currentColorVariants =
			colorVariants.find((cv) => cv.label === selectedColor)?.variants || [];

		if (!sizeOption) {
			return currentColorVariants
				.map((v: any) => v.title)
				.filter((title: any) => title && title !== null);
		}

		const sizesSet = new Set<string>();
		currentColorVariants.forEach((variant: any) => {
			const sizeValue = variant.options?.find(
				(opt: any) => opt.option_id === sizeOption.id
			)?.value;
			if (sizeValue) sizesSet.add(sizeValue);
		});

		return Array.from(sizesSet);
	}, [selectedColor, colorVariants, sizeOption]);

	// ===== IMAGES POUR LA COULEUR ACTIVE =====
	const currentImages = useMemo(() => {
		if (!selectedColor || colorVariants.length === 0) {
			return product?.images?.map((img: any) => img.url) || [];
		}

		const currentColorVariant = colorVariants.find(
			(cv) => cv.label === selectedColor
		);
		return currentColorVariant?.images || [];
	}, [selectedColor, colorVariants, product]);

	// ===== INITIALISATION AU CHARGEMENT =====
	useEffect(() => {
		if (product && colorVariants.length > 0 && colorVariants[0]) {
			// Définir la première couleur par défaut
			const defaultColor = colorVariants[0].label;
			setSelectedColor(defaultColor);

			// Définir la première taille par défaut si disponible
			const firstColorVariants = colorVariants[0].variants;
			if (sizeOption && firstColorVariants && firstColorVariants.length > 0) {
				const firstSize = firstColorVariants[0]?.options?.find(
					(opt: any) => opt.option_id === sizeOption.id
				)?.value;
				if (firstSize) {
					setSelectedSize(firstSize);
					setDisabled(false);
				}
			}
		}
	}, [product, colorVariants, sizeOption]);

	// ===== GESTION DES CHANGEMENTS =====
	const handleColorChange = useCallback((newColor: string) => {
		console.log("Changement de couleur vers:", newColor);
		setSelectedColor(newColor);
		setSelectedSize("");
		setDisabled(true);
		setActiveImage(0);
	}, []);

	const handleSizeChange = useCallback((size: string) => {
		console.log("Changement de taille vers:", size);
		setSelectedSize(size);
		setDisabled(false);
	}, []);

	const handleClick = () => {
		if (!selectedColor || !selectedSize) {
			console.error("Veuillez sélectionner une couleur et une taille");
			return;
		}

		// Trouver le variant correspondant
		const currentColorVariants =
			colorVariants.find((cv) => cv.label === selectedColor)?.variants || [];

		let matchingVariant;
		if (sizeOption) {
			matchingVariant = currentColorVariants.find((variant: any) => {
				const variantSize = variant.options?.find(
					(opt: any) => opt.option_id === sizeOption.id
				)?.value;
				return variantSize === selectedSize;
			});
		} else {
			matchingVariant = currentColorVariants.find(
				(variant: any) => variant.title === selectedSize
			);
		}

		if (matchingVariant) {
			console.log("Ajout au panier:", {
				productId: product?.id,
				variantId: matchingVariant.id,
				color: selectedColor,
				size: selectedSize,
			});
			// TODO: Appeler votre mutation d'ajout au panier ici
		} else {
			console.error("Variant non trouvé");
		}
	};

	if (isLoading) {
		return <ProductSkeleton />;
	}

	if (!product) {
		return (
			<Container maxWidth="100vw" className="px-4 py-12 text-center">
				<h2 className="text-2xl font-semibold">Produit non trouvé</h2>
			</Container>
		);
	}

	return (
		<>
			<Container
				maxWidth="100vw"
				className="px-4 py-2 mx-auto sm:py-12 lg:px-40 "
			>
				<div className="flex flex-col justify-center sm:flex-row gap-x-14 ">
					<div className="flex flex-col space-y-4 sm:space-y-8 w-fit ">
						<ProductGallery
							images={currentImages}
							title={product?.title || "Produit"}
							activeImage={activeImage}
							setActiveImage={setActiveImage}
							promotion={undefined}
						/>
						<Reviews className="max-sm:hidden sm:block w-[600px] " />
					</div>

					<ProductInfos
						sizes={availableSizes}
						productData={{ product } as any}
						selectedColor={selectedColor}
						setSelectedColor={handleColorChange}
						selectedSize={selectedSize}
						setSelectedSize={handleSizeChange}
						onClick={() => {
							handleClick();
						}}
						disabled={disabled}
					/>

					<div className="sm:hidden max-sm:block">
						<Reviews />
					</div>
				</div>

				<ProductSuggestion />
			</Container>
		</>
	);
}
