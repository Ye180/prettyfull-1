"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateCartRegionParams {
	cartId: string;
	regionId: string;
}

const updateCartRegion = async ({
	cartId,
	regionId,
}: UpdateCartRegionParams) => {
	const { cart } = await sdk.store.cart.update(cartId, {
		region_id: regionId,
	});

	return cart;
};

export const useUpdateCartRegion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCartRegion,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, variables.cartId],
			});
		},
	});
};
