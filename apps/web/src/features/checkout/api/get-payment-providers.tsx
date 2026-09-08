"use client";

import { fetchPaymentOptions } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

const PAYMENT_PROVIDERS_QUERY_KEY = "payment-providers";

/**
 * Moyens de paiement réellement disponibles.
 *
 * L'API n'expose que les agrégateurs activés **et** complètement configurés :
 * un prestataire dont les clés manquent n'apparaît pas, plutôt que d'échouer
 * au clic.
 */
export const useGetPaymentProviders = () =>
	useQuery({
		queryKey: [PAYMENT_PROVIDERS_QUERY_KEY],
		queryFn: async () => {
			const options = await fetchPaymentOptions();
			return options.map((option) => ({ id: option.key, name: option.name }));
		},
		staleTime: 5 * 60 * 1000,
	});
