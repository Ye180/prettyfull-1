"use client";

import { fetchProducts } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => fetchProducts();

export const useGetProductsMedusa = () =>
	useQuery({
		queryKey: ["list-products-medusa"],
		queryFn: () => getProductsMedusa(),
		staleTime: 5 * 60 * 1000,
	});
