import { Category } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS, PAGES_PATHS } from "@/lib/routes/paths-en";
import { Logo, ScrollArea, Skeleton } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { EnterIcon } from "../../../../../../../packages/ui/src/icons/enter.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import { CurrencySelector } from "./currency-selector";

const NavbarResponsive = ({
	close,
	onClick,
	main_category,
	secondary_category,
	cartItems,
}: {
	close: () => void;
	onClick: () => void;
	main_category?: Category[];
	secondary_category?: Category[];
	cartItems?: any[];
}) => {
	const t = useTranslations("headerResponsive");
	return (
		<div className="overflow-hidden fixed top-0 right-0 left-0 z-40 w-full h-full bg-white md:hidden">
			{/* Header avec logo et icônes */}
			<div className="flex justify-between items-center px-4 pt-10 pb-4 border-b border-gray-200">
				<Link href="/" onClick={close}>
					<Logo className="w-68" />
				</Link>

				<div className="flex gap-2 items-center">
					<div className="">
						<CurrencySelector />
					</div>

					{/* Close button */}
					<button
						onClick={close}
						className="p-2 text-gray-600 cursor-pointer hover:text-black focus:outline-none"
						aria-label="Fermer le menu"
					>
						<CloseIcon className="w-10 h-10" />
					</button>
				</div>
			</div>

			{/* Barre de recherche */}
			<div className="px-4 py-3 border-b border-gray-100">
				<div className="flex items-center px-4 py-3 rounded-lg border border-gray-300">
					<Search className="w-5 h-5 text-gray-400 shrink-0" />
					<input
						placeholder="Search for products..."
						className="flex-1 min-w-0 px-3 text-[1.4rem] font-light text-black bg-transparent border-none outline-none placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.3rem]"
					/>
					<button
						type="button"
						className="flex justify-center items-center w-8 h-8 text-white bg-black rounded-lg transition-colors shrink-0 hover:bg-gray-800"
					>
						<EnterIcon className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Catégories principales horizontales */}
			<div className="px-4 py-3 border-b border-gray-100">
				<div className="horizontal-scroll scrollbar-hide space-x-6 uppercase *:whitespace-nowrap">
					{main_category ? (
						main_category.map((items: Category, index) => (
							<Link
								key={index}
								href={PAGES_PATHS.pageDetail(items.handle as string)}
								onClick={close}
								className="font-black text-[1.2rem] tracking-wide text-gray-700 hover:text-black transition-colors"
							>
								{items.name}
							</Link>
						))
					) : (
						<Skeleton className="w-full h-9" />
					)}
				</div>
			</div>

			{/* Catégories secondaires scrollables */}
			<ScrollArea className="h-[calc(100vh-280px)] px-4">
				<div className="flex flex-col gap-y-1 py-4">
					{secondary_category && secondary_category.length > 0 ? (
						secondary_category.map((items: Category, index: number) => (
							<Link
								href={COLLECTION_PATHS.collectionDetail(items.handle as string)}
								key={index}
								onClick={close}
								className="text-[1.4rem] capitalize w-full py-3 px-3 hover:bg-gray-50 rounded-md font-normal text-gray-700 hover:text-black transition-colors"
							>
								{items.name}
							</Link>
						))
					) : (
						<Skeleton className="w-full h-9" />
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default NavbarResponsive;
