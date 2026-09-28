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
        .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
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
    /** Base publique de l'API, utilisée pour construire les URLs de webhook. */
    PUBLIC_API_URL: z.string().default("http://localhost:7777"),
    STOREFRONT_URL: z.string().default("http://localhost:3000"),
    ADMIN_URL: z.string().default("http://localhost:3001"),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    const details = parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".") || "(racine)"} : ${issue.message}`)
        .join("\n");
    throw new Error(`Configuration d'environnement invalide :\n${details}`);
}
export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
//# sourceMappingURL=env.js.map