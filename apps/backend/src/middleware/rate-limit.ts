import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { tooManyRequests } from "../lib/errors.js";
import type { AppEnv } from "./request-context.js";

/**
 * Limitation de débit en fenêtre fixe, en mémoire.
 *
 * Protège les points d'entrée coûteux ou sensibles : force brute sur les
 * connexions (chaque essai coûte un hachage Argon2 de 19 Mio), création de
 * comptes, commandes qui bloquent du stock, téléversements anonymes.
 *
 * ponytail: compteurs propres au processus - suffisant pour une instance
 * unique. Si l'API est répliquée, passer les compteurs dans Redis
 * (variable `REDIS_URL` à ajouter) avec INCR + EXPIRE.
 */

interface Bucket {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Nettoyage périodique : sans lui, chaque IP vue resterait en mémoire. */
setInterval(() => {
	const now = Date.now();
	for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
}, 60_000).unref();

/**
 * Compte une tentative ; lève une 429 au-delà de `limit` dans la fenêtre.
 * Utilisable hors middleware (clé dépendant du corps, callback UploadThing).
 */
export const consumeRateLimit = (
	name: string,
	key: string,
	limit: number,
	windowMs: number,
): void => {
	const id = `${name}:${key}`;
	const now = Date.now();
	let bucket = buckets.get(id);

	if (!bucket || bucket.resetAt <= now) {
		bucket = { count: 0, resetAt: now + windowMs };
		buckets.set(id, bucket);
	}

	bucket.count += 1;
	if (bucket.count > limit) {
		throw tooManyRequests(Math.ceil((bucket.resetAt - now) / 1_000));
	}
};

export const clientKey = (c: Context<AppEnv>): string => c.get("clientIp") ?? "unknown";

/** Middleware : `limit` requêtes par IP et par fenêtre de `windowMs`. */
export const rateLimit = (name: string, limit: number, windowMs: number) =>
	createMiddleware<AppEnv>(async (c, next) => {
		consumeRateLimit(name, clientKey(c), limit, windowMs);
		await next();
	});

export const MINUTE = 60_000;

/** Réservé aux tests. */
export const resetRateLimits = (): void => buckets.clear();
