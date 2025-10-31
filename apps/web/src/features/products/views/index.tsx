"use client";

import { SizeOption } from "@/features/products/components/molecules/product-options";
import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import ProductInfos from "@/features/products/components/organims/products-info";
import Reviews from "@/features/products/components/organims/reviews";
import { ProductTypes } from "@/features/products/types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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

	variable: [
		{
			color: {
				label: "Bleue",
				code: "#3b82f6",
			},
			size: ["S", "M", "L", "3XL"],
			image: [
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
			image: ["/assets/product5.webp"],
			quantity: 1,
		},

		{
			color: {
				label: "Rouge",
				code: "#ff0000",
			},
			size: ["S", "M", "L", "XL", "2XL", "3XL"],
			image: ["/assets/product_2.webp"],
			quantity: 1,
		},
	],
};

export default function ProductViews() {
	const params = useParams();

	const { data: product, isLoading } = useGetProductBySlug(
		params.productId as string
	);

	console.log("Product data from API:", product);

	console.log("Params product page:", params);

	const [variable, setVariable] = useState<{
		images: string[] | StaticImport[];
		sizes: SizeOption[] | string[];
		activeImageOne?: number;
	}>({
		images: [],
		sizes: [],
		activeImageOne: 0,
	});

	const colorByDefault = product?.variable
		? product?.variable[0]?.color.code
		: product?.notVariable?.color
			? product?.notVariable.color.code
			: "#3b82f6";

	const sizeByDefault = variable?.sizes[0] as string;

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

	const availableColors = useMemo(() => {
		const colors = product?.variable?.find(
			(v) => v.color.code === selectedColor
		);

		setVariable({
			images:
				((colors?.image as string[]) || product?.notVariable?.image) ?? [],
			sizes: (colors?.size as string[]) || product?.notVariable?.size || [],
		});
	}, [selectedColor]);

	const handleColorChange = useCallback(
		async (selectedColor: string) => {
			variable;
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

		const selectedVariant = productData.variable?.find(
			(v) =>
				v.color.code === selectedColor &&
				(v.size as string[])?.includes(selectedSize)
		);

		selectedVariant === undefined ? setDisabled(true) : setDisabled(false);
	};

	return (
		<>
			<Container
				maxWidth="100vw"
				className="px-4 py-2 mx-auto sm:py-12 lg:px-40 "
			>
				<div className="flex flex-col justify-center sm:flex-row gap-x-14 ">
					<div className="flex flex-col space-y-4 sm:space-y-8 w-fit ">
						<ProductGallery
							images={variable?.images}
							title={productData?.name}
							activeImage={activeImage}
							setActiveImage={setActiveImage}
							promotion={productData.promotion}
						/>
						<Reviews className="max-sm:hidden sm:block w-[600px] " />
					</div>

					<ProductInfos
						sizes={
							(variable.sizes as string[]) ||
							productData.notVariable?.size ||
							[]
						}
						productData={productData}
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
