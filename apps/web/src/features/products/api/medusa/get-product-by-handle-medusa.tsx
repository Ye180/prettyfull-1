"use client";

import { sdk } from "@/lib/api/sdk";
import { PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsByHandleMedusa = async (handle: string) => {
	const response = await sdk.store.product.list({
		handle,
	});

	if (response.products && response.products.length > 0) {
		return response.products[0];
	}
	return null;
};

export const useGetProductsByHandleMedusa = (handle: string) => {
	return useQuery({
		queryKey: [PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY, handle],
		queryFn: () => getProductsByHandleMedusa(handle),
		enabled: !!handle,
	});
};
