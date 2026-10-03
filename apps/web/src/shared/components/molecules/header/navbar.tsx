"use client";

import { useLogout } from "@/features/auth/api/logout";
import { AuthModal, type AuthMode } from "@/features/auth/components";
import { paths } from "@/lib/routes/paths-en";
import { fetchProfile } from "@/lib/store-api";
import type { StoreCategory } from "@/lib/store-api/types";
import { LogOut, User } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
				{/* Row 1 : burger+recherche (gauche), logo (centre), actions (droite) */}
				<div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center py-5 sm:py-6 ">
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
						<Image
							src="/assets/logo.png"
							alt="Prettyfull"
							width={200}
							height={46}
							className="w-auto h-10 sm:h-12"
							priority
						/>
					</Link>

					{/* Actions - droite */}
					<div className="flex items-center justify-end space-x-6 text-[1.5rem] font-medium">
						<LocaleCurrencySelector />
						<WishlistDrawer />
						<CartDrawer />

						<div className="flex items-center space-x-4 max-sm:hidden">
							{profile ? (
								<>
									<Link
										href={paths.account}
										className="flex items-center gap-1.5 text-[#111111] hover:text-black transition-colors"
									>
										<User className="w-[20px] h-[20px]" />
										{profile.firstName}
									</Link>
									<button
										onClick={() => logout()}
										className="flex items-center gap-1.5 text-[#111111] hover:text-black transition-colors cursor-pointer"
									>
										<LogOut className="w-[20px] h-[20px]" />
										{t("logout")}
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => openAuth("login")}
										className="text-[#111111] hover:text-black transition-colors cursor-pointer"
									>
										{t("login")}
									</button>
									<button
										onClick={() => openAuth("register")}
										className="text-[#111111] hover:text-black transition-colors cursor-pointer"
									>
										{t("register")}
									</button>
								</>
							)}
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
