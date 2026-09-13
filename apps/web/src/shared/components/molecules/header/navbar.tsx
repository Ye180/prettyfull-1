"use client";

import { AuthModal, type AuthMode } from "@/features/auth/components";
import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import { useCartStore } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartDrawer from "./cart-drawer";
import { CurrencySelector } from "./currency-selector";
import NavbarResponsive from "./navbar-responsive";
import WishlistDrawer from "./wishlist-drawer";

export interface NavBarHeadersProps {
	main_category?: any[];
	secondary_category?: any[];
}

const NavBarHeaders = ({
	main_category = [],
	secondary_category = [],
}: NavBarHeadersProps) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode | null>(null);
	const pathname = usePathname();
	const items = useCartStore((state) => state.items);

	const openAuth = (mode: AuthMode) => {
		setIsMobileMenuOpen(false);
		setAuthMode(mode);
	};

	// ponytail: categories come straight from the backend (however many there
	// are) instead of a hardcoded Men/Ladies/New Collection list — "Home" is
	// pinned first so the nav always offers a way back regardless of category count.
	const navLinks = [
		{ label: "Home", href: paths.home },
		...main_category.map((cat: any) => ({
			label: cat.name,
			href: COLLECTION_PATHS.collectionDetail(cat.handle),
		})),
	];

	return (
		<>
			<div className="grid grid-cols-[1fr_auto_1fr] items-center h-20 w-full">
				{/* Navigation Links — Left */}
				<nav className="flex items-center flex-wrap gap-x-8 gap-y-1 text-[1.4rem] font-medium max-md:hidden">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"text-[#111111] hover:text-black transition-colors",
									isActive && "text-black font-semibold",
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Mobile left placeholder / spacer */}
				<div className="md:hidden flex items-center">
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className="p-2 -ml-2 text-black hover:opacity-70 transition-opacity cursor-pointer"
						aria-label="Ouvrir le menu"
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
				</div>

				{/* Brand Logo — Center */}
				<Link
					href="/"
					className="justify-self-center flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
					aria-label="Prettyfull Accueil"
				>
					<Image src="/assets/logo.png" alt="Prettyfull" width={140} height={32} className="h-6 w-auto sm:h-7" priority />
				</Link>

				{/* Actions — Right */}
				<div className="flex items-center justify-end space-x-6 text-[1.4rem] font-medium">
					<div className="max-md:hidden">
						<CurrencySelector />
					</div>
					<WishlistDrawer />
					<CartDrawer />

					<div className="flex items-center space-x-4 max-sm:hidden">
						<button
							onClick={() => openAuth("login")}
							className="text-[#111111] hover:text-black transition-colors cursor-pointer"
						>
							Login
						</button>
						<button
							onClick={() => openAuth("register")}
							className="text-[#111111] hover:text-black transition-colors cursor-pointer"
						>
							Sign Up
						</button>
					</div>
				</div>
			</div>

			{isMobileMenuOpen && (
				<NavbarResponsive
					close={() => setIsMobileMenuOpen(false)}
					onClick={() => setIsMobileMenuOpen(false)}
					main_category={main_category}
					secondary_category={secondary_category}
					cartItems={items}
					onOpenAuth={openAuth}
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
