"use client";

import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { useTranslations } from "next-intl";
import { FREE_SHIPPING_THRESHOLD } from "../../hooks/use-cart-totals";

/** Jauge "plus que X pour la livraison offerte", partagée page panier + tiroir. */
export const FreeShippingBar = ({ subtotal }: { subtotal: number }) => {
	const t = useTranslations("Cart.freeShipping");
	const { format } = useDisplayCurrency();
	const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
	const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

	return (
		<div>
			<p className="text-[1.3rem] text-(--color-ink)">
				{remaining > 0 ? (
					t.rich("remaining", { amount: format(remaining), b: (chunks) => <strong>{chunks}</strong> })
				) : (
					<strong>{t("reached")}</strong>
				)}
			</p>
			<div className="overflow-hidden mt-2.5 h-[0.4rem] rounded-full bg-(--color-surface-border)">
				<div
					className="h-full rounded-full transition-[width] duration-500 bg-(--color-ink)"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
};

export default FreeShippingBar;
