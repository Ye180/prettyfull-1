"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import {
	StoreApiError,
	applyDiscountCode,
	removeDiscountCode,
	syncCartToServer,
} from "@/lib/store-api";
import { toast } from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CartSummaryProps {
	subtotal?: number;
	taxes?: number;
	freeShipping?: boolean;
}

/** Récapitulatif du panier : totaux, code promo, passage en caisse. */
const CartSummary = ({ subtotal = 0, taxes = 0, freeShipping = false }: CartSummaryProps) => {
	const t = useTranslations("Cart.summary");
	const router = useRouter();
	const { format } = useDisplayCurrency();
	const items = useCartStore((state) => state.items);
	const [couponCode, setCouponCode] = useState("");
	const [appliedCode, setAppliedCode] = useState<string | null>(null);
	const [discountAmount, setDiscountAmount] = useState(0);
	const [isApplying, setIsApplying] = useState(false);

	const finalTotal = Math.max(0, subtotal - discountAmount + taxes);

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
				toast.success(t("couponApplied", { code: cart.discountCode }));
			} else {
				toast.info(t("couponNotApplicable"));
			}
		} catch (error) {
			toast.error(
				error instanceof StoreApiError
					? error.message
					: t("couponApplyError"),
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
					: t("couponRemoveError"),
			);
		} finally {
			setIsApplying(false);
		}
	};

	const handleCheckout = () => {
		router.push("/checkout");
	};

	const row = "flex justify-between items-center text-[1.4rem] text-(--color-ink)/75";

	return (
		<div className="p-7 bg-(--color-surface-card) md:p-8">
			<h2 className="pb-5 text-[2.2rem]!">{t("title")}</h2>

			<div className="space-y-3">
				<div className={row}>
					<span>{t("subtotal")}</span>
					<span className="text-(--color-ink)">{format(subtotal)}</span>
				</div>
				{appliedCode && (
					<div className={row}>
						<span>{t("discount", { code: appliedCode })}</span>
						<span className="text-emerald-700">-{format(discountAmount)}</span>
					</div>
				)}
				<div className={row}>
					<span>{t("shipping")}</span>
					<span className="text-(--color-ink)">{freeShipping ? t("free") : t("atCheckout")}</span>
				</div>
				<div className={row}>
					<span>{t("taxes")}</span>
					<span className="text-(--color-ink)">{format(taxes)}</span>
				</div>
			</div>

			<div className="flex justify-between items-baseline pt-5 mt-5 border-t border-(--color-surface-border)">
				<span className="text-[1.6rem] font-semibold text-(--color-ink)">{t("total")}</span>
				<span className="text-[2.4rem] font-semibold text-(--color-ink)">{format(finalTotal)}</span>
			</div>

			<div className="mt-6">
				<label htmlFor="coupon-input" className="block mb-2 text-[1.3rem] font-medium text-(--color-ink)">
					{t("couponsCode")}
				</label>
				{appliedCode ? (
					<div className="flex justify-between items-center px-4 py-3 text-[1.3rem] bg-white border border-(--color-surface-border)">
						<span className="font-medium text-(--color-ink)">{appliedCode}</span>
						<button
							type="button"
							onClick={() => void handleRemoveCoupon()}
							disabled={isApplying}
							className="underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink) disabled:opacity-50"
						>
							{t("remove")}
						</button>
					</div>
				) : (
					<div className="flex">
						<input
							id="coupon-input"
							type="text"
							value={couponCode}
							onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
							placeholder={t("couponPlaceholder")}
							disabled={isApplying}
							className="flex-1 px-4 py-3 min-w-0 text-[1.3rem] bg-white border border-r-0 border-(--color-surface-border) outline-none focus:border-(--color-ink) disabled:opacity-50"
						/>
						<button
							type="button"
							onClick={() => void handleApplyCoupon()}
							disabled={isApplying || !couponCode.trim()}
							className="px-5 text-[1.25rem] font-semibold tracking-[0.08em] uppercase border transition-colors cursor-pointer shrink-0 border-(--color-ink) text-(--color-ink) hover:bg-(--color-ink) hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-(--color-ink)"
						>
							{isApplying ? "…" : t("apply")}
						</button>
					</div>
				)}
			</div>

			<button
				type="button"
				onClick={handleCheckout}
				className="flex gap-3 justify-center items-center py-4 mt-6 w-full text-[1.4rem] font-semibold tracking-[0.1em] text-white uppercase transition-colors cursor-pointer group bg-(--color-ink) hover:bg-black"
			>
				{t("checkout")}
				<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
			</button>

			<ul className="mt-6 space-y-2 text-[1.25rem] text-(--color-surface-muted)">
				<li className="flex gap-2 items-center">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
					{t("securePayment")}
				</li>
				<li className="flex gap-2 items-center">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
					{t("authentic")}
				</li>
			</ul>
		</div>
	);
};

export default CartSummary;
