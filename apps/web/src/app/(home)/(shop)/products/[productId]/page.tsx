"use client";

import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import ProductInfos from "@/features/products/components/organims/products-info";
import Reviews from "@/features/products/components/organims/reviews";
import { ProductTypes } from "@/features/products/types";
import { useState } from "react";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

// Exemple de données produit (à remplacer par des données réelles)
const productData: ProductTypes = {
	category: "FEMME FASHION",
	title: "SWEET TOP",
	price: 79000,
	description:
		"Un haut élégant et confortable parfait pour toutes les occasions.",
	sizes: [
		{ label: "XS", value: "XS" },
		{ label: "S", value: "S" },
		{ label: "M", value: "M" },
		{ label: "L", value: "L" },
		{ label: "XL", value: "XL" },
		{ label: "XXL", value: "XXL" },
	],
	colors: [
		{ name: "Black", code: "#000000" },
		{ name: "Bleue", code: "#3b82f6" },
		{ name: "Rouge", code: "#ef4444" },
	],
	images: [
		"/assets/product_1.jpg",
		"/assets/product_2.jpg",
		"/assets/product_1.jpg",
		"/assets/product_2.jpg",
	],
};

export default function ProductPage() {
	const [selectedSize, setSelectedSize] = useState<string>("M");
	const [selectedColor, setSelectedColor] = useState<string>("Black");

	return (
		<Container
			maxWidth="100vw"
			className="px-4 py-12 mx-auto lg:px-40 space-y-18"
		>
			<div className="flex flex-col justify-center gap-20 sm:flex-row ">
				{/* Colonne de gauche - Images */}
				<div className="w-full space-y-8 lg:w-2/5 ">
					<ProductGallery
						images={productData.images}
						title={productData.title}
					/>

					<Reviews className="max-sm:hidden sm:block" />
				</div>
				<ProductInfos
					productData={productData}
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
					selectedSize={selectedSize}
					setSelectedSize={setSelectedSize}
				/>

				<div className="sm:hidden max-sm:block">
					<Reviews />
				</div>
				{/* Colonne de droite - Informations produit */}
			</div>

			<ProductSuggestion />
		</Container>
	);
}
