import type { AuthMode } from "@/features/auth/components";
import { Category } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import { NAV_INFO_LINKS } from "@/lib/utils/constants/header";
import { Logo, ScrollArea, Skeleton } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createPortal } from "react-dom";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { CurrencySelector } from "./currency-selector";
import SearchBar from "./search-bar";

const NavbarResponsive = ({
	close,
	onClick,
	main_category,
	secondary_category,
	cartItems,
	onOpenAuth,
}: {
	close: () => void;
	onClick: () => void;
	main_category?: Category[];
	secondary_category?: Category[];
	cartItems?: any[];
	onOpenAuth: (mode: AuthMode) => void;
}) => {
	const t = useTranslations("headerResponsive");
	return createPortal(
		<div className="fixed inset-0 z-40 flex justify-end">
			{/* Backdrop — desktop only, mobile stays full-bleed */}
			<button
				aria-label="Fermer le menu"
				onClick={close}
				className="hidden md:block absolute inset-0 bg-black/40 cursor-pointer"
			/>

			<div className="overflow-hidden relative w-full h-full bg-white md:w-[440px] md:shadow-2xl flex flex-col">
				{/* Header avec logo et icônes */}
				<div className="flex justify-between items-center px-4 pt-10 pb-4 border-b border-gray-200 shrink-0">
					<Link href="/" onClick={close}>
						<Logo className="w-48 md:w-56" />
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
				<div className="px-4 py-3 border-b border-gray-100 shrink-0">
					<SearchBar onNavigate={close} />
				</div>

				{/* Catégories principales horizontales */}
				<div className="px-4 py-3 border-b border-gray-100 shrink-0">
					<div className="horizontal-scroll scrollbar-hide space-x-6 uppercase *:whitespace-nowrap">
						<Link
							href={paths.home}
							onClick={close}
							className="font-black text-[1.2rem] tracking-wide text-gray-700 hover:text-black transition-colors"
						>
							Accueil
						</Link>
						{main_category ? (
							main_category.map((items: Category, index) => (
								<Link
									key={index}
									href={COLLECTION_PATHS.collectionDetail(items.handle as string)}
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
				<ScrollArea className="flex-1 px-4">
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

					{/* Auth entry points — the only ones on mobile, since the header's
					 * Login/Sign Up buttons are hidden below the sm breakpoint. */}
					<div className="flex gap-3 border-t border-gray-100 py-4">
						<button
							onClick={() => onOpenAuth("login")}
							className="flex-1 rounded-full border border-gray-200 px-3 py-3 text-[1.4rem] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black cursor-pointer"
						>
							Connexion
						</button>
						<button
							onClick={() => onOpenAuth("register")}
							className="flex-1 rounded-full bg-black px-3 py-3 text-[1.4rem] font-medium text-white transition-colors hover:bg-gray-800 cursor-pointer"
						>
							S'inscrire
						</button>
					</div>

					{/*
					 * Pages d'information, après les rayons : on vient d'abord ici pour
					 * acheter. Le séparateur marque le changement de nature des liens.
					 */}
					<div className="flex flex-col gap-y-1 border-t border-gray-100 py-4">
						{NAV_INFO_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className="w-full rounded-md px-3 py-3 text-[1.4rem] font-normal text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
							>
								{link.label}
							</Link>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>,
		document.body,
	);
};

export default NavbarResponsive;
