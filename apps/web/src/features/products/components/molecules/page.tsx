"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { useState } from "react";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import Container from "../../../../../../../packages/ui/src/layouts/helpers/container";
import { Button } from "../../../../components/ui/button";
import { ProductGallery } from "../organims/product-gallery";
import { ProductOptions } from "./product-options";

// Exemple de données produit (à remplacer par des données réelles)
const productData = {
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

export default function ProductPage({ params }: { params: { id: string } }) {
	const [selectedSize, setSelectedSize] = useState<string>("M");
	const [selectedColor, setSelectedColor] = useState<string>("Black");
	const [activeTab, setActiveTab] = useState<string>("Overview");

	const classNames = "!font-light font-manrope !text-[1.8rem]";

	return (
		<Container maxWidth="100vw" className="py-8 lg:px-40 ">
			<div className="flex flex-col gap-20 md:flex-row">
				{/* Colonne de gauche - Images */}
				<div className="w-full lg:w-2/5">
					<ProductGallery
						images={productData.images}
						title={productData.title}
					/>
				</div>

				{/* Colonne de droite - Informations produit */}
				<div className="w-full lg:w-2/5 ">
					<div className="space-y-6">
						{/* Catégorie */}
						<h4 className="tracking-wide text-gray-500 uppercase !text-[2.1rem] font-bebas-neue">
							{productData.category}
						</h4>

						{/* Titre et prix */}
						<div className="space-y-2">
							<h1 className="!text-[4.8rem] font-bold">{productData.title}</h1>
							<p className="text-3xl font-medium font-bebas-neue">
								{formatCurrency_FR(productData.price)}
							</p>
						</div>

						{/* Options de produit */}
						<ProductOptions
							sizes={productData.sizes}
							colors={productData.colors}
							selectedSize={selectedSize}
							selectedColor={selectedColor}
							onSizeChange={(size) => setSelectedSize(size)}
							onColorChange={(color) => setSelectedColor(color)}
						/>

						{/* Boutons d'action */}
						<div className="flex gap-8 mt-15 w-[70%] items-center">
							<Button variant="default" className="flex-1 py-6 text-lg">
								Acheter
							</Button>

							<Button
								variant="outline"
								className="p-4 text-2xl rounded-full cursor-pointer w-fit h-fit "
							>
								<Heart />
							</Button>
						</div>

						{/* Section description */}
						<div className="pt-10 space-y-4">
							<h4 className="!text-[4rem] font-bold">DESCRIPTION</h4>

							<Accordion type="single" collapsible className="space-y-4">
								<AccordionItem value="item-1">
									<AccordionTrigger className={cn(classNames)}>
										Overview
									</AccordionTrigger>
									<AccordionContent>
										<p className="text-gray-700">{productData.description}</p>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2 ">
									<AccordionTrigger className={cn(classNames)}>
										Materials
									</AccordionTrigger>
									<AccordionContent>
										<p className="text-gray-700">
											Fabriqué en coton de haute qualité pour un confort
											optimal.
										</p>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-3">
									<AccordionTrigger className={cn(classNames)}>
										Return Policy
									</AccordionTrigger>
									<AccordionContent>
										<p className="text-gray-700">
											Retours acceptés sous 14 jours dans l'emballage d'origine.
										</p>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
