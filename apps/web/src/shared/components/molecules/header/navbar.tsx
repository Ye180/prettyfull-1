"use client";

import { NAV_LINKS } from "@/lib/utils/constants/constants";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { setItem } from "@/lib/utils/local-storage";
import { Input, NavLink } from "@prettyfull/ui";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import { Currency } from "./currency";

const NavBarHeaders = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="relative flex items-center justify-between h-20">
			<div className="flex items-center space-x-12 ">
				<Link
					href="/"
					className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue"
				>
					PRETTYFULL
				</Link>
				<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
					{NAV_LINKS.map((link, index) => (
						<NavLink
							key={index}
							href={link.href}
							onClick={() => setItem("links", link.label)}
							className="font-semibold"
						>
							{link.label}
						</NavLink>
					))}
				</div>
			</div>
			<div className="flex items-center gap-2 md:gap-6">
				<div className="flex items-center gap-2 md:gap-6">
					<div className="flex items-center justify-start gap-2 py-1 text-gray-500 border-b border-gray-300 px- outline-gray-700 max-sm:hidden w-fit">
						<Search className="" />
						<Input
							placeholder="Rechercher..."
							className="h-4 border-none outline-1 text-black font-light px-2 py-4 border-gray-300 focus:ring-0 focus:border-none  text-[1.8rem] max-sm:hidden w-[20rem] sm:w-[28rem] placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem]"
						/>
					</div>
					<div>
						<Currency />
					</div>

					<div className="flex items-center justify-center gap-0 md:gap-2">
						{NAV_USER_LINKS.map((item, index) => (
							<NavLink
								key={index}
								href={item.href}
								variant="icon"
								aria-label="Liste de souhaits"
								className="relative p-3 text-black transition-colors rounded-full hover:bg-gray-100"
							>
								{item.infos?.count && (
									<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-2 right-2  text-center content-center w-[1.5rem] h-[1.5rem] lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:right-0 lg:bottom-0 lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
										{item.infos.count}
									</p>
								)}
								<item.icon />
							</NavLink>
						))}
					</div>
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
				{/* <Drawer>
					<DrawerTrigger asChild>
						<Menu className="w-6 h-6" />
					</DrawerTrigger>
					<DrawerContent
						position="left"
						className="w-full p-5 border-none outline-none  md:hidden lg:hidden xl:hidden 2xl:hidden max-h-[90%] left"
					>
						<div className=" overflow-x-scroll scrollbar-hide h-[90%] rounded-lg p-4">
							<NavLink href="/collection" variant="mobile">
								Collection
							</NavLink>
							<NavLink href="/special-offer" variant="mobile">
								Special Offer
							</NavLink>
							<NavLink href="/store" variant="mobile">
								Store
							</NavLink>
							
							<NavLink href="/about" variant="mobile">
								About
							</NavLink>
							<NavLink href="/help" variant="mobile">
								Help
							</NavLink>
						</div>
					</DrawerContent>
				</Drawer> */}
			</div>
			{isMobileMenuOpen && (
				<div className="absolute z-50 w-[100vw] pb-4 space-y-2 bg-white border-b border-gray-200 md:hidden top-20 right-0 -left-4 h-[100vh] ">
					<NavLink href="/collection" variant="mobile">
						Collection
					</NavLink>
					<NavLink href="/special-offer" variant="mobile">
						Special Offer
					</NavLink>
					<NavLink href="/store" variant="mobile">
						Store
					</NavLink>
					{/* <hr /> */}
					<NavLink href="/about" variant="mobile">
						About
					</NavLink>
					<NavLink href="/help" variant="mobile">
						Help
					</NavLink>
				</div>
			)}{" "}
		</div>
	);
};

export default NavBarHeaders;
