import { randomUUID } from "node:crypto";
import { UPLOAD_IMAGE_TYPES, type UploadEndpoint, type UploadImageType } from "@prettyfull/contracts";
import { env } from "./env.js";
import { presignUrl } from "./sigv4.js";

/**
 * Stockage des visuels : Cloudflare R2 (compatible S3).
 *
 * Aucun SDK : l'API ne fait que **signer** des URL (SigV4, ~40 lignes). Le
 * navigateur envoie le fichier directement à R2, qui ne passe jamais par ce
 * serveur ; la suppression est la seule requête que l'API émet elle-même.
 */

// --- Configuration ---------------------------------------------------------

/**
 * `R2_PUBLIC_URL` ne doit jamais être l'adresse de l'API S3
 * (`<compte>.r2.cloudflarestorage.com`) : elle exige une signature, donc les
 * images téléversées seraient illisibles pour tout visiteur.
 */
const publicUrlIsPrivateApi = /\.r2\.cloudflarestorage\.com$/i.test(
	(() => {
		try {
			return new URL(env.R2_PUBLIC_URL ?? "https://x.invalid").hostname;
		} catch {
			return "";
		}
	})(),
);

if (publicUrlIsPrivateApi) {
	console.error(
		"[stockage] R2_PUBLIC_URL pointe vers l'API S3 privée de R2 : téléversement désactivé. " +
			"Utilisez l'URL publique du bucket (https://pub-xxxx.r2.dev) ou son domaine personnalisé.",
	);
}

export const isStorageConfigured = !publicUrlIsPrivateApi && Boolean(
	env.R2_ACCOUNT_ID &&
		env.R2_ACCESS_KEY_ID &&
		env.R2_SECRET_ACCESS_KEY &&
		env.R2_BUCKET &&
		env.R2_PUBLIC_URL,
);

const PREFIXES: Record<UploadEndpoint, string> = {
	catalogImage: "catalog",
	contentImage: "content",
	reviewPhoto: "reviews",
};

/** `catalog/2026/11/<uuid>.jpg` : jamais le nom d'origine (collisions, caractères, fuite d'info). */
const KEY_PATTERN = /^(catalog|content|reviews)\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/;

export const isValidKey = (key: string): boolean => KEY_PATTERN.test(key);

export const newObjectKey = (endpoint: UploadEndpoint, type: UploadImageType, now = new Date()): string => {
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	return `${PREFIXES[endpoint]}/${now.getUTCFullYear()}/${month}/${randomUUID()}.${UPLOAD_IMAGE_TYPES[type]}`;
};

const publicBase = (): string => (env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");

export const publicUrlFor = (key: string): string => `${publicBase()}/${key}`;

/** Une URL d'image est « à nous » si elle pointe vers le domaine public du bucket. */
export const isOwnMediaUrl = (url: string): boolean => {
	if (!isStorageConfigured) return false;
	return url.startsWith(`${publicBase()}/`) && isValidKey(url.slice(publicBase().length + 1));
};

const signFor = (method: "PUT" | "DELETE", key: string, headers?: Record<string, string>, expiresSeconds = 300) =>
	presignUrl({
		method,
		host: `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		path: `/${env.R2_BUCKET}/${key}`,
		accessKeyId: env.R2_ACCESS_KEY_ID!,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
		expiresSeconds,
		headers,
	});

/** Les clés étant uniques, le fichier ne change jamais : cache navigateur et CDN maximal. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * URL d'envoi valable 5 min, liée au type et au poids annoncés : R2 refuse
 * toute requête dont l'en-tête diffère de ce qui a été signé.
 */
export const presignUpload = (
	endpoint: UploadEndpoint,
	file: { type: UploadImageType; size: number },
) => {
	const key = newObjectKey(endpoint, file.type);
	const headers = {
		"Content-Type": file.type,
		"Content-Length": String(file.size),
		"Cache-Control": CACHE_CONTROL,
	};

	return {
		key,
		uploadUrl: signFor("PUT", key, headers),
		publicUrl: publicUrlFor(key),
		// Le navigateur pose `Content-Length` lui-même et refuse qu'on le lui impose.
		headers: { "Content-Type": headers["Content-Type"], "Cache-Control": headers["Cache-Control"] },
	};
};

export const deleteObject = async (key: string): Promise<void> => {
	const response = await fetch(signFor("DELETE", key), {
		method: "DELETE",
		signal: AbortSignal.timeout(10_000),
	});
	// 404 : déjà supprimé, c'est le résultat voulu.
	if (!response.ok && response.status !== 404) {
		throw new Error(`R2 a répondu HTTP ${response.status}`);
	}
};
