"use client";

import { Category } from "@/features/homepage/api/medusa/get-category";
import { PAGES_PATHS } from "@/lib/routes/paths-en";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { Logo, Skeleton } from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import CartDropdown from "./carte-dropdown";
import { CurrencySelector } from "./currency-selector";
import NavbarResponsive from "./navbar-responsive";
import SearchBar from "./search-bar";

const NavBarHeaders = ({
	main_category,
	secondary_category,
}: {
	main_category: Category[];
	secondary_category: Category[];
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const [division] = useQueryState("division");

	const items = useCartStore((state) => state.items);

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
						<div className="py-3 w-[400px] lg:w-[400px] max-md:hidden">
							<SearchBar />
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
						<CartDropdown cart={items} />
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
						cartItems={items}
					/>
				)}{" "}
			</div>
		</>
	);
};

export default NavBarHeaders;
