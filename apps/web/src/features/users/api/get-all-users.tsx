// apps/web/src/features/users/api/get-all-users.tsx

import { API_ROUTES } from "@/api";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
	const response = await apiClient.get(API_ROUTES.users.getAll);
	return response.data;
};

export const useGetUsers = () => {
	return useQuery({
		queryKey: [USER_QUERY_KEY],
		queryFn: getUsers,
	});
};
