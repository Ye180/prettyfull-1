'use client';

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
  return (
    <a href={href} className={cn(navLinkVariants({ variant, className }))} {...props}>
      {children}
    </a>
  );
};

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
