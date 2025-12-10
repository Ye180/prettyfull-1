// import { API_ROUTES } from "@/api";
// import apiClient from "@/shared/lib/client";
// import { PRODUCTS_QUERY_KEY } from "@/shared/utils/query-keys";
// import { CardProps } from "@prettyfull/ui";
// import { useQuery } from "@tanstack/react-query";

// export const getProductById = async (id: string): Promise<CardProps> => {
// 	const response = await apiClient.get<CardProps>(
// 		API_ROUTES.products.getById(id)
// 	);
// 	return response.data;
// };

// export const useGetProductById = (productId: string) => {
// 	return useQuery({
// 		queryKey: [PRODUCTS_QUERY_KEY, productId],
// 		queryFn: () => getProductById(productId),
// 		enabled: !!productId,
// 	});
// };
