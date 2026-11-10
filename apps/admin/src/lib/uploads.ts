"use client";

import type { PresignResponse, UploadEndpoint } from "@prettyfull/contracts";
import { uploadToStorage } from "@prettyfull/utils";
import { useCallback, useState } from "react";
import { api } from "./api";

/**
 * Téléversement des visuels du back-office vers Cloudflare R2.
 *
 * Deux temps : l'API (qui vérifie le jeton, la permission, le type et le
 * poids) signe une URL par fichier, puis le navigateur envoie le fichier
 * directement au stockage. Il ne passe jamais par l'API.
 */
export const useUpload = (endpoint: Exclude<UploadEndpoint, "reviewPhoto">) => {
	const [isUploading, setIsUploading] = useState(false);

	/** Renvoie les adresses publiques ; lève une erreur lisible en cas d'échec. */
	const upload = useCallback(
		async (files: File[]): Promise<string[]> => {
			setIsUploading(true);
			try {
				const { files: presigned } = await api.post<PresignResponse>("/api/admin/uploads/presign", {
					endpoint,
					files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
				});
				return await uploadToStorage(files, presigned);
			} finally {
				setIsUploading(false);
			}
		},
		[endpoint],
	);

	return { upload, isUploading };
};
