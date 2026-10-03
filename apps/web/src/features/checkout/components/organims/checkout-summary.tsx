"use client";

import { useGetShippingOptions } from "@/features/checkout/api/get-shipping-options";
import { useCheckoutStore } from "@/features/checkout/stores/use-checkout-store";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useCartStore } from "@prettyfull/store";
import { DropdownMenuSeparator } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import VisualSummary from "../molecules/visual-sumary";

const TAX_RATE = 0.18;

const CheckoutSummary = () => {
	const t = useTranslations("CheckoutPage.summary");
	const items = useCartStore((state) => state.items);
	const { format } = useDisplayCurrency();
	const selectedShippingOptionId = useCheckoutStore(
		(state) => state.selectedShippingOptionId,
	);
	const { data: shippingOptions } = useGetShippingOptions("cart");

	const subtotal = items.reduce(
		(acc, item) =>
			acc +
			(item.unitPrice?.amount ?? item.product.price?.amount ?? 0) *
				item.quantity,
		0,
	);
	// Le port affiché suit l'option réellement choisie ; tant qu'aucune ne
	// l'est, il reste à zéro plutôt que d'annoncer un tarif arbitraire.
	const shipping =
		shippingOptions?.find((option) => option.id === selectedShippingOptionId)
			?.amount ?? 0;
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + shipping + taxes;

	return (
		<div className="px-8 py-6 w-full bg-white rounded-xl">
			{/* SECTION: Produits visuels */}
			<div className="flex flex-col pb-8 space-y-10">
				{items.map((item) => (
					<VisualSummary
						key={item.productId}
						item={{
							id: item.productId,
							name: item.product.name,
							description: item.product.description || "",
							price: item.unitPrice?.amount ?? item.product.price?.amount ?? 0,
							currency: (item.unitPrice?.currency ??
								item.product.price?.currency ??
								"xof") as CurrencyCode,
							image: item.product.image || "",
							quantity: item.quantity,
						}}
					/>
				))}
			</div>

			{/* SECTION: Résumé des coûts */}
			<h3 className="py-8 text-2xl! lg:text-3xl!">{t("title")}</h3>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md">
						<span>{t("subtotal")}</span>
						<span>{format(subtotal)}</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("shipping")}</span>
						<span>{format(shipping)}</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("taxes")}</span>
						<span>{format(taxes)}</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<div className="flex justify-between py-6 text-lg font-semibold">
					<span>{t("total")}</span>
					<span>{format(total)}</span>
				</div>
			</div>

			<DropdownMenuSeparator />
		</div>
	);
};

export default CheckoutSummary;
