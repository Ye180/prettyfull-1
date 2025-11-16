"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import { buildProvidersTree } from "../lib/provider-tree";
import { queryConfig } from "../lib/react-query";

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

const ProviderTree = buildProvidersTree([
  [QueryClientProvider, { client: queryClient }],
  [NuqsAdapter, {}],
]);

export const Provider = ({ children }: PropsWithChildren) => {
  return <ProviderTree>{children}</ProviderTree>;
};
