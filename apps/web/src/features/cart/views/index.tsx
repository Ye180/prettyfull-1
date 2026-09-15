"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import CartContent from "@/features/cart/components/organims/cart-content";
import { useCartStore } from "@prettyfull/store";
import { Checkbox } from "@prettyfull/ui";
import Link from "next/link";
import { useState } from "react";

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
		<main className="pt-6 pb-28 w-full min-h-screen text-gray-900 bg-white sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Title */}
				<div className="flex flex-wrap gap-4 justify-between items-center pb-6">
					<h1 className="font-sans text-xl font-extrabold tracking-tight sm:text-2xl md:text-5xl text-gray-950">
						Mon panier{" "}
						<span className="font-medium text-gray-400">
							({totalItemCount || items.length})
						</span>
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
									aria-label="Tout sélectionner"
									className="rounded"
								/>
								<span className="text-sm font-medium text-gray-800 sm:text-base">
									Tout sélectionner
								</span>
							</label>
							<button
								type="button"
								onClick={clearCart}
								className="text-sm font-semibold text-rose-500 transition cursor-pointer sm:text-base hover:text-rose-600"
							>
								Tout supprimer
							</button>
						</div>

						<CartContent
							items={items}
							layout="page"
							selectedIds={selectedIds}
							onToggleItem={toggleItem}
							itemsFooter={
								<div className="pt-4 mt-8 text-xs leading-relaxed text-gray-500 border-t border-gray-100 sm:text-sm">
									<p>
										Les frais de livraison sont calculés au moment du paiement.
										Vous pouvez modifier la quantité ou retirer des articles
										avant de confirmer votre commande.
									</p>
								</div>
							}
						/>
					</>
				) : (
					/* Empty Cart State */
					<div className="flex flex-col items-center py-20 mx-auto max-w-lg text-center">
						<div className="flex justify-center items-center mb-6 w-20 h-20 text-3xl bg-gray-50 rounded-full border border-gray-200">
							🛍️
						</div>
						<h2 className="mb-2 text-2xl font-bold text-gray-900">
							Votre panier est actuellement vide
						</h2>
						<p className="mb-8 leading-relaxed text-gray-500">
							Découvrez nos silhouettes sélectionnées, nos mailles intemporelles
							et nos pièces contemporaines pensées pour un quotidien tout en
							légèreté.
						</p>
						<div className="flex flex-col gap-4 justify-center w-full sm:flex-row">
							<Link
								href="/collections"
								className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm"
							>
								<span>Découvrir les collections</span>
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
