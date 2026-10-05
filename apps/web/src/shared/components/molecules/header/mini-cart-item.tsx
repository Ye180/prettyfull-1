"use client";

import { QuantitySelector } from "@/features/cart/components/molecules/quantity-selector";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useCartStore, type CartItem } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Image from "next/image";

/** Ligne du tiroir panier : vignette, nom, stepper, total de ligne, retrait. */
export const MiniCartItem = ({ item }: { item: CartItem }) => {
	const t = useTranslations("Header.cart");
	const removeItem = useCartStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();

	const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;
	const currency = (item.unitPrice?.currency ?? item.product.price?.currency ?? "xof") as CurrencyCode;

	return (
		<li className="flex gap-4 py-5">
			<div className="overflow-hidden relative shrink-0 size-[8rem] bg-(--color-surface-card)">
				<Image
					src={item.product.image || "/products/shop/hero-shopping.jpg"}
					alt={item.product.name}
					fill
					sizes="80px"
					className="object-cover"
					unoptimized
				/>
			</div>

			<div className="flex flex-col flex-1 justify-between min-w-0">
				<div className="flex gap-3 justify-between">
					<p className="text-[1.4rem] font-medium leading-snug line-clamp-2 text-(--color-ink)">{item.product.name}</p>
					<span className="text-[1.4rem] font-semibold whitespace-nowrap text-(--color-ink)">
						{format(unitPrice * item.quantity, currency)}
					</span>
				</div>

				<div className="flex justify-between items-center mt-3">
					<QuantitySelector productId={item.productId} initialQuantity={item.quantity} />
					<button
						type="button"
						aria-label={t("removeItem", { name: item.product.name })}
						onClick={() => removeItem(item.productId)}
						className="text-[1.25rem] underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink)"
					>
						{t("remove")}
					</button>
				</div>
			</div>
		</li>
	);
};

export default MiniCartItem;
