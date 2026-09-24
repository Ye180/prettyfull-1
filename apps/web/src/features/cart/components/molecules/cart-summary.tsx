"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import {
	StoreApiError,
	applyDiscountCode,
	removeDiscountCode,
	syncCartToServer,
} from "@/lib/store-api";
import { Button, toast } from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
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
	const items = useCartStore((state) => state.items);
	const [couponCode, setCouponCode] = useState("");
	const [appliedCode, setAppliedCode] = useState<string | null>(null);
	const [discountAmount, setDiscountAmount] = useState(0);
	const [isApplying, setIsApplying] = useState(false);

	const taxAmount = taxes;
	const finalTotal = Math.max(
		0,
		subtotal - discountAmount + taxAmount + shipping,
	);

	/**
	 * Le code est validé côté serveur, contre le vrai sous-total : le panier
	 * local est d'abord poussé au panier serveur (comme au passage en
	 * commande, § `syncCartToServer`), sans quoi le serveur validerait le code
	 * contre un panier vide.
	 */
	const handleApplyCoupon = async () => {
		const code = couponCode.trim();
		if (!code) return;

		setIsApplying(true);
		try {
			await syncCartToServer(items);
			const cart = await applyDiscountCode(code);

			setAppliedCode(cart.discountCode);
			setDiscountAmount(cart.discountTotal);

			if (cart.discountCode) {
				toast.success(`Code promo « ${cart.discountCode} » appliqué.`);
			} else {
				toast.info("Ce code ne s'applique pas à votre panier actuel.");
			}
		} catch (error) {
			toast.error(
				error instanceof StoreApiError
					? error.message
					: "Impossible d'appliquer ce code promo.",
			);
		} finally {
			setIsApplying(false);
		}
	};

	const handleRemoveCoupon = async () => {
		setIsApplying(true);
		try {
			await removeDiscountCode();
			setAppliedCode(null);
			setDiscountAmount(0);
			setCouponCode("");
		} catch (error) {
			toast.error(
				error instanceof StoreApiError
					? error.message
					: "Impossible de retirer ce code promo.",
			);
		} finally {
			setIsApplying(false);
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

				{appliedCode && (
					<div className="flex justify-between items-center text-gray-600">
						<span>Réduction ({appliedCode})</span>
						<span className="font-semibold text-rose-500">
							-{formatCurrency_FR(discountAmount, currency)}
						</span>
					</div>
				)}

				<div className="flex justify-between items-center text-gray-600">
					<span>{t("shipping")}</span>
					<span className="font-semibold text-gray-900">
						{shipping > 0 ? formatCurrency_FR(shipping, currency) : "Gratuit"}
					</span>
				</div>

				<div className="flex justify-between items-center text-gray-600">
					<span>{t("taxes")}</span>
					<span className="font-semibold text-gray-900">
						{formatCurrency_FR(taxAmount, currency)}
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
				{appliedCode ? (
					<div
						className={cn(
							"flex items-center justify-between gap-2.5 px-4 py-3 text-sm bg-white border border-gray-200 font-medium",
							square ? "rounded-none" : "rounded-full",
						)}
					>
						<span className="text-gray-900">{appliedCode}</span>
						<button
							type="button"
							onClick={() => void handleRemoveCoupon()}
							disabled={isApplying}
							className="text-gray-400 hover:text-black transition disabled:opacity-50 cursor-pointer"
						>
							Retirer
						</button>
					</div>
				) : (
				<div className="flex gap-2.5">
					<input
						id="coupon-input"
						type="text"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
						placeholder={t("couponPlaceholder")}
						disabled={isApplying}
						className={cn(
							"flex-1 px-4 py-3 text-sm bg-white border border-gray-200 focus:outline-none focus:border-black font-medium transition disabled:opacity-50",
							square ? "rounded-none" : "rounded-full",
						)}
					/>
					<button
						type="button"
						onClick={() => void handleApplyCoupon()}
						disabled={isApplying || !couponCode.trim()}
						className={cn(
							"px-6 py-3 text-sm font-semibold text-white bg-black hover:bg-black/85 transition cursor-pointer shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed",
							square ? "rounded-none" : "rounded-full",
						)}
					>
						{isApplying ? "…" : t("apply")}
					</button>
				</div>
				)}
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
