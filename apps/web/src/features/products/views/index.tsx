"use client";

import { useAddItemToCartMedusa } from "@/features/cart/api/medusa/add-item-to-cart-medusa";
import Reviews from "@/features/products/components/organims/reviews";
import ProductSkeleton from "@/shared/components/organims/product-fiche-loading";
import { useRegionStore } from "@/stores/useRegion";
import { toast } from "@prettyfull/ui";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCollectionProductsMedusa } from "../api/medusa/get-collection-products-medusa";
import { useGetProductsByHandleMedusa } from "../api/medusa/get-product-by-handle-medusa";
import { ProductGalleryNew } from "../components/organims/product-gallery-new";
import { ProductInfosNew } from "../components/organims/product-infos-new";

export default function ProductViews() {
	const params = useParams();

	const regions = useRegionStore((state) => state.region);
	const { data: product, isLoading } = useGetProductsByHandleMedusa(
		params.handle as string,
		regions?.id as string,
	);

	// Récupérer les produits de la même collection
	const collectionId = product?.collection?.id;
	const { data: collectionProducts } = useGetCollectionProductsMedusa(
		collectionId,
		regions?.id,
	);

	const [activeImage, setActiveImage] = useState<number>(0);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string>("");

	const addItemToCartMutation = useAddItemToCartMedusa();

	// ===== EXTRACTION DES OPTIONS (Color, Size) =====
	const colorOption = useMemo(() => {
		return product?.options?.find(
			(opt: any) =>
				opt.title.toLowerCase() === "color" ||
				opt.title.toLowerCase() === "couleur",
		);
	}, [product]);

	const sizeOption = useMemo(() => {
		return product?.options?.find(
			(opt: any) =>
				opt.title.toLowerCase() === "size" ||
				opt.title.toLowerCase() === "taille",
		);
	}, [product]);

	// ===== MAPPER LES COULEURS DISPONIBLES =====
	const colorVariants = useMemo(() => {
		if (!product?.variants || product.variants.length === 0) return [];

		const colorMap = new Map<
			string,
			{
				label: string;
				variants: any[];
				images: string[];
			}
		>();

		// Si pas d'option couleur, créer une entrée par variant avec son thumbnail
		if (!colorOption) {
			const prodImgs = product.images?.map((img: any) => img.url) || [];
			if (sizeOption) {
				// Pas de couleur mais des tailles — grouper TOUS les variants ensemble
				const thumbs = product.variants
					.map((v: any) => v.thumbnail)
					.filter(Boolean);
				colorMap.set("__default__", {
					label: "__default__",
					variants: product.variants,
					images: [...new Set([...thumbs, ...prodImgs])],
				});
			} else {
				product.variants.forEach((variant: any, index: number) => {
					const variantLabel = variant.title || `Variant ${index + 1}`;
					const variantImage =
						variant.thumbnail || product.images?.[0]?.url || "";
					if (!colorMap.has(variantLabel)) {
						colorMap.set(variantLabel, {
							label: variantLabel,
							variants: [variant],
							images: [...new Set([...(variantImage ? [variantImage] : []), ...prodImgs])],
						});
					}
				});
			}
			return Array.from(colorMap.values());
		}

		product.variants.forEach((variant: any) => {
			const colorValue = variant.options?.find(
				(opt: any) => opt.option_id === colorOption.id,
			)?.value;

			if (colorValue && !colorMap.has(colorValue)) {
				// Récupérer tous les variants de cette couleur
				const colorVariantsList = (product.variants || []).filter((v: any) =>
					v.options?.some(
						(o: any) =>
							o.option_id === colorOption.id && o.value === colorValue,
					),
				);

				// Récupérer toutes les images des variants de cette couleur
				const colorImages = colorVariantsList
					.map((v: any) => v.thumbnail)
					.filter((img: string) => !!img);

				// Combiner thumbnails variants + images produit (déduplication)
				const productImgUrls = product.images?.map((img: any) => img.url) || [];
				const allImages = [...new Set([...colorImages, ...productImgUrls])];
				const finalImages = allImages.length > 0 ? allImages : productImgUrls;

				colorMap.set(colorValue, {
					label: colorValue,
					variants: colorVariantsList,
					images: finalImages,
				});
			}
		});

		return Array.from(colorMap.values());
	}, [product, colorOption, sizeOption]);

	// ===== TAILLES DISPONIBLES POUR LA COULEUR ACTIVE =====
	const availableSizes = useMemo(() => {
		// if (!selectedColor || colorVariants.length === 0) return [];

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
				(opt: any) => opt.option_id === sizeOption.id,
			)?.value;
			if (sizeValue) sizesSet.add(sizeValue);
		});

		return Array.from(sizesSet);
	}, [selectedColor, colorVariants, sizeOption]);

	// ===== IMAGES POUR LA COULEUR ACTIVE =====
	const currentImages = useMemo(() => {
		const productImgUrls = product?.images?.map((img: any) => img.url) || [];
		if (!selectedColor || colorVariants.length === 0) {
			return productImgUrls;
		}
		const currentColorVariant = colorVariants.find(
			(cv) => cv.label === selectedColor,
		);
		const variantImgs = currentColorVariant?.images || [];
		return [...new Set([...variantImgs, ...productImgUrls])];
	}, [selectedColor, colorVariants, product]);

	// Extraire les noms de couleurs disponibles
	const availableColors = useMemo(() => {
		return colorVariants?.map((cv) => cv.label) || [];
	}, [colorVariants]);

	// Créer les variantes de collection basées sur les produits de la même collection avec couleurs différentes
	const collectionColorVariants = useMemo(() => {
		if (!collectionProducts || collectionProducts.length <= 1 || !product) {
			return [];
		}

		// Extraire la couleur de chaque produit de la collection
		const productsWithColors = collectionProducts.map((p: any) => {
			// Trouver l'option couleur du produit
			const colorOpt = p.options?.find(
				(opt: any) =>
					opt.title.toLowerCase() === "color" ||
					opt.title.toLowerCase() === "couleur",
			);

			// Récupérer la première valeur de couleur disponible
			let colorValue = "";
			if (colorOpt && p.variants && p.variants.length > 0) {
				const firstVariant = p.variants[0];
				const colorOptValue = firstVariant.options?.find(
					(o: any) => o.option_id === colorOpt.id,
				)?.value;
				colorValue = colorOptValue || "";
			}

			return {
				id: p.id,
				handle: p.handle,
				title: p.title,
				color: p.hs_code,
				image: p.thumbnail || p.images?.[0]?.url || "",
				isActive: p.id === product.id,
			};
		});

		// Filtrer pour ne garder que les produits avec des couleurs différentes
		const uniqueColors = new Map();
		productsWithColors.forEach((p: any) => {
			const colorKey = p.color || p.id; // Utiliser l'ID si pas de couleur
			if (!uniqueColors.has(colorKey)) {
				uniqueColors.set(colorKey, p);
			}
		});

		return Array.from(uniqueColors.values());
	}, [collectionProducts, product]);

	// Calcul du prix
	const productPrice = useMemo(() => {
		if (product?.variants && product.variants.length > 0) {
			const prices = product.variants
				.map(
					(v: any) =>
						v.calculated_price?.calculated_amount || v.calculated_price || 0,
				)
				.filter((p: number) => p > 0);
			return prices.length > 0 ? Math.min(...prices) : 0;
		}
		return 0;
	}, [product]);

	// ===== RÉINITIALISATION QUAND LE PRODUIT CHANGE =====
	useEffect(() => {
		setSelectedColor("");
		setSelectedSize("");
		setActiveImage(0);
	}, [product?.id]);

	// ===== INITIALISATION AU CHARGEMENT =====
	useEffect(() => {
		if (
			product &&
			colorVariants &&
			colorVariants.length > 0 &&
			colorVariants[0] &&
			!selectedColor
		) {
			// Définir la première couleur par défaut
			const defaultColor = colorVariants[0].label;
			setSelectedColor(defaultColor);

			const firstColorVariants = colorVariants[0].variants;
			if (sizeOption && firstColorVariants && firstColorVariants.length > 0) {
				const firstSize = firstColorVariants[0]?.options?.find(
					(opt: any) => opt.option_id === sizeOption.id,
				)?.value;
				if (firstSize) setSelectedSize(firstSize);
			}
		}
	}, [product, colorVariants, sizeOption, selectedColor]);

	// ===== GESTION DES CHANGEMENTS =====
	const handleColorChange = useCallback((newColor: string) => {
		setSelectedColor(newColor);
		setSelectedSize("");
		setActiveImage(0);
	}, []);

	const handleSizeChange = useCallback((size: string) => {
		setSelectedSize(size);
	}, []);

	const handleClick = () => {
		if (!selectedSize) {
			toast.error("Sélectionnez une taille", {
				description: "Veuillez choisir une taille avant d'ajouter au panier.",
			});
			return;
		}

		const matchingVariant = sizeOption
			? product?.variants?.find(
					(variant: any) =>
						variant.options?.find((opt: any) => opt.option_id === sizeOption.id)
							?.value === selectedSize,
				)
			: product?.variants?.find(
					(variant: any) => variant.title === selectedSize,
				);

		if (!matchingVariant) {
			toast.error("Taille non disponible", {
				description: "Ce variant n'existe pas.",
			});
			return;
		}

		const purchasable =
			!matchingVariant.manage_inventory ||
			matchingVariant.allow_backorder ||
			(matchingVariant.inventory_quantity ?? 1) > 0;

		if (!purchasable) {
			toast.error("Rupture de stock", {
				description: "Cette taille n'est plus disponible.",
			});
			return;
		}

		const cartId = localStorage.getItem("cart_id");
		const loadingId = toast.loading("Ajout au panier...");

		addItemToCartMutation.mutate(
			{ cartId: cartId || "", quantity: 1, variant_id: matchingVariant.id },
			{
				onSuccess: () => {
					toast.cart("Ajouté au panier", {
						id: loadingId,
						description: `${product?.title} a été ajouté à votre panier.`,
					});
				},
				onError: (error: any) => {
					toast.error("Impossible d'ajouter au panier", {
						id: loadingId,
						description: error?.message ?? "Une erreur est survenue.",
					});
				},
			},
		);
	};

	if (isLoading) {
		return <ProductSkeleton />;
	}

	if (!product) {
		return (
			<Container maxWidth="100vw" className="px-4 py-12 text-center">
				<ProductSkeleton />
			</Container>
		);
	}

	return (
		<>
			<Container maxWidth="100vw" className="px-4 py-2 mx-auto sm:py-12">
				<div className="flex flex-col gap-8 justify-center lg:gap-14 sm:flex-row">
					{/* Colonne gauche: Galerie */}
					<div className="flex flex-col space-y-4 sm:space-y-8">
						<ProductGalleryNew
							images={
								currentImages.length > 0
									? currentImages
									: product?.images?.map((img: any) => img.url) || []
							}
							title={product?.title || "Produit"}
							activeImage={activeImage}
							setActiveImage={setActiveImage}
							promotion={undefined}
						/>

						<Reviews className="hidden lg:block w-[600px]" />
					</div>

					{/* Colonne droite: Infos produit */}
					<ProductInfosNew
						productName={product?.title || "Produit"}
						productCategory={product?.collection?.title || "Collection"}
						price={productPrice}
						colors={availableColors}
						sizes={availableSizes}
						selectedColor={selectedColor}
						selectedSize={selectedSize}
						onColorChange={handleColorChange}
						onSizeChange={handleSizeChange}
						onAddToCart={handleClick}
						disabled={!selectedSize || addItemToCartMutation.isPending}
						isLoading={addItemToCartMutation.isPending}
						collectionColorVariants={collectionColorVariants}
						currency={regions?.currency_code === "xof" ? "FCFA" : "$"}
					/>

					{/* Reviews mobile */}
					<div className="sm:hidden">
						<Reviews />
					</div>
				</div>
				{/* <ProductSuggestion /> */}
			</Container>
		</>
	);
}
