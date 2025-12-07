import { Category } from "@/features/homepage/api/backend/get-category";
import { COLLECTION_PATHS, PAGES_PATHS } from "@/lib/routes/paths-en";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	NavLink,
	ScrollArea,
	Skeleton,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";

const NavbarResponsive = ({
	close,
	onClick,
	main_category,
	secondary_category,
}: {
	close: () => void;
	onClick: () => void;
	main_category?: Category[];
	secondary_category?: Category[];
}) => {
	// const {
	// 	data: Category,
	// 	isLoading,
	// 	isError,
	// } = useGetCategory({ second: true });
	const t = useTranslations("headerResponsive");
	return (
		<div className="overflow-hidden fixed top-0 right-0 left-0 z-40 pb-4 space-y-4 w-full h-full bg-white md:hidden">
			<div className="flex relative flex-col justify-between items-start p-2 h-fit">
				<button
					onClick={close}
					className="absolute right-5 top-10 text-gray-600 cursor-pointer hover:text-black focus:outline-none"
					aria-label="Fermer le menu"
				>
					<CloseIcon className="w-10 h-10 cursor-pointer" />
				</button>

				<div className="overflow-hidden mt-5 h-fit">
					<Link
						href="/"
						className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue pt-5 px-2"
					>
						PRETTYFULL
					</Link>
					<div className="flex items-center px-2 space-x-6">
						{main_category ? (
							main_category.map((items: Category, index) => (
								<NavLink
									key={index}
									href={PAGES_PATHS.pageDetail(items.handle as string)}
									className="font-extrabold text-[1.7rem]!"
								>
									{items.name}
								</NavLink>
							))
						) : (
							<Skeleton className="w-full h-9" />
						)}
					</div>
				</div>
			</div>

			<ScrollArea className="py-4 border-b-8 h-[90vh] px-4">
				<div className="flex overflow-x-auto flex-col gap-y-2 p-0 px-2 py-4 w-full border-t border-gray-200">
					{secondary_category && secondary_category.length > 0 ? (
						secondary_category.map((items: Category, index: number) => (
							<NavLink
								href={COLLECTION_PATHS.collectionDetail(items.handle as string)}
								key={index}
								className="!text-[1.6rem]! capitalize snap-center w-full py-2 hover:bg-gray-100 rounded-md px-2 font-medium"
							>
								{items.name}
							</NavLink>
						))
					) : (
						<Skeleton className="w-80 h-9" />
					)}
				</div>

				<div className="p-4 border-t border-gray-200">
					<Accordion
						type="single"
						defaultValue="item-1"
						collapsible
						className="w-full text-black"
					>
						<AccordionItem value="item-12" className="pb-4 space-y-2 md:hidden">
							<AccordionTrigger className=" font-manrope! text-lg font-medium">
								{t("setting")}
							</AccordionTrigger>
							<AccordionContent className="pb-8 mt-4 space-y-8">
								<div className="space-y-3">
									{/* <h4 className="!text-[1.8rem] ">Currency</h4> */}
									<div className="flex flex-wrap gap-x-4 mt-0">
										{[
											{ label: "Euro (€)", symbol: "€" },
											{ label: "Dollar ($)", symbol: "$" },
											{ label: "Franc CFA (XOF)", symbol: "FCFA" },
										].map((items, index) => (
											<div
												key={index}
												className="flex gap-3 justify-between items-center px-8 py-3 rounded-md border border-gray-300 transition-all duration-300 cursor-pointer py w-fit hover:bg-black hover:text-white hover:border-black"
											>
												<p className="text-[1.2rem] font-semibold">
													{items.label}
												</p>
											</div>
										))}
									</div>
								</div>
								<div className="px-24 border-b border-gray-100" />

								<div className="mt-2 space-y-3">
									{/* <h4 className="!text-[1.8rem]">Langue</h4> */}
									<div className="flex flex-wrap gap-4 mt-0">
										{[
											{ label: "Anglais", symbol: "AN" },
											{ label: "Français", symbol: "FR" },
										].map((items, index) => (
											<div
												key={index}
												className="flex gap-3 justify-between items-center px-8 py-3 rounded-md border border-gray-300 transition-all duration-300 cursor-pointer w-fit hover:bg-black hover:text-white hover:border-black"
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
			</ScrollArea>
		</div>
	);
};

export default NavbarResponsive;
