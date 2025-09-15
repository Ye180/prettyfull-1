'use client';

import { useState, type FC, type SVGProps, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Cart } from './icons/cart.icon';
import { User } from './icons/user.icon';
import { Heart } from './icons/heart.icon';
import { Search } from './icons/search.icon';
import { Menu } from './icons/menu.icon';

// --- Fonctions et Icônes Utilitaires (pour la prévisualisation) ---
// NOTE: Dans votre projet, vous importeriez 'cn' et vos icônes.
const cn = (...args: any[]) => args.filter(Boolean).join(' ');

interface IconProps extends SVGProps<SVGSVGElement> {}



// --- Composants de Style (CVA) ---
const navLinkVariants = cva(
  "transition-colors duration-300 text-sm",
  {
    variants: {
      variant: {
        default: "text-[#262626] hover:text-black text-[16px]",
        mobile: "block py-2 px-4 text-base text-gray-600 hover:bg-gray-100 rounded",
        icon: "text-[#262626] hover:text-black"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof navLinkVariants> {
  href: string;
  children: ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ className, variant, href, children, ...props }) => {
  // NOTE: Remplacé par <a> pour la prévisualisation. Utilisez <Link> de Next.js dans votre projet.
  return (
    <a href={href} className={cn(navLinkVariants({ variant, className }))} {...props}>
      {children}
    </a>
  );
};


const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white p-8">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <div className="flex items-center space-x-25">
            <a href="/" className="text-[32px] font-bold tracking-wider text-black">SHOPHERE</a>
            <div className=" max-md:hidden flex text-[16px] text-black items-center space-x-6">
              <NavLink href="/collection">Collection</NavLink>
              <NavLink href="/special-offer">Special Offer</NavLink>
              <NavLink href="/store">Store</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="max-md:hidden max-w-md:flex items-center  space-x-4 text-[16px]">
              <NavLink href="/about">About</NavLink>
              <NavLink href="/help">Help</NavLink>
            </div>
            <div className="flex items-center gap-4">
               <NavLink href="/search" variant="icon" aria-label="Rechercher"><Search className="w-8 h-8" /></NavLink>
               <NavLink href="/wishlist" variant="icon" aria-label="Liste de souhaits"><Heart className="w-8 h-8" /></NavLink>
               <NavLink href="/profile" variant="icon" aria-label="Profil"><User className="w-8 h-8" /></NavLink>
               <NavLink href="/cart" variant="icon" aria-label="Panier"><Cart className="w-8 h-8" /></NavLink>
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
          <div className="md:hidden pb-4 space-y-2">
            <NavLink href="/collection" variant="mobile">Collection</NavLink>
            <NavLink href="/special-offer" variant="mobile">Special Offer</NavLink>
            <NavLink href="/store" variant="mobile">Store</NavLink>
            <hr/>
            <NavLink href="/about" variant="mobile">About</NavLink>
            <NavLink href="/help" variant="mobile">Help</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
