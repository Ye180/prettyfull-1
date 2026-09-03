"use client";

import { useMutation } from "@tanstack/react-query";

interface InitPaymentSessionParams {
	cartId: string;
	providerId: string;
}

export const useInitPaymentSession = () => {
	return useMutation({
		mutationFn: async ({ providerId }: InitPaymentSessionParams) => {
			return { id: "fake_payment_collection", provider_id: providerId };
		},
	});
};
