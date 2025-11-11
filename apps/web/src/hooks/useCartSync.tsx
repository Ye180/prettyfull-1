import { useGetCart } from "@/features/cart/api/get-cart-by-userid";
import { useEffect } from "react";
import { useCartStore } from "../../../../packages/store/src/use-cart-store";
import { useAuth } from "./useAuth";

export const useCartSync = () => {
	const { isAuthenticated } = useAuth(); // On peut le garder pour d'autres logiques
	const { data: apiCart, isLoading, isError, isSuccess } = useGetCart();
	const setCart = useCartStore((state) => state.setCart);
	const localCartItems = useCartStore((state) => state.items);

	useEffect(() => {
		// Logique simplifiée :
		// Si la requête (pour loggué OU invité) réussit...
		if (isSuccess) {
			// S'il y a un panier dans l'API, on le charge.
			// S'il n'y en a pas (apiCart est null, ex: 404), on charge un tableau vide.
			setCart(apiCart?.items || []);
		}

		// L'ancienne logique 'else if (!isAuthenticated) { clearCart() }'
		// qui vidait le panier des invités est supprimée.
	}, [apiCart, isSuccess, setCart]); // Dépendances simplifiées

	return {
		cartItems: localCartItems,
		isLoading: isLoading,
		isError: isError,
	};
};
