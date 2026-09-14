import { PERMISSIONS, UPLOAD_ENDPOINTS, type Permission } from "@prettyfull/contracts";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";
import { extractBearerToken, verifyAccessToken } from "../../lib/jwt.js";

/**
 * Routes de téléversement des visuels (UploadThing).
 *
 * L'authentification est faite **ici**, dans le middleware, et non déléguée
 * au client : un téléversement part directement du navigateur vers
 * UploadThing après notre validation, donc c'est le seul point où l'on peut
 * refuser. Sans ce contrôle, n'importe qui pourrait remplir le quota de
 * stockage de la boutique.
 */

const f = createUploadthing();

const IMAGE_LIMITS = {
	image: {
		// 8 Mio : une photo produit en pleine définition passe, un fichier
		// manifestement inadapté (vidéo, RAW) est refusé d'emblée.
		maxFileSize: "8MB",
		maxFileCount: 10,
	},
} as const;

const REVIEW_PHOTO_LIMITS = {
	image: {
		maxFileSize: "4MB",
		maxFileCount: 4,
	},
} as const;

/**
 * Vérifie le jeton et la permission portés par la requête.
 *
 * Le jeton arrive en en-tête `Authorization`, ajouté par le client du
 * back-office. Toute erreur remonte en `UploadThingError`, seule forme que le
 * client sait présenter à l'utilisateur.
 */
const requireStaff = async (request: Request, permission: Permission) => {
	const token = extractBearerToken(request.headers.get("authorization") ?? undefined);

	if (!token) {
		throw new UploadThingError("Authentification requise pour téléverser un visuel.");
	}

	let auth;
	try {
		auth = await verifyAccessToken(token);
	} catch {
		throw new UploadThingError("Session expirée. Reconnectez-vous puis réessayez.");
	}

	if (auth.kind !== "staff") {
		throw new UploadThingError("Ce compte n'a pas accès au back-office.");
	}

	if (!auth.permissions.includes(permission)) {
		throw new UploadThingError(`Permission requise : ${permission}.`);
	}

	return { userId: auth.sub, email: auth.email };
};

export const uploadRouter = {
	/** Visuels du catalogue : produits, variantes, catégories. */
	[UPLOAD_ENDPOINTS.catalog]: f(IMAGE_LIMITS)
		.middleware(({ req }) => requireStaff(req, PERMISSIONS.catalog.write))
		.onUploadComplete(({ metadata, file }) => {
			console.log(`[upload] catalogue · ${file.name} par ${metadata.email}`);

			// Renvoyé au client dans `serverData` : c'est ce que le formulaire
			// enregistre ensuite sur le produit.
			return { url: file.ufsUrl, key: file.key, name: file.name };
		}),

	/** Visuels éditoriaux : bannières et pages de contenu. */
	[UPLOAD_ENDPOINTS.content]: f(IMAGE_LIMITS)
		.middleware(({ req }) => requireStaff(req, PERMISSIONS.content.write))
		.onUploadComplete(({ metadata, file }) => {
			console.log(`[upload] contenu · ${file.name} par ${metadata.email}`);
			return { url: file.ufsUrl, key: file.key, name: file.name };
		}),

	/**
	 * Photos jointes à un avis produit (client montrant l'article porté).
	 *
	 * Pas d'authentification requise : un avis se dépose sans compte, même
	 * posture que le formulaire de contact public. La modération se fait à la
	 * publication de l'avis, pas au téléversement de la photo.
	 */
	[UPLOAD_ENDPOINTS.reviewPhoto]: f(REVIEW_PHOTO_LIMITS)
		.middleware(() => ({}))
		.onUploadComplete(({ file }) => {
			console.log(`[upload] avis · ${file.name}`);
			return { url: file.ufsUrl, key: file.key, name: file.name };
		}),
} satisfies FileRouter;

export type PrettyfullFileRouter = typeof uploadRouter;
