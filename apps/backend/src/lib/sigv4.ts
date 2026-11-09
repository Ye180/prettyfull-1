import { createHash, createHmac } from "node:crypto";

/**
 * Signature AWS SigV4 par URL (query-string), pour Cloudflare R2 / S3.
 *
 * Isolée de `env` pour rester testable seule : voir `sigv4.test.ts`, qui
 * rejoue l'exemple officiel d'AWS.
 */

const DEFAULT_REGION = "auto";
const DEFAULT_SERVICE = "s3";

const hmac = (key: string | Buffer, data: string): Buffer =>
	createHmac("sha256", key).update(data).digest();

const sha256 = (data: string): string => createHash("sha256").update(data).digest("hex");

/** Encodage RFC 3986 exigé par SigV4 (`encodeURIComponent` laisse passer `!'()*`). */
const encode = (value: string): string =>
	encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);

export interface PresignOptions {
	method: "GET" | "PUT" | "DELETE";
	host: string;
	/** Chemin déjà complet (`/bucket/cle/fichier.jpg`), segments non encodés. */
	path: string;
	accessKeyId: string;
	secretAccessKey: string;
	region?: string;
	service?: string;
	expiresSeconds: number;
	/** En-têtes signés en plus de `host` : le client doit les envoyer à l'identique. */
	headers?: Record<string, string>;
	now?: Date;
}

/** URL signée par requête query-string (SigV4, `UNSIGNED-PAYLOAD`). */
export const presignUrl = (options: PresignOptions): string => {
	const region = options.region ?? DEFAULT_REGION;
	const service = options.service ?? DEFAULT_SERVICE;
	const now = options.now ?? new Date();

	const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
	const day = amzDate.slice(0, 8);
	const scope = `${day}/${region}/${service}/aws4_request`;

	const headers: Record<string, string> = { host: options.host };
	for (const [name, value] of Object.entries(options.headers ?? {})) {
		headers[name.toLowerCase()] = value.trim();
	}
	const names = Object.keys(headers).sort();

	const query: Record<string, string> = {
		"X-Amz-Algorithm": "AWS4-HMAC-SHA256",
		"X-Amz-Credential": `${options.accessKeyId}/${scope}`,
		"X-Amz-Date": amzDate,
		"X-Amz-Expires": String(options.expiresSeconds),
		"X-Amz-SignedHeaders": names.join(";"),
	};
	const canonicalQuery = Object.keys(query)
		.sort()
		.map((name) => `${encode(name)}=${encode(query[name]!)}`)
		.join("&");

	const canonicalPath = options.path.split("/").map(encode).join("/");
	const canonicalHeaders = names.map((name) => `${name}:${headers[name]}\n`).join("");
	const canonicalRequest = [
		options.method,
		canonicalPath,
		canonicalQuery,
		canonicalHeaders,
		names.join(";"),
		"UNSIGNED-PAYLOAD",
	].join("\n");

	const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
	const signingKey = hmac(hmac(hmac(hmac(`AWS4${options.secretAccessKey}`, day), region), service), "aws4_request");
	const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

	return `https://${options.host}${canonicalPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;
};

