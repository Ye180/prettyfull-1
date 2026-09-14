"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { Button, toast } from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartSummaryProps {
	subtotal?: number;
	taxes?: number;
	shipping?: number;
	total?: number;
	currency?: string;
	/** Squares off the summary block/inputs/buttons - cart drawer only. */
	square?: boolean;
}

const CartSummary = ({
	subtotal = 0,
	taxes = 0,
	shipping = 0,
	total = 0,
	currency = "$",
	square = false,
}: CartSummaryProps) => {
	const t = useTranslations("Cart.summary");
	const router = useRouter();
	const [couponCode, setCouponCode] = useState("BOOOM55");
	const [discountApplied, setDiscountApplied] = useState(true);

	// 5% discount matching mockup ($42.50 on $850)
	const discountAmount = discountApplied ? subtotal * 0.05 : 0;
	const taxAmount = subtotal > 0 ? subtotal * 0.05 : 0;
	const finalTotal = Math.max(
		0,
		subtotal - discountAmount + taxAmount + shipping,
	);

	const handleApplyCoupon = () => {
		if (couponCode.trim().toUpperCase() === "BOOOM55") {
			setDiscountApplied(true);
			toast.success("Code promo BOOOM55 appliqué : réduction de 5 % !");
		} else if (couponCode.trim()) {
			toast.info(`Code promo « ${couponCode} » appliqué.`);
			setDiscountApplied(true);
		} else {
			setDiscountApplied(false);
		}
	};

	const handleCheckout = () => {
		router.push("/checkout");
	};

	return (
		<div
			className={cn(
				"p-7 md:p-8 bg-[#F9FAFB] border border-gray-100 shadow-sm",
				square ? "rounded-none" : "rounded-3xl",
			)}
		>
			<div className="text-center pb-2">
				<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
					Prix total
				</p>
				<p className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-950 font-sans tracking-tight">
					{formatCurrency_FR(finalTotal > 0 ? finalTotal : total, currency)}
				</p>
			</div>

			<div className="w-full h-px bg-gray-200/80 my-6" />

			<div className="space-y-4 text-base">
				<div className="flex justify-between items-center text-gray-600">
					<span>{t("subtotal")}</span>
					<span className="font-semibold text-gray-900">
						{formatCurrency_FR(subtotal, currency)}
					</span>
				</div>

				<div className="flex justify-between items-center text-gray-600">
					<span>Réduction</span>
					<span className="font-semibold text-rose-500">
						{discountApplied && subtotal > 0
							? `-${formatCurrency_FR(discountAmount, currency)} (5%)`
							: "0 FCFA"}
					</span>
				</div>

				<div className="flex justify-between items-center text-gray-600">
					<span>{t("shipping")}</span>
					<span className="font-semibold text-gray-900">
						{shipping > 0 ? formatCurrency_FR(shipping, currency) : "Gratuit"}
					</span>
				</div>

				<div className="flex justify-between items-center text-gray-600">
					<span>{t("taxes")}</span>
					<span className="font-semibold text-gray-900">
						{formatCurrency_FR(taxAmount, currency)} (5%)
					</span>
				</div>
			</div>

			<div className="w-full h-px bg-gray-200/80 my-6" />

			<div className="mb-6">
				<label
					htmlFor="coupon-input"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("couponsCode")}
				</label>
				<div className="flex gap-2.5">
					<input
						id="coupon-input"
						type="text"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						placeholder={t("couponPlaceholder")}
						className={cn(
							"flex-1 px-4 py-3 text-sm bg-white border border-gray-200 focus:outline-none focus:border-black font-medium transition",
							square ? "rounded-none" : "rounded-full",
						)}
					/>
					<button
						type="button"
						onClick={handleApplyCoupon}
						className={cn(
							"px-6 py-3 text-sm font-semibold text-white bg-black hover:bg-black/85 transition cursor-pointer shadow-sm shrink-0",
							square ? "rounded-none" : "rounded-full",
						)}
					>
						{t("apply")}
					</button>
				</div>
			</div>

			<button
				type="button"
				onClick={handleCheckout}
				className={cn(
					"w-full py-4 px-6 bg-black hover:bg-black/85 text-white font-semibold flex items-center justify-center gap-3 transition cursor-pointer shadow-md group",
					square ? "rounded-none" : "rounded-full",
				)}
			>
				<span className="text-base font-medium">{t("checkout")}</span>
				<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
			</button>
		</div>
	);
};

export default CartSummary;
