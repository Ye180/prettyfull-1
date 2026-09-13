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
	/** Squares off rows/thumbnails/badges — used by the cart drawer only. */
	square?: boolean;
}

const CartItems = ({ items, selectedIds, onToggleItem, square }: CartItemsProps) => {
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
				const variantEntries = Object.entries(item.selectedVariants || {});
				const colorEntry = variantEntries.find(([key]) => /color|couleur/i.test(key));
				const sizeEntry = variantEntries.find(([key]) => /size|taille/i.test(key));
				
				// fallback color & size if not present in variant
				const colorName = colorEntry ? colorEntry[1] : "Maroon";
				const sizeName = sizeEntry ? sizeEntry[1] : "M";
				
				const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 250;
				const itemTotal = unitPrice * item.quantity;

				return (
					<div
						key={item.productId}
						className="flex items-start gap-4 sm:gap-6 py-6 transition group relative"
					>
						{onToggleItem && (
							<div className="pt-2 sm:pt-4">
								<Checkbox
									className={cn("cursor-pointer", square ? "rounded-none" : "rounded")}
									checked={selectedIds?.has(item.productId) ?? false}
									onCheckedChange={() => onToggleItem(item.productId)}
									aria-label={`Select ${item.product.name}`}
								/>
							</div>
						)}

						<div
							className={cn(
								"relative w-24 h-24 sm:w-28 sm:h-28 bg-[#F4F4F5] overflow-hidden shrink-0 border border-gray-150/60",
								square ? "rounded-none" : "rounded-2xl",
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
									{item.product.name}{" "}
									<span className="text-sm font-normal text-gray-400">
										(20 Item)
									</span>
								</h3>

								{/* Color and Size attributes */}
								<div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mt-1">
									<div className="flex items-center gap-1.5">
										<span>color:</span>
										<span
											className={cn(
												"inline-flex items-center gap-1 px-2.5 py-0.5 border border-gray-200 bg-white text-gray-700 font-medium text-xs",
												square ? "rounded-none" : "rounded-full",
											)}
										>
											<span
												className={cn("w-2.5 h-2.5 inline-block", square ? "rounded-none" : "rounded-full")}
												style={{
													backgroundColor:
														colorName.toLowerCase().includes("maroon")
															? "#800000"
															: colorName.toLowerCase().includes("olive")
															? "#556B2F"
															: colorName.toLowerCase().includes("black")
															? "#111827"
															: colorName.toLowerCase().includes("burgundy")
															? "#800020"
															: "#6B7280",
												}}
											/>
											{colorName}
										</span>
									</div>

									<span className="text-gray-300">|</span>

									<div className="flex items-center gap-1.5">
										<span>size:</span>
										<span
											className={cn(
												"inline-flex items-center justify-center w-6 h-6 bg-black text-white font-semibold text-xs",
												square ? "rounded-none" : "rounded-full",
											)}
										>
											{sizeName}
										</span>
									</div>
								</div>
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
							aria-label={`Remove ${item.product.name}`}
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
