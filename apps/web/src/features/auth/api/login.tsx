import { setStoreAccessToken, storeApi } from "@/lib/store-api";
import type { AuthResponse } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginFormData } from "../schemas/login.schema";

export const login = (data: LoginFormData) =>
	storeApi.post<AuthResponse>("/api/store/auth/login", data, true);

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setStoreAccessToken(data.accessToken);
			queryClient.setQueryData(["customer-profile"], data.user);
		},
	});
};
