import { setStoreAccessToken, storeApi } from "@/lib/store-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const logout = () =>
	storeApi.post<{ success: boolean }>(
		"/api/store/auth/logout",
		undefined,
		true,
	);

export const useLogout = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: logout,
		// Best-effort : même si l'appel réseau échoue, la session locale doit
		// être effacée - une cliente ne doit jamais rester "connectée" côté
		// client alors que rien ne répond côté serveur.
		onSettled: () => {
			setStoreAccessToken(null);
			queryClient.clear();
			router.push("/login");
		},
	});
};
