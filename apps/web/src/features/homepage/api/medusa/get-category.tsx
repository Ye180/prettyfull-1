"use client";

import { fetchCategories } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

export interface Category {
	id: string;
	name: string;
	handle: string;
	image?: string | { url: string };
	metadata?: Record<string, unknown>;
	isFeatured: boolean;
}

export const getCategory = async (): Promise<Category[]> => {
	const categories = await fetchCategories();

	return categories.map((category) => ({
		id: category.id,
		name: category.name,
		handle: category.handle,
		image:
			category.product_category_image?.[0]?.url ??
			(category.metadata as Record<string, string> | undefined)?.image,
		metadata: category.metadata,
		isFeatured: category.is_featured ?? false,
	}));
};

export const useGetCategory = () =>
	useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategory(),
		staleTime: 10 * 60 * 1000,
	});
