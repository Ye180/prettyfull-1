"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiRequestError } from "./api";
import { AuthProvider } from "./auth";
import { ToastProvider } from "@/components/ui/toast";

/**
 * Fournisseurs applicatifs.
 *
 * Le `QueryClient` est créé dans un état de composant : une instance globale
 * serait partagée entre requêtes lors du rendu serveur et ferait fuiter les
 * données d'un utilisateur vers un autre.
 */
export const Providers = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						refetchOnWindowFocus: false,
						retry: (failureCount, error) => {
							// Inutile d'insister sur une erreur définitive : un 403 ou
							// un 404 ne deviendra pas un succès au troisième essai.
							if (error instanceof ApiRequestError && error.status < 500) return false;
							return failureCount < 2;
						},
					},
					mutations: { retry: false },
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ToastProvider>{children}</ToastProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
};
