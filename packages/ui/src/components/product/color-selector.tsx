"use client";

// =============================================================================
// ColorSelector : Sélecteur de couleurs sous forme de pastilles
// =============================================================================

import { cn } from "@prettyfull/utils";
import React from "react";

import type { NormalizedColorVariant } from "./types";

interface ColorSelectorProps {
	/** Liste des couleurs disponibles */
	colors: NormalizedColorVariant[];
	/** Index de la couleur actuellement sélectionnée */
	activeIndex: number;
	/** Callback appelé lors du changement de couleur */
	onChange: (index: number) => void;
	/** Nombre max de couleurs à afficher avant "+N" (optionnel) */
	maxVisible?: number;
	/** Masquer le sélecteur (pour les produits standalone) */
	hidden?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
	colors,
	activeIndex,
	onChange,
	maxVisible = 5,
	hidden = false,
}) => {
	// Ne pas afficher si hidden ou si une seule couleur (produit standalone)
	if (hidden || !colors.length || colors.length <= 1) return null;

	const visibleColors = colors.slice(0, maxVisible);
	const remainingCount = colors.length - maxVisible;

	return (
		<div className="flex flex-wrap gap-2 items-center px-1">
			{visibleColors.map((color, index) => (
				<button
					key={color.productId}
					type="button"
					onClick={() => onChange(index)}
					className={cn(
						"flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer",
						index === activeIndex
							? "border-black scale-110"
							: "border-gray-200 hover:border-gray-400 hover:scale-105"
					)}
					aria-label={`Couleur ${color.label}`}
					title={color.label}
				>
					<span
						className="block w-6 h-6 rounded-full shadow-inner"
						style={{ backgroundColor: color.colorCode }}
					/>
				</button>
			))}

			{/* Indicateur "+N" si plus de couleurs */}
			{remainingCount > 0 && (
				<span className="flex justify-center items-center w-8 h-8 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
					+{remainingCount}
				</span>
			)}
		</div>
	);
};

export default ColorSelector;
