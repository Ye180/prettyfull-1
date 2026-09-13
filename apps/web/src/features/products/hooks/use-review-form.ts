"use client";

import { useUploadThing } from "@/lib/uploadthing";
import type { ReviewInput } from "@prettyfull/contracts";
import { toast } from "@prettyfull/ui";
import { useCallback } from "react";

export interface ReviewFormValues {
	rating: number;
	authorName: string;
	authorEmail: string;
	body: string;
	photoUrls: string[];
}

/**
 * Partie « réseau » du formulaire d'avis : téléversement des photos et envoi.
 *
 * L'état des champs (saisie, étoiles) reste dans `DrawerReview` — c'est de
 * l'état d'interface pure, pas la peine d'un hook dédié pour ça. Ce hook
 * n'existe que parce que `DrawerReview` vit dans `packages/ui`, qui ne peut
 * pas dépendre de `apps/web/src/lib/store-api` ni `apps/web/src/lib/uploadthing` :
 * les deux appels réseau sont donc préparés ici et passés en props.
 */
export function useReviewForm(
	productId: string,
	submitReview: (input: ReviewInput) => Promise<{ success: boolean; id?: string }>,
) {
	const { startUpload, isUploading } = useUploadThing("reviewPhoto", {
		onUploadError: (error) => {
			toast.error("Téléversement impossible", { description: error.message });
		},
	});

	const uploadPhotos = useCallback(
		async (files: File[]): Promise<string[]> => {
			const uploaded = await startUpload(files);
			return (uploaded ?? []).map((file) => file.serverData?.url ?? file.ufsUrl);
		},
		[startUpload],
	);

	const onSubmit = useCallback(
		async (values: ReviewFormValues) => {
			await submitReview({ productId, ...values });
			toast.success("Merci pour votre avis !", {
				description: "Il sera visible dès sa validation par notre équipe.",
			});
		},
		[productId, submitReview],
	);

	return { uploadPhotos, isUploading, onSubmit };
}
