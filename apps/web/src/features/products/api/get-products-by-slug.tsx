import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { PRODUCTS_QUERY_KEY } from "@/shared/utils/query-keys";
import { CardProps } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";

export const getProductBySlug = async (slug: string): Promise<CardProps> => {
	const response = await apiClient.get<CardProps>(
		API_ROUTES.products.getBySlug(slug)
	);
	return response.data;
};

export const useGetProductBySlug = (productslug: string) => {
	return useQuery({
		queryKey: [PRODUCTS_QUERY_KEY, productslug],
		queryFn: () => getProductBySlug(productslug),
		enabled: !!productslug,
	});
};
