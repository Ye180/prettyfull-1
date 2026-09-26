"use client";

import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

const imageUrlOf = (image: string | { url: string } | undefined): string | undefined =>
	typeof image === "string" ? image : image?.url;

/**
 * Rangée unique de tuiles catégorie, défilable horizontalement - la version
 * précédente (2 grandes + 3 petites, empilées) prenait trop de hauteur ;
 * ici tout tient sur une seule ligne, qu'on glisse jusqu'au bout.
 */
export const ShopNewProducts = () => {
	const { data: categories, isLoading } = useGetCategory();
	const scrollRef = useRef<HTMLDivElement>(null);

	const tiles = useMemo(() => {
		return [...(categories ?? [])].sort(
			(a, b) => Number(b.isFeatured) - Number(a.isFeatured),
		);
	}, [categories]);

	const scrollByTile = (direction: 1 | -1) => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({ left: direction * el.clientWidth * 0.45, behavior: "smooth" });
	};

	if (!isLoading && tiles.length === 0) return null;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h2 className="pb-8 text-3xl sm:text-4xl font-bold tracking-tight text-amber-700">
				Découvrez nos nouveautés
			</h2>

			<div className="relative">
				<div
					ref={scrollRef}
					className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
				>
					{isLoading
						? Array.from({ length: 4 }, (_, i) => (
								<div
									key={i}
									className="bg-gray-200 rounded-lg animate-pulse shrink-0 w-[60%] sm:w-72 lg:w-80 aspect-4/5"
								/>
							))
						: tiles.map((category) => (
								<Tile key={category.id} category={category} />
							))}
				</div>

				{tiles.length > 3 && (
					<>
						<button
							aria-label="Précédent"
							onClick={() => scrollByTile(-1)}
							className="hidden sm:flex absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</button>
						<button
							aria-label="Suivant"
							onClick={() => scrollByTile(1)}
							className="hidden sm:flex absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</button>
					</>
				)}
			</div>
		</section>
	);
};

interface TileProps {
	category: {
		id: string;
		name: string;
		handle: string;
		image?: string | { url: string };
	};
}

const Tile = ({ category }: TileProps) => {
	const imageUrl = getMediaUrl(imageUrlOf(category.image)) || "/category/category-vitamins.jpg";

	return (
		<Link
			href={COLLECTION_PATHS.collectionDetail(category.handle)}
			className="group relative block overflow-hidden shrink-0 w-[60%] sm:w-72 lg:w-80 aspect-4/5 snap-start rounded-lg bg-gray-100"
		>
			<Image
				src={imageUrl}
				alt={category.name}
				fill
				sizes="(max-width: 640px) 60vw, 320px"
				className="object-cover transition-transform duration-500 group-hover:scale-105"
				unoptimized
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
			<div className="flex absolute inset-x-0 bottom-0 flex-col gap-3 items-start p-5">
				<h3 className="text-xl font-bold text-white">{category.name}</h3>
				<span className="inline-flex items-center gap-2 px-4 py-2 text-[1.2rem] font-semibold tracking-wide text-white uppercase bg-white/10 backdrop-blur-sm border border-white/70 rounded-md transition-colors group-hover:bg-white group-hover:text-black">
					Découvrir
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
						<line x1="7" y1="17" x2="17" y2="7" />
						<polyline points="7 7 17 7 17 17" />
					</svg>
				</span>
			</div>
		</Link>
	);
};

export default ShopNewProducts;
