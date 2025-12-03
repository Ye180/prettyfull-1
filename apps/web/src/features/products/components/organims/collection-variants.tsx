"use client";

import { cn } from "@prettyfull/utils";
import Link from "next/link";

interface CollectionVariant {
	id: string;
	image: string;
	title: string;
	handle: string;
	color: string;
	isActive?: boolean;
}

interface CollectionVariantsProps {
	variants: CollectionVariant[];
	className?: string;
}

export function CollectionVariants({
	variants,
	className,
}: CollectionVariantsProps) {
	if (!variants || variants.length === 0) return null;

	return (
		<div className={cn("mt-6", className)}>
			<p className="mb-2 text-sm text-gray-600">Autres couleurs disponibles</p>
			<div className="flex overflow-x-auto gap-4 p-4 scrollbar-hide">
				{variants.map((variant) => (
					<Link
						key={variant.id}
						href={`/products/${variant.handle}`}
						className={cn(
							"shrink-0 size-10 md:size-14 overflow-hidden border transition-all duration-200 relative group rounded-full p-1 ",
							variant.isActive
								? "border-black border-2 scale-110"
								: "border-gray-200 hover:border-gray-400 hover:scale-105"
						)}
						title={variant.color || variant.title}
					>
						<div
							className="h-full text-xs text-center text-gray-400 bg-gray-100 rounded-full"
							style={{
								backgroundColor: variant.color,
							}}
						/>

						{/* {variant.image ? (
							<Image
								src={variant.image + "?view=1"}
								alt={variant.color || variant.title}
								width={80}
								height={112}
								className="object-cover w-full h-full"
							/>
						) : (
							<div className="flex justify-center items-center p-1 w-full h-full text-xs text-center text-gray-400 bg-gray-100">
								{variant.color || variant.title}
							</div>
						)} */}
						{/* Tooltip avec le nom de la couleur */}
						{/* {variant.color && (
							<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
								{variant.color}
							</div>
						)} */}
					</Link>
				))}
			</div>
		</div>
	);
}
