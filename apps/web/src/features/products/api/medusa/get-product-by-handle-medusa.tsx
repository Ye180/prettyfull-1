"use client";

import { getProductByHandle } from "@/lib/fake-data";
import { PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsByHandleMedusa = async (
	handle: string,
	regionId: string,
) => {
	return getProductByHandle(handle) ?? null;
};

export const useGetProductsByHandleMedusa = (
	handle: string,
	regionId: string,
) => {
	return useQuery({
		queryKey: [PRODUCT_MEDUSA_BY_HANDLE_QUERY_KEY, handle],
		queryFn: () => getProductsByHandleMedusa(handle, regionId),
		staleTime: Infinity,
		enabled: !!handle,
	});
};
