"use client";

import { shippingOptions } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const SHIPPING_OPTIONS_QUERY_KEY = "shipping-options-for-cart";

export const useGetShippingOptions = (cartId: string | null) => {
	return useQuery({
		queryKey: [SHIPPING_OPTIONS_QUERY_KEY, cartId],
		queryFn: () => Promise.resolve(shippingOptions),
		enabled: !!cartId,
		staleTime: Infinity,
	});
};
