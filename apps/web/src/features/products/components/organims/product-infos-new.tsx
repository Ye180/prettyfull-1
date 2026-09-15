"use client";

import {
	SizeSelector,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useState } from "react";
import { Button } from "../../../../../../../packages/ui/src/button";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";

/**
 * Guide des tailles - pas de champ backend Bust/Length/Sleeve par produit,
 * stub statique unique affiché pour tous les produits (cf. plan Phase 6).
 */
const SIZE_CHART = [
	{ size: "S", bust: 90, length: 58, sleeve: 56 },
	{ size: "M", bust: 96, length: 60, sleeve: 57 },
	{ size: "L", bust: 102, length: 62, sleeve: 58 },
	{ size: "XL", bust: 108, length: 64, sleeve: 59 },
];

interface ProductInfosNewProps {
	productName: string;
	productCategory: string;
	price: number;
	originalPrice?: number;
	promotion?: {
		pourcentage: number;
	};
	colors: string[];
	/** Coloris → code hexadécimal, pour la pastille du sélecteur. */
	colorSwatches?: Record<string, string | null>;
	sizes: string[];
	selectedColor: string;
	selectedSize: string;
	onColorChange: (color: string) => void;
	onSizeChange: (size: string) => void;
	onAddToCart: (quantity: number) => void;
	onAddToWishlist?: () => void;
	isWishlisted?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	rating?: number;
	reviewCount?: number;
	description?: string;
	features?: {
		title: string;
		description: string;
	}[];
	details?: string[];
	shippingInfo?: string;
	returnPolicy?: string;
	currency?: string;
}

