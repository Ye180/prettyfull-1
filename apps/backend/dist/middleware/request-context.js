import { randomUUID } from "node:crypto";
import { getConnInfo } from "@hono/node-server/conninfo";
import { createMiddleware } from "hono/factory";
/**
 * Adresse cliente réelle.
 *
 * Derrière un proxy (Vercel, Nginx), `x-forwarded-for` contient la chaîne
 * complète : la première entrée est l'appelant d'origine. En l'absence de
 * proxy, on retombe sur l'adresse de la connexion - sans quoi le journal
 * d'audit du §5 n'aurait aucune IP en déploiement direct.
 */
const resolveClientIp = (c) => {
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
export const requestContext = createMiddleware(async (c, next) => {
	const requestId = c.req.header("x-request-id") ?? randomUUID();
	c.set("requestId", requestId);
	c.set("clientIp", resolveClientIp(c));
	c.set("userAgent", c.req.header("user-agent") ?? null);
	c.header("x-request-id", requestId);
	await next();
});
//# sourceMappingURL=request-context.js.map
