"use client";

import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { useCartStore, type CartItem } from "@prettyfull/store";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";

interface MiniCartItemProps {
	item: CartItem;
	currency: string;
}

/**
 * Ligne de panier façon carte flottante (référence client) : image, nom,
 * prix, stepper en pastille numérique avec chevrons empilés - propre au
 * tiroir panier, distinct du rendu tabulaire de `CartItems` sur /cart.
 */
export const MiniCartItem = ({ item, currency }: MiniCartItemProps) => {
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const removeItem = useCartStore((state) => state.removeItem);

	const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;
	const imageSrc = item.product.image || "/assets/product5.webp";

	return (
		<div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
			<div className="overflow-hidden relative w-16 h-16 bg-gray-50 rounded-lg shrink-0">
				<Image
					src={imageSrc}
					alt={item.product.name}
					fill
					sizes="64px"
					className="object-contain p-1"
					unoptimized
				/>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex gap-2 justify-between">
					<p className="text-sm font-medium leading-snug text-gray-900 line-clamp-2">
						{item.product.name}
					</p>
					<span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
						{formatCurrency_FR(unitPrice, currency)}
					</span>
				</div>

				<div className="flex justify-between items-end mt-3">
					<div className="flex items-center h-9 rounded-md border border-gray-300">
						<span className="flex justify-center items-center w-9 text-sm font-medium border-r border-gray-300">
							{item.quantity}
						</span>
						<div className="flex flex-col">
							<button
								type="button"
								aria-label="Augmenter la quantité"
								onClick={() => updateQuantity(item.productId, item.quantity + 1)}
								className="flex justify-center items-center w-6 h-[17px] cursor-pointer hover:bg-gray-50"
							>
								<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
									<polyline points="6 15 12 9 18 15" />
								</svg>
							</button>
							<button
								type="button"
								aria-label="Diminuer la quantité"
								onClick={() => updateQuantity(item.productId, item.quantity - 1)}
								className="flex justify-center items-center w-6 h-[17px] border-t border-gray-300 cursor-pointer hover:bg-gray-50"
							>
								<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</button>
						</div>
					</div>

					<button
						type="button"
						aria-label={`Retirer ${item.product.name}`}
						onClick={() => removeItem(item.productId)}
						className="p-2 text-gray-400 rounded-md transition-colors cursor-pointer hover:text-red-500 hover:bg-red-50"
					>
						<TrashIcon size={16} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default MiniCartItem;