export function ProductInfosNew({
	productName,
	productCategory,
	price,
	originalPrice,
	promotion,
	colors,
	colorSwatches = {},
	sizes,
	selectedColor,
	selectedSize,
	onColorChange,
	onSizeChange,
	onAddToCart,
	onAddToWishlist,
	isWishlisted = false,
	disabled = false,
	isLoading = false,
	rating = 4.5,
	reviewCount = 2260,
	description,
	features,
	details,
	shippingInfo = "Livraison offerte dès 50 000 FCFA",
	returnPolicy = "Retours acceptés sous 14 jours - échange ou avoir",
	currency = "USD",
}: ProductInfosNewProps) {
	const defaultFeatures = [
		{
			title: "Qualité Premium",
			description:
				"Confectionné avec des matières soigneusement sélectionnées pour un confort durable et une finition impeccable.",
		},
		{
			title: "Coupe Ajustée",
			description:
				"Silhouette flatteuse et taille fidèle - conçu pour s'adapter naturellement à votre morphologie.",
		},
		{
			title: "Entretien Facile",
			description:
				"Conserve sa forme, sa couleur et son toucher après chaque lavage sans effort particulier.",
		},
	];

	const defaultDetails = [
		"Tissu premium sélectionné pour la durabilité et le confort",
		"Coupe ajustée et silhouette flatteuse",
		"Entretien facile - voir étiquette pour les instructions",
		"Matières responsables et approvisionnement éthique",
		"Consultez notre guide des tailles pour un fit parfait",
		"Design exclusif Prettyfull",
	];

	const displayFeatures = features || defaultFeatures;
	const displayDetails = details || defaultDetails;

	// Stepper local - non branché au store panier, la quantité n'est transmise
	// qu'au moment du clic sur "Add to Cart" (cf. useAddToCart).
	const [quantity, setQuantity] = useState(1);
	const subtotal = price * quantity;

	return (
		<div className="w-full md:w-[400px] space-y-6">
			{/* Header: Nom, Prix, Rating */}
			<div className="space-y-2">
				{/* Breadcrumb / Category */}
				<p className="text-xs tracking-wide text-[#666666] uppercase">
					{productCategory}
				</p>

				{/* Titre et Rating */}
				<div className="flex gap-4 justify-between items-start">
					<h3 className="text-2xl lg:text-4xl font-semibold text-[#080808]">
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
											: "text-neutral-300"
									}`}
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							))}
						</div>
						<span className="text-xs text-[#666666]">({reviewCount})</span>
					</div>
				</div>

				{/* Prix */}
				<div className="flex gap-3 items-center">
					<span className="text-2xl font-bold text-[#080808]">
						{formatCurrency_FR(price, currency)}
					</span>
					{originalPrice && originalPrice > price && (
						<span className="text-lg text-[#666666] line-through">
							{formatCurrency_FR(originalPrice, currency)}
						</span>
					)}
				</div>

				{/* Promotion Badge */}
				{promotion && (
					<div className="inline-flex gap-2 items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
						<span>
							Offres Cyber Monday à partir de {promotion.pourcentage} % de
							réduction ! Prix indiqués
						</span>
					</div>
				)}
			</div>

			{/*
			 * Sélecteur de coloris.
			 *
			 * Le libellé accompagne la pastille : la couleur seule ne suffit
			 * pas à identifier un choix (vision déficiente, écran monochrome),
			 * et deux teintes proches comme « Beige » et « Blanc » se
			 * distinguent mal côte à côte.
			 */}
			{colors.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="text-sm font-medium text-[#080808]">
						Coloris{selectedColor ? ` : ${selectedColor}` : ""}
					</span>
					<div className="flex flex-wrap gap-3">
						{colors.map((color) => {
							const isSelected = selectedColor === color;

							return (
								<button
									key={color}
									type="button"
									onClick={() => onColorChange(color)}
									aria-pressed={isSelected}
									aria-label={`Coloris ${color}`}
									title={color}
									className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-all ${
										isSelected
											? "border-black"
											: "border-neutral-200 hover:border-neutral-400"
									} cursor-pointer`}
								>
									<span
										className="block w-7 h-7 rounded-full border border-black/10"
										style={{
											backgroundColor: colorSwatches[color] ?? "#e5e5e5",
										}}
									/>
									<span className="text-sm text-[#080808]">{color}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* Sélecteur de taille */}
			{sizes.length > 0 && (
				<SizeSelector
					sizes={sizes}
					selectedSize={selectedSize}
					onChange={onSizeChange}
				/>
			)}

			{/* Info retour */}
			<p className="text-xs text-neutral-500">{returnPolicy}</p>

			{/* Stepper de quantité + sous-total */}
			<div className="flex justify-between items-center">
				<div className="flex gap-3 items-center px-2 py-1.5 bg-neutral-100 rounded-full w-fit">
					<button
						type="button"
						aria-label="Diminuer la quantité"
						onClick={() => setQuantity((q) => Math.max(1, q - 1))}
						disabled={quantity <= 1}
						className={`flex justify-center items-center w-8 h-8 rounded-full border border-neutral-300 transition ${
							quantity <= 1
								? "opacity-50 cursor-not-allowed"
								: "cursor-pointer hover:bg-neutral-200"
						}`}
					>
						<MinusIcon className="w-6 h-6" />
					</button>
					<span className="w-6 text-sm font-medium text-center select-none">
						{quantity}
					</span>
					<button
						type="button"
						aria-label="Augmenter la quantité"
						onClick={() => setQuantity((q) => q + 1)}
						className="flex justify-center items-center w-8 h-8 bg-black rounded-full transition cursor-pointer hover:bg-black/80"
					>
						<PlusIcon className="w-6 h-6" color="white" />
					</button>
				</div>
				<span className="text-sm text-neutral-600">
					Sous-total{" "}
					<span className="font-semibold text-neutral-900">
						{formatCurrency_FR(subtotal, currency)}
					</span>
				</span>
			</div>

			{/* Boutons d'action */}
			<div className="flex gap-3 justify-center items-center">
				<Button
					className="py-6 text-base font-semibold text-white bg-black rounded-full hover:bg-neutral-800"
					onClick={() => onAddToCart(quantity)}
					disabled={disabled || isLoading}
				>
					{isLoading ? "Ajout en cours..." : "Ajouter au panier"}
				</Button>
				<button
					className={`w-fit! rounded-full border p-3 border-black h-fit hover:border-black cursor-pointer hover:bg-black hover:text-white ${
						isWishlisted ? "text-white bg-black" : ""
					}`}
					onClick={onAddToWishlist}
					aria-label={
						isWishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"
					}
				>
					<Heart className="w-8 h-8" />
				</button>
			</div>

			{/* Info livraison */}
			<div className="flex gap-2 items-center text-sm text-neutral-600">
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
				<span>Norme internationale</span>
				<span className="text-neutral-400">|</span>
				<span>{shippingInfo}</span>
			</div>

			{/* Warranty - rangée statique (icône + texte encadré), pas de champ backend dédié */}
			<div className="flex gap-3 items-start p-4 rounded-2xl border border-neutral-200">
				<span className="flex justify-center items-center w-9 h-9 rounded-full shrink-0 bg-neutral-100">
					<svg
						className="w-5 h-5 text-neutral-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
						/>
					</svg>
				</span>
				<div>
					<p className="text-sm font-semibold text-neutral-900">Garantie</p>
					<p className="text-xs text-neutral-500">
						1 mois de garantie sur tous les produits. {returnPolicy}
					</p>
				</div>
			</div>

			{/* Section "Why you'll love it" */}
			<div className="pt-4 border-t border-neutral-200">
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
					<span className="font-semibold text-neutral-900">
						POURQUOI VOUS ALLEZ ADORER
					</span>
				</div>
				{description && (
					<p className="mb-4 text-sm leading-relaxed text-neutral-600">
						{description}
					</p>
				)}

				{/* Features Grid */}
				<div className="grid grid-cols-3 gap-3">
					{displayFeatures.slice(0, 3).map((feature, index) => (
						<div
							key={index}
							className="p-3 rounded-xl border border-neutral-200"
						>
							<div className="flex gap-1 items-center mb-1">
								<svg
									className="w-4 h-4 text-neutral-600"
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
								<span className="text-xs font-semibold text-neutral-900">
									{feature.title}
								</span>
							</div>
							<p className="text-xs text-neutral-500 line-clamp-3">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Product Details - About / Size & Fit / Additional */}
			<Tabs defaultValue="about" className="pt-4 border-t border-neutral-200">
				<TabsList className="justify-start p-0 space-x-2 h-auto bg-transparent">
					<TabsTrigger
						value="about"
						className="px-5 py-2 text-sm rounded-full border-black/20 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:px-5 data-[state=active]:py-2"
					>
						À propos
					</TabsTrigger>
					<TabsTrigger
						value="size-fit"
						className="px-5 py-2 text-sm rounded-full border-black/20 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:px-5 data-[state=active]:py-2"
					>
						Taille & Coupe
					</TabsTrigger>
					<TabsTrigger
						value="additional"
						className="px-5 py-2 text-sm rounded-full border-black/20 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:px-5 data-[state=active]:py-2"
					>
						Complément
					</TabsTrigger>
				</TabsList>

				<TabsContent value="about" className="py-4 text-sm text-neutral-600">
					{description && <p className="mb-3 leading-relaxed">{description}</p>}
					<ul className="space-y-2">
						{displayDetails.map((detail, i) => (
							<li key={i} className="flex gap-2 items-start">
								<span className="mt-0.5 text-neutral-400">•</span>
								<span>{detail}</span>
							</li>
						))}
					</ul>
				</TabsContent>

				<TabsContent value="size-fit" className="py-4">
					{/* Guide des tailles - stub statique, pas de champ backend par produit */}
					<table className="w-full text-sm border border-collapse border-neutral-200">
						<thead>
							<tr className="bg-neutral-50">
								<th className="p-3 text-left border border-neutral-200">
									Taille
								</th>
								<th className="p-3 text-left border border-neutral-200">
									Tour de poitrine
								</th>
								<th className="p-3 text-left border border-neutral-200">
									Longueur
								</th>
								<th className="p-3 text-left border border-neutral-200">
									Manche
								</th>
							</tr>
						</thead>
						<tbody>
							{SIZE_CHART.map((row) => (
								<tr key={row.size}>
									<td className="p-3 font-medium border border-neutral-200">
										{row.size}
									</td>
									<td className="p-3 border text-neutral-600 border-neutral-200">
										{row.bust} cm
									</td>
									<td className="p-3 border text-neutral-600 border-neutral-200">
										{row.length} cm
									</td>
									<td className="p-3 border text-neutral-600 border-neutral-200">
										{row.sleeve} cm
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="mt-2 text-xs text-neutral-400">
						Guide des tailles indicatif - les mesures peuvent varier légèrement
						selon le produit.
					</p>
				</TabsContent>

				<TabsContent
					value="additional"
					className="py-4 text-sm text-neutral-600"
				>
					<ul className="space-y-2">
						<li className="flex gap-2 items-start">
							<span className="mt-0.5 text-neutral-400">•</span>
							<span>{shippingInfo}</span>
						</li>
						<li className="flex gap-2 items-start">
							<span className="mt-0.5 text-neutral-400">•</span>
							<span>{returnPolicy}</span>
						</li>
					</ul>
				</TabsContent>
			</Tabs>
		</div>
	);
}
