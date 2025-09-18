"use client";

import { NAV_LINKS } from "@/lib/utils/constants";
import { NavLink } from "@prettyfull/ui";
import Link from "next/link";
import { useState, type FC } from "react";
import { Heart } from "../../../../../../packages/ui/src/icons/heart.icon";
import { Menu } from "../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../packages/ui/src/icons/search.icon";
import { UserIcon } from "../../../../../../packages/ui/src/icons/user.icon";
import { Input } from "../../../../../../packages/ui/src/input";
import { Cart } from "../../../components/icons/cart.icon";

const Header: FC = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="py-8 bg-white border-b border-gray-200 ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<div className="flex items-center justify-between h-20">
					<div className="flex items-center space-x-12 ">
						<Link
							href="/"
							className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue"
						>
							PRETTYFULL
						</Link>
						<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
							{NAV_LINKS.map((link, index) => (
								<NavLink key={index} href={link.href} className="font-semibold">
									{link.label}
								</NavLink>
							))}
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-8">
							<div className="flex items-center px-4 text-gray-500 border border-gray-300 rounded-lg py- max-md:hidden ">
								<Search />
								<Input
									placeholder="Rechercher..."
									className="h-4 border-none outline-1  border-gray-300 focus:ring-0 focus:border-none text-[1.6rem] max-md:hidden w-[20rem] lg:w-[28rem]"
								/>
							</div>
							<NavLink
								href="/wishlist"
								variant="icon"
								aria-label="Liste de souhaits"
							>
								<Heart className="w-8 h-8" />
							</NavLink>
							<NavLink href="/profile" variant="icon" aria-label="Profil">
								<UserIcon className="w-8 h-8" />
							</NavLink>
							<NavLink href="/cart" variant="icon" aria-label="Panier">
								<Cart className="w-8 h-8" />
							</NavLink>
						</div>
						<div className="md:hidden">
							<button
								onClick={() => setIsMobileMenuOpen((prev) => !prev)}
								className="text-gray-600 hover:text-black focus:outline-none"
								aria-label="Ouvrir le menu"
							>
								<Menu className="w-6 h-6" />
							</button>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-start gap-6 mt-4  text-[1.5rem] max-md:hidden">
					{[
						{ href: "/collection", label: "Tailleur GT" },
						{ href: "/special-offer", label: "Jooging" },
						{ href: "/store", label: "Decembre" },
						{ href: "/store", label: "Zara Shoes" },
						{ href: "/store", label: "Herve Leger" },
						{ href: "/store", label: "Accessoires" },
						{ href: "/store", label: "Sexy-hot" },
					].map((link, index) => (
						<NavLink href={link.href} key={index} className="!text-[1.6rem]">
							{" "}
							{link.label}
						</NavLink>
					))}
				</div>

				{/* {isMobileMenuOpen && (
					<div className="pb-4 space-y-2 md:hidden">
						<NavLink href="/collection" variant="mobile">
							Collection
						</NavLink>
						<NavLink href="/special-offer" variant="mobile">
							Special Offer
						</NavLink>
						<NavLink href="/store" variant="mobile">
							Store
						</NavLink>
						<hr />
						<NavLink href="/about" variant="mobile">
							About
						</NavLink>
						<NavLink href="/help" variant="mobile">
							Help
						</NavLink>
					</div>
				)} */}
			</nav>
		</header>
	);
};

export default Header;
