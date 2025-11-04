"use client";

import { cn } from "@prettyfull/utils";
import { AnimatePresence, motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useSwipeable } from "react-swipeable";

interface ProductGalleryProps {
	images: string[] | StaticImport[];
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
	const [isZoomed, setIsZoomed] = useState(false);

	const swipeHandlers = useSwipeable({
		onSwipedLeft: () =>
			setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0)),
		onSwipedRight: () =>
			setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1)),
		trackMouse: true,
	});

	if (!images || images.length === 0) {
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
			<div className={cn("flex-row gap-4 w-fit relative sm:flex", className)}>
				<div className="hidden grid-cols-2 gap-4 sm:grid place-content-start">
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
							<Image
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={80}
								height={80}
								className="object-cover"
							/>
						</div>
					))}
				</div>

				<div
					className="relative hidden sm:flex cursor-zoom-in w-fit"
					onClick={() => setIsZoomed(true)}
				>
					<Image
						src={images[activeImage] || "/placeholder.png"}
						alt={title}
						width={500}
						height={800}
						className="object-cover"
						priority
					/>
					{promotion && (
						<span className="fond-semibold bg-red-700 text-white !text-[1.2rem] lg:!text-xs  absolute top-4 left-4 px-4 py-2 rounded-full">
							{promotion.pourcentage}% OFF
						</span>
					)}
				</div>

				{/* Mobile gallery horizontal */}
				<div className="flex w-full gap-2 overflow-x-auto sm:hidden scrolbar">
					{images.map((image, index) => (
						<Image
							key={index}
							src={image}
							alt={`${title} - vue ${index + 1}`}
							width={250}
							height={450}
							className=" cursor-zoom-in"
							onClick={() => {
								setActiveImage(index);
								setIsZoomed(true);
							}}
						/>
					))}
					{promotion && (
						<span className="fond-semibold bg-red-700 text-white !text-[1rem] lg:!text-xs  absolute top-4 left-4 px-4 py-2 rounded-full">
							{promotion.pourcentage}% OFF
						</span>
					)}
				</div>
			</div>

			<AnimatePresence>
				{isZoomed && (
					<motion.div
						className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						{...swipeHandlers}
					>
						<button
							className="absolute z-50 text-3xl text-white top-4 right-4"
							onClick={() => setIsZoomed(false)}
						>
							×
						</button>

						<div
							className="relative flex items-center justify-center max-h-[100vh] w-full max-w-4xl"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={images[activeImage] || "/placeholder.png"}
								alt={title}
								width={600}
								height={900}
								className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg transition-all"
								priority
							/>

							{images.length > 1 && (
								<>
									<button
										onClick={() =>
											setActiveImage((prev) =>
												prev > 0 ? prev - 1 : images.length - 1
											)
										}
										className="absolute hidden text-5xl text-white -translate-y-1/2 left-2 top-1/2 sm:block"
									>
										‹
									</button>
									<button
										onClick={() =>
											setActiveImage((prev) =>
												prev < images.length - 1 ? prev + 1 : 0
											)
										}
										className="absolute hidden text-5xl text-white -translate-y-1/2 right-2 top-1/2 sm:block"
									>
										›
									</button>
								</>
							)}
						</div>

						<div className="mt-6 flex justify-center gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
							{images.map((image, index) => (
								<div
									key={index}
									onClick={() => setActiveImage(index)}
									className={cn(
										"relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all",
										activeImage === index
											? "border-white scale-105"
											: "border-transparent opacity-70 hover:opacity-100"
									)}
								>
									<Image
										src={image}
										alt={`${title} miniature ${index + 1}`}
										fill
										className="object-cover"
									/>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
