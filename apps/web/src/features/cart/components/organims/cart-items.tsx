"use client";

import { useRegionStore } from "@/stores/useRegion";
import { Checkbox } from "@prettyfull/ui";
import { useCartStore, type CartItem } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import Image from "next/image";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { formatCurrency_FR } from "../../../../../../../packages/utils/lib/format-curency";
import { QuantitySelector } from "../molecules/quantity-selector";

interface CartItemsProps {
	items: CartItem[];
	selectedIds?: Set<string>;
	onToggleItem?: (productId: string) => void;
	/** Squares off rows/thumbnails/badges - used by the cart drawer only. */
	square?: boolean;
}

const CartItems = ({
	items,
	selectedIds,
	onToggleItem,
	square,
}: CartItemsProps) => {
	const removeItem = useCartStore((state) => state.removeItem);
	const regions = useRegionStore((state) => state.region);
	const currency = regions?.currency_code === "xof" ? "FCFA" : "$";

	if (!items || items.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center py-16 text-center">
				<div
					className={cn(
						"flex justify-center items-center mb-6 w-16 h-16 bg-gray-100",
						square ? "rounded-none" : "rounded-full",
					)}
				>
					<svg
						width="26"
						height="26"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="text-gray-400"
					>
						<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
						<path d="M3 6h18" />
						<path d="M16 10a4 4 0 0 1-8 0" />
					</svg>
				</div>
				<span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
					Panier vide
				</span>
				<h3 className="mt-3 text-xl font-bold text-gray-900">
					Votre panier est vide
				</h3>
				<p className="mt-2 max-w-xs text-sm text-gray-500">
					Ajoutez des articles pour les retrouver ici.
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-gray-100">
			{items.map((item) => {
				const imageSrc = item.product.image || "/assets/product5.webp";
				const unitPrice =
					item.unitPrice?.amount ?? item.product.price?.amount ?? 250;
				const itemTotal = unitPrice * item.quantity;

				return (
					<div
						key={item.productId}
						className="flex items-start gap-4 sm:gap-6 py-6 transition group relative"
					>
						{onToggleItem && (
							<div className="pt-2 sm:pt-4">
								<Checkbox
									className={cn(
										"cursor-pointer",
										square ? "rounded-none" : "rounded",
									)}
									checked={selectedIds?.has(item.productId) ?? false}
									onCheckedChange={() => onToggleItem(item.productId)}
									aria-label={`Sélectionner ${item.product.name}`}
								/>
							</div>
						)}

						<div
							className={cn(
								"relative w-24 h-24 sm:w-28 sm:h-28 bg-[#F4F4F5] overflow-hidden shrink-0 border border-gray-150/60",
								square ? "rounded-none" : "rounded-lg",
							)}
						>
							<Image
								src={imageSrc}
								alt={item.product.name}
								fill
								sizes="120px"
								className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
								unoptimized
							/>
						</div>

						<div className="flex flex-col flex-1 min-w-0 pr-8">
							<div className="flex flex-col gap-1">
								<h3 className="text-base sm:text-lg font-semibold text-gray-950 font-sans tracking-tight line-clamp-1">
									{item.product.name}
								</h3>
							</div>

							{/* Price and Quantity Selector */}
							<div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-1">
								<p className="text-lg sm:text-xl font-bold text-gray-950 font-sans">
									{formatCurrency_FR(itemTotal, currency)}
								</p>
								<QuantitySelector
									productId={item.productId}
									initialQuantity={item.quantity}
									square={square}
								/>
							</div>
						</div>

						<button
							type="button"
							onClick={() => removeItem(item.productId)}
							aria-label={`Retirer ${item.product.name}`}
							className={cn(
								"absolute top-6 right-0 p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer",
								square ? "rounded-none" : "rounded-full",
							)}
						>
							<TrashIcon size={18} />
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default CartItems;
