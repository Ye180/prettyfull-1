'use client';

<<<<<<< HEAD
import { useState, type FC, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Menu } from './icons/menu.icon';
import { Search } from './icons/search.icon';
import { User } from './icons/user.icon';
import { Cart } from './icons/cart.icon';
import { cn } from '@prettyfull/utils';

const navLinkVariants = cva(
  "transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "text-gray-600 hover:text-black",
        mobile: "block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100 rounded",
        icon: "text-gray-600 hover:text-black"
=======
import { useState, type FC, type SVGProps, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Cart } from './icons/cart.icon';
import { User } from './icons/user.icon';
import { Heart } from './icons/heart.icon';
import { Search } from './icons/search.icon';
import { Menu } from './icons/menu.icon';
<<<<<<< HEAD

const cn = (...args: any[]) => args.filter(Boolean).join(' ');

interface IconProps extends SVGProps<SVGSVGElement> {}


=======
>>>>>>> 61b92b3 (feat: finalize footer component)

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
>>>>>>> feature/footer
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
<<<<<<< HEAD
=======
  // NOTE: Remplacé par <a> pour la prévisualisation. Utilisez <Link> de Next.js dans votre projet.
>>>>>>> feature/footer
  return (
    <a href={href} className={cn(navLinkVariants({ variant, className }))} {...props}>
      {children}
    </a>
  );
};

<<<<<<< HEAD
=======

>>>>>>> feature/footer
const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
<<<<<<< HEAD
    <header className="bg-white shadow-sm">
      <div className="bg-black text-white py-2 px-4 text-center text-sm md:text-base">
        <p>Livraison gratuite pour les commandes de plus de 300€ ! Achetez maintenant et profitez de la mode directement chez vous.</p>
      </div>
      <nav className=" mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20  justify-between">
          {/* Liens desktop */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/products">Produits</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
            {/* Bouton mobile */}
=======
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
>>>>>>> feature/footer
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
<<<<<<< HEAD
          {/* Logo centré */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavLink href="/" className="text-2xl font-bold tracking-wider !text-black">SNAELY.</NavLink>
          </div>
          {/* Icônes actions */}
          <div className="flex items-center space-x-5">
            <NavLink href="/search" variant="icon" aria-label="Rechercher">
              <Search className="w-10 h-10" />
            </NavLink>
            <NavLink href="/cart" variant="icon" aria-label="Voir le panier">
              <Cart className="w-10 h-10" />
            </NavLink>
            <NavLink href="/profile" variant="icon" aria-label="Voir le profil">
              <User className="w-10 h-10" />
            </NavLink>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <NavLink href="/products" variant="mobile">Produits</NavLink>
            <NavLink href="/blog" variant="mobile">Blog</NavLink>
            <NavLink href="/contact" variant="mobile">Contact</NavLink>
=======
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <NavLink href="/collection" variant="mobile">Collection</NavLink>
            <NavLink href="/special-offer" variant="mobile">Special Offer</NavLink>
            <NavLink href="/store" variant="mobile">Store</NavLink>
            <hr/>
            <NavLink href="/about" variant="mobile">About</NavLink>
            <NavLink href="/help" variant="mobile">Help</NavLink>
>>>>>>> feature/footer
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
