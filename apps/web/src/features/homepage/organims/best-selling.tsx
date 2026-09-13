"use client";

import { useWishlistStore } from "@prettyfull/store";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface BestSellingProduct {
	id: string;
	slug: string;
	name: string;
	itemCount: number;
	price: number;
	originalPrice: number;
	image: string;
	category: string;
}

export const BEST_SELLING_PRODUCTS: BestSellingProduct[] = [
	{
		id: "prod_sadie_jeans",
		slug: "sadie-jeans-sheets",
		name: "Sadie Jeans Sheets",
		itemCount: 20,
		price: 450,
		originalPrice: 500,
		image: "/assets/product5.webp",
		category: "Jeans",
	},
	{
		id: "prod_kato_zip",
		slug: "kato-x-zip-shirt",
		name: "Kato X Zip Shirt",
		itemCount: 15,
		price: 300,
		originalPrice: 500,
		image: "/assets/product_2.webp",
		category: "Jacket",
	},
	{
		id: "prod_sarlo_ss",
		slug: "sarlo-ss-shirt",
		name: "Sarlo SS Shirt",
		itemCount: 25,
		price: 220,
		originalPrice: 500,
		image: "/assets/product_2.jpg",
		category: "T-Shirts",
	},
	{
		id: "prod_norsbro_burgundy",
		slug: "norsbro-crew-neck-burgundy",
		name: "Norsbro Crew Neck",
		itemCount: 10,
		price: 250,
		originalPrice: 500,
		image: "/home/arrivals-1.jpg",
		category: "Knitwear",
	},
	{
		id: "prod_norsbro_black",
		slug: "norsbro-crew-neck-black",
		name: "Norsbro Crew Neck",
		itemCount: 15,
		price: 250,
		originalPrice: 350,
		image: "/home/arrivals-2.jpg",
		category: "Knitwear",
	},
	{
		id: "prod_saniklas_hoodie",
		slug: "saniklas-hoodie",
		name: "Saniklas Hoodie",
		itemCount: 25,
		price: 220,
		originalPrice: 500,
		image: "/home/arrivals-3.jpg",
		category: "Long Sleeve",
	},
];

const CATEGORIES = [
	"All Collection",
	"Knitwear",
	"Jeans",
	"Trousers",
	"T-Shirts",
	"Jacket",
	"Long Sleeve",
	"Swim Shorts",
];

export const BestSellingSection = () => {
	const [activeCategory, setActiveCategory] = useState("All Collection");
	const wishlistItems = useWishlistStore((state) => state.items);
	const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

	const toggleWishlist = (product: BestSellingProduct, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleWishlistItem({
			productId: product.id,
			product: {
				id: product.id,
				name: product.name,
				image: product.image,
				price: { amount: product.price, currency: "usd" },
			},
		});
	};

	const filteredProducts =
		activeCategory === "All Collection"
			? BEST_SELLING_PRODUCTS
			: BEST_SELLING_PRODUCTS.filter((p) => p.category === activeCategory);

	const productsToDisplay =
		filteredProducts.length > 0 ? filteredProducts : BEST_SELLING_PRODUCTS;

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* Top Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
				<div className="max-w-xl">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Explore Our Best Selling Product Collection
					</h2>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-md">
					<p className="text-[1.4rem] text-[#666666] leading-relaxed">
						Discover and dive into our most popular and best-selling categories that everyone is talking about!
					</p>
					<Link
						href="/collections"
						className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[1.4rem] font-medium rounded-full whitespace-nowrap hover:bg-[#222] transition-all self-start shadow"
					>
						<span>Let's Shop Now</span>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
					</Link>
				</div>
			</div>

			{/* Category Filter Pills */}
			<div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
				{CATEGORIES.map((cat) => {
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

			{/* 3-Column Product Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
				{productsToDisplay.map((product) => {
					const isFav = wishlistItems.some((i) => i.productId === product.id);
					return (
						<Link
							key={product.id}
							href={`/products/${product.slug}`}
							className="group flex flex-col space-y-4"
						>
							{/* Card Image */}
							<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden transition-all duration-300 group-hover:shadow-md">
								<Image
									src={product.image}
									alt={product.name}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							{/* Card Meta & Heart */}
							<div className="flex items-start justify-between gap-2 pt-1">
								<div>
									<h3 className="text-[1.6rem] font-semibold text-[#080808] group-hover:text-black">
										{product.name} <span className="font-normal text-[#777777] text-[1.4rem]">({product.itemCount} item)</span>
									</h3>
									<div className="flex items-center gap-3 pt-1">
										<span className="text-[1.6rem] font-bold text-[#080808]">
											${product.price}
										</span>
										<span className="text-[1.4rem] text-[#999999] line-through">
											${product.originalPrice}
										</span>
									</div>
								</div>

								{/* Wishlist Heart Icon Toggle */}
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
