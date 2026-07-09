"use client";

// =============================================================================
// SizeSelector : Sélecteur de tailles sous forme de boutons
// =============================================================================

import { cn } from "@prettyfull/utils";
import React from "react";
import { Button } from "../../button";

interface SizeSelectorProps {
	/** Liste des tailles existantes pour ce produit/couleur */
	sizes: string[];
	/** Tailles épuisées (stock = 0, non commandables) */
	unavailableSizes?: string[];
	/** Taille actuellement sélectionnée */
	selectedSize: string | null;
	/** Callback appelé lors de la sélection d'une taille */
	onChange: (size: string) => void;
	/** Afficher en mode compact (pour les cartes) */
	compact?: boolean;
	onClick?: (e: React.MouseEvent, size: string) => void;
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
	sizes,
	unavailableSizes = [],
	selectedSize,
	onChange,
	onClick,
	compact = false,
}) => {
	if (!sizes.length) return null;

	const allCodes = Array.from(new Set([...sizes, ...unavailableSizes]));
	const orderedSizes = SIZE_ORDER.filter((code) => allCodes.includes(code));
	const extraSizes = allCodes.filter((code) => !SIZE_ORDER.includes(code));

	return (
		<div className="flex flex-wrap gap-2">
			{[...orderedSizes, ...extraSizes].map((code) => {
				const outOfStock = unavailableSizes.includes(code);
				const isSelected = selectedSize === code;

				return (
					<Button
						key={code}
						disabled={outOfStock}
						type="button"
						onClick={(e) => {
							if (outOfStock) return;
							onClick?.(e, code);
							onChange(code);
						}}
						className={cn(
							"p-0 font-normal uppercase bg-white border rounded-sm text-[1.3rem] transition-all duration-200",
							compact ? "w-10 h-10 text-xs" : "w-12 h-12 lg:w-14 lg:h-14",
							outOfStock
								? "text-gray-300 border-gray-200 cursor-not-allowed line-through"
								: isSelected
									? "border-black text-black"
									: "text-gray-600 border-gray-300 hover:border-black hover:text-black cursor-pointer active:bg-white hover:bg-white",
						)}
						title={outOfStock ? "Rupture de stock" : undefined}
					>
						{code}
					</Button>
				);
			})}
		</div>
	);
};

export default SizeSelector;
