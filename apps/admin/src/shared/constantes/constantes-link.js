import { HomeIcon } from "../icons/home";
import { ProductListIcon } from "../icons/product-list";

export const LINK_ROUTES = [
	// { name: "Home", path: "/" },
	{ name: "Dashboard", path: "/", icon: HomeIcon },
	{ name: "Site content", path: "/site-content", icon: HomeIcon },
	{ name: "Order", path: "/order", icon: ProductListIcon },
	{ name: "Product List", path: "/product-list", icon: ProductListIcon },

	{ name: "Add Product", path: "/add-product", icon: HomeIcon },
	{ name: "Category", path: "/category", icon: ProductListIcon },
	{ name: "Customer", path: "/customer", icon: HomeIcon },

	{ name: "Manage Review", path: "/manage-review", icon: ProductListIcon },
	{ name: "Gestion Accueil", path: "/homepage", icon: HomeIcon },
];
