import { sdk } from "@/lib/api/sdk";
import { useMutation } from "@tanstack/react-query";

const UpdateQuantity = (itemId: string, quantity: number) => {
	const cartId = localStorage.getItem("cart_id");
	if (!cartId) return;
	sdk.store.cart
		.updateLineItem(cartId, itemId, { quantity })
		.then(({ cart }) => {
			// Utiliser le panier mis à jour
		});
};

export const useUpdateItemInCart = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: UpdateQuantity as any,
		onSuccess,
		onError,
	});
};
