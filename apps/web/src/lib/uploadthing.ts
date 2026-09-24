"use client";

import type { UploadEndpoint } from "@prettyfull/contracts";
import { generateReactHelpers } from "@uploadthing/react";
import type { FileRouter } from "uploadthing/types";
import { storeApi } from "./store-api/client";

/**
 * Client de téléversement du storefront.
 *
 * Miroir de `apps/admin/src/lib/uploadthing.ts` : le routeur de fichiers vit
 * dans l'API Hono, que le storefront ne peut pas importer (résolutions de
 * modules incompatibles), donc on redéclare ici sa *forme* en réutilisant les
 * noms d'endpoints des contrats - un renommage côté API casse alors à la
 * compilation plutôt qu'à l'exécution.
 *
 * Contrairement au panel, aucun en-tête d'authentification n'est nécessaire :
 * `reviewPhoto` est un point de téléversement public, au même niveau de
 * confiance que le formulaire de contact.
 */
type PrettyfullFileRouter = Record<UploadEndpoint, FileRouter[string]>;

export const { useUploadThing } = generateReactHelpers<PrettyfullFileRouter>({
	url: `${storeApi.baseUrl}/api/uploadthing`,
});
