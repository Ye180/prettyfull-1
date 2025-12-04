"use client";

import { useAddItemToCartMedusa } from "@/features/cart/api/medusa/add-item-to-cart-medusa";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import Reviews from "@/features/products/components/organims/reviews";
import ProductSkeleton from "@/shared/components/organims/product-fiche-loading";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCollectionProductsMedusa } from "../api/medusa/get-collection-products-medusa";
import { useGetProductsByHandleMedusa } from "../api/medusa/get-product-by-handle-medusa";
import { ProductGalleryNew } from "../components/organims/product-gallery-new";
import { ProductInfosNew } from "../components/organims/product-infos-new";

export default function ProductViews() {
	const params = useParams();

	const { data: product, isLoading } = useGetProductsByHandleMedusa(
		params.handle as string
	);

	// Récupérer les produits de la même collection
	const collectionId = product?.collection?.id;
	const { data: collectionProducts } =
		useGetCollectionProductsMedusa(collectionId);

	const [activeImage, setActiveImage] = useState<number>(0);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [disabled, setDisabled] = useState(true);

	const addItemToCartMutation = useAddItemToCartMedusa();

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

		// console.log("product.variants:", product?.variants);

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
			product.variants.forEach((variant: any, index: number) => {
				const variantLabel = variant.title || `Variant ${index + 1}`;
				const variantImage =
					variant.thumbnail || product.images?.[0]?.url || "";

				if (!colorMap.has(variantLabel)) {
					colorMap.set(variantLabel, {
						label: variantLabel,
						variants: [variant],
						images: variantImage
							? [variantImage]
							: product.images?.map((img: any) => img.url) || [],
					});
				}
			});
			return Array.from(colorMap.values());
		}

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
					opt.title.toLowerCase() === "couleur"
			);

			// Récupérer la première valeur de couleur disponible
			let colorValue = "";
			if (colorOpt && p.variants && p.variants.length > 0) {
				const firstVariant = p.variants[0];
				const colorOptValue = firstVariant.options?.find(
					(o: any) => o.option_id === colorOpt.id
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
						v.calculated_price?.calculated_amount || v.calculated_price || 0
				)
				.filter((p: number) => p > 0);
			return prices.length > 0 ? Math.min(...prices) : 0;
		}
		return 0;
	}, [product]);

	// ===== RÉINITIALISATION QUAND LE PRODUIT CHANGE =====
	useEffect(() => {
		// Réinitialiser les sélections quand le produit change
		setSelectedColor("");
		setSelectedSize("");
		setDisabled(true);
		setActiveImage(0);
	}, [product?.id]);

	// console.log(colorVariants);

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

			// Définir la première taille par défaut si disponible
			const firstColorVariants = colorVariants[0].variants;
			if (sizeOption && firstColorVariants && firstColorVariants.length > 0) {
				const firstSize = firstColorVariants[0]?.options?.find(
					(opt: any) => opt.option_id === sizeOption
				)?.value;
				if (firstSize) {
					setSelectedSize(firstSize);
					setDisabled(false);
				}
			}
		}
	}, [product, colorVariants, sizeOption, selectedColor]);

	const sizeOnly = sizeOption?.values?.map((item) => {
		return item.value;
	});

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

	const handleClick = async () => {
		if (!selectedSize) {
			console.error("Veuillez sélectionner une taille");
			return;
		}

		// Trouver le variant correspondant
		let matchingVariant;

		if (sizeOption) {
			// Chercher dans tous les variants du produit par taille
			matchingVariant = product?.variants?.find((variant: any) => {
				const variantSize = variant.options?.find(
					(opt: any) => opt.option_id === sizeOption.id
				)?.value;
				return variantSize === selectedSize;
			});
		} else {
			// Si pas d'option taille, chercher par titre de variant
			matchingVariant = product?.variants?.find(
				(variant: any) => variant.title === selectedSize
			);
		}

		const cartId = localStorage.getItem("cart_id");

		if (matchingVariant) {
			addItemToCartMutation.mutate(
				{
					cartId: cartId || "",
					quantity: 1,
					variant_id: matchingVariant.id, // ou adapter votre API
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

	console.log(sizeOnly);

	return (
		<>
			<Container
				maxWidth="100vw"
				className="px-4 py-2 mx-auto sm:py-12 lg:px-40"
			>
				<div className="flex flex-col gap-8 justify-center lg:gap-14 lg:flex-row">
					{/* Colonne gauche: Galerie */}
					<div className="flex flex-col space-y-4 sm:space-y-8">
						<ProductGalleryNew
							images={product?.images?.map((img: any) => img.url) || []}
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
						sizes={sizeOnly as string[]}
						selectedColor={selectedColor}
						selectedSize={selectedSize}
						onColorChange={handleColorChange}
						onSizeChange={handleSizeChange}
						onAddToCart={handleClick}
						disabled={disabled}
						isLoading={addItemToCartMutation.isPending}
						collectionColorVariants={collectionColorVariants}
					/>

					{/* Reviews mobile */}
					<div className="lg:hidden">
						<Reviews />
					</div>
				</div>
				<ProductSuggestion />
			</Container>
		</>
	);
}
