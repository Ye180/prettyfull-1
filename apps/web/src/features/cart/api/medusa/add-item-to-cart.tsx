"use client";
import { sdk } from "@/lib/api/sdk";
import { useMutation } from "@tanstack/react-query";

const AddItemToCartMedusa = async (variant_id: string) => {
	const cartId = localStorage.getItem("cart_id");
	if (!cartId) return;

	sdk.store.cart
		.createLineItem(cartId, {
			variant_id,
			quantity: 1,
		})
		.then(({ cart }) => {
			// Utiliser le panier mis à jour
			alert(cart);
		});
};

export const useAddItemToCart = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: AddItemToCartMedusa,
		onSuccess,
		onError,
	});
};
