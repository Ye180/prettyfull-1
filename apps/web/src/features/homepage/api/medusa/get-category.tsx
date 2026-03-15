"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

export interface Category {
	id: string;
	name: string;
	handle: string;
	image?: string | { url: string };
	metadata?: Record<string, any>;
}

export const getCategory = async () => {
	const response = await sdk.store.category
		.list({
			fields: "id, name, handle, metadata, *product_category_image",
		})
		.then(({ product_categories }) => {
			return product_categories.map((cat: any) => ({
				id: cat.id,
				name: cat.name,
				handle: cat.handle,
				image: cat.product_category_image?.url || cat.metadata?.image,
				metadata: cat.metadata,
			}));
		});
	return response;
};

export const useGetCategory = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategory(),
	});
};
