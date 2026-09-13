"use client";

import CartContent from "@/features/cart/components/organims/cart-content";
import { Checkbox } from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";

const CartView = () => {
	const items = useCartStore((state) => state.items);
	const clearCart = useCartStore((state) => state.clearCart);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	const allSelected =
		items.length > 0 && items.every((item) => selectedIds.has(item.productId));

	const toggleAll = () => {
		setSelectedIds(
			allSelected ? new Set() : new Set(items.map((item) => item.productId)),
		);
	};

	const toggleItem = (productId: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(productId)) {
				next.delete(productId);
			} else {
				next.add(productId);
			}
			return next;
		});
	};

	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-28 pt-6 sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Title */}
				<div className="flex flex-wrap items-center justify-between gap-4 pb-6">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-gray-950">
						My Cart <span className="font-medium text-gray-400">({totalItemCount || items.length})</span>
					</h1>
				</div>

				{items.length > 0 ? (
					<>
						{/* Select all & Remove all toolbar */}
						<div className="flex justify-between items-center py-4 mb-6 border-b border-gray-200">
							<label className="flex gap-3 items-center cursor-pointer select-none">
								<Checkbox
									checked={allSelected}
									onCheckedChange={toggleAll}
									aria-label="Select all items"
									className="rounded"
								/>
								<span className="text-sm sm:text-base font-medium text-gray-800">
									Select All
								</span>
							</label>
							<button
								type="button"
								onClick={clearCart}
								className="text-sm sm:text-base font-semibold text-rose-500 cursor-pointer hover:text-rose-600 transition"
							>
								Remove All
							</button>
						</div>

						<CartContent
							items={items}
							layout="page"
							selectedIds={selectedIds}
							onToggleItem={toggleItem}
							itemsFooter={
								<div className="mt-8 pt-4 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100">
									<p>
										Shipping costs are calculated at checkout. You can modify the
										quantity or remove items before confirming your order.
									</p>
								</div>
							}
						/>
					</>
				) : (
					/* Empty Cart State */
					<div className="py-20 text-center max-w-lg mx-auto flex flex-col items-center">
						<div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl mb-6">
							🛍️
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Your Cart is Currently Empty
						</h2>
						<p className="text-gray-500 mb-8 leading-relaxed">
							Discover our curated silhouettes, timeless knitwear, and contemporary pieces tailored for effortless living.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
							<Link
								href="/collections"
								className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm"
							>
								<span>Explore Collections</span>
								<ArrowRightIcon className="w-4 h-4" />
							</Link>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default CartView;
