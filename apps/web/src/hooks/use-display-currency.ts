"use client";

import { fetchConfig } from "@/lib/store-api";
import { useRegionStore } from "@/stores/useRegion";
import { convertAmount, formatMoney, type CurrencyCode } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";

/**
 * Conversion + formatage cohérents avec la devise choisie dans le header.
 *
 * Remplace le pattern `region?.currency_code === "xof" ? "FCFA" : "$"` +
 * `formatCurrency_FR` répété dans tout le storefront - celui-ci ne faisait
 * que changer le symbole affiché sans jamais convertir le montant réel.
 */
export const useDisplayCurrency = () => {
	const region = useRegionStore((state) => state.region);
	const { data: config } = useQuery({
		queryKey: ["store-config"],
		queryFn: fetchConfig,
		staleTime: 30 * 60 * 1000,
	});

	const currencyCode = (region?.currency_code ??
		config?.defaultCurrency ??
		"xof") as CurrencyCode;
	const usdToXofRate = config?.usdToXofRate ?? 600;

	const convert = (amountMinor: number, fromCurrency: CurrencyCode = "xof"): number =>
		convertAmount(amountMinor, fromCurrency, currencyCode, usdToXofRate);

	const format = (amountMinor: number, fromCurrency: CurrencyCode = "xof"): string =>
		formatMoney(convert(amountMinor, fromCurrency), currencyCode);

	return { currencyCode, usdToXofRate, convert, format };
};
