import { randomUUID } from "node:crypto";
import { getConnInfo } from "@hono/node-server/conninfo";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { JwtPayload } from "@prettyfull/contracts";

/**
 * Variables de contexte partagées par toute la chaîne de traitement.
 *
 * Déclarées ici pour que `c.get("auth")` soit typé partout, sans cast, dans
 * les routes comme dans les middlewares.
 */
export interface AppVariables {
	requestId: string;
	clientIp: string | null;
	userAgent: string | null;
	/** Renseigné par le middleware d'authentification quand un jeton est valide. */
	auth?: JwtPayload;
}

export interface AppEnv {
	Variables: AppVariables;
}

/**
 * Adresse cliente réelle.
 *
 * Derrière un proxy (Vercel, Nginx), `x-forwarded-for` contient la chaîne
 * complète : la première entrée est l'appelant d'origine. En l'absence de
 * proxy, on retombe sur l'adresse de la connexion - sans quoi le journal
 * d'audit du §5 n'aurait aucune IP en déploiement direct.
 */
const resolveClientIp = (c: Context<AppEnv>): string | null => {
	const headers = c.req.raw.headers;

	const forwarded = headers.get("x-forwarded-for");
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim();
		if (first) return first;
	}

	const proxied = headers.get("x-real-ip") ?? headers.get("cf-connecting-ip");
	if (proxied) return proxied;

	try {
		return getConnInfo(c).remote.address ?? null;
	} catch {
		// Runtime sans information de connexion (tests, fetch direct).
		return null;
	}
};

/**
 * Attache un identifiant de requête et les métadonnées d'appel.
 *
 * L'identifiant est repris de l'en-tête entrant s'il existe, pour suivre une
 * même requête à travers storefront, panel et API dans les journaux.
 */
export const requestContext = createMiddleware<AppEnv>(async (c, next) => {
	const requestId = c.req.header("x-request-id") ?? randomUUID();

	c.set("requestId", requestId);
	c.set("clientIp", resolveClientIp(c));
	c.set("userAgent", c.req.header("user-agent") ?? null);
	c.header("x-request-id", requestId);

	await next();
});
