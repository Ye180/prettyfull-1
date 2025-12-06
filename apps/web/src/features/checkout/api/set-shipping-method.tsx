"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SetShippingMethodParams {
	cartId: string;
	shippingOptionId: string;
}

const setShippingMethod = async ({
	cartId,
	shippingOptionId,
}: SetShippingMethodParams) => {
	const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
		option_id: shippingOptionId,
	});

	return cart;
};

export const useSetShippingMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: setShippingMethod,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, variables.cartId],
			});
		},
	});
};
