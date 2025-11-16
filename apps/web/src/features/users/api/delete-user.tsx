import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { useMutation } from "@tanstack/react-query";

export const deleteUser = async (userId: string) => {
	const response = await apiClient.delete(API_ROUTES.users.remove(userId));
	return response.data;
};

export const useDeleteUser = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) => {
	return useMutation({
		mutationFn: deleteUser,
		onSuccess,
		onError,
	});
};
