"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

const PAYMENT_PROVIDERS_QUERY_KEY = "payment-providers";

const getPaymentProviders = async (regionId: string) => {
	const { payment_providers } = await sdk.store.payment.listPaymentProviders({
		region_id: regionId,
	});

	return payment_providers;
};

export const useGetPaymentProviders = (regionId: string | null) => {
	return useQuery({
		queryKey: [PAYMENT_PROVIDERS_QUERY_KEY, regionId],
		queryFn: () => getPaymentProviders(regionId!),
		enabled: !!regionId,
	});
};
