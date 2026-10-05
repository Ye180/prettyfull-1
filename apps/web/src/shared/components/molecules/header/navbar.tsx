"use client";

import { useLogout } from "@/features/auth/api/logout";
import { AuthModal, type AuthMode } from "@/features/auth/components";
import { paths } from "@/lib/routes/paths-en";
import { fetchProfile } from "@/lib/store-api";
import type { StoreCategory } from "@/lib/store-api/types";
import { User } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import BrandLogo from "../core/brand-logo";
import CartDrawer from "./cart-drawer";
import { LocaleCurrencySelector } from "./locale-currency-selector";
import NavCategoryBar from "./nav-category-bar";
import NavbarResponsive from "./navbar-responsive";
import SearchBar from "./search-bar";
import WishlistDrawer from "./wishlist-drawer";

export interface NavBarHeadersProps {
	main_category?: StoreCategory[];
}

const NavBarHeaders = ({ main_category = [] }: NavBarHeadersProps) => {
	const t = useTranslations("Header.nav");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode | null>(null);

	// Session restaurée en mémoire au chargement (voir `SessionBootstrap`) -
	// même clé de cache que la page /account, alimentée par la connexion.
	const { data: profile } = useQuery({
		queryKey: ["customer-profile"],
		queryFn: fetchProfile,
	});
	const { mutate: logout } = useLogout();

	const openAuth = (mode: AuthMode) => {
		setIsMobileMenuOpen(false);
		setAuthMode(mode);
	};

	return (
		<>
			<div className="flex flex-col w-full">
				{/* Row 1 : bandeau gris pleine largeur - burger+recherche (gauche), logo (centre), icônes (droite) */}
				<div className="bg-(--color-surface-card)">
				<div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
					<div className="flex gap-3 items-center">
						<button
							onClick={() => setIsMobileMenuOpen(true)}
							className="p-2 -ml-2 text-black transition-opacity cursor-pointer hover:opacity-70 md:hidden"
							aria-label={t("openMenu")}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							>
								<line x1="3" y1="7" x2="21" y2="7" />
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="17" x2="21" y2="17" />
							</svg>
						</button>

						{/* Recherche - desktop uniquement, la version mobile vit dans le drawer */}
						<div className="hidden w-64 md:block lg:w-104 xl:w-xs">
							<SearchBar variant="minimal" />
						</div>
					</div>

					<Link
						href="/"
						className="flex justify-self-center items-center p-1 transition-opacity hover:opacity-80"
						aria-label={t("homeAriaLabel")}
					>
						<BrandLogo className="text-[2.4rem] sm:text-[3.6rem] lg:text-[4.2rem]" />
					</Link>

					{/* Icônes - droite, façon naturium : compte, favoris, panier */}
					<div className="flex items-center justify-end gap-5 sm:gap-6">
						<div className="max-sm:hidden">
							<LocaleCurrencySelector />
						</div>
						{profile ? (
							<Link
								href={paths.account}
								aria-label={profile.firstName}
								className="text-(--color-ink) transition-opacity hover:opacity-70 max-sm:hidden"
							>
								<User className="size-[22px]" />
							</Link>
						) : (
							<button
								type="button"
								onClick={() => openAuth("login")}
								aria-label={t("login")}
								className="text-(--color-ink) transition-opacity hover:opacity-70 cursor-pointer max-sm:hidden"
							>
								<User className="size-[22px]" />
							</button>
						)}
						<WishlistDrawer />
						<CartDrawer />
					</div>
				</div>
				</div>

				{/* Row 2 : barre de catégories, toujours visible - sous-catégories au survol/clic */}
				<NavCategoryBar main_category={main_category} />
			</div>

			{isMobileMenuOpen && (
				<NavbarResponsive
					close={() => setIsMobileMenuOpen(false)}
					main_category={main_category}
					onOpenAuth={openAuth}
					profile={profile}
					onLogout={() => logout()}
				/>
			)}

			<AuthModal
				open={authMode !== null}
				onClose={() => setAuthMode(null)}
				defaultMode={authMode ?? "login"}
			/>
		</>
	);
};

export default NavBarHeaders;
