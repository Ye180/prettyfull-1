"use client";
import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState, type PropsWithChildren } from "react";
import { buildProvidersTree } from "../lib/provider-tree";
import { queryConfig } from "../lib/react-query";
import { WebCartActionsProvider } from "./cart-actions-provider";

function makeQueryClient() {
  return new QueryClient({ defaultOptions: queryConfig });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Server : un client neuf par requête (aucun partage entre utilisateurs).
 * Navigateur : un singleton stable réutilisé entre les rendus.
 */
function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export const Provider = ({ children }: PropsWithChildren) => {
  // useState garantit un client stable pour la durée de vie du composant côté client,
  // tout en laissant getQueryClient() créer un client par requête côté serveur.
  const [queryClient] = useState(getQueryClient);

  const [ProviderTree] = useState(() =>
    buildProvidersTree([
      [QueryClientProvider, { client: queryClient }],
      // WebCartActionsProvider doit rester à l'intérieur du QueryClientProvider
      [WebCartActionsProvider, {}],
      [NuqsAdapter, {}],
    ]),
  );

  return <ProviderTree>{children}</ProviderTree>;
};
