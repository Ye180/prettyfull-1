"use client";

import { cn } from "@prettyfull/utils";

interface SizeOption {
	label: string;
	value: string;
}

interface ColorOption {
	name: string;
	code: string;
}

interface ProductOptionsProps {
	sizes?: SizeOption[];
	colors?: ColorOption[];
	selectedSize: string;
	selectedColor: string;
	onSizeChange: (size: string) => void;
	onColorChange: (color: string) => void;
	className?: string;
}

export function ProductOptions({
	sizes,
	colors,
	selectedSize,
	selectedColor,
	onSizeChange,
	onColorChange,
	className,
}: ProductOptionsProps) {
	return (
		<div className={cn("space-y-12", className)}>
			{/* Sélecteur de taille */}
			{sizes && sizes.length > 0 && (
				<div className="space-y-6">
					<div className="flex justify-between">
						<p className="font-semibold uppercase !text-[1.9rem] font-bebas-neue tracking-wider">
							Taille
						</p>
						<span className="text-right">Taille</span>
					</div>
					<div className="flex flex-wrap gap-6">
						{sizes.map((size) => (
							<button
								key={size.value}
								onClick={() => onSizeChange(size.value)}
								className={cn(
									"w-16 h-15 border-1 text-[1.5rem] flex items-center justify-center transition-all",
									selectedSize === size.value
										? "border-black bg-black text-white"
										: "border-gray-200 hover:border-gray-500"
								)}
							>
								{size.label}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Sélecteur de couleur */}
			{colors && colors.length > 0 && (
				<div className="space-y-6">
					<p className="font-semibold uppercase !text-[1.9rem] font-bebas-neue tracking-wider">
						Color
					</p>
					<div className="flex flex-wrap gap-6 ">
						{colors.map((color) => (
							<button
								key={color.name}
								onClick={() => onColorChange(color.name)}
								className={cn(
									"w-[13rem] h-16 border-1 flex items-center justify-center gap-2 transition-all",
									selectedColor === color.name
										? "border-black"
										: "border-gray-200 hover:border-gray-500"
								)}
							>
								<span
									className="w-5 h-5 rounded-full"
									style={{ backgroundColor: color.code }}
								/>
								{color.name}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
