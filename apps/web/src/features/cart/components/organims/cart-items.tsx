"use client";

import { useDisplayCurrency } from "@/hooks/use-display-currency";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useCartStore, type CartItem } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { QuantitySelector } from "../molecules/quantity-selector";

/** Lignes du panier (page /cart) : en-têtes de colonnes sur desktop, empilé sur mobile. */
const CartItems = ({ items }: { items: CartItem[] }) => {
	const t = useTranslations("Cart.items");
	const removeItem = useCartStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();

	return (
		<div>
			<div className="hidden pb-3 text-[1.15rem] font-semibold tracking-[0.12em] uppercase border-b md:grid md:grid-cols-[1fr_12rem_12rem] text-(--color-surface-muted) border-(--color-surface-border)">
				<span>{t("product")}</span>
				<span className="text-center">{t("quantity")}</span>
				<span className="text-right">{t("total")}</span>
			</div>

			<ul className="divide-y divide-(--color-surface-border)">
				{items.map((item) => {
					const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;
					const currency = (item.unitPrice?.currency ?? item.product.price?.currency ?? "xof") as CurrencyCode;

					return (
						<li
							key={item.productId}
							className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 items-center py-6 md:grid-cols-[1fr_12rem_12rem]"
						>
							<div className="flex col-span-2 gap-5 items-center md:col-span-1">
								<div className="overflow-hidden relative shrink-0 size-[9.6rem] bg-(--color-surface-card)">
									<Image
										src={item.product.image || "/products/shop/hero-shopping.jpg"}
										alt={item.product.name}
										fill
										sizes="96px"
										className="object-cover"
										unoptimized
									/>
								</div>
								<div className="min-w-0">
									<p className="text-[1.5rem] font-medium leading-snug line-clamp-2 text-(--color-ink)">
										{item.product.name}
									</p>
									<p className="mt-1 text-[1.3rem] text-(--color-surface-muted)">{format(unitPrice, currency)}</p>
									<button
										type="button"
										onClick={() => removeItem(item.productId)}
										aria-label={t("removeItemAria", { name: item.product.name })}
										className="mt-2 text-[1.25rem] underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink)"
									>
										{t("remove")}
									</button>
								</div>
							</div>

							<div className="md:flex md:justify-center">
								<QuantitySelector productId={item.productId} initialQuantity={item.quantity} />
							</div>

							<p className="text-[1.5rem] font-semibold text-right text-(--color-ink)">
								{format(unitPrice * item.quantity, currency)}
							</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default CartItems;
