"use client";

import { SizeOption } from "@/features/products/components/molecules/product-options";
import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import Reviews from "@/features/products/components/organims/reviews";
import { ProductTypes } from "@/features/products/types";
import ProductSkeleton from "@/shared/components/organims/product-fiche-loading";
import { CardProps } from "@prettyfull/ui";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductInfos from "../../../../../../packages/ui/src/components/products/products-infos";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductBySlug } from "../api/get-products-by-slug";

const productData: ProductTypes = {
	category: "FEMME FASHION",
	name: "SWEET TOP",
	price: {
		amount: 89000,
		currency: "XOF",
	},
	promotion: {
		reduced_price: 59000,
		pourcentage: 30,
	},

	description:
		"Un haut élégant et confortable parfait pour toutes les occasions.",

	variants: [
		{
			color: {
				label: "Bleue",
				code: "#3b82f6",
			},
			size: ["S", "M", "L", "3XL"],
			images: [
				"/assets/product5.webp",
				"/assets/product_2.webp",
				"/assets/product5.webp",
				"/assets/product_2.webp",
				"/assets/product5.webp",
				"/assets/product_2.webp",
			],
			quantity: 1,
		},
		{
			color: {
				label: "Black",
				code: "#000",
			},
			size: ["2XL", "3XL"],
			images: ["/assets/product5.webp"],
			quantity: 1,
		},

		{
			color: {
				label: "Rouge",
				code: "#ff0000",
			},
			size: ["S", "M", "L", "XL", "2XL", "3XL"],
			images: ["/assets/product_2.webp"],
			quantity: 1,
		},
	],
};

export default function ProductViews() {
	const params = useParams();

	const { data: product, isLoading } = useGetProductBySlug(
		params.productId as string
	);

	const [variants, setVariants] = useState<{
		images: string[] | StaticImport[];
		size: SizeOption[] | string[];
		activeImageOne?: number;
	}>({
		images: [],
		size: [],
		activeImageOne: 0,
	});

	const colorByDefault = product?.variants
		? product?.variants[0]?.color.code
		: product?.notVariable?.color
			? product?.notVariable.color.code
			: "#3b82f6";

	const sizeByDefault = variants?.size[0] as string;

	const [selectedColor, setSelectedColor] = useState<string>(
		colorByDefault as string
	);
	const [selectedSize, setSelectedSize] = useState<string>(
		sizeByDefault as string
	);

	const [activeImage, setActiveImage] = useState<number>(0);

	const [disabled, setDisabled] = useState(true);

	const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
	const [outOfStockVariant, setOutOfStockVariant] = useState<{
		size: string;
		color: { name: string; code: string };
		image: string;
	} | null>(null);

	// Modifiez la logique du useMemo pour retourner les couleurs au lieu de faire un setVariants
	const availableColors = useMemo(() => {
		const colors = product?.variants?.find(
			(v) => v.color.code === selectedColor
		);

		// Mettre à jour l'état variants ici
		if (colors) {
			setVariants({
				images: colors.images || [],
				size: colors.size || [],
				activeImageOne: 0,
			});
		} else if (product?.notVariable) {
			setVariants({
				images: product.notVariable.image || [],
				size: product.notVariable.size || [],
				activeImageOne: 0,
			});
		}

		return colors;
	}, [selectedColor, product]);

	// Initialiser les données du produit au chargement
	useEffect(() => {
		if (product) {
			// Définir la couleur par défaut
			const defaultColor = product?.variants
				? product.variants[0]?.color.code
				: product?.notVariable?.color?.code || "#3b82f6";

			// Définir les images et tailles par défaut
			const initialImages =
				product.variants?.[0]?.images || product.notVariable?.image || [];
			const initialSizes =
				product.variants?.[0]?.size || product.notVariable?.size || [];

			setSelectedColor(defaultColor as string);
			setVariants({
				images: initialImages,
				size: initialSizes,
				activeImageOne: 0,
			});

			// Définir la première taille comme taille par défaut
			if (initialSizes.length > 0) {
				setSelectedSize(initialSizes[0] as string);
				setDisabled(false);
			}
		}
	}, [product]);

	// Mettre à jour les images et tailles quand la couleur change
	useEffect(() => {
		if (!product || !selectedColor) return;

		const selectedVariant = product.variants?.find(
			(v) => v.color.code === selectedColor
		);

		if (selectedVariant) {
			setVariants({
				images: selectedVariant.images || [],
				size: selectedVariant.size || [],
				activeImageOne: 0,
			});

			// Réinitialiser la taille sélectionnée si elle n'est pas disponible
			if (!selectedVariant.size.includes(selectedSize)) {
				setSelectedSize("");
				setDisabled(true);
			}
		} else if (product.notVariable) {
			setVariants({
				images: product.notVariable.image || [],
				size: product.notVariable.size || [],
				activeImageOne: 0,
			});
		}

		setActiveImage(0);
	}, [selectedColor, product]);

	const handleColorChange = useCallback(
		async (selectedColor: string) => {
			variants;
			setSelectedColor(selectedColor);
			setDisabled(true);
			setSelectedSize(null as unknown as string);

			setActiveImage(0);
		},

		[selectedColor]
	);

	const handleSizeChange = useCallback(
		async (size: string) => {
			setSelectedSize(size);
			setDisabled(false);
		},

		[selectedSize]
	);

	const handleClick = () => {
		console.log("Acheter", { size: selectedSize, color: selectedColor });

		const selectedVariant = product?.variants?.find(
			(v) =>
				v.color.code === selectedColor &&
				(v.size as string[])?.includes(selectedSize)
		);

		selectedVariant === undefined ? setDisabled(true) : setDisabled(false);
	};

	if (isLoading) {
		return <ProductSkeleton />;
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
							images={variants?.images as string[]}
							title={productData?.name}
							activeImage={activeImage}
							setActiveImage={setActiveImage}
							promotion={productData.promotion}
						/>
						<Reviews className="max-sm:hidden sm:block w-[600px] " />
					</div>

					<ProductInfos
						sizes={(variants.size as string[]) || productData.notVariable?.size}
						productData={product as CardProps}
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

			{/* <NotifyMeModal
				isOpen={isNotifyModalOpen}
				onClose={() => setIsNotifyModalOpen(false)}
				product={product}
				variant={outOfStockVariant}
			/> */}
		</>
	);
}
