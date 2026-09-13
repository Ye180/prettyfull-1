"use client";

import { useWishlistStore } from "@prettyfull/store";
import Image from "next/image";
import Link from "next/link";

interface ShowcaseProduct {
	id: string;
	name: string;
	image: string;
	price: number;
}

export const NewCollectionShowcase = () => {
	const wishlistItems = useWishlistStore((state) => state.items);
	const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

	const isWishlisted = (id: string) => wishlistItems.some((i) => i.productId === id);

	const toggleWishlist = (product: ShowcaseProduct, e: React.MouseEvent) => {
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

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10">
				<div className="max-w-xl space-y-2">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Explore Our New Collection
					</h2>
					<p className="text-[1.4rem] text-[#666666]">
						Discover and dive into our most popular and best-selling categories that everyone is talking about!
					</p>
				</div>

				<div className="flex items-center space-x-3 self-start sm:self-auto">
					<button
						aria-label="Previous"
						className="w-11 h-11 rounded-full border border-gray-300 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						aria-label="Next"
						className="w-11 h-11 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center transition-colors shadow cursor-pointer"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			{/* Asymmetric Editorial Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
				{/* Left Column (2 cards) */}
				<div className="flex flex-col gap-8">
					{/* Saavan X Shirt */}
					<Link href="/collections" className="group flex flex-col space-y-3">
						<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden">
							<Image
								src="/assets/product_2.jpg"
								alt="Saavan X Shirt"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex items-start justify-between pt-1">
							<div>
								<h3 className="text-[1.6rem] font-semibold text-[#080808]">
									Saavan X Shirt <span className="font-normal text-[#777777] text-[1.4rem]">(10 item)</span>
								</h3>
								<div className="flex items-center gap-3 pt-0.5">
									<span className="text-[1.6rem] font-bold text-[#080808]">$300</span>
									<span className="text-[1.4rem] text-[#999999] line-through">$500</span>
								</div>
							</div>
							<button
								onClick={(e) =>
									toggleWishlist(
										{ id: "saavan", name: "Saavan X Shirt", image: "/assets/product_2.jpg", price: 300 },
										e,
									)
								}
								className="p-2 text-[#222] hover:text-black cursor-pointer"
								aria-label="Favoris"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill={isWishlisted("saavan") ? "#000" : "none"}
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
						</div>
					</Link>

					{/* Avan JX Shirt */}
					<Link href="/collections" className="group flex flex-col space-y-3">
						<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden">
							<Image
								src="/home/arrivals-4.jpg"
								alt="Avan JX Shirt"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex items-start justify-between pt-1">
							<div>
								<h3 className="text-[1.6rem] font-semibold text-[#080808]">
									Avan JX Shirt <span className="font-normal text-[#777777] text-[1.4rem]">(65 item)</span>
								</h3>
								<div className="flex items-center gap-3 pt-0.5">
									<span className="text-[1.6rem] font-bold text-[#080808]">$200</span>
									<span className="text-[1.4rem] text-[#999999] line-through">$500</span>
								</div>
							</div>
							<button
								onClick={(e) =>
									toggleWishlist(
										{ id: "avan", name: "Avan JX Shirt", image: "/home/arrivals-4.jpg", price: 200 },
										e,
									)
								}
								className="p-2 text-[#222] hover:text-black cursor-pointer"
								aria-label="Favoris"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill={isWishlisted("avan") ? "#000" : "none"}
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
						</div>
					</Link>
				</div>

				{/* Center Column (Tall Feature Card spanning full height) */}
				<div className="flex flex-col justify-between">
					<Link href="/collections" className="group flex flex-col h-full space-y-3">
						<div className="relative w-full h-full min-h-[460px] lg:min-h-[620px] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden flex-1">
							<Image
								src="/home/commerce1.jpg"
								alt="Blue Jacket and Short Jeans"
								fill
								sizes="(max-width: 1024px) 100vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex items-start justify-between pt-1">
							<div>
								<h3 className="text-[1.6rem] font-semibold text-[#080808]">
									Blue Jacket and Short Jeans <span className="font-normal text-[#777777] text-[1.4rem]">(15 item)</span>
								</h3>
								<div className="flex items-center gap-3 pt-0.5">
									<span className="text-[1.6rem] font-bold text-[#080808]">$450</span>
									<span className="text-[1.4rem] text-[#999999] line-through">$500</span>
								</div>
							</div>
							<button
								onClick={(e) =>
									toggleWishlist(
										{
											id: "blue_jacket",
											name: "Blue Jacket and Short Jeans",
											image: "/home/commerce1.jpg",
											price: 450,
										},
										e,
									)
								}
								className="p-2 text-[#222] hover:text-black cursor-pointer"
								aria-label="Favoris"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill={isWishlisted("blue_jacket") ? "#000" : "none"}
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
						</div>
					</Link>
				</div>

				{/* Right Column (2 cards) */}
				<div className="flex flex-col gap-8">
					{/* Saryan X Shirt */}
					<Link href="/collections" className="group flex flex-col space-y-3">
						<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden">
							<Image
								src="/assets/product5.webp"
								alt="Saryan X Shirt"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex items-start justify-between pt-1">
							<div>
								<h3 className="text-[1.6rem] font-semibold text-[#080808]">
									Saryan X Shirt <span className="font-normal text-[#777777] text-[1.4rem]">(10 item)</span>
								</h3>
								<div className="flex items-center gap-3 pt-0.5">
									<span className="text-[1.6rem] font-bold text-[#080808]">$700</span>
									<span className="text-[1.4rem] text-[#999999] line-through">$900</span>
								</div>
							</div>
							<button
								onClick={(e) =>
									toggleWishlist(
										{ id: "saryan", name: "Saryan X Shirt", image: "/assets/product5.webp", price: 700 },
										e,
									)
								}
								className="p-2 text-[#222] hover:text-black cursor-pointer"
								aria-label="Favoris"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill={isWishlisted("saryan") ? "#000" : "none"}
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
						</div>
					</Link>

					{/* Liam FP Shirt */}
					<Link href="/collections" className="group flex flex-col space-y-3">
						<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden">
							<Image
								src="/assets/product_2.webp"
								alt="Liam FP Shirt"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex items-start justify-between pt-1">
							<div>
								<h3 className="text-[1.6rem] font-semibold text-[#080808]">
									Liam FP Shirt <span className="font-normal text-[#777777] text-[1.4rem]">(8 item)</span>
								</h3>
								<div className="flex items-center gap-3 pt-0.5">
									<span className="text-[1.6rem] font-bold text-[#080808]">$500</span>
									<span className="text-[1.4rem] text-[#999999] line-through">$600</span>
								</div>
							</div>
							<button
								onClick={(e) =>
									toggleWishlist(
										{ id: "liam", name: "Liam FP Shirt", image: "/assets/product_2.webp", price: 500 },
										e,
									)
								}
								className="p-2 text-[#222] hover:text-black cursor-pointer"
								aria-label="Favoris"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill={isWishlisted("liam") ? "#000" : "none"}
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
						</div>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default NewCollectionShowcase;
