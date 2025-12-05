"use client";

import { useGetItemsCart } from "@/features/cart/api/medusa/get-items-cart";
import { Category } from "@/features/homepage/api/backend/get-category";
import { PAGES_PATHS } from "@/lib/routes/paths-en";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { Input, Logo, Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
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

	// Initialize cart ID from localStorage on client side only
	useEffect(() => {
		const storedCartId = localStorage.getItem("cart_id");
		if (storedCartId) {
			setCartId(storedCartId);
		}
	}, []);

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
					<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
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
												"underline decoration-[3px] underline-offset-[6px]"
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
						<div className="flex gap-2 justify-start items-center px-6 py-3 w-full text-gray-500 rounded-2xl border border-gray-300 px- outline-gray-700 max-sm:hidden lg:w-140">
							<Search className="" />
							<Input
								placeholder={t("placeholder")}
								className="h-4  border-none outline-1 text-black font-light px-2 py-4 border-gray-300  text-[1.6rem] max-sm:hidden w-full sm:w-full placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
							/>
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
										"relative p-3 text-black transition-colors rounded-full hover:bg-gray-100  hover:[&>span]:flex"
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
					/>
				)}{" "}
			</div>
		</>
	);
};

export default NavBarHeaders;
