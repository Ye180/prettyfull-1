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
	// First, get the cart with payment_collection and shipping_methods
	let { cart } = await sdk.store.cart.retrieve(cartId, {
		fields: "+payment_collection,+shipping_methods",
	});

	// If no payment collection exists, try to create one by updating the cart
	// In Medusa v2, payment collection should be created automatically when shipping method is added
	// But sometimes we need to trigger it manually
	if (!cart.payment_collection?.id) {
		// Verify shipping method exists
		if (!cart.shipping_methods || cart.shipping_methods.length === 0) {
			throw new Error(
				"Aucune méthode de livraison trouvée. Veuillez retourner à l'étape de livraison et sélectionner une méthode.",
			);
		}

		// Try to trigger payment collection creation by updating the cart
		// This is a workaround for Medusa v2
		await sdk.store.cart.update(cartId, {
			// Update with the same email to trigger payment collection creation
			email: cart.email,
		});

		// Wait a moment for the payment collection to be created
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Retrieve the cart again
		const result = await sdk.store.cart.retrieve(cartId, {
			fields: "+payment_collection",
		});
		cart = result.cart;

		if (!cart.payment_collection?.id) {
			throw new Error(
				"La collection de paiement n'a pas pu être créée automatiquement. Veuillez contacter le support.",
			);
		}
	}

	// Initialize payment session on the payment collection
	// The SDK expects the full cart object
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
