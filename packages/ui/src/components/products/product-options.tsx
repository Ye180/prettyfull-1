"use client";

import { cn } from "@prettyfull/utils";
import Size from "../../size";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

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
	variable?: {
		color: { label: string; code: string };
		size: string[];
		image: string[] | StaticImport[];
		quantity: number;
	}[];
	notVariable?: {
		color?: { label: string; code: string };
		size: string[];
		image: string;
		quantity?: number;
	};
	selectedSize: string;
	selectedColor: string;
	onColorChange: (color: string) => void;

	onSizeChange?: (size: string) => void;

	handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

	className?: string;
}

export function ProductOptions({
	variable,
	sizes,
	selectedSize,
	selectedColor,
	onColorChange,
	onSizeChange,
	handleClick,
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
					</div>
					<div className="flex flex-wrap gap-6">
						<Size
							selectSize={selectedSize}
							onSizeChange={onSizeChange}
							size={sizes as []}
							className="flex flex-row whitespace-nowrap"
							classButton=""
							onClose={handleClick}
						/>
					</div>
				</div>
			)}

			{/* Sélecteur de couleur */}
			{variable && variable.length > 0 && (
				<div className="space-y-6">
					<p className="font-semibold uppercase !text-[1.9rem] font-bebas-neue tracking-wider">
						Color
					</p>
					<div className="flex flex-wrap gap-6 ">
						{variable.map((items, index) => (
							<button
								key={index}
								onClick={() => onColorChange(items.color.code)}
								className={cn(
									"w-[13rem] h-16 border-1 flex items-center justify-center gap-2 transition-all",
									selectedColor === items.color.code
										? "border-black"
										: "border-gray-200 hover:border-gray-500"
								)}
							>
								<span
									className="w-5 h-5 rounded-full"
									style={{ backgroundColor: items.color.code }}
								/>
								{items.color.label}
							</button>
						))}
					</div>
				</div>
			)}

			<div></div>
		</div>
	);
}
