import { HomeIcon } from "../icons/home";
import { ProductListIcon } from "../icons/product-list";

export const LINK_ROUTES = [
	// { name: "Home", path: "/" },
	{ name: "Dashboard", path: "/", icon: HomeIcon },
	// { name: "Add Site content", path: "/add-content", icon: HomeIcon },
	{ name: "Contenu", path: "/site-content", icon: HomeIcon },

	{ name: "Produits", path: "/product-list", icon: ProductListIcon },
	{ name: "Categories", path: "/category", icon: ProductListIcon },
	{ name: "Commandes", path: "/order", icon: ProductListIcon },
	{ name: "Clients", path: "/customer", icon: HomeIcon },

	{ name: "Gérer les avis", path: "/manage-review", icon: ProductListIcon },
];
