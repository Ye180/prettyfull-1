import { createMiddleware } from "hono/factory";
import { extractBearerToken, verifyAccessToken } from "../lib/jwt.js";
import { forbidden, unauthorized } from "../lib/errors.js";
/**
 * Exige un jeton d'accès valide et dépose la charge utile dans le contexte.
 */
export const requireAuth = createMiddleware(async (c, next) => {
    const token = extractBearerToken(c.req.header("Authorization"));
    if (!token)
        throw unauthorized("Jeton d'accès manquant.");
    c.set("auth", await verifyAccessToken(token));
    await next();
});
/**
 * Restreint l'accès à un type de compte.
 *
 * Empêche qu'un jeton de cliente valide n'atteigne les routes du back-office :
 * la séparation ne repose pas sur l'application appelante, mais sur le jeton.
 */
export const requireKind = (kind) => createMiddleware(async (c, next) => {
    const auth = c.get("auth");
    if (!auth)
        throw unauthorized();
    if (auth.kind !== kind)
        throw forbidden("Ce compte n'a pas accès à cette interface.");
    await next();
});
/**
 * Exige une permission précise (§5, §7).
 *
 * C'est le contrôle qui rend vérifiable le critère d'acceptation : un
 * gestionnaire catalogue reçoit 403 sur la configuration des agrégateurs.
 */
export const requirePermission = (...required) => createMiddleware(async (c, next) => {
    const auth = c.get("auth");
    if (!auth)
        throw unauthorized();
    const granted = new Set(auth.permissions);
    const missing = required.filter((permission) => !granted.has(permission));
    if (missing.length > 0) {
        throw forbidden(`Permission requise : ${missing.join(", ")}. Contactez un super administrateur.`);
    }
    await next();
});
/**
 * Authentification facultative : renseigne le contexte si un jeton valide est
 * fourni, sans jamais bloquer.
 *
 * Utilisée par les routes storefront qui servent à la fois les visiteurs
 * anonymes et les clientes connectées (panier, produits). Un jeton invalide
 * est ignoré plutôt que rejeté : un jeton expiré ne doit pas casser la
 * navigation d'un visiteur.
 */
export const optionalAuth = createMiddleware(async (c, next) => {
    const token = extractBearerToken(c.req.header("Authorization"));
    if (token) {
        try {
            c.set("auth", await verifyAccessToken(token));
        }
        catch {
            // Navigation anonyme : on continue sans identité.
        }
    }
    await next();
});
/** Identité courante, garantie non nulle derrière `requireAuth`. */
export const currentUser = (c) => {
    const auth = c.get("auth");
    if (!auth)
        throw unauthorized();
    return auth;
};
//# sourceMappingURL=auth.js.map