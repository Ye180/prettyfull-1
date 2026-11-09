import {
	PERMISSIONS,
	adminPresignSchema,
	reviewPresignSchema,
	type PresignResponse,
	type UploadEndpoint,
	type UploadImageType,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { badRequest, forbidden, internalError } from "../../lib/errors.js";
import { deleteObject, isStorageConfigured, isValidKey, presignUpload } from "../../lib/r2.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { MINUTE, rateLimit } from "../../middleware/rate-limit.js";
import type { AppEnv } from "../../middleware/request-context.js";
import { validate } from "../../middleware/validate.js";

/**
 * Téléversement des visuels vers Cloudflare R2.
 *
 * Deux temps : le navigateur demande ici une URL signée par fichier (c'est
 * le seul point où l'on peut refuser : jeton, permission, type, poids), puis
 * envoie le fichier directement à R2. Il ne transite jamais par cette API.
 *
 * Sans configuration R2, l'API démarre normalement et ces routes répondent
 * un message explicite : un projet doit pouvoir tourner sans compte de stockage.
 */

const requireStorage = () => {
	if (!isStorageConfigured) {
		throw badRequest(
			"Le stockage des visuels n'est pas configuré. Renseignez les variables R2_* côté API.",
		);
	}
};

const sign = (endpoint: UploadEndpoint, files: { type: UploadImageType; size: number }[]): PresignResponse => ({
	files: files.map((file) => presignUpload(endpoint, file)),
});

// --- Back-office -----------------------------------------------------------

/** Routes montées sous `/api/admin` (jeton staff déjà exigé par le garde global). */
export const adminUploadRoutes = new Hono<AppEnv>();

/** Le panel s'en sert pour n'annoncer le téléversement que s'il est branché. */
adminUploadRoutes.get("/uploads/status", (c) => c.json({ configured: isStorageConfigured }));

adminUploadRoutes.post(
	"/uploads/presign",
	rateLimit("admin-presign", 120, 15 * MINUTE),
	validate("json", adminPresignSchema),
	async (c) => {
		requireStorage();
		const { endpoint, files } = c.req.valid("json");

		const permission =
			endpoint === "catalogImage" ? PERMISSIONS.catalog.write : PERMISSIONS.content.write;
		if (!currentUser(c).permissions.includes(permission)) {
			throw forbidden(`Permission requise : ${permission}.`);
		}

		return c.json(sign(endpoint, files));
	},
);

/**
 * Suppression d'un fichier.
 *
 * Retirer un visuel d'un produit ne libère rien côté stockage : sans cette
 * route, le bucket se remplirait de fichiers que plus rien ne référence.
 * La clé est contrôlée contre notre schéma de nommage : impossible de viser
 * un autre objet du bucket.
 */
adminUploadRoutes.delete(
	"/uploads",
	requirePermission(PERMISSIONS.catalog.write),
	validate("query", z.object({ key: z.string().max(200).refine(isValidKey, "Clé invalide.") })),
	async (c) => {
		requireStorage();
		const { key } = c.req.valid("query");

		try {
			await deleteObject(key);
		} catch (error) {
			console.error("[upload] suppression impossible", key, error);
			throw internalError("Le fichier n'a pas pu être supprimé du stockage.");
		}

		await recordAudit(c, { action: "upload.deleted", resourceType: "upload", resourceId: key });
		return c.json({ success: true });
	},
);

// --- Storefront ------------------------------------------------------------

/**
 * Photos d'avis : le seul téléversement anonyme, au même niveau de confiance
 * que le formulaire de contact. Quota par IP pour que personne ne remplisse
 * le bucket ; la modération se fait à la publication de l'avis.
 */
export const storeUploadRoutes = new Hono<AppEnv>();

storeUploadRoutes.post(
	"/uploads/review-photos",
	rateLimit("review-photo", 10, 60 * MINUTE),
	validate("json", reviewPresignSchema),
	async (c) => {
		requireStorage();
		return c.json(sign("reviewPhoto", c.req.valid("json").files));
	},
);
