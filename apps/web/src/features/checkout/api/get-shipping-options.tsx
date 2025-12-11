"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

const SHIPPING_OPTIONS_QUERY_KEY = "shipping-options-for-cart";

const getShippingOptionsForCart = async (cartId: string) => {
	const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
		cart_id: cartId,
	});

	return shipping_options;
};

export const useGetShippingOptions = (cartId: string | null) => {
	return useQuery({
		queryKey: [SHIPPING_OPTIONS_QUERY_KEY, cartId],
		queryFn: () => getShippingOptionsForCart(cartId!),
		enabled: !!cartId,
		retry: 2,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};
