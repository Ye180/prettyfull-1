
import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserDto, User } from "../types";

export const updateUser = async ({ userId, data }: { userId: string; data: UpdateUserDto }): Promise<User> => {
	const response = await apiClient.put(API_ROUTES.users.update(userId), data);
	return response.data;
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        }
	});
};