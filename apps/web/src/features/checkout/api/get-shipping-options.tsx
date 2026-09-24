"use client";

import { fetchShippingOptions, setCartAddress } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";
import { useCheckoutStore } from "../stores/use-checkout-store";

const SHIPPING_OPTIONS_QUERY_KEY = "shipping-options-for-cart";

/**
 * Options de livraison calculées par l'API pour l'adresse saisie.
 *
 * L'adresse est poussée juste avant : les tarifs dépendent du pays de
 * destination et du poids du panier, et l'API ne peut rien proposer tant
 * qu'elle ne les connaît pas.
 */
export const useGetShippingOptions = (cartId: string | null) => {
	const shippingAddress = useCheckoutStore((state) => state.shippingAddress);

	return useQuery({
		queryKey: [
			SHIPPING_OPTIONS_QUERY_KEY,
			cartId,
			shippingAddress?.country_code,
			shippingAddress?.city,
		],
		queryFn: async () => {
			if (shippingAddress) {
				await setCartAddress({
					first_name: shippingAddress.first_name ?? "",
					last_name: shippingAddress.last_name ?? "",
					address_1: shippingAddress.address_1 ?? "",
					address_2: shippingAddress.address_2 ?? undefined,
					city: shippingAddress.city ?? "",
					postal_code: shippingAddress.postal_code ?? "",
					country_code: shippingAddress.country_code ?? "ci",
					phone: shippingAddress.phone ?? undefined,
				});
			}

			return fetchShippingOptions();
		},
		enabled: Boolean(shippingAddress?.country_code),
	});
};
