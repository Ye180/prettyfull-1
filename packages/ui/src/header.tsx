"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useState, type FC, type ReactNode, type SVGProps } from "react";
import { Cart } from "./icons/cart.icon";
import { Heart } from "./icons/heart.icon";
import { Menu } from "./icons/menu.icon";
import { Search } from "./icons/search.icon";
import { UserIcon } from "./icons/user.icon";

// --- Fonctions et Icônes Utilitaires (pour la prévisualisation) ---
// NOTE: Dans votre projet, vous importeriez 'cn' et vos icônes.
const cn = (...args: any[]) => args.filter(Boolean).join(" ");

interface IconProps extends SVGProps<SVGSVGElement> {}

// --- Composants de Style (CVA) ---
const navLinkVariants = cva("transition-colors duration-300 text-sm", {
	variants: {
		variant: {
			default: "text-[#262626] hover:text-black text-[16px]",
			mobile:
				"block py-2 px-4 text-base text-gray-600 hover:bg-gray-100 rounded",
			icon: "text-[#262626] hover:text-black",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface NavLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof navLinkVariants> {
	href: string;
	children: ReactNode;
}

const NavLink: FC<NavLinkProps> = ({
	className,
	variant,
	href,
	children,
	...props
}) => {
	// NOTE: Remplacé par <a> pour la prévisualisation. Utilisez <Link> de Next.js dans votre projet.
	return (
		<a
			href={href}
			className={cn(navLinkVariants({ variant, className }))}
			{...props}
		>
			{children}
		</a>
	);
};

const Header: FC = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="p-8 bg-white">
			<nav className="px-4 mx-auto sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					<div className="flex items-center space-x-25">
						<Link
							href="/"
							className="text-[4.5rem] font-bold tracking-wider text-black font-bebas-neue"
						>
							PRETTYFULL
						</Link>
						<div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
							{[
								{ href: "/collection", label: "Collection" },
								{ href: "/special-offer", label: "Special Offer" },
								{ href: "/store", label: "Store" },
							].map((link) => (
								<NavLink key={link.href} href={link.href}>
									{link.label}
								</NavLink>
							))}
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-4">
							<NavLink href="/search" variant="icon" aria-label="Rechercher">
								<Search className="w-8 h-8" />
							</NavLink>
							<NavLink
								href="/wishlist"
								variant="icon"
								aria-label="Liste de souhaits"
							>
								<Heart className="w-8 h-8" />
							</NavLink>
							<NavLink href="/profile" variant="icon" aria-label="Profil">
								<UserIcon className="w-8 h-8" />
							</NavLink>
							<NavLink href="/cart" variant="icon" aria-label="Panier">
								<Cart className="w-8 h-8" />
							</NavLink>
						</div>
						<div className="md:hidden">
							<button
								onClick={() => setIsMobileMenuOpen((prev) => !prev)}
								className="text-gray-600 hover:text-black focus:outline-none"
								aria-label="Ouvrir le menu"
							>
								<Menu className="w-6 h-6" />
							</button>
						</div>
					</div>
				</div>

				{isMobileMenuOpen && (
					<div className="pb-4 space-y-2 md:hidden">
						<NavLink href="/collection" variant="mobile">
							Collection
						</NavLink>
						<NavLink href="/special-offer" variant="mobile">
							Special Offer
						</NavLink>
						<NavLink href="/store" variant="mobile">
							Store
						</NavLink>
						<hr />
						<NavLink href="/about" variant="mobile">
							About
						</NavLink>
						<NavLink href="/help" variant="mobile">
							Help
						</NavLink>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
