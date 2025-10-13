"use client";

import { cn } from "@prettyfull/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface ProductGalleryProps {
	images: string[] | StaticImport[];
	title: string;

	className?: string;
	activeImage: number;
	setActiveImage: Dispatch<SetStateAction<number>>;
}

export function ProductGallery({
	images,
	title,
	className,
	activeImage,
	setActiveImage,
}: ProductGalleryProps) {
	if (images.length === 0) {
		return (
			<div
				className={cn("relative w-full aspect-square bg-gray-100", className)}
			>
				<div className="flex items-center justify-center h-full text-gray-500">
					Aucune image disponible
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-row gap-4 relative", className)}>
			{/* Thumbnails */}
			<div className="flex-col hidden gap-4 sm:flex ">
				{images.map((image, index) => (
					<div
						key={index}
						onClick={() => setActiveImage(index)}
						className={cn(
							"w-20 h-20 cursor-pointer border hover:border-black rounded-sm overflow-hidden transition-all",
							activeImage === index
								? "border-black shadow-md"
								: "border-gray-200"
						)}
					>
						<div className="relative w-full h-full overflow-hidden">
							<Image
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={80}
								height={80}
								className="object-cover object-center-top"
							/>
						</div>
					</div>
				))}
			</div>

			{/* Image principale */}
			<div className="flex-1 relative max-xs:h-[25vh] xs:h-[70vh] bg-gray-100 min-h-[500px] ">
				<Image
					src={images[activeImage] as string | StaticImport}
					alt={title}
					fill
					className="object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>

			{/* Mobile thumbnails (dots) */}
			<div className="absolute flex justify-center w-full gap-2 mt-4 transform -translate-x-1/2 sm:hidden -bottom-24 left-1/2">
				{images.map((image, index) => (
					<div
						key={index}
						onClick={() => setActiveImage(index)}
						className={cn(
							"w-20 h-20 cursor-pointer border hover:border-black rounded-sm overflow-hidden transition-all",
							activeImage === index
								? "border-black shadow-md"
								: "border-gray-200"
						)}
					>
						<div className="relative w-full h-full overflow-hidden">
							<Image
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={80}
								height={80}
								className="object-cover"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
