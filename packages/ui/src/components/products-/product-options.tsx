"use client";

import { cn } from "@prettyfull/utils";
import { useMemo } from "react";
import Size from "../../size";
import type { PricedProduct } from "../../types/medusa";

interface SizeOption {
	label: string;
	value: string;
}

interface ProductOptionsProps {
	sizes?: SizeOption[];
	product?: PricedProduct; // Nouveau: produit Medusa
	selectedSize: string;
	selectedColor: string;
	onColorChange: (color: string) => void;
	onSizeChange?: (size: string) => void;
	handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
}

export function ProductOptions({
	product,
	sizes,
	selectedSize,
	selectedColor,
	onColorChange,
	onSizeChange,
	handleClick,
	className,
}: ProductOptionsProps) {
	// Extraire les couleurs disponibles depuis le produit Medusa
	const colorVariants = useMemo(() => {
		if (!product?.variants || !product?.options) return [];

		const colorOption = product.options.find(
			(opt: any) =>
				opt.title.toLowerCase() === "color" ||
				opt.title.toLowerCase() === "couleur"
		);

		if (!colorOption) return [];

		const colorMap = new Map<string, { label: string }>();

		product.variants.forEach((variant: any) => {
			const colorValue = variant.options?.find(
				(opt: any) => opt.option_id === colorOption.id
			)?.value;

			if (colorValue && !colorMap.has(colorValue)) {
				colorMap.set(colorValue, {
					label: colorValue,
				});
			}
		});

		return Array.from(colorMap.values());
	}, [product]);

	return (
		<div className={cn("space-y-12", className)}>
			{/* Sélecteur de taille */}
			{sizes && sizes.length > 0 && (
				<div className="space-y-6">
					<div className="flex justify-between">
						<p className="font-semibold uppercase text-[1.9rem]! font-bebas-neue tracking-wider">
							Taille
						</p>
					</div>
					<div className="flex flex-wrap gap-6">
						<Size
							selectSize={selectedSize}
							onSizeChange={onSizeChange}
							size={sizes as []}
							className="flex flex-row whitespace-nowrap"
							classButton=""
						/>
					</div>
				</div>
			)}

			{/* Sélecteur de couleur */}
			{colorVariants && colorVariants.length > 0 && (
				<div className="space-y-6">
					<p className="font-semibold uppercase text-[1.9rem]! font-bebas-neue tracking-wider">
						Color
					</p>
					<div className="flex flex-wrap gap-6">
						{colorVariants.map((colorVar, index) => (
							<button
								key={index}
								onClick={() => onColorChange(colorVar.label)}
								className={cn(
									"px-4 py-3 text-[1.4rem] border rounded-md transition-all capitalize font-medium hover:shadow-sm",
									selectedColor === colorVar.label
										? "border-black bg-black text-white"
										: "border-gray-300 text-gray-700 hover:border-gray-400"
								)}
							>
								{colorVar.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
