import { z } from "zod";
import "./load-env.js";

/**
 * Variables d'environnement, validées au démarrage.
 *
 * Toute variable manquante ou mal formée fait échouer le boot plutôt que de
 * produire une panne silencieuse en production.
 */
const schema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PORT: z.coerce.number().default(7777),

	DATABASE_URL: z.string().min(1),
	DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
	DB_LOGGING: z
		.string()
		.default("false")
		.transform((v) => v === "true"),

	REDIS_URL: z.string().optional(),

	CORS_ORIGINS: z
		.string()
		.default("http://localhost:3000,http://localhost:3001")
		// Le navigateur envoie `Origin` sans barre finale : « https://site.com/ »
		// ne correspondrait jamais et bloquerait le site.
		.transform((v) =>
			v
				.split(",")
				.map((s) => s.trim().replace(/\/+$/, ""))
				.filter(Boolean),
		),

	/** Secret de signature des JWT. Doit différer entre environnements. */
	JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire au moins 32 caractères."),
	JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().default(900),
	JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().default(60 * 60 * 24 * 30),

	/**
	 * Clé de chiffrement des identifiants d'agrégateurs stockés en base
	 * (AES-256-GCM) : 32 octets en hexadécimal, soit 64 caractères.
	 */
	CREDENTIALS_ENCRYPTION_KEY: z
		.string()
		.regex(/^[0-9a-fA-F]{64}$/, "CREDENTIALS_ENCRYPTION_KEY doit être 64 caractères hex."),

	/** Domaine des cookies de session ; vide en local. */
	COOKIE_DOMAIN: z.string().optional(),
	COOKIE_SECURE: z
		.string()
		.default("false")
		.transform((v) => v === "true"),

	/**
	 * Jeton UploadThing (stockage des visuels).
	 *
	 * Optionnel : sans lui, l'API démarre normalement et les routes de
	 * téléversement répondent une erreur explicite. Rendre la variable
	 * obligatoire empêcherait de lancer le projet sans compte UploadThing.
	 */
	UPLOADTHING_TOKEN: z.string().optional(),

	/**
	 * Nombre de proxys de confiance devant l'API (Traefik, Nginx, Vercel…).
	 * L'IP cliente est lue à cette position en partant de la fin de
	 * `X-Forwarded-For` : les entrées de gauche sont fournies par le client et
	 * falsifiables. `0` : aucun proxy, IP de la connexion TCP.
	 *
	 * Obligatoire en production : trop haut, l'IP se falsifie et la limitation
	 * de débit se contourne ; trop bas, tous les clients partagent l'IP du
	 * proxy et se bloquent mutuellement.
	 */
	TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).optional(),

	/** Base publique de l'API, utilisée pour construire les URLs de webhook. */
	PUBLIC_API_URL: z.string().default("http://localhost:7777"),
	STOREFRONT_URL: z.string().default("http://localhost:3000"),
	ADMIN_URL: z.string().default("http://localhost:3001"),
});

/**
 * Valeurs d'exemple (`.env.example`) : valides syntaxiquement, mais publiques.
 * En production, elles permettraient de forger des jetons d'administration
 * et de déchiffrer les clés des prestataires.
 */
const productionSchema = schema.superRefine((value, ctx) => {
	if (value.NODE_ENV !== "production") return;

	if (/^remplacer/i.test(value.JWT_SECRET) || new Set(value.JWT_SECRET).size < 10) {
		ctx.addIssue({
			code: "custom",
			path: ["JWT_SECRET"],
			message: "secret d'exemple ou trop faible : `openssl rand -hex 32`.",
		});
	}
	if (value.TRUST_PROXY_HOPS === undefined) {
		ctx.addIssue({
			code: "custom",
			path: ["TRUST_PROXY_HOPS"],
			message: "nombre de proxys devant l'API (1 derrière Traefik/Nginx/Vercel, 0 sans proxy).",
		});
	}
	if (new Set(value.CREDENTIALS_ENCRYPTION_KEY.toLowerCase()).size < 8) {
		ctx.addIssue({
			code: "custom",
			path: ["CREDENTIALS_ENCRYPTION_KEY"],
			message: "clé d'exemple : `openssl rand -hex 32`.",
		});
	}
});

const parsed = productionSchema.safeParse(process.env);

if (!parsed.success) {
	const details = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".") || "(racine)"} : ${issue.message}`)
		.join("\n");
	throw new Error(`Configuration d'environnement invalide :\n${details}`);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
