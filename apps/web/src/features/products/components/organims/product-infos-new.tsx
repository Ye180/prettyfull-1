"use client";

import { SizeSelector } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { Button } from "../../../../../../../packages/ui/src/button";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { CollectionVariants } from "./collection-variants";
// import { SizeSelector } from "../molecules/size-selector";

interface ProductInfosNewProps {
	productName: string;
	productCategory: string;
	price: number;
	originalPrice?: number;
	promotion?: {
		pourcentage: number;
	};
	colors: string[];
	sizes: string[];
	selectedColor: string;
	selectedSize: string;
	onColorChange: (color: string) => void;
	onSizeChange: (size: string) => void;
	onAddToCart: () => void;
	onAddToWishlist?: () => void;
	disabled?: boolean;
	isLoading?: boolean;
	rating?: number;
	reviewCount?: number;
	features?: {
		title: string;
		description: string;
	}[];
	shippingInfo?: string;
	returnPolicy?: string;
	collectionColorVariants: any[];
	currency?: string;
}

export function ProductInfosNew({
	productName,
	productCategory,
	price,
	originalPrice,
	promotion,
	colors,
	sizes,
	selectedColor,
	selectedSize,
	onColorChange,
	onSizeChange,
	collectionColorVariants,
	onAddToCart,
	onAddToWishlist,
	disabled = false,
	isLoading = false,
	rating = 4.5,
	reviewCount = 2260,
	features,
	shippingInfo = "Free shipping USD $125+",
	returnPolicy = "30 day Return, Store Credit",
	currency = "USD",
}: ProductInfosNewProps) {
	// Features par défaut si non fournies
	const defaultFeatures = [
		{
			title: "Perfect Fit",
			description:
				"This sweater offers a comfortable and true-to-size fit for many.",
		},
		{
			title: "Soft Material",
			description: "This sweater features a soft, nice, and high-end material.",
		},
		{
			title: "Vibrant Color",
			description: "This sweater has a beautiful hunter green color.",
		},
	];

	const displayFeatures = features || defaultFeatures;

	return (
		<div className="w-full md:w-[400px] space-y-6">
			{/* Header: Nom, Prix, Rating */}
			<div className="space-y-2">
				{/* Breadcrumb / Category */}
				<p className="text-xs tracking-wide text-gray-500 uppercase">
					{productCategory}
				</p>

				{/* Titre et Rating */}
				<div className="flex gap-4 justify-between items-start">
					<h3 className="text-[3rem]! font-semibold text-gray-900">
						{productName}
					</h3>
					<div className="flex gap-1 items-center shrink-0">
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<svg
									key={star}
									className={`w-4 h-4 ${
										star <= Math.floor(rating)
											? "text-yellow-400"
											: "text-gray-300"
									}`}
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							))}
						</div>
						<span className="text-xs text-gray-500">({reviewCount})</span>
					</div>
				</div>

				{/* Prix */}
				<div className="flex gap-3 items-center">
					<span className="text-2xl font-bold text-gray-900">
						{formatCurrency_FR(price, currency)}
					</span>
					{originalPrice && originalPrice > price && (
						<span className="text-lg text-gray-400 line-through">
							{formatCurrency_FR(originalPrice, currency)}
						</span>
					)}
				</div>

				{/* Promotion Badge */}
				{promotion && (
					<div className="inline-flex gap-2 items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded">
						<span>
							Cyber Monday Steals Starting at ${promotion.pourcentage}! Prices
							as Marked
						</span>
					</div>
				)}
			</div>

			{/* Sélecteur de couleur */}
			{/* {colors.length > 0 && (
				<ColorSelector
					colors={colors}
					selectedColor={selectedColor}
					onColorChange={onColorChange}
				/>
			)} */}

			{/* Sélecteur de taille */}
			{sizes.length > 0 && (
				<SizeSelector
					sizes={sizes}
					selectedSize={selectedSize}
					onChange={onSizeChange}
				/>
			)}

			{collectionColorVariants.length > 1 && (
				<CollectionVariants variants={collectionColorVariants} />
			)}

			{/* Info retour */}
			<p className="text-xs text-gray-500">{returnPolicy}</p>

			{/* Boutons d'action */}
			<div className="flex gap-3 justify-center items-center">
				<Button
					className="py-6 text-base font-semibold text-white bg-black rounded-full hover:bg-gray-800"
					onClick={onAddToCart}
					disabled={disabled || isLoading}
				>
					{isLoading ? "Ajout en cours..." : "Add to Bag"}
				</Button>
				<button
					className="w-fit! rounded-full border p-3 border-black h-fit hover:border-black cursor-pointer hover:bg-black hover:text-white"
					onClick={onAddToWishlist}
				>
					<Heart className="w-8 h-8" />
				</button>
			</div>

			{/* Info livraison */}
			<div className="flex gap-2 items-center text-sm text-gray-600">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
					/>
				</svg>
				<span>International Standard</span>
				<span className="text-gray-400">|</span>
				<span>{shippingInfo}</span>
			</div>

			{/* Section "Why you'll love it" */}
			<div className="pt-4 border-t border-gray-200">
				<div className="flex gap-2 items-center mb-4">
					<svg
						className="w-5 h-5 text-green-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="font-semibold text-gray-900">
						WHY YOU&apos;LL LOVE IT
					</span>
				</div>
				<p className="mb-4 text-sm text-gray-600">
					Buy this if you want a comfortable, true-to-size sweater with a soft,
					high-end material, a beautiful hunter green color, a sleek and classy
					look, well-fitting sleeves, a comfortable turtleneck, and a nice
					stretch.
				</p>

				{/* Features Grid */}
				<div className="grid grid-cols-3 gap-3">
					{displayFeatures.slice(0, 3).map((feature, index) => (
						<div key={index} className="p-3 rounded-lg border border-gray-200">
							<div className="flex gap-1 items-center mb-1">
								<svg
									className="w-4 h-4 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="text-xs font-semibold text-gray-900">
									{feature.title}
								</span>
							</div>
							<p className="text-xs text-gray-500 line-clamp-3">
								{feature.description}
							</p>
						</div>
					))}
				</div>

				<p className="mt-2 text-xs italic text-gray-400">
					Summary generated by AI based on customer feedback
				</p>
			</div>

			{/* Product Details Accordion */}
			<details className="pt-4 border-t border-gray-200">
				<summary className="flex justify-between items-center py-2 cursor-pointer">
					<div className="flex gap-2 items-center">
						<svg
							className="w-5 h-5 text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						<span className="font-medium text-gray-900">Product Details</span>
					</div>
					<svg
						className="w-5 h-5 text-gray-400 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</summary>
				<div className="py-4 text-sm text-gray-600">
					<ul className="space-y-2">
						<li>• High-quality material</li>
						<li>• Machine washable</li>
						<li>• Imported</li>
					</ul>
				</div>
			</details>
		</div>
	);
}
