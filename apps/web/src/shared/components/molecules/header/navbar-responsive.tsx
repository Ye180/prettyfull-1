import { NAV_LINKS } from "@/lib/utils/constants/constants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	NavLink,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import BottomHeader from "./bottom";

const NavbarResponsive = ({
	close,
	onClick,
}: {
	close: () => void;
	onClick: () => void;
}) => {
	const t = useTranslations("headerResponsive");
	return (
		<div
			className="fixed z-40 w-[100vw] pb-4 space-y-10 bg-white  md:hidden top-0 
				right-0 -left-0 h-[100vh] overflow-hidden "
		>
			<div className="relative flex flex-col items-start justify-between p-2 ">
				<button
					// onClick={() => setIsMobileMenuOpen(false)}
					onClick={close}
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
							// onClick={() => setItem("links", link.label)}
							onClick={onClick}
							className="font-semibold text-gray-500 text-[1.8rem]  w-fit hover:text-black hover:bg-white cursor-pointer "
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
					<AccordionItem value="item-12" className="pb-4 space-y-2 md:hidden">
						<AccordionTrigger className=" !font-manrope text-lg font-medium">
							{t("setting")}
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
	);
};

export default NavbarResponsive;
