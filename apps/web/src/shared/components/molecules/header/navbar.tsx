"use client";

import { NAV_LINKS } from "@/lib/utils/constants/constants";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { setItem } from "@/lib/utils/local-storage";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Input,
	NavLink,
} from "@prettyfull/ui";
import Link from "next/link";
import { useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import BottomHeader from "./bottom";
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
					<div className="max-md:hidden">
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
								<item.icon className="" />
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
						<Menu className="w-10 h-10" />
					</button>
				</div>
			</div>
			{isMobileMenuOpen && (
				<div
					className="fixed z-50 w-[100vw] pb-4 space-y-10 bg-white  md:hidden top-0 
				right-0 -left-0 h-[100vh] overflow-hidden "
				>
					<div className="relative flex flex-col items-start justify-between p-2 ">
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="absolute text-gray-600 cursor-pointer right-5 top-10 hover:text-black focus:outline-none "
							aria-label="Fermer le menu"
						>
							<CloseIcon className="w-10 h-10 cursor-pointer" />
						</button>
						<Link
							href="/"
							className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue pt-5 px-2"
						>
							PRETTYFULL
						</Link>
						<div className="flex flex-col w-full p-0 mt-4 space-y-4 ">
							{NAV_LINKS.map((link, index) => (
								<NavLink
									key={index}
									href={link.href}
									onClick={() => setItem("links", link.label)}
									className="font-semibold text-gray-500 text-[1.8rem]  w-fit hover:text-black hover:bg-none cursor-pointer "
									variant="mobile"
								>
									{link.label}
								</NavLink>
							))}
						</div>
					</div>
					<BottomHeader className="px-4 max-sm:flex" className_2="flex-wrap" />

					<div className="p-4 border-t border-gray-200">
						<Accordion
							type="single"
							defaultValue="item-1"
							collapsible
							className="w-full text-black"
						>
							<AccordionItem
								value="item-12"
								className="pb-4 space-y-2 md:hidden"
							>
								<AccordionTrigger className=" !font-manrope text-lg font-medium">
									Reglages
								</AccordionTrigger>
								<AccordionContent className="pb-8 mt-4 space-y-8 ">
									<div className="space-y-3 ">
										{/* <h4 className="!text-[1.8rem] ">Currency</h4> */}
										<div className="flex flex-wrap mt-0 gap-x-4">
											{[
												{ label: "Euro (€)", symbol: "€" },
												{ label: "Dollar ($)", symbol: "$" },
												{ label: "Franc CFA (XOF)", symbol: "FCFA" },
											].map((items, index) => (
												<div
													key={index}
													className="flex items-center justify-between gap-3 px-8 py-3 transition-all duration-300 border border-gray-300 rounded-md cursor-pointer py w-fit hover:bg-black hover:text-white hover:border-black"
												>
													<p className="text-[1.2rem] font-semibold">
														{items.label}
													</p>
												</div>
											))}
										</div>
									</div>
									<div className="px-[6rem] border-b border-gray-100" />

									<div className="mt-2 space-y-3">
										{/* <h4 className="!text-[1.8rem]">Langue</h4> */}
										<div className="flex flex-wrap gap-4 mt-0">
											{[
												{ label: "Anglais", symbol: "AN" },
												{ label: "Français", symbol: "FR" },
											].map((items, index) => (
												<div
													key={index}
													className="flex items-center justify-between gap-3 px-8 py-3 transition-all duration-300 border border-gray-300 rounded-md cursor-pointer w-fit hover:bg-black hover:text-white hover:border-black"
												>
													<p className="text-[1.2rem] font-semibold">
														{items.label} ({items.symbol})
													</p>
												</div>
											))}
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			)}{" "}
		</div>
	);
};

export default NavBarHeaders;
