"use client";

import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { paths } from "@/lib/routes/paths-en";
import type { CurrencyCode } from "@prettyfull/contracts";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { useWishlistStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import Image from "next/image";

/**
 * Aperçu liste de souhaits - même gabarit que le tiroir panier : à droite en
 * desktop, remonte du bas en mobile, une ligne par article.
 */
const WishlistDrawer = () => {
	const t = useTranslations("Header.wishlist");
	const [open, setOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const router = useRouter();
	const items = useWishlistStore((state) => state.items);
	const removeItem = useWishlistStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const goToWishlist = () => {
		setOpen(false);
		router.push(paths.wishlist);
	};

	return (
		<Drawer direction={isDesktop ? "right" : "bottom"} open={open} onOpenChange={setOpen}>
			<DrawerTrigger
				className="relative flex focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
				aria-label={t("ariaView")}
			>
				<Heart className="w-[20px] h-[20px] text-[#262626]" />
				{items.length > 0 && (
					<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-1 -right-1 text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
						{items.length}
					</p>
				)}
			</DrawerTrigger>

			<DrawerContent className="flex! flex-col w-full sm:max-w-[46rem]! max-h-[88vh] md:h-full md:max-h-none rounded-none! border-0!">
				<div className="flex justify-between items-center px-6 py-5 border-b border-(--color-surface-border) shrink-0">
					<h2 className="text-[2.4rem]!">
						{t("title")}{" "}
						{items.length > 0 && (
							<span className="text-(--color-surface-muted)">({items.length})</span>
						)}
					</h2>
					<DrawerClose
						aria-label={t("ariaClose")}
						className="p-1.5 rounded-md cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink) hover:bg-(--color-surface-card)"
					>
						<CloseIcon className="w-6 h-6" />
					</DrawerClose>
				</div>

				{/* data-lenis-prevent : sinon le smooth-scroll de la page capte la molette. */}
				<div data-lenis-prevent className="overflow-y-auto overscroll-contain flex-1 px-6 min-h-0">
					{items.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-20 text-center">
							<div className="flex justify-center items-center mb-6 size-16 rounded-full bg-(--color-surface-card)">
								<Heart className="size-6 text-(--color-surface-muted)" />
							</div>
							<h3 className="text-[2.2rem]! [font-family:var(--font-display)]!">{t("emptyTitle")}</h3>
							<p className="mt-2 max-w-[30rem] text-[1.4rem] text-(--color-surface-muted)">
								{t("emptyDescription")}
							</p>
						</div>
					) : (
						<ul className="divide-y divide-(--color-surface-border)">
							{items.map((item) => (
								<li key={item.productId} className="flex gap-4 py-5">
									<div className="overflow-hidden relative shrink-0 size-[8rem] bg-(--color-surface-card)">
										<Image
											src={item.product.image || "/products/shop/hero-shopping.jpg"}
											alt={item.product.name}
											fill
											sizes="80px"
											className="object-cover"
											unoptimized
										/>
									</div>
									<div className="flex flex-col flex-1 justify-between min-w-0">
										<div className="flex gap-3 justify-between">
											<p className="text-[1.4rem] font-medium leading-snug line-clamp-2 text-(--color-ink)">
												{item.product.name}
											</p>
											{item.product.price && (
												<span className="text-[1.4rem] font-semibold whitespace-nowrap text-(--color-ink)">
													{format(
														item.product.price.amount,
														item.product.price.currency as CurrencyCode,
													)}
												</span>
											)}
										</div>
										<button
											type="button"
											onClick={() => removeItem(item.productId)}
											aria-label={t("removeItem", { name: item.product.name })}
											className="self-end mt-3 text-[1.25rem] underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink)"
										>
											{t("remove")}
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				<DrawerFooter className="px-6! pt-5! pb-6! border-t border-(--color-surface-border) bg-(--color-surface-card)">
					<button
						type="button"
						onClick={goToWishlist}
						className="py-3.5 w-full text-[1.3rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors cursor-pointer bg-(--color-ink) hover:bg-black"
					>
						{t("viewButton")}
					</button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default WishlistDrawer;
