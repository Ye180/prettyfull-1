"use client";

import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import type { StoreCategory } from "@/lib/store-api/types";
import { usePathname } from "next/navigation";
import NavDropdown from "./nav-dropdown";

interface NavCategoryBarProps {
	main_category?: StoreCategory[];
}

/**
 * Barre de catégories toujours visible sous le header (desktop) - les
 * sous-catégories apparaissent au survol/clic via `NavDropdown`, plutôt que
 * de forcer un détour par le menu mobile pour les voir.
 */
const NavCategoryBar = ({ main_category = [] }: NavCategoryBarProps) => {
	const pathname = usePathname();

	const navLinks = [
		{ label: "Accueil", href: paths.home, subcategories: [], parentSlug: undefined },
		...main_category.map((cat) => ({
			label: cat.name,
			href: COLLECTION_PATHS.collectionDetail(cat.handle),
			subcategories: (cat.category_children ?? []).map((child) => ({
				name: child.name,
				handle: child.handle,
			})),
			parentSlug: cat.handle,
		})),
	];

	return (
		<nav className="hidden overflow-x-auto justify-center items-center pt-3 pb-4 text-[1.5rem] font-semibold tracking-widest uppercase border-t border-gray-100 md:flex gap-x-10 scrollbar-hide">
			{navLinks.map((link) => {
				const isActive = pathname === link.href;
				return (
					<NavDropdown
						key={link.href}
						label={link.label}
						href={link.href}
						isActive={isActive}
						subcategories={link.subcategories}
						parentSlug={link.parentSlug}
					/>
				);
			})}
		</nav>
	);
};

export default NavCategoryBar;
