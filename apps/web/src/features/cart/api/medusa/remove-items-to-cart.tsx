import { sdk } from "@/lib/api/sdk";
import { useMutation } from "@tanstack/react-query";

const removeItem = (itemId: string) => {
	const cartId = localStorage.getItem("cart_id");
	if (!cartId) return;
	sdk.store.cart.deleteLineItem(cartId, itemId).then(({ parent: cart }) => {
		// Utiliser le panier mis à jour
		console.log(cart);
	});
};

export const useRemoveItemsToCart = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: removeItem as any,
		onSuccess,
		onError,
	});
};
