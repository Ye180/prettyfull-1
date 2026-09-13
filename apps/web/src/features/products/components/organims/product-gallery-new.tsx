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
				className={cn("relative w-full bg-neutral-100 aspect-[4/5] rounded-3xl", className)}
			>
				<div className="flex justify-center items-center h-full text-[#666666]">
					Aucune image disponible
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={cn("flex flex-col w-full", className)}>
				<div className="hidden sm:flex gap-4 w-full">
					{/* Rail de miniatures - Desktop : colonne à gauche, toutes les vues, scrollable */}
					<div className="flex overflow-y-auto flex-col gap-3 w-20 shrink-0 max-h-[46rem] scrollbar-hide">
						{images.map((image, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Voir la vue ${index + 1}`}
								onClick={() => setActiveImage(index)}
								className={cn(
									"relative shrink-0 w-20 aspect-[3/4] cursor-pointer rounded-xl overflow-hidden border-2 transition-all",
									activeImage === index
										? "border-black"
										: "border-transparent hover:border-neutral-300",
								)}
							>
								<Image
									src={image}
									alt={`${title} - vue ${index + 1}`}
									fill
									sizes="80px"
									className="object-cover"
									unoptimized
								/>
							</button>
						))}
					</div>

					{/* Image principale - Desktop : grande, dominante, occupe l'espace disponible */}
					<div
						className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 cursor-zoom-in"
						onClick={() => setIsZoomed(true)}
					>
						<Image
							src={images[activeImage] || "/placeholder.png"}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, 46rem"
							className="object-cover"
							priority
							unoptimized
						/>
						{promotion && (
							<span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
								STEALS
							</span>
						)}

						{/* Flèches prev/next superposées sur l'image */}
						{images.length > 1 && (
							<>
								<button
									type="button"
									aria-label="Image précédente"
									onClick={(e) => {
										e.stopPropagation();
										setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
									}}
									className="flex absolute left-3 top-1/2 justify-center items-center w-9 h-9 rounded-full border border-white/40 bg-white/80 backdrop-blur transition-colors -translate-y-1/2 hover:bg-white cursor-pointer"
								>
									<span aria-hidden className="text-lg">‹</span>
								</button>
								<button
									type="button"
									aria-label="Image suivante"
									onClick={(e) => {
										e.stopPropagation();
										setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
									}}
									className="flex absolute right-3 top-1/2 justify-center items-center w-9 h-9 rounded-full border border-white/40 bg-white/80 backdrop-blur transition-colors -translate-y-1/2 hover:bg-white cursor-pointer"
								>
									<span aria-hidden className="text-lg">›</span>
								</button>
								<div className="flex absolute inset-x-0 bottom-4 gap-2 justify-center items-center">
									{images.map((_, index) => (
										<button
											key={index}
											type="button"
											aria-label={`Aller à l'image ${index + 1}`}
											onClick={(e) => {
												e.stopPropagation();
												setActiveImage(index);
											}}
											className={cn("cursor-pointer", 
												"h-2 rounded-full transition-all",
												activeImage === index ? "w-6 bg-white" : "w-2 bg-white/50",
											)}
										/>
									))}
								</div>
							</>
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
								className="object-cover rounded-2xl cursor-zoom-in"
								onClick={() => {
									setActiveImage(index);
									setIsZoomed(true);
								}}
								unoptimized
							/>
							{index === 0 && promotion && (
								<span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
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
							className="absolute top-4 right-4 z-50 text-3xl text-white transition-colors hover:text-gray-300 cursor-pointer"
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
								className="object-contain max-h-[80vh] w-auto mx-auto rounded-2xl transition-all"
								priority
								unoptimized
							/>

							{images.length > 1 && (
								<>
									<button
										onClick={() =>
											setActiveImage((prev) =>
												prev > 0 ? prev - 1 : images.length - 1,
											)
										}
										className="hidden absolute left-2 top-1/2 text-5xl text-white -translate-y-1/2 sm:block hover:text-gray-300 cursor-pointer"
									>
										‹
									</button>
									<button
										onClick={() =>
											setActiveImage((prev) =>
												prev < images.length - 1 ? prev + 1 : 0,
											)
										}
										className="hidden absolute right-2 top-1/2 text-5xl text-white -translate-y-1/2 sm:block hover:text-gray-300 cursor-pointer"
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
										"relative w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0",
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
										unoptimized
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
