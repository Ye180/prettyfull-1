"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { useWishlistStore } from "@prettyfull/store";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";

const WishlistView = () => {
	const items = useWishlistStore((state) => state.items);
	const removeItem = useWishlistStore((state) => state.removeItem);

	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-28 pt-6 sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-center justify-between gap-4 pb-6">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-gray-950">
						My Wishlist <span className="font-medium text-gray-400">({items.length})</span>
					</h1>
				</div>

				{items.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
						{items.map((item) => (
							<div key={item.productId} className="group flex flex-col space-y-4">
								<Link href={`/products/${item.productId}`} className="block">
									<div className="relative w-full aspect-[1/1.12] bg-[#F7F7F7] rounded-[2.2rem] overflow-hidden transition-all duration-300 group-hover:shadow-md">
										<Image
											src={item.product.image || "/assets/product5.webp"}
											alt={item.product.name}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											unoptimized
										/>
									</div>
								</Link>

								<div className="flex items-start justify-between gap-2 pt-1">
									<div>
										<h3 className="text-[1.6rem] font-semibold text-[#080808]">
											{item.product.name}
										</h3>
										{item.product.price && (
											<span className="text-[1.6rem] font-bold text-[#080808]">
												{formatCurrency_FR(
													item.product.price.amount,
													item.product.price.currency === "xof" ? "FCFA" : "$",
												)}
											</span>
										)}
									</div>

									<button
										type="button"
										onClick={() => removeItem(item.productId)}
										aria-label={`Retirer ${item.product.name}`}
										className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
									>
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
											<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="py-20 text-center max-w-lg mx-auto flex flex-col items-center">
						<div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl mb-6">
							♡
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Your Wishlist is Currently Empty
						</h2>
						<p className="text-gray-500 mb-8 leading-relaxed">
							Save the pieces you love and find them here whenever you're ready.
						</p>
						<Link
							href="/collections"
							className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm"
						>
							<span>Explore Collections</span>
							<ArrowRightIcon className="w-4 h-4" />
						</Link>
					</div>
				)}
			</div>
		</main>
	);
};

export default WishlistView;
