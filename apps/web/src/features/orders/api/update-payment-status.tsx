import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

interface UpdatePaymentStatusParams {
	orderId: string;
	status: string;
}

export const updatePaymentStatus = async ({
	orderId,
	status,
}: UpdatePaymentStatusParams) => {
	const res = await apiClient.patch(
		API_ROUTES.orders.updatePaymentStatus(orderId),
		{
			status,
		}
	);
	return res;
};

export const usePaymentStatus = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
}) => {
	return useMutation({
		mutationFn: updatePaymentStatus,
		onSuccess,
		onError,
	});
};
