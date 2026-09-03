"use client";

import { paymentProviders } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const PAYMENT_PROVIDERS_QUERY_KEY = "payment-providers";

export const useGetPaymentProviders = (regionId: string | null) => {
	return useQuery({
		queryKey: [PAYMENT_PROVIDERS_QUERY_KEY, regionId],
		queryFn: () => Promise.resolve(paymentProviders),
		enabled: !!regionId,
	});
};
