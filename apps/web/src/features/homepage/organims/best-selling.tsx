"use client";

import {
	useGetBestSellingProducts,
	useGetShopCategories,
} from "@/features/homepage/api/medusa/get-best-selling-products";
import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { useRegionStore } from "@/stores/useRegion";
import { useWishlistStore } from "@prettyfull/store";
import { formatCurrency_FR, getMediaUrl } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const ALL_LABEL = "Toute la collection";

export const BestSellingSection = () => {
	const [activeCategory, setActiveCategory] = useState(ALL_LABEL);
	const { data: rawProducts, isLoading } = useGetBestSellingProducts();
	const { data: categories } = useGetShopCategories();
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const currencySymbol = currencyCode === "xof" ? "FCFA" : "$";

	const wishlistItems = useWishlistStore((state) => state.items);
	const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

	const products = useMemo(
		() =>
			(rawProducts ?? []).map((product) => ({
				id: product.id,
				handle: product.handle,
				name: product.title,
				category: product.collection?.title ?? "",
				price: product.variants[0]?.calculated_price?.calculated_amount ?? 0,
				compareAtPrice: product.variants[0]?.calculated_price?.original_amount,
				image: getMediaUrl(product.thumbnail) || "/assets/product_2.jpg",
				variantCount: product.variants.length,
			})),
		[rawProducts],
	);

	const categoryTabs = useMemo(
		() => [ALL_LABEL, ...((categories ?? []).map((c) => c.name))],
		[categories],
	);

	const toggleWishlist = (product: (typeof products)[number], e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleWishlistItem({
			productId: product.id,
			product: {
				id: product.id,
				name: product.name,
				image: product.image,
				price: { amount: product.price, currency: currencyCode ?? "usd" },
			},
		});
	};

	const filteredProducts =
		activeCategory === ALL_LABEL ? products : products.filter((p) => p.category === activeCategory);

	const productsToDisplay = (filteredProducts.length > 0 ? filteredProducts : products).slice(0, 6);

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* En-tête */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
				<div className="max-w-xl">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Explorez Notre Collection de Meilleures Ventes
					</h2>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-md">
					<p className="text-[1.4rem] text-[#666666] leading-relaxed">
						Découvrez et plongez dans nos catégories les plus populaires dont tout le monde parle !
					</p>
					<Link
						href="/collections"
						className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[1.4rem] font-medium rounded-full whitespace-nowrap hover:bg-[#222] transition-all self-start shadow"
					>
						<span>Achetez maintenant</span>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
					</Link>
				</div>
			</div>

			{/* Filtres par catégorie */}
			<div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
				{categoryTabs.map((cat) => {
					const isActive = activeCategory === cat;
					return (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`px-6 py-2.5 rounded-full text-[1.4rem] font-medium whitespace-nowrap transition-all ${
								isActive
									? "bg-black text-white shadow"
									: "bg-transparent text-[#222222] border border-[#E5E7EB] hover:border-black"
							} cursor-pointer`}
						>
							{cat}
						</button>
					);
				})}
			</div>

			{/* Grille de produits */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
				{isLoading
					? Array.from({ length: 6 }, (_, i) => (
							<div key={i} className="space-y-4 animate-pulse">
								<div className="w-full bg-gray-200 rounded-[2.2rem] aspect-[1/1.12]" />
								<div className="w-3/4 h-6 bg-gray-200 rounded" />
								<div className="w-1/3 h-6 bg-gray-300 rounded" />
							</div>
						))
					: productsToDisplay.map((product) => {
							const isFav = wishlistItems.some((i) => i.productId === product.id);
							return (
								<Link
									key={product.id}
									href={PRODUCT_PATHS.productDetail(product.handle)}
									className="group flex flex-col space-y-4"
								>
									<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden transition-all duration-300 group-hover:shadow-md">
										<Image
											src={product.image}
											alt={product.name}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											unoptimized
										/>
									</div>

									<div className="flex items-start justify-between gap-2 pt-1">
										<div>
											<h3 className="text-[1.6rem] font-semibold text-[#080808] group-hover:text-black">
												{product.name}{" "}
												{product.variantCount > 1 && (
													<span className="font-normal text-[#777777] text-[1.4rem]">
														({product.variantCount} coloris)
													</span>
												)}
											</h3>
											<div className="flex items-center gap-3 pt-1">
												<span className="text-[1.6rem] font-bold text-[#080808]">
													{formatCurrency_FR(product.price, currencySymbol)}
												</span>
												{product.compareAtPrice != null && product.compareAtPrice > product.price && (
													<span className="text-[1.4rem] text-[#999999] line-through">
														{formatCurrency_FR(product.compareAtPrice, currencySymbol)}
													</span>
												)}
											</div>
										</div>

										<button
											onClick={(e) => toggleWishlist(product, e)}
											aria-label="Ajouter aux favoris"
											className="p-2 text-[#222222] hover:text-black transition-colors cursor-pointer"
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill={isFav ? "#000000" : "none"}
												stroke="currentColor"
												strokeWidth="1.8"
												className={isFav ? "text-black" : "text-[#333333]"}
											>
												<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
											</svg>
										</button>
									</div>
								</Link>
							);
						})}
			</div>
		</section>
	);
};

export default BestSellingSection;
