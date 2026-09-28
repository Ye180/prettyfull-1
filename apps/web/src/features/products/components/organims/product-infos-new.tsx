"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useState } from "react";
import { Cart } from "../../../../components/icons/cart.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";

interface ProductInfosNewProps {
	productName: string;
	productCategory: string;
	price: number;
	originalPrice?: number;
	onAddToCart: (quantity: number) => void;
	onAddToWishlist?: () => void;
	isWishlisted?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	rating?: number;
	reviewCount?: number;
	description?: string;
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
	onAddToCart,
	onAddToWishlist,
	isWishlisted = false,
	disabled = false,
	isLoading = false,
	rating = 4.5,
	reviewCount = 2260,
	description,
	details,
	shippingInfo = "Livraison offerte dès 50 000 FCFA",
	returnPolicy = "Retours acceptés sous 14 jours - échange ou avoir",
	currency = "USD",
}: ProductInfosNewProps) {
	const defaultDetails = [
		"Ingrédients testés en laboratoire indépendant, lot après lot",
		"Sans OGM, formule végétalienne disponible sur certaines références",
		"Posologie recommandée indiquée sur l'étiquette du produit",
		"Approvisionnement responsable et traçabilité des ingrédients",
	];

	const displayDetails = details || defaultDetails;

	// Stepper local - non branché au store panier, la quantité n'est transmise
	// qu'au moment du clic sur "Ajouter au panier" (cf. useAddToCart).
	const [quantity, setQuantity] = useState(1);

	return (
		<div className="w-full md:w-[420px] space-y-6">
			{/* Header: Nom, Prix, Rating */}
			<div className="space-y-2">
				<p className="text-xs tracking-wide text-[#666666] uppercase">
					{productCategory}
				</p>

				<div className="flex gap-4 justify-between items-start">
					<h1 className="text-2xl lg:text-3xl font-semibold text-[#080808]">
						{productName}
					</h1>
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
			</div>

			<p className="text-xs text-neutral-500">{returnPolicy}</p>

			{/* Quantité + Ajouter au panier, sur une même ligne */}
			<div className="flex gap-3">
				<div className="flex items-center border border-neutral-300 rounded-md shrink-0">
					<button
						type="button"
						aria-label="Diminuer la quantité"
						onClick={() => setQuantity((q) => Math.max(1, q - 1))}
						disabled={quantity <= 1}
						className={`flex justify-center items-center w-10 h-12 transition ${
							quantity <= 1
								? "opacity-40 cursor-not-allowed"
								: "cursor-pointer hover:bg-neutral-100"
						}`}
					>
						<MinusIcon className="w-4 h-4" />
					</button>
					<span className="w-8 text-sm font-medium text-center select-none">
						{quantity}
					</span>
					<button
						type="button"
						aria-label="Augmenter la quantité"
						onClick={() => setQuantity((q) => q + 1)}
						className="flex justify-center items-center w-10 h-12 transition cursor-pointer hover:bg-neutral-100"
					>
						<PlusIcon className="w-4 h-4" />
					</button>
				</div>

				<button
					type="button"
					onClick={() => onAddToCart(quantity)}
					disabled={disabled || isLoading}
					className="flex flex-1 gap-2 justify-center items-center h-12 text-sm font-semibold text-[#080808] bg-white rounded-md border border-neutral-800 transition cursor-pointer hover:bg-neutral-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Cart className="w-[18px] h-[18px]" />
					{isLoading ? "Ajout en cours..." : "Ajouter au panier"}
				</button>

				<button
					type="button"
					onClick={onAddToWishlist}
					aria-label={isWishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
					className={`flex justify-center items-center w-12 h-12 rounded-md border shrink-0 cursor-pointer transition ${
						isWishlisted
							? "text-white bg-neutral-900 border-neutral-900"
							: "border-neutral-300 hover:border-neutral-800"
					}`}
				>
					<Heart className="w-5 h-5" />
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
				<span>{shippingInfo}</span>
			</div>

			{/* Description / Directions / Livraison & retours */}
			<Accordion type="single" collapsible defaultValue="description" className="border-t border-neutral-200">
				<AccordionItem value="description">
					<AccordionTrigger className="text-base">Description</AccordionTrigger>
					<AccordionContent>
						{description && (
							<p className="mb-3 leading-relaxed text-neutral-600">{description}</p>
						)}
						<ul className="space-y-2 text-neutral-600">
							{displayDetails.map((detail, i) => (
								<li key={i} className="flex gap-2 items-start">
									<span className="mt-0.5 text-neutral-400">•</span>
									<span>{detail}</span>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="directions">
					<AccordionTrigger className="text-base">Posologie</AccordionTrigger>
					<AccordionContent>
						<p className="text-neutral-600">
							Prendre la portion indiquée sur l&apos;étiquette, de préférence au
							cours d&apos;un repas. Ne pas dépasser la dose journalière
							recommandée.
						</p>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="shipping">
					<AccordionTrigger className="text-base">
						Livraison &amp; retours
					</AccordionTrigger>
					<AccordionContent>
						<ul className="space-y-2 text-neutral-600">
							<li className="flex gap-2 items-start">
								<span className="mt-0.5 text-neutral-400">•</span>
								<span>{shippingInfo}</span>
							</li>
							<li className="flex gap-2 items-start">
								<span className="mt-0.5 text-neutral-400">•</span>
								<span>{returnPolicy}</span>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
