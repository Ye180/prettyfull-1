"use client";

import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const imageUrlOf = (
	image: string | { url: string } | undefined,
): string | undefined => (typeof image === "string" ? image : image?.url);

/**
 * Grille asymétrique (2 grandes tuiles + 3 petites) façon "Shop New
 * Products" de la référence - haut de page, juste après le hero.
 */
export const ShopNewProducts = () => {
	const t = useTranslations("HomePage.shopNewProducts");
	const { data: categories, isLoading } = useGetCategory();

	const tiles = useMemo(() => {
		const sorted = [...(categories ?? [])].sort(
			(a, b) => Number(b.isFeatured) - Number(a.isFeatured),
		);
		return sorted.slice(0, 5);
	}, [categories]);

	if (!isLoading && tiles.length === 0) return null;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h2 className="pb-8 text-3xl font-bold tracking-tight text-amber-700 sm:text-4xl">
				{t("title")}
			</h2>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{Array.from({ length: 2 }, (_, i) => (
						<div
							key={i}
							className="bg-gray-200 rounded-lg animate-pulse h-[45dvh] min-h-96"
						/>
					))}
				</div>
			) : (
				<div className="space-y-4">
					{/* 2 grandes tuiles */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{tiles.slice(0, 2).map((category) => (
							<Tile
								key={category.id}
								category={category}
								height="h-[50dvh] min-h-100"
							/>
						))}
					</div>

					{/* 3 petites tuiles */}
					{tiles.length > 2 && (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							{tiles.slice(2, 5).map((category) => (
								<Tile
									key={category.id}
									category={category}
									height="h-[35dvh] min-h-88"
								/>
							))}
						</div>
					)}
				</div>
			)}
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
	height: string;
}

const Tile = ({ category, height }: TileProps) => {
	const t = useTranslations("HomePage.shopNewProducts");
	const imageUrl =
		getMediaUrl(imageUrlOf(category.image)) ||
		"/category/category-vitamins.jpg";

	return (
		<Link
			href={COLLECTION_PATHS.collectionDetail(category.handle)}
			className={`block overflow-hidden relative w-full bg-gray-100 rounded-lg group ${height}`}
		>
			<Image
				src={imageUrl}
				alt={category.name}
				fill
				sizes="(max-width: 640px) 100vw, 50vw"
				className="object-cover transition-transform duration-500 group-hover:scale-105"
				unoptimized
			/>
			<div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-black/40" />
			<div className="flex absolute inset-x-0 bottom-0 flex-col gap-3 items-start p-5">
				<h3 className="text-xl font-bold text-white">{category.name}</h3>
				<span className="inline-flex items-center gap-2 px-4 py-2 text-[1.2rem] font-semibold tracking-wide text-white uppercase bg-white/10 backdrop-blur-sm border border-white/70 rounded-md transition-colors group-hover:bg-white group-hover:text-black">
					{t("discover")}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.4"
					>
						<line x1="7" y1="17" x2="17" y2="7" />
						<polyline points="7 7 17 7 17 17" />
					</svg>
				</span>
			</div>
		</Link>
	);
};

export default ShopNewProducts;
