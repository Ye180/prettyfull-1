"use client";

import { cn } from "@prettyfull/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useSwipeable } from "react-swipeable";

interface ProductGalleryNewProps {
	images: string[];
	title: string;
	className?: string;
	activeImage: number;
	setActiveImage: Dispatch<SetStateAction<number>>;
	promotion?: {
		pourcentage: number;
	};
}

export function ProductGalleryNew({
	images,
	title,
	className,
	activeImage,
	setActiveImage,
	promotion,
}: ProductGalleryNewProps) {
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
				className={cn("relative w-full bg-gray-100 aspect-square", className)}
			>
				<div className="flex justify-center items-center h-full text-gray-500">
					Aucune image disponible
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={cn("flex relative gap-4 w-fit", className)}>
				{/* Thumbnails à gauche - Desktop */}
				<div className="hidden overflow-y-auto flex-col gap-1 max-md:w-30 sm:flex h-fit scrollbar-hide md:grid md:grid-cols-2">
					{images.map((image, index) => (
						<div
							key={index}
							onClick={() => setActiveImage(index)}
							className={cn(
								"shrink-0 w-18 h-25 cursor-pointer border rounded overflow-hidden transition-all",
								activeImage === index
									? "border-black"
									: "border-transparent hover:border-gray-300",
							)}
						>
							<Image
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={64}
								height={90}
								className="object-cover w-full h-full"
							/>
						</div>
					))}
				</div>

				{/* Image principale - Desktop */}
				<div
					className="hidden relative sm:flex cursor-zoom-in"
					onClick={() => setIsZoomed(true)}
				>
					<div className="relative">
						<Image
							src={images[activeImage] || "/placeholder.png"}
							alt={title}
							width={480}
							height={640}
							className="object-cover rounded"
							priority
						/>
						{promotion && (
							<span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded">
								STEALS
							</span>
						)}
					</div>
				</div>

				{/* Mobile gallery horizontal */}
				<div className="flex overflow-x-auto gap-2 w-full sm:hidden scrollbar-hide">
					{images.map((image, index) => (
						<div key={index} className="relative shrink-0">
							<Image
								src={image}
								alt={`${title} - vue ${index + 1}`}
								width={280}
								height={400}
								className="rounded cursor-zoom-in"
								onClick={() => {
									setActiveImage(index);
									setIsZoomed(true);
								}}
							/>
							{index === 0 && promotion && (
								<span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded">
									STEALS
								</span>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Modal Zoom */}
			<AnimatePresence>
				{isZoomed && (
					<motion.div
						className="flex fixed inset-0 z-50 flex-col justify-center items-center p-4 bg-black/95"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						{...swipeHandlers}
					>
						<button
							className="absolute top-4 right-4 z-50 text-3xl text-white transition-colors hover:text-gray-300"
							onClick={() => setIsZoomed(false)}
						>
							×
						</button>

						<div
							className="flex relative justify-center items-center w-full max-w-4xl max-h-screen"
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
												prev > 0 ? prev - 1 : images.length - 1,
											)
										}
										className="hidden absolute left-2 top-1/2 text-5xl text-white -translate-y-1/2 sm:block hover:text-gray-300"
									>
										‹
									</button>
									<button
										onClick={() =>
											setActiveImage((prev) =>
												prev < images.length - 1 ? prev + 1 : 0,
											)
										}
										className="hidden absolute right-2 top-1/2 text-5xl text-white -translate-y-1/2 sm:block hover:text-gray-300"
									>
										›
									</button>
								</>
							)}
						</div>

						{/* Thumbnails en bas du modal */}
						<div className="mt-6 flex justify-center gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
							{images.map((image, index) => (
								<div
									key={index}
									onClick={() => setActiveImage(index)}
									className={cn(
										"relative w-16 h-20 rounded overflow-hidden cursor-pointer border-2 transition-all shrink-0",
										activeImage === index
											? "border-white scale-105"
											: "border-transparent opacity-70 hover:opacity-100",
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
