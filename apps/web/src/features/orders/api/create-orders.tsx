import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const createOrder = async (data: any) => {
	const res = await apiClient.post(API_ROUTES.orders.create, data);
	return res.data;
};

export const useCreateOrder = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
}) => {
	return useMutation({
		mutationFn: createOrder,
		onSuccess,
		onError,
	});
};
