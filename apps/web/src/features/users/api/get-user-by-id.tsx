
import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types";

export const getUserById = async (userId: string): Promise<User> => {
	const response = await apiClient.get(API_ROUTES.users.getById(userId));
	return response.data;
};

export const useGetUserById = (userId: string) => {
	return useQuery({
		queryKey: [USER_QUERY_KEY, userId],
		queryFn: () => getUserById(userId),
        enabled: !!userId, 
	});
};