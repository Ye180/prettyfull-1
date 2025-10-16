
import { API_ROUTES } from "@/api";
import { setItem } from "@/lib/utils/local-storage";
import apiClient from "@/shared/lib/client";
import { USER_QUERY_KEY } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../users/types";
import { LoginDto } from "../types/login.dto";

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const login = async (data: LoginDto): Promise<LoginResponse> => {
	const response = await apiClient.post(API_ROUTES.auth.login, data);
	return response.data;
};

export const useLogin = () => {
    const queryClient = useQueryClient();

	return useMutation({
		mutationFn: login,
        onSuccess: (data) => {
            setItem('accessToken', data.accessToken);
            
            queryClient.setQueryData([USER_QUERY_KEY, 'profile'], data.user);

        }
	});
};