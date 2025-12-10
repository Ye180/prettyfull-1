// import { API_ROUTES } from "@/api";
// import apiClient from "@/shared/lib/client";
// import { CardProps } from "@prettyfull/ui";
// import { useMutation } from "@tanstack/react-query";

// export const getAllProducts = async (): Promise<CardProps[]> => {
// 	const response = await apiClient.get<CardProps[]>(API_ROUTES.products.getAll);
// 	return response.data;
// };

// export const useGetAllProducts = ({
// 	onSuccess,
// 	onError,
// }: {
// 	onSuccess?: () => void;
// 	onError?: () => void;
// } = {}) => {
// 	return useMutation({
// 		mutationFn: getAllProducts,
// 		onSuccess,
// 		onError,
// 	});
// };
