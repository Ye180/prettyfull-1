"use client";

import { sdk } from "@/lib/api/sdk";
import { PRODUCTS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => {
	const response = sdk.store.product
		.list()
		.then(({ products, count, offset, limit }) => {
			console.log(products);
		});
	return response;
};

export const useGetProductsMedusa = () => {
	return useQuery({
		queryKey: [PRODUCTS_MEDUSA_QUERY_KEY],
		queryFn: () => getProductsMedusa(),
	});
};
