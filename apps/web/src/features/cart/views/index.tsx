"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import FreeShippingBar from "@/features/cart/components/molecules/free-shipping-bar";
import CartItems from "@/features/cart/components/organims/cart-items";
import { useCartTotals } from "@/features/cart/hooks/use-cart-totals";
import { paths } from "@/lib/routes/paths-en";
import { useCartStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CartView = () => {
	const t = useTranslations("Cart.page");
	const items = useCartStore((state) => state.items);
	const clearCart = useCartStore((state) => state.clearCart);
	const totals = useCartTotals(items);
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<main className="px-4 pt-10 pb-28 mx-auto w-full max-w-[140rem] min-h-[60vh] sm:px-6 lg:px-10">
			<div className="flex flex-wrap gap-4 justify-between items-end pb-8 border-b border-(--color-surface-border)">
				<h1 className="text-[3.6rem]! sm:text-[4.8rem]!">
					{t("title")} <span className="text-(--color-surface-muted)">({itemCount})</span>
				</h1>
				<Link
					href={paths.collections}
					className="text-[1.35rem] underline underline-offset-4 transition-colors text-(--color-surface-muted) hover:text-(--color-ink)"
				>
					{t("continueShopping")}
				</Link>
			</div>

			{items.length > 0 ? (
				<div className="grid gap-12 pt-8 lg:grid-cols-[1fr_40rem] lg:gap-16">
					<section>
						<div className="mb-8 max-w-[52rem]">
							<FreeShippingBar subtotal={totals.subtotal} />
						</div>
						<CartItems items={items} />
						<div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t border-(--color-surface-border)">
							<p className="max-w-[60rem] text-[1.3rem] leading-relaxed text-(--color-surface-muted)">{t("shippingNote")}</p>
							<button
								type="button"
								onClick={clearCart}
								className="text-[1.3rem] underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink)"
							>
								{t("removeAll")}
							</button>
						</div>
					</section>

					<aside className="lg:sticky lg:top-56 lg:self-start">
						<CartSummary subtotal={totals.subtotal} taxes={totals.taxes} freeShipping={totals.freeShipping} />
					</aside>
				</div>
			) : (
				<div className="flex flex-col items-center py-24 mx-auto max-w-[52rem] text-center">
					<h2 className="text-[3rem]!">{t("emptyTitle")}</h2>
					<p className="mt-4 text-[1.5rem] leading-relaxed text-(--color-surface-muted)">{t("emptyDescription")}</p>
					<Link
						href={paths.collections}
						className="inline-flex gap-2 items-center px-10 py-4 mt-10 text-[1.4rem] font-semibold tracking-[0.1em] text-white uppercase transition-colors bg-(--color-ink) hover:bg-black"
					>
						{t("discoverCta")}
					</Link>
				</div>
			)}
		</main>
	);
};

export default CartView;
