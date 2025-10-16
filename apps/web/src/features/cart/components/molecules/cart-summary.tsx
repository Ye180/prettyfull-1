"use client";

import { CartSummaryType } from "@/features/cart/types";
import { paths } from "@/lib/routes/paths-en";
import { Button, DropdownMenuSeparator, Input } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
	summary: CartSummaryType;
}

const CartSummary: FC<Props> = ({ summary }) => {
	const tCart = useTranslations("Cart.product");
	const tSummary = useTranslations("Cart.summary");

	const router = useRouter();

	return (
		<div className="w-full py-6 bg-white sm:w-1/3">
			<div>
				<div className="flex flex-row justify-between gap-x-8">
					{/* <Input className="w-full" placeholder="Code promo" /> */}
					<div className="w-full">
						<Input className="w-full" placeholder="Code promo" />
					</div>
					<Button className="w-fit">{tSummary("apply")}</Button>
				</div>
			</div>
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
				onClick={() => router.push(paths.checkout)}
			>
				{tSummary("checkout")}
			</Button>
		</div>
	);
};

export default CartSummary;
