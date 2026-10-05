"use client";

import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import type { StoreCategory } from "@/lib/store-api/types";
import { useTranslations } from "next-intl";
import { cn, getMediaUrl } from "@prettyfull/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavMegaMenu from "./nav-mega-menu";
import { buildNavPromoTiles, navLabel } from "./nav-promo-tiles";

interface NavCategoryBarProps {
	main_category?: StoreCategory[];
}

/**
 * Barre de catégories toujours visible sous le header (desktop) : au
 * survol/focus d'un rayon ayant des sous-rayons, un mega-menu se déploie en
 * dessous de toute la barre (pas seulement sous le lien) - c'est pourquoi
 * l'état "ouvert" vit ici plutôt que dans chaque lien.
 */
const NavCategoryBar = ({ main_category = [] }: NavCategoryBarProps) => {
	const pathname = usePathname();
	const t = useTranslations("Header.nav");
	const [activeHandle, setActiveHandle] = useState<string | null>(null);

	const navLinks = [
		{ label: t("bestSellersNav"), href: paths.collections, subcategories: [], parentSlug: undefined },
		...main_category.map((cat) => ({
			label: navLabel(cat),
			href: COLLECTION_PATHS.collectionDetail(cat.handle),
			subcategories: (cat.category_children ?? []).map((child) => ({
				name: child.name,
				handle: child.handle,
			})),
			parentSlug: cat.handle,
		})),
	];

	const activeLink = navLinks.find((link) => link.parentSlug === activeHandle);
	const activeCategory = main_category.find((cat) => cat.handle === activeHandle);
	const activeImage = getMediaUrl(activeCategory?.product_category_image?.[0]?.url);
	const promoTiles = [
		...(activeLink && activeImage
			? [{ title: activeLink.label, subtitle: t("shopAll", { name: activeLink.label }), image: activeImage, href: activeLink.href }]
			: []),
		...buildNavPromoTiles(main_category, t, activeHandle ?? undefined),
	].slice(0, 2);

	return (
		<div
			className="relative hidden border-b border-(--color-surface-border) bg-white md:block"
			onMouseLeave={() => setActiveHandle(null)}
		>
			<nav className="flex items-center justify-center gap-x-8 overflow-x-auto px-6 font-display text-[1.8rem] text-(--color-ink) scrollbar-hide lg:gap-x-10">
				{navLinks.map((link) => {
					const isActive = pathname === link.href;
					const hasChildren = link.subcategories.length > 0;
					const isOpen = hasChildren && activeHandle === link.parentSlug;
					return (
						<div
							key={link.href}
							onMouseEnter={() => setActiveHandle(hasChildren ? (link.parentSlug ?? null) : null)}
							onFocus={() => setActiveHandle(hasChildren ? (link.parentSlug ?? null) : null)}
						>
							<Link
								href={link.href}
								className={cn(
									"flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent py-4 transition-colors hover:border-(--color-ink)",
									(isActive || isOpen) && "border-(--color-ink)",
								)}
							>
								{link.label}
								{hasChildren && (
									<svg
										width="10"
										height="10"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={cn("shrink-0 transition-transform", isOpen && "rotate-180")}
										aria-hidden="true"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								)}
							</Link>
						</div>
					);
				})}
			</nav>

			{activeLink && activeLink.subcategories.length > 0 && (
				<div className="absolute inset-x-0 top-full z-50">
					<NavMegaMenu
						label={activeLink.label}
						href={activeLink.href}
						parentSlug={activeLink.parentSlug}
						subcategories={activeLink.subcategories}
						promoTiles={promoTiles}
						onNavigate={() => setActiveHandle(null)}
					/>
				</div>
			)}
		</div>
	);
};

export default NavCategoryBar;
