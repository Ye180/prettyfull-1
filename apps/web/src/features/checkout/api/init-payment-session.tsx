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
	// First, get the cart with payment_collection
	const { cart } = await sdk.store.cart.retrieve(cartId, {
		fields: "+payment_collection",
	});

	if (!cart.payment_collection?.id) {
		throw new Error(
			"No payment collection found on cart. Make sure a shipping method has been selected."
		);
	}

	// Initialize payment session on the payment collection
	// The SDK expects the full cart object
	const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
		cart as any,
		{
			provider_id: providerId,
		}
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
