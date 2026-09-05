"use client";

import { fetchProductByHandle } from "@/lib/store-api";
import { PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsByHandleMedusa = async (handle: string) =>
	fetchProductByHandle(handle);

export const useGetProductsByHandleMedusa = (handle: string) =>
	useQuery({
		queryKey: [PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY, handle],
		queryFn: () => getProductsByHandleMedusa(handle),
		// Le stock affiché sur la fiche doit rester frais : une durée infinie
		// laisserait « en stock » sur un article épuisé entre-temps.
		staleTime: 60 * 1000,
		enabled: !!handle,
	});
