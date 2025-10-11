"use client";

import { NotifyMeModal } from "@/features/products/components/organims/notify-me";
import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import ProductInfos from "@/features/products/components/organims/products-info";
import Reviews from "@/features/products/components/organims/reviews";
import { ProductTypes } from "@/features/products/types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useMemo, useState } from "react";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

const productData: ProductTypes = {
	category: "FEMME FASHION",
	title: "SWEET TOP",
	price: 79000,
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
			image: ["/assets/product5.webp", "/assets/product_2.jpg"],
			quantity: 1,
		},
		{
			color: {
				label: "Black",
				code: "#000",
			},
			size: ["2xL", "3XL"],
			image: ["/assets/product5.webp"],
			quantity: 1,
		},

		{
			color: {
				label: "Rouge",
				code: "#FF0000",
			},
			size: ["S", "M", "L", "XL", "2XL", "3XL"],
			image: ["/assets/product_2.jpg"],
			quantity: 1,
		},
	],
};

export default function ProductPage() {
	const [selectedColor, setSelectedColor] = useState<string>("Black");
	const [selectedSize, setSelectedSize] = useState<string>("M");

	const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
	const [outOfStockVariant, setOutOfStockVariant] = useState<{
		size: string;
		color: { name: string; code: string };
		image: string;
	} | null>(null);

	const availableColors = useMemo(() => {
		const colors = productData.variable.map((v) => v.color);
		return [...new Map(colors.map((item) => [item, item])).values()];
	}, []);

	const availableSizes = useMemo(() => {
		const sizes = productData.variable
			.filter((v) => v.color.label === selectedColor)
			.map((v) => ({ label: v.size, value: v.size }));
		return [...new Map(sizes.map((item) => [item.label, item])).values()];
	}, [selectedColor]);

	const handleSizeChange = (size: string) => {
		setSelectedSize(size);
		const variant = productData.variable.find(
			(v) => v.color.label === selectedColor
			// && v.size === selectedSize
		);

		// if (variant && variant.stock === 0) {
		// 	setOutOfStockVariant({
		// 		size: variant.size,
		// 		color: variant.color,
		// 		image: variant.images[0] ?? "/assets/placeholder.jpg",
		// 	});
		// 	setIsNotifyModalOpen(true);
		// }
	};

	const handleColorChange = (colorName: string) => {
		setSelectedColor(colorName);
		const firstAvailableVariant = productData.variable.find(
			(v) => v.color.label === colorName
		);
		if (firstAvailableVariant?.size) {
			setSelectedSize(firstAvailableVariant?.size?.[0] ?? "M");
		} else {
			setSelectedSize("M");
		}
	};

	// const currentImages = useMemo(() => {
	// 	return (
	// 		productData.variable.find((v) => v.color.name === selectedColor)
	// 			?.images || []
	// 	);
	// }, [selectedColor]);

	// const infoProductData = {
	// 	category: productData.category,
	// 	title: productData.title,
	// 	price: productData.price,
	// 	description: productData.description,
	// 	sizes: availableSizes,
	// 	colors: availableColors,
	// 	images: currentImages,
	// 	promotion: productData.promotion,
	// };

	return (
		<>
			<Container
				maxWidth="100vw"
				className="px-4 py-12 mx-auto lg:px-40 space-y-18"
			>
				<div className="flex flex-col justify-center gap-20 sm:flex-row">
					<div className="w-full space-y-8 lg:w-2/5">
						<ProductGallery
							images={
								productData.variable[0]?.image as string[] | StaticImport[]
							}
							title={productData.title}
						/>
						<Reviews className="max-sm:hidden sm:block" />
					</div>

					<ProductInfos
						productData={productData}
						selectedColor={selectedColor}
						setSelectedColor={handleColorChange}
						selectedSize={selectedSize}
						setSelectedSize={handleSizeChange}
					/>

					<div className="sm:hidden max-sm:block">
						<Reviews />
					</div>
				</div>

				<ProductSuggestion />
			</Container>

			<NotifyMeModal
				isOpen={isNotifyModalOpen}
				onClose={() => setIsNotifyModalOpen(false)}
				product={productData}
				variant={outOfStockVariant}
			/>
		</>
	);
}
