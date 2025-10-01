"use client";

import { CartSummaryType } from "@/features/cart/types";
import { Button, DropdownMenuSeparator } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface Props {
	summary: CartSummaryType;
}

const CartSummary: FC<Props> = ({ summary }) => {
	const tCart = useTranslations("Cart.product");
	const tSummary = useTranslations("Cart.summary");

	return (
		<div className="w-full py-6 bg-white md:w-1/3">
			<div className="py-12 text-2xl font-bold">{tSummary("title")}</div>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md ">
						<span>{tSummary("subtotal")}</span>
						<span>${summary.subtotal}</span>
					</div>
					<div className="flex justify-between text-md ">
						<span>{tSummary("shipping")}</span>
						<span>${summary.shipping}</span>
					</div>

					<div className="flex justify-between text-md ">
						<span>{tSummary("taxes")}</span>
						<span>{summary.taxes ? `$${summary.taxes}` : "-"}</span>
					</div>
				</div>

				<DropdownMenuSeparator />
				<div className="flex justify-between py-6 text-lg font-semibold ">
					<span>{tSummary("total")}</span>
					<span>${summary.total}</span>
				</div>
			</div>
			<Button
				variant="secondary"
				className="w-full text-white bg-black hover:bg-gray-800"
			>
				{tSummary("checkout")}
			</Button>
		</div>
	);
};

export default CartSummary;
