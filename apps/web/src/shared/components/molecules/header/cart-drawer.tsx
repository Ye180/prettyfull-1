"use client";

import { Cart } from "@/components/icons/cart.icon";
import { useCartTotals } from "@/features/cart/hooks/use-cart-totals";
import { paths } from "@/lib/routes/paths-en";
import { useRegionStore } from "@/stores/useRegion";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
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
	const region = useRegionStore((state) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const goToCart = () => {
		setOpen(false);
		router.push(paths.cart);
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

			<DrawerContent
				className="flex! flex-col w-full sm:max-w-md! max-h-[85vh] rounded-none! border-t-0!"
			>
				<div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
					<h2 className="text-2xl font-semibold text-gray-900">{t("title")}</h2>
					<DrawerClose
						aria-label={t("ariaClose")}
						className="p-1 text-gray-500 rounded-md cursor-pointer hover:bg-gray-100 hover:text-black"
					>
						<CloseIcon className="w-6 h-6" />
					</DrawerClose>
				</div>

				<div className="overflow-y-auto flex-1 min-h-0 px-6 py-4 space-y-4 bg-gray-50">
					{items.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-16 text-center">
							<div className="flex justify-center items-center mb-6 w-16 h-16 bg-gray-100 rounded-full">
								<Cart className="w-6 h-6 text-gray-400" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">{t("emptyTitle")}</h3>
							<p className="mt-2 max-w-xs text-sm text-gray-500">
								{t("emptyDescription")}
							</p>
						</div>
					) : (
						items.map((item) => (
							<MiniCartItem key={item.productId} item={item} currency={currency} />
						))
					)}
				</div>

				{items.length > 0 && (
					<DrawerFooter className="border-t border-gray-100">
						<div className="flex justify-between items-center mb-1 text-base font-semibold text-gray-900">
							<span>{t("subtotal")}</span>
							<span>{formatCurrency_FR(subtotal, currency)}</span>
						</div>
						<p className="mb-3 text-xs text-gray-500">
							{t("shippingNote")}
						</p>
						<Button shape="square" fullWidth onClick={goToCart}>
							{t("viewCartButton")}
						</Button>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
};

export default CartDrawer;
