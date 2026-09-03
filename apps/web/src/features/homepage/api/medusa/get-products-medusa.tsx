"use client";

import { products } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

export const getProductsMedusa = async () => {
	return products;
};

export const useGetProductsMedusa = () => {
	return useQuery({
		queryKey: ["list-products-medusa"],
		queryFn: () => getProductsMedusa(),
	});
};
