"use client"; // Important si vous utilisez un fichier TSX avec un client-side

import { queryConfig } from "@/shared/lib/react-query";
// import queryClient from "@/lib/queryClient";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient({
	defaultOptions: queryConfig,
});
function Providers({ children }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export default Providers;
