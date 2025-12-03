"use client";

import { cn } from "@prettyfull/utils";

interface SizeSelectorProps {
	sizes: string[];
	selectedSize: string;
	onSizeChange: (size: string) => void;
	className?: string;
}

export function SizeSelector({
	sizes,
	selectedSize,
	onSizeChange,
	className,
}: SizeSelectorProps) {
	if (!sizes || sizes.length === 0) return null;

	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex justify-between items-center">
				<span className="text-sm font-medium text-gray-900">Size</span>
				<button className="text-sm text-gray-500 underline hover:text-gray-700">
					View Size Guide
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{sizes.map((size, index) => {
					const isSelected = selectedSize === size;

					return (
						<button
							key={index}
							onClick={() => onSizeChange(size)}
							className={cn(
								"px-4 h-10 text-sm font-medium rounded border transition-all duration-200 min-w-[48px]",
								isSelected
									? "text-white bg-black border-black"
									: "text-gray-700 bg-white border-gray-300 hover:border-black"
							)}
						>
							{size}
						</button>
					);
				})}
			</div>
		</div>
	);
}
