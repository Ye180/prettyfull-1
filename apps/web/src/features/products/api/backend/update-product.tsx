// import { API_ROUTES } from "@/api";
// import apiClient from "@/shared/lib/client";
// import { CardProps } from "@prettyfull/ui";
// import { useMutation } from "@tanstack/react-query";

// interface UpdateProductParams {
// 	id: string;
// 	productData: Omit<CardProps, "id">;
// }

// export const updateProduct = async ({
// 	productData,
// 	id,
// }: UpdateProductParams): Promise<CardProps> => {
// 	const response = await apiClient.post<CardProps>(
// 		API_ROUTES.products.update(id),
// 		productData
// 	);
// 	return response.data;
// };

// export const useCreateProduct = ({
// 	onSuccess,
// 	onError,
// }: {
// 	onSuccess?: () => void;
// 	onError?: () => void;
// } = {}) => {
// 	return useMutation({
// 		mutationFn: updateProduct,
// 		onSuccess,
// 		onError,
// 	});
// };
