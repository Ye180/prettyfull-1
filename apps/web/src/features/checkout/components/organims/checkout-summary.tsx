"use client";

import { useCheckoutSummary } from "@/hooks/use-Checkout-summary";
import { DropdownMenuSeparator } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import VisualSummary from "../molecules/visual-sumary";

const CheckoutSummary = () => {
	const t = useTranslations("CheckoutPage.summary");
	const { items, summary } = useCheckoutSummary();

	return (
		<div className="w-full py-6 bg-white">
			{/* SECTION: Produits visuels */}
			<div className="flex flex-col pb-8 space-y-10">
				{items.map((item) => (
					<VisualSummary
						key={item.productId}
						item={{
							id: item.productId,
							name: item.product?.name ?? "Unknown product",
							description: item.product?.description || "",
							color: item.selectedVariants?.color || "",
							size: item.selectedVariants?.size || "",
							image: item.product?.image || "",
							price: item.unitPrice?.amount || 0,
							quantity: item?.quantity,
						}}
					/>
				))}
			</div>

			{/* SECTION: Résumé des coûts */}
			<h3 className="py-8 text-2xl! lg:text-3xl! ">{t("title")}</h3>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md">
						<span>{t("subtotal")}</span>
						<span>
							{summary.currency} {summary.subtotal.toLocaleString()}
						</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("shipping")}</span>
						<span>
							{summary.currency} {summary.shipping.toLocaleString()}
						</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("taxes")}</span>
						<span>
							{summary.taxes
								? `${summary.currency} ${summary.taxes.toLocaleString()}`
								: "-"}
						</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<div className="flex justify-between py-6 text-lg font-semibold">
					<span>{t("total")}</span>
					<span>
						{summary.currency} {summary.total.toLocaleString()}
					</span>
				</div>
			</div>

			<DropdownMenuSeparator />

			<p className="py-8 text-[1.5rem] font-semibold">
				Arrive Dim, 28 Sept - Vend 02 Aout
			</p>
		</div>
	);
};

export default CheckoutSummary;
