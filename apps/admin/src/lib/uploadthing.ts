"use client";

import type { UploadEndpoint } from "@prettyfull/contracts";
import { generateReactHelpers } from "@uploadthing/react";
import type { FileRouter } from "uploadthing/types";
import { api, getAccessToken } from "./api";

/**
 * Client de téléversement du back-office.
 *
 * Le routeur de fichiers vit dans l'API Hono, que le panel ne peut pas
 * importer (résolutions de modules incompatibles). On redéclare donc ici sa
 * *forme*, en réutilisant les noms d'endpoints des contrats : un renommage
 * côté API casse alors à la compilation, ce qui est le vrai risque à couvrir.
 */
type PrettyfullFileRouter = Record<UploadEndpoint, FileRouter[string]>;

export const { useUploadThing } = generateReactHelpers<PrettyfullFileRouter>({
	url: `${api.baseUrl}/api/uploadthing`,
});

/**
 * En-têtes d'authentification du téléversement.
 *
 * Évalués à l'appel, pas au montage : le jeton d'accès vit en mémoire et
 * tourne toutes les quinze minutes, un en-tête figé serait périmé.
 */
export const uploadHeaders = (): HeadersInit => {
	const token = getAccessToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Extrait la clé UploadThing d'une URL de fichier, pour pouvoir la supprimer. */
export const uploadKeyFromUrl = (url: string): string | null => {
	const match = /^https:\/\/[^/]+\.ufs\.sh\/f\/([^/?#]+)/.exec(url);
	return match?.[1] ?? null;
};
