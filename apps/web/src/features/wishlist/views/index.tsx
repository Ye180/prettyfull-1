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
		<main className="pt-6 pb-28 w-full min-h-screen text-gray-900 bg-white sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap gap-4 justify-between items-center pb-6">
					<h1 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gray-950">
						Mes préférences
						<span className="font-medium text-gray-400">({items.length})</span>
					</h1>
				</div>

				{items.length > 0 ? (
					<div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<div
								key={item.productId}
								className="flex flex-col space-y-4 group"
							>
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

								<div className="flex gap-2 justify-between items-start pt-1">
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
										className="p-2 text-rose-500 rounded-full transition cursor-pointer hover:text-rose-600 hover:bg-rose-50"
									>
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
										>
											<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center py-20 mx-auto max-w-lg text-center">
						<div className="flex justify-center items-center mb-6 w-20 h-20 text-3xl bg-gray-50 rounded-full border border-gray-200">
							♡
						</div>
						<h2 className="mb-2 text-2xl font-bold text-gray-900">
							Votre liste d'envies est actuellement vide.
						</h2>
						<p className="mb-8 leading-relaxed text-gray-500">
							Enregistrez les pièces que vous aimez et retrouvez-les ici dès que
							vous êtes prêt.
						</p>
						<Link
							href="/collections"
							className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm"
						>
							<span>Explorer les collections</span>
							<ArrowRightIcon className="w-4 h-4" />
						</Link>
					</div>
				)}
			</div>
		</main>
	);
};

export default WishlistView;
