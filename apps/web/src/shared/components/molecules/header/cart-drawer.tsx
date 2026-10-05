"use client";

import { Cart } from "@/components/icons/cart.icon";
import { useCartTotals } from "@/features/cart/hooks/use-cart-totals";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { paths } from "@/lib/routes/paths-en";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import FreeShippingBar from "@/features/cart/components/molecules/free-shipping-bar";
import MiniCartItem from "./mini-cart-item";

/**
 * Aperçu panier - panneau qui flotte au-dessus de la page : à droite en
 * desktop, remonte du bas en mobile (la seule direction ergonomique là où
 * un panneau latéral n'a pas la place). Chaque article est sa propre carte,
 * fini le tableau dense.
 */
const CartDrawer = () => {
	const t = useTranslations("Header.cart");
	const [open, setOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const router = useRouter();
	const items = useCartStore((state) => state.items);
	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
	const { subtotal } = useCartTotals(items);
	const { format } = useDisplayCurrency();

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const go = (href: string) => {
		setOpen(false);
		router.push(href);
	};

	return (
		<Drawer direction={isDesktop ? "right" : "bottom"} open={open} onOpenChange={setOpen}>
			<DrawerTrigger
				className="relative flex focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
				aria-label={t("ariaViewCart")}
			>
				<Cart className="w-[20px] h-[20px]" />
				{itemCount > 0 && (
					<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-1 -right-1 text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
						{itemCount}
					</p>
				)}
			</DrawerTrigger>

			<DrawerContent className="flex! flex-col w-full sm:max-w-[46rem]! max-h-[88vh] md:h-full md:max-h-none rounded-none! border-0!">
				<div className="flex justify-between items-center px-6 py-5 border-b border-(--color-surface-border) shrink-0">
					<h2 className="text-[2.4rem]!">
						{t("title")} {itemCount > 0 && <span className="text-(--color-surface-muted)">({itemCount})</span>}
					</h2>
					<DrawerClose
						aria-label={t("ariaClose")}
						className="p-1.5 rounded-md cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink) hover:bg-(--color-surface-card)"
					>
						<CloseIcon className="w-6 h-6" />
					</DrawerClose>
				</div>

				{items.length > 0 && (
					<div className="px-6 py-4 border-b border-(--color-surface-border) shrink-0">
						<FreeShippingBar subtotal={subtotal} />
					</div>
				)}

				{/* data-lenis-prevent : sans lui, le smooth-scroll de la page capte la molette
				 * et la liste du tiroir ne défile pas (ou par à-coups). */}
				<div data-lenis-prevent className="overflow-y-auto overscroll-contain flex-1 px-6 min-h-0">
					{items.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-20 text-center">
							<h3 className="text-[2.2rem]! [font-family:var(--font-display)]!">{t("emptyTitle")}</h3>
							<p className="mt-2 max-w-[30rem] text-[1.4rem] text-(--color-surface-muted)">{t("emptyDescription")}</p>
							<DrawerClose asChild>
								<Link
									href={paths.collections}
									className="px-8 py-3.5 mt-8 text-[1.3rem] font-semibold tracking-[0.1em] text-white uppercase bg-(--color-ink) hover:bg-black"
								>
									{t("shopNow")}
								</Link>
							</DrawerClose>
						</div>
					) : (
						<ul className="divide-y divide-(--color-surface-border)">
							{items.map((item) => (
								<MiniCartItem key={item.productId} item={item} />
							))}
						</ul>
					)}
				</div>

				{items.length > 0 && (
					<DrawerFooter className="gap-0! px-6! pt-5! pb-6! border-t border-(--color-surface-border) bg-(--color-surface-card)">
						<div className="flex justify-between items-baseline text-(--color-ink)">
							<span className="text-[1.5rem] font-semibold">{t("subtotal")}</span>
							<span className="text-[1.8rem] font-semibold">{format(subtotal)}</span>
						</div>
						<p className="mt-1 mb-5 text-[1.25rem] text-(--color-surface-muted)">{t("shippingNote")}</p>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => go(paths.cart)}
								className="py-3.5 text-[1.3rem] font-semibold tracking-[0.08em] uppercase border transition-colors cursor-pointer border-(--color-ink) text-(--color-ink) hover:bg-white"
							>
								{t("viewCartButton")}
							</button>
							<button
								type="button"
								onClick={() => go("/checkout")}
								className="py-3.5 text-[1.3rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors cursor-pointer bg-(--color-ink) hover:bg-black"
							>
								{t("checkoutButton")}
							</button>
						</div>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
};

export default CartDrawer;
