"use client";

import { Category } from "@/features/homepage/api/get-category";
import { PAGES_PATHS } from "@/lib/routes/paths-en";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { setItem } from "@/lib/utils/local-storage";
import { Input, Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import { Currency } from "./currency";
import NavbarResponsive from "./navbar-responsive";
import { useCartStore } from "../../../../../../../packages/store/src/use-cart-store"; // Chemin corrigé
import { useState } from "react";

const NavBarHeaders = ({
	main_category,
	secondary_category,
}: {
	main_category: Category[];
	secondary_category: Category[];
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const t = useTranslations("HomePage.header");

	// --- 2. LIRE LES DONNÉES DU PANIER ---
	const { items } = useCartStore();

	// **CORRECTION** : 'items' peut être 'undefined' au premier chargement.
	// On utilise (items || []) pour éviter l'erreur '.reduce() of undefined'.
	const totalCount = (items || []).reduce(
		(acc, item) => acc + item.quantity,
		0,
	);

	// 3. CRÉER LES LIENS DYNAMIQUES
	const dynamicNavLinks = NAV_USER_LINKS.map((link) => {
		// !! Assurez-vous que '/cart' est le bon href
		if (link.href === "/cart") {
			return {
				...link,
				infos: {
					...link.infos,
					count: totalCount > 0 ? totalCount : undefined, // N'affiche pas 0
				},
			};
		}
		return link; // Retourne les autres liens (compte, favoris)
	});
	// --- FIN DES MODIFICATIONS ---

	return (
		<>
			<div className="relative flex items-center justify-between h-20">
				{/* ... (Partie gauche du header - Logo, catégories) ... */}
				<div className="flex items-center space-x-12 ">
					<Link
						href="/"
						className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue"
					>
						PRETTYFULL
					</Link>
					<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
						{main_category ? (
							main_category.map((items: Category, index: number) => (
								// ... (Votre logique de dropdown de catégorie ici) ...
								<div key={index} className="relative group">
									<Link
										href={PAGES_PATHS.pageDetail(items.slug)}
										onClick={() => setItem("links", items.name)}
										className="font-black text-[#262626] hover:text-black text-[16px] py-4"
									>
										{items.name}
									</Link>
									{/* Menu déroulant pour les enfants */}
									{items.children && items.children.length > 0 && (
										<div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-md py-2 z-10 w-56">
											{items.children.map((child: Category) => (
												<Link
													key={child.id}
													// href={COLLECTION_PATHS.collectionDetail(child.slug)} // Assurez-vous d'importer COLLECTION_PATHS
													href={`/collections/${child.slug}`} // Fallback si non importé
													className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												>
													{child.name}
												</Link>
											))}
										</div>
									)}
								</div>
							))
						) : (
							<Skeleton className="h-9 w-[20rem] " />
						)}
					</div>
				</div>

				{/* ... (Partie droite du header - Icônes) ... */}
				<div className="flex items-center gap-2 md:gap-6">
					<div className="flex items-center gap-2 md:gap-6">
						{/* ... (Input de recherche et Currency) ... */}
						<div className="flex items-center justify-start w-full gap-2 py-1 text-gray-500 border-b border-gray-300 px- outline-gray-700 max-sm:hidden ">
							<Search className="" />
							<Input
								placeholder={t("placeholder")}
								className="h-4 border-none outline-1 text-black font-light px-2 py-4 border-gray-300  text-[1.8rem] max-sm:hidden w-full sm:w-[28rem] placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
							/>
						</div>
						<div className="max-md:hidden">
							<Currency />
						</div>

						{/* 4. UTILISER LES LIENS DYNAMIQUES */}
						<div className="flex items-center justify-center gap-0 md:gap-2">
							{dynamicNavLinks.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									aria-label={item.label || "User Navigation Link"} // Label dynamique
									className={cn(
										"relative p-3 text-black transition-colors rounded-full hover:bg-gray-100  hover:[&>span]:flex" +
											(item.visible ? " relative " : " "),
									)}
								>
									{item.infos?.count && (
										<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-2 right-2  text-center content-center w-[1.5rem] h-[1.5rem] lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:right-2 lg:bottom-0 lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
											{item.infos.count}
										</p>
									)}
									<item.icon className="" />
								</Link>
							))}
						</div>
					</div>

					{/* ... (Menu mobile) ... */}
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