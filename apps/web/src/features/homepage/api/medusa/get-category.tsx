"use client";

import { categories } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

export interface Category {
	id: string;
	name: string;
	handle: string;
	image?: string | { url: string };
	metadata?: Record<string, any>;
}

export const getCategory = async (): Promise<Category[]> => {
	return categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		handle: cat.handle,
		image: cat.product_category_image?.[0]?.url || (cat.metadata as any)?.image,
		metadata: cat.metadata,
	}));
};

export const useGetCategory = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategory(),
	});
};
