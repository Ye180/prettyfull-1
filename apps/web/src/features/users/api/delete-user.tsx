
import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteUser = async (userId: string) => {
	const response = await apiClient.delete(API_ROUTES.users.remove(userId));
	return response.data;
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        }
	});
};