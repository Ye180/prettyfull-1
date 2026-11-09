import { z } from "zod";
import { UPLOAD_IMAGE_TYPES, UPLOAD_RULES, type UploadEndpoint } from "./enums.js";

/**
 * Téléversement direct vers le stockage (Cloudflare R2).
 *
 * Le navigateur demande d'abord à l'API une URL signée par fichier, puis
 * envoie le fichier lui-même au stockage : il ne transite jamais par l'API.
 */

export const uploadFileSchema = z.object({
	name: z.string().trim().min(1).max(255),
	type: z.enum(Object.keys(UPLOAD_IMAGE_TYPES) as [keyof typeof UPLOAD_IMAGE_TYPES]),
	size: z.number().int().positive(),
});

const filesSchema = z.array(uploadFileSchema).min(1);

/** Contrôle commun : nombre et poids, selon la destination. */
export const enforceUploadRules = (
	endpoint: UploadEndpoint,
	files: z.infer<typeof filesSchema>,
	ctx: z.RefinementCtx,
) => {
	const rules = UPLOAD_RULES[endpoint];

	if (files.length > rules.maxFiles) {
		ctx.addIssue({
			code: "custom",
			path: ["files"],
			message: `${rules.maxFiles} fichier(s) au maximum par envoi.`,
		});
	}
	files.forEach((file, index) => {
		if (file.size > rules.maxBytes) {
			ctx.addIssue({
				code: "custom",
				path: ["files", index, "size"],
				message: `« ${file.name} » dépasse ${Math.round(rules.maxBytes / 1024 / 1024)} Mo.`,
			});
		}
	});
};

/** Demande côté back-office : la destination détermine la permission requise. */
export const adminPresignSchema = z
	.object({
		endpoint: z.enum(["catalogImage", "contentImage"]),
		files: filesSchema,
	})
	.superRefine((value, ctx) => enforceUploadRules(value.endpoint, value.files, ctx));

/** Demande côté storefront : photos d'avis uniquement, sans compte. */
export const reviewPresignSchema = z
	.object({ files: filesSchema })
	.superRefine((value, ctx) => enforceUploadRules("reviewPhoto", value.files, ctx));

export type PresignedUpload = {
	/** URL signée : le navigateur y envoie le fichier en `PUT`. */
	uploadUrl: string;
	/** Adresse publique du fichier une fois envoyé. */
	publicUrl: string;
	key: string;
	/** En-têtes à reprendre à l'identique, sous peine de signature refusée. */
	headers: Record<string, string>;
};

export type PresignResponse = { files: PresignedUpload[] };
