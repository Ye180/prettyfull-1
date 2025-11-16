import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

interface UpdateStatusParams {
	orderId: string;
	status: string;
}

// Met à jour le statut de la commande (admin only)
export const updateOrderStatus = async ({
	orderId,
	status,
}: UpdateStatusParams) => {
	const res = await apiClient.patch(
		API_ROUTES.orders.updateOrderStatus(orderId),
		{
			status,
		}
	);
	return res.data;
};

export const useOrderStatus = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
}) => {
	return useMutation({
		mutationFn: updateOrderStatus,
		onSuccess,
		onError,
	});
};
