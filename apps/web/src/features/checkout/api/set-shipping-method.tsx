"use client";

import { useMutation } from "@tanstack/react-query";

interface SetShippingMethodParams {
	cartId: string;
	shippingOptionId: string;
}

export const useSetShippingMethod = () => {
	return useMutation({
		mutationFn: async ({ shippingOptionId }: SetShippingMethodParams) => {
			return { shipping_option_id: shippingOptionId };
		},
	});
};
