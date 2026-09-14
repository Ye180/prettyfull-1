"use client";

import { fetchProductsRaw } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export const getNewCollectionProducts = async () => {
	const { products } = await fetchProductsRaw({
		sort: "createdAt",
		order: "desc",
		limit: 10,
	});
	return products;
};

export const useGetNewCollectionProducts = () =>
	useQuery({
		queryKey: ["new-collection-products"],
		queryFn: () => getNewCollectionProducts(),
		staleTime: 5 * 60 * 1000,
	});
