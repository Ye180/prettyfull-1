// apps/web/src/features/auth/api/get-profile.tsx

import { API_ROUTES } from "@/api";
import { getItem } from "@/lib/utils/local-storage";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../users/types";

export const getProfile = async (): Promise<User | null> => {
	const token = getItem("accessToken");
	if (!token) {
		return null;
	}
	const response = await apiClient.get(API_ROUTES.auth.getProfile);
	return response.data;
};

export const useGetProfile = () => {
	return useQuery({
		queryKey: [USER_QUERY_KEY, "profile"],
		queryFn: getProfile,
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
