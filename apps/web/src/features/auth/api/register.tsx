import { setStoreAccessToken, storeApi } from "@/lib/store-api";
import type { AuthResponse } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterFormData } from "../schemas/register.schema";

export const register = (data: RegisterFormData) =>
	storeApi.post<AuthResponse>("/api/store/auth/register", data, true);

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			// L'inscription ouvre directement une session (voir backend
			// `issueSession`) : pas besoin d'un second aller-retour de login.
			setStoreAccessToken(data.accessToken);
			queryClient.setQueryData(["customer-profile"], data.user);
		},
	});
};
