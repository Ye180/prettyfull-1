"use client";

import { useGetItemsCart } from "@/features/cart/api/medusa/get-items-cart";
import { Category } from "@/features/homepage/api/medusa/get-category";
import { PAGES_PATHS } from "@/lib/routes/paths-en";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { Logo, Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { EnterIcon } from "../../../../../../../packages/ui/src/icons/enter.icon";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import CartDropdown from "./carte-dropdown";
import { CurrencySelector } from "./currency-selector";
import NavbarResponsive from "./navbar-responsive";

const NavBarHeaders = ({
	main_category,
	secondary_category,
}: {
	main_category: Category[];
	secondary_category: Category[];
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [cartId, setCartId] = useState<string | null>(null);
	const pathname = usePathname();
	const [division] = useQueryState("division");
	const t = useTranslations("HomePage.header");

	const syncCartId = useCallback(() => {
		const storedCartId = localStorage.getItem("cart_id");
		setCartId(storedCartId);
	}, []);

	// Initialize cart ID from localStorage and listen for changes
	useEffect(() => {
		syncCartId();

		// Listen for cross-tab localStorage changes
		const handleStorage = (e: StorageEvent) => {
			if (e.key === "cart_id") syncCartId();
		};

		// Listen for same-tab cart updates (dispatched from add-to-cart)
		const handleCartUpdate = () => syncCartId();

		window.addEventListener("storage", handleStorage);
		window.addEventListener("cart_id_updated", handleCartUpdate);

		return () => {
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener("cart_id_updated", handleCartUpdate);
		};
	}, [syncCartId]);

	const { data: itemsCart } = useGetItemsCart(cartId || "");

	return (
		<>
			<div className="flex relative justify-between items-center h-20">
				<div className="flex items-center space-x-12">
					<Link
						href="/"
						className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue"
					>
						<Logo />
					</Link>
					<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6 scrollbar-hide">
						{main_category ? (
							main_category.map((items: Category, index: number) => {
								const itemHandle = items.handle as string;
								// Check if current pathname matches this category's page
								const isActive =
									pathname.includes(`/pages/${itemHandle}`) ||
									pathname.includes(`/collection/${itemHandle}`) ||
									division === itemHandle;

								return (
									<Link
										key={index}
										href={PAGES_PATHS.pageDetail(itemHandle)}
										className={cn(
											"font-black tracking-wide uppercase text-[#262626] hover:text-black text-sm transition-all",
											isActive &&
												"underline decoration-[3px] underline-offset-[6px]",
										)}
									>
										{items.name}
									</Link>
								);
							})
						) : (
							<Skeleton className="w-80 h-9" />
						)}
					</div>
				</div>
				<div className="flex gap-2 items-center md:gap-6">
					<div className="flex gap-2 items-center md:gap-6">
						<div className="px-4 py-3 w-[300px] max-md:hidden">
							<div className="flex items-center px-4 py-3 rounded-lg border border-gray-300">
								<Search className="w-5 h-5 text-gray-400 shrink-0" />
								<input
									placeholder={t("placeholder")}
									className="flex-1 min-w-0 px-3 text-[1.4rem] font-light text-black bg-transparent border-none outline-none placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.3rem]"
								/>
								<button
									type="button"
									className="flex justify-center items-center w-8 h-8 text-white bg-black rounded-lg transition-colors cursor-pointer shrink-0 hover:bg-gray-800"
								>
									<EnterIcon className="w-4 h-4" />
								</button>
							</div>
						</div>
						<div className="max-md:hidden">
							<CurrencySelector />
						</div>

						<div className="flex gap-0 justify-center items-center md:gap-2">
							{NAV_USER_LINKS.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									aria-label="Liste de souhaits"
									className={cn(
										"relative p-3 text-black transition-colors rounded-full hover:bg-gray-100  hover:[&>span]:flex",
									)}
								>
									{item.infos?.count && (
										<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-2 right-2  text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:right-2 lg:bottom-0 lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
											{item.infos.count}
										</p>
									)}
									<item.icon className="" />
								</Link>
							))}
						</div>
						<CartDropdown cart={itemsCart?.items || []} />
					</div>

					<div className="md:hidden">
						<button
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							className="text-gray-600 hover:text-black focus:outline-none"
							aria-label="Ouvrir le menu"
						>
							<Menu className="w-10 h-10" />
						</button>
					</div>
				</div>
				{isMobileMenuOpen && (
					<NavbarResponsive
						close={() => setIsMobileMenuOpen(false)}
						onClick={() => setIsMobileMenuOpen(false)}
						main_category={main_category}
						secondary_category={secondary_category}
						cartItems={itemsCart?.items || []}
					/>
				)}{" "}
			</div>
		</>
	);
};

export default NavBarHeaders;
