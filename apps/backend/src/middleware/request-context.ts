import { randomUUID } from "node:crypto";
import { getConnInfo } from "@hono/node-server/conninfo";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { JwtPayload } from "@prettyfull/contracts";
import { env } from "../lib/env.js";

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
 * Chaque proxy ajoute l'adresse qu'il voit **à la fin** de
 * `x-forwarded-for` ; le début de la chaîne vient du client et peut être
 * inventé. On lit donc l'entrée posée par le proxy de confiance le plus
 * proche (`TRUST_PROXY_HOPS` depuis la fin). Sans cela, la limitation de
 * débit se contournerait en changeant l'en-tête à chaque requête.
 */
const resolveClientIp = (c: Context<AppEnv>): string | null => {
	const hops = env.TRUST_PROXY_HOPS ?? 0;
	const forwarded = c.req.header("x-forwarded-for");

	if (hops > 0 && forwarded) {
		const chain = forwarded.split(",").map((entry) => entry.trim()).filter(Boolean);
		const trusted = chain[chain.length - hops];
		if (trusted) return trusted;
	}

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
