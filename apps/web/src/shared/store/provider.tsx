"use client";
import { storeApi } from "@/lib/store-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect, type PropsWithChildren } from "react";
import { buildProvidersTree } from "../lib/provider-tree";
import { queryConfig } from "../lib/react-query";

export const queryClient = new QueryClient({
	defaultOptions: queryConfig,
});

const ProviderTree = buildProvidersTree([
	[QueryClientProvider, { client: queryClient }],
	[NuqsAdapter, {}],
]);

/**
 * Le jeton d'accès vit en mémoire (voir `lib/store-api/client.ts`) : il
 * disparaît à chaque rechargement de page. Le cookie de rafraîchissement,
 * lui, survit - cet effet le consomme une fois au montage pour rouvrir la
 * session silencieusement, sinon toute navigation en dur déconnecterait la
 * cliente.
 */
const SessionBootstrap = () => {
	useEffect(() => {
		storeApi.refreshSession().then((restored) => {
			if (restored) {
				queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
			}
		});
	}, []);

	return null;
};

export const Provider = ({ children }: PropsWithChildren) => {
	return (
		<ProviderTree>
			<SessionBootstrap />
			{children}
		</ProviderTree>
	);
};
