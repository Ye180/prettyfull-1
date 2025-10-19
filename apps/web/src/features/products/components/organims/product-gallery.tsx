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
		<>
			<div
				className={cn(" flex-row gap-4 w-fit  relative sm:flex ", className)}
			>
				{/* Thumbnails */}
				<div className="hidden grid-cols-2 gap-4 sm:grid place-content-start ">
					{images.map((image, index) => (
						<div
							key={index}
							onClick={() => setActiveImage(index)}
							className={cn(
								"w-20 h-20 cursor-pointer border hover:border-black rounded-sm overflow-hidden transition-all bg-amber-300",
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
				<div className="relative hidden w-fit bg-amber-900 sm:flex ">
					<Image
						src={images[activeImage] as string | StaticImport}
						alt={title}
						width={500}
						height={800}
						className="object-cover"
						priority
						sizes=""
					/>
				</div>

				{/* Mobile thumbnails (dots) */}
				<div className="w-full overflow-x-auto sm:hidden h-fit max-sm:flex ">
					<div
						className={cn(
							"flex   max-sm:snap-x md:w-full  md:overflow-hidden overflow-y-hidden  lg:overflow-visible   space-y-0  space-x-0  scrollbar-hide  scroll-smooth snap-x  lg:snap-mandatory gap-x-1  scrolbar text-[1.5rem]"
						)}
					>
						{images.map((image, index) => (
							<Image
								key={index}
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={300}
								height={500}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
