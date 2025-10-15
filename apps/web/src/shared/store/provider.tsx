"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { queryConfig } from "../lib/react-query";

export const queryClient = new QueryClient({
	defaultOptions: queryConfig,
});

// const ProviderTree = [QueryClientProvider, { client: queryClient }];

export const Provider = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
