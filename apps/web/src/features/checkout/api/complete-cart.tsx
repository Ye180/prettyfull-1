"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CompleteCartParams {
	cartId: string;
}

const completeCart = async ({ cartId }: CompleteCartParams) => {
	const result = await sdk.store.cart.complete(cartId);

	// The result contains either the order or an error
	if (result.type === "order") {
		return result.order;
	}

	throw new Error("Failed to complete cart");
};

export const useCompleteCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: completeCart,
		onSuccess: (_, variables) => {
			// Clear cart from cache
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, variables.cartId],
			});
			// Remove cart_id from localStorage after successful order
			if (typeof window !== "undefined") {
				localStorage.removeItem("cart_id");
			}
		},
	});
};
