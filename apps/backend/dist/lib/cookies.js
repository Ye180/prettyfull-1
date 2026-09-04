import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { env, isProduction } from "./env.js";
/**
 * Cookies de rafraîchissement.
 *
 * Le back-office et le storefront utilisent des noms distincts : en
 * développement les deux applications partagent l'hôte `localhost` et un nom
 * commun ferait qu'une connexion admin écraserait la session cliente.
 *
 * Le jeton de rafraîchissement ne transite jamais dans le corps d'une
 * réponse : `httpOnly` le met hors de portée de tout script, ce qui neutralise
 * l'exfiltration par XSS, et `sameSite: Strict` couvre le CSRF (§5).
 */
export const REFRESH_COOKIES = {
    admin: "pf_admin_refresh",
    store: "pf_store_refresh",
};
const baseOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction || env.COOKIE_SECURE,
    sameSite: "Strict",
    path: "/",
    maxAge,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});
export const setRefreshCookie = (c, scope, token) => {
    setCookie(c, REFRESH_COOKIES[scope], token, baseOptions(env.JWT_REFRESH_TTL_SECONDS));
};
export const readRefreshCookie = (c, scope) => getCookie(c, REFRESH_COOKIES[scope]);
export const clearRefreshCookie = (c, scope) => {
    deleteCookie(c, REFRESH_COOKIES[scope], {
        path: "/",
        ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    });
};
//# sourceMappingURL=cookies.js.map