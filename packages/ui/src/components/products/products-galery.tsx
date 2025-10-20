"use client";

import { cn } from "@prettyfull/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface ProductGalleryProps {
	images?: string[] | StaticImport[];
	title: string;
	className?: string;

	activeImage: number;
	setActiveImage: Dispatch<SetStateAction<number>>;
	promotion?: {
		pourcentage: number;
	};
}

export function ProductGallery({
	images,
	title,
	className,
	activeImage,
	setActiveImage,
	promotion,
}: ProductGalleryProps) {
	return (
		<div
			className={cn(
				"flex flex-row gap-4 relative justify-center items-start",
				className
			)}
		>
			{/* <h2>{title}</h2> */}
			{/* Thumbnails */}
			<div className="flex-col hidden gap-4 sm:flex ">
				{images?.map((image, index) => (
					<div
						key={index}
						onClick={() => setActiveImage(index)}
						className={cn(
							"w-20 h-20 cursor-pointer border hover:border-black rounded-sm overflow-hidden transition-all hidden sm:flex",
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

			{/* Image principale */}
			<div className="relative hidden sm:flex w-fit">
				<Image
					src={images?.[activeImage] || "/placeholder.png"}
					alt={title}
					width={500}
					height={800}
					className="object-cover"
					priority
				/>
				{promotion && (
					<span className="fond-semibold bg-red-700 text-white !text-[1.2rem] lg:!text-xs  absolute top-4 right-4 px-4 py-2 rounded-full">
						{promotion.pourcentage}% OFF
					</span>
				)}
			</div>

			{/* Mobile thumbnails (dots) */}
			<div className="w-full overflow-x-auto sm:hidden h-fit max-sm:flex ">
				<div
					className={cn(
						"flex   max-sm:snap-x md:w-full  md:overflow-hidden overflow-y-hidden  lg:overflow-visible   space-y-0  space-x-0  scrollbar-hide  scroll-smooth snap-x  lg:snap-mandatory gap-x-1  scrolbar text-[1.5rem]"
					)}
				>
					{images?.map((image, index) => (
						<Image
							key={index}
							src={image}
							alt={`${title} - vue ${index + 1}`}
							width={150}
							height={350}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
