"use client";

import { fetchProducts } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => {
	const { products } = await fetchProducts();
	return products;
};

export const useGetProductsMedusa = () =>
	useQuery({
		queryKey: ["list-products-medusa"],
		queryFn: () => getProductsMedusa(),
		staleTime: 5 * 60 * 1000,
	});
