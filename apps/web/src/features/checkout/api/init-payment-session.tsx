"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface InitPaymentSessionParams {
	cartId: string;
	providerId: string;
}

const initPaymentSession = async ({
	cartId,
	providerId,
}: InitPaymentSessionParams) => {
	// Retrieve the cart with payment_collection
	const { cart } = await sdk.store.cart.retrieve(cartId, {
		fields: "+payment_collection,+shipping_methods",
	});

	if (!cart.shipping_methods || cart.shipping_methods.length === 0) {
		throw new Error(
			"Aucune méthode de livraison trouvée. Veuillez retourner à l'étape de livraison et sélectionner une méthode.",
		);
	}

	// The JS SDK's initiatePaymentSession handles both:
	// 1. Creating the payment collection if it doesn't exist
	// 2. Initializing the payment session with the chosen provider
	const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
		cart as any,
		{
			provider_id: providerId,
		},
	);

	return payment_collection;
};

export const useInitPaymentSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: initPaymentSession,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, variables.cartId],
			});
		},
	});
};
