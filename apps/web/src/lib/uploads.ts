"use client";

import type { PresignResponse } from "@prettyfull/contracts";
import { uploadToStorage } from "@prettyfull/utils";
import { storeApi } from "./store-api/client";

/**
 * Téléversement des photos d'avis vers Cloudflare R2.
 *
 * Point public, sans compte : l'API signe une URL par fichier (types et poids
 * contrôlés, quota par IP), puis le navigateur envoie le fichier directement
 * au stockage.
 */
export const uploadReviewPhotos = async (files: File[]): Promise<string[]> => {
	const { files: presigned } = await storeApi.post<PresignResponse>(
		"/api/store/uploads/review-photos",
		{ files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })) },
		true,
	);
	return uploadToStorage(files, presigned);
};
