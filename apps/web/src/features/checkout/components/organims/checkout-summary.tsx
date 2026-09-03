"use client";

import { shippingOptions } from "@/lib/fake-data";
import { useCartStore } from "@prettyfull/store";
import { DropdownMenuSeparator } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import VisualSummary from "../molecules/visual-sumary";

const TAX_RATE = 0.18;

const CheckoutSummary = ({ currency }: { currency: string }) => {
	const t = useTranslations("CheckoutPage.summary");
	const items = useCartStore((state) => state.items);

	const subtotal = items.reduce(
		(acc, item) => acc + (item.unitPrice?.amount ?? item.product.price?.amount ?? 0) * item.quantity,
		0,
	);
	const shipping = shippingOptions[0]?.amount ?? 0;
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + shipping + taxes;

	return (
		<div className="py-6 w-full bg-white">
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
							size: Object.values(item.selectedVariants || {}).join(" / "),
							image: item.product.image || "",
							quantity: item.quantity,
						}}
						currency={currency}
					/>
				))}
			</div>

			{/* SECTION: Résumé des coûts */}
			<h3 className="py-8 text-2xl! lg:text-3xl! ">{t("title")}</h3>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md">
						<span>{t("subtotal")}</span>
						<span>{formatCurrency_FR(subtotal, currency)}</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("shipping")}</span>
						<span>{formatCurrency_FR(shipping, currency)}</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("taxes")}</span>
						<span>{formatCurrency_FR(taxes, currency)}</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<div className="flex justify-between py-6 text-lg font-semibold">
					<span>{t("total")}</span>
					<span>{formatCurrency_FR(total, currency)}</span>
				</div>
			</div>

			<DropdownMenuSeparator />
		</div>
	);
};

export default CheckoutSummary;
