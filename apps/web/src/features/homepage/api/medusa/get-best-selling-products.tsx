"use client";

import { fetchCategories, fetchProductsRaw } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export const useGetBestSellingProducts = () =>
	useQuery({
		queryKey: ["best-selling-products"],
		queryFn: async () => {
			const { products } = await fetchProductsRaw({ limit: 48 });
			return products;
		},
		staleTime: 5 * 60 * 1000,
	});

export const useGetShopCategories = () =>
	useQuery({
		queryKey: ["shop-categories"],
		queryFn: fetchCategories,
		staleTime: 10 * 60 * 1000,
	});
