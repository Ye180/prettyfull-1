"use client";

import { QuantitySelector } from "@/features/cart/components/molecules/quantity-selector";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useCartStore, type CartItem } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface MiniCartItemProps {
	item: CartItem;
}

/**
 * Ligne de panier façon carte flottante (référence client) : image, nom,
 * prix, et le même stepper -/+ que sur /cart (`QuantitySelector`) - distinct
 * du rendu tabulaire de `CartItems` sur /cart.
 */
export const MiniCartItem = ({ item }: MiniCartItemProps) => {
	const t = useTranslations("Header.cart");
	const removeItem = useCartStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();

	const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;
	const sourceCurrency = (item.unitPrice?.currency ??
		item.product.price?.currency ??
		"xof") as CurrencyCode;
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
						{format(unitPrice, sourceCurrency)}
					</span>
				</div>

				<div className="flex justify-between items-end mt-3">
					<QuantitySelector
						productId={item.productId}
						initialQuantity={item.quantity}
						square
					/>

					<button
						type="button"
						aria-label={t("removeItem", { name: item.product.name })}
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
