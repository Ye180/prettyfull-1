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
				className={cn("relative w-full bg-neutral-100 aspect-[4/5] rounded-md", className)}
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
				{/* Image principale - grande, dominante ; miniatures en dessous (desktop et mobile) */}
				<div
					className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-neutral-100 cursor-zoom-in"
					onClick={() => setIsZoomed(true)}
				>
					<Image
						src={images[activeImage] || "/placeholder.png"}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 55rem"
						className="object-cover"
						priority
						unoptimized
					/>
					{promotion && (
						<span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md">
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
						</>
					)}
				</div>

				{/* Miniatures - rangée horizontale sous l'image principale */}
				{images.length > 1 && (
					<div className="flex overflow-x-auto gap-3 pt-3 w-full scrollbar-hide">
						{images.map((image, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Voir la vue ${index + 1}`}
								onClick={() => setActiveImage(index)}
								className={cn(
									"relative shrink-0 w-16 sm:w-20 aspect-[3/4] cursor-pointer rounded-md overflow-hidden border-2 transition-all",
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
				)}
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
								className="object-contain max-h-[80vh] w-auto mx-auto rounded-md transition-all"
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
										"relative w-16 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all shrink-0",
										activeImage === index
											? "border-white scale-105"
											: "border-transparent opacity-70 hover:opacity-100",
									)}
								>
									<Image
										src={image}
										alt={`${title} miniature ${index + 1}`}
										fill
										sizes="64px"
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
