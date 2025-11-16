import { LucideHome, ShoppingBag, Sidebar } from "lucide-react";
import { CategoryIcon } from "../icons/category.icon";
import DeliveryIcon from "../icons/order.icon";
import ReviewsIcon from "../icons/reviews.icon";
import CustomerIcon from "../icons/user.icon";

export const LINK_ROUTES = [
	// { name: "Home", path: "/" },
	{ name: "Dashboard", path: "/", icon: LucideHome },
	// { name: "Add Site content", path: "/add-content", icon: HomeIcon },
	{ name: "Contenu", path: "/sites-content", icon: Sidebar },

	{ name: "Produits", path: "/products", icon: ShoppingBag },
	{ name: "Categories", path: "/categories", icon: CategoryIcon },
	{ name: "Commandes", path: "/order", icon: DeliveryIcon },
	{ name: "Clients", path: "/customer", icon: CustomerIcon },

	{
		name: "Gérer les avis",
		path: "/manage-review",
		icon: ReviewsIcon,
	},
];

{
	<ShoppingBag strokeWidth={1} />;
	/* <ShoppingBag />; */
}
